import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL servers, storage, or data. See root CLAUDE.md.
export const sharedStorageOutageScenario: InvestigationScenario = {
  id: "shared-storage-outage",
  title: "A Shared Drive Suddenly Becomes Unavailable",
  description:
    "A widely-used shared storage resource goes down for many employees at once — check server/storage health and capacity before escalating.",
  difficulty: "Foundation",
  estimatedMinutes: 12,
  initialReport:
    "Around mid-afternoon, employees across several departments report the shared network drive (used for shared documents/templates) has become completely inaccessible — File Explorer shows \"network path not found\" or hangs when trying to open it.",
  suggestedBusinessImpact: "Multiple departments",
  businessImpactNote:
    "A shared drive used across departments failing all at once is a strong early signal this is server/storage-side, not a per-user problem — worth confirming quickly rather than troubleshooting one laptop at a time.",
  relatedTopicIds: ["storage", "server", "monitoring", "high-availability", "escalation"],
  likelyTeams: ["infrastructure", "support-network"],
  learningObjectives: [
    "Confirm scope quickly for a shared-resource outage — many users, not one.",
    "Use monitoring to check server/storage health instead of guessing.",
    "Recognize signs of a capacity problem (storage full) versus a service crash.",
    "Escalate a shared-infrastructure issue with the right evidence instead of troubleshooting individual devices.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "infrastructure",
  topicsToReview: ["storage", "monitoring", "escalation"],
  modelDocumentation: {
    issueSummary: "A shared network drive used across multiple departments became completely inaccessible mid-afternoon — \"network path not found\" or File Explorer hanging.",
    scopeImpact: "At least three departments reported the issue within a 20-minute window; confirmed on a second device, ruling out a single broken laptop.",
    evidenceGathered: "The server hosting the drive was online but its storage volume was at 100% capacity as of about 30 minutes before the reports started. Other shared drives on the same server were also failing, pointing to the server/storage layer rather than one specific share.",
    likelyCause: "The storage volume reached full capacity, causing the shared-drive service on that server to stop responding.",
    actionTaken: "Escalated to Infrastructure with the capacity evidence and the scope of affected departments.",
    escalation: "Escalated to Infrastructure (commonly manages shared server/storage capacity — exact ownership varies by organization).",
    verification: "Confirmed with employees across the affected departments that the shared drive was accessible again.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Around mid-afternoon, employees across several departments report the shared network drive has become completely inaccessible.",
      diagnosticQuestions: [
        { id: "q-others", question: "Is anyone else affected?", answer: "Employees in at least three different departments report it within the same 20 minutes." },
        { id: "q-worked-before", question: "Did this work before?", answer: "Yes — everyone agrees it was working normally this morning." },
        { id: "q-exact-error", question: "What exact error appears?", answer: "\"Network path not found,\" or File Explorer hangs for a long time before timing out." },
        { id: "q-other-device", question: "Does this happen on another device?", answer: "One employee tried from a second laptop and got the same result." },
      ],
      actions: [
        {
          id: "check-scope",
          label: "Confirm how many departments/employees are affected",
          description: "Establish scope before troubleshooting anything.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — confirming multiple departments and a second device rules out a single broken laptop before you go any further.",
          nextNodeId: "scope-confirmed",
        },
        {
          id: "troubleshoot-one-laptop",
          label: "Focus on fixing the first employee's laptop",
          description: "Start with the device in front of you.",
          stage: "resolve",
          quality: "weak",
          feedback: "Multiple departments losing access to the same shared resource at the same time points to something on the server/storage side, not this one laptop.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-confirmed": {
      id: "scope-confirmed",
      prompt: "You confirm the scope of the outage.",
      evidence: [
        "At least three departments report the same issue within a 20-minute window.",
        "A second device also fails, ruling out one broken laptop.",
      ],
      actions: [
        { id: "check-monitoring", label: "Check monitoring for the server hosting the shared drive", description: "Look at server/storage health directly.", stage: "evidence", quality: "strong", feedback: "Exactly right — with scope confirmed as widespread, server-side monitoring is where the answer is most likely to be.", nextNodeId: "monitoring-checked" },
        { id: "check-other-shares", label: "Check whether other shared resources on the same server are also affected", description: "See if this is isolated to one share or the whole server.", stage: "evidence", quality: "reasonable", feedback: "Reasonable — this helps narrow down scope further, though checking monitoring directly would likely get you to the cause faster.", nextNodeId: "other-shares-checked" },
        { id: "ask-users-restart", label: "Ask each affected employee to restart their computer", description: "Try a per-device reset.", stage: "resolve", quality: "weak", feedback: "With multiple departments and multiple devices affected simultaneously, the shared cause is very unlikely to be fixed by restarting individual employees' computers.", nextNodeId: "scope-confirmed" },
      ],
    },

    "monitoring-checked": {
      id: "monitoring-checked",
      prompt: "You check monitoring for the server hosting the shared drive.",
      evidence: [
        "Fictional training evidence: the storage volume is at 100% capacity as of about 30 minutes ago.",
        "The server itself is online and responding to basic health checks, but the storage service for that drive has stopped responding.",
      ],
      actions: [
        { id: "check-other-shares-2", label: "Check whether other shares on the same server are also affected", description: "Confirm the scope of the impact on that server.", stage: "evidence", quality: "strong", feedback: "Good — confirming other shares are affected too strengthens the case that this is the server/storage layer, not one share's config.", nextNodeId: "other-shares-checked" },
        { id: "proceed-from-monitoring", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — a storage volume at 100% capacity, right as the outage started, is clear, specific evidence.", nextNodeId: "hub" },
      ],
    },

    "other-shares-checked": {
      id: "other-shares-checked",
      prompt: "You check other shared resources on the same server.",
      evidence: [
        "Other shared drives on the same server are also failing the same way.",
        "This points to the server/storage layer itself, not one specific share's configuration.",
      ],
      actions: [
        { id: "check-monitoring-2", label: "Check monitoring for the server hosting these shares", description: "Look for the underlying cause.", stage: "evidence", quality: "strong", feedback: "Good — with the problem confirmed server-wide, monitoring is exactly where to look next.", nextNodeId: "monitoring-checked" },
        { id: "proceed-from-shares", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — you've confirmed this is server-wide, though checking monitoring directly would tell you specifically why.", nextNodeId: "hub" },
        { id: "assume-network", label: "Assume this is a general network connectivity issue", description: "Blame the network path rather than the server.", stage: "diagnose", quality: "weak", feedback: "General network connectivity works fine for everything else these employees do — this looks specific to the storage server, not the network path to it.", nextNodeId: "other-shares-checked" },
      ],
    },

    hub: {
      id: "hub",
      prompt: "You know this is a shared, server-side storage problem, most likely tied to the volume reaching full capacity. Decide how to proceed.",
      actions: [
        {
          id: "escalate-with-evidence",
          label: "Escalate to Infrastructure with the capacity evidence and the scope of departments affected",
          description: "Hand off with specific, actionable evidence.",
          stage: "escalate",
          quality: "strong",
          feedback: "Strong — a storage volume at full capacity with several departments blocked is exactly the kind of evidence that gets acted on immediately.",
          nextNodeId: "post-escalate",
        },
        {
          id: "delete-files-yourself",
          label: "Try deleting some old files on the shared drive yourself to free up space",
          description: "Attempt to fix the capacity problem directly.",
          stage: "resolve",
          quality: "weak",
          feedback: "Without visibility into what's actually safe to delete on a shared drive, this risks removing something someone needs — and it doesn't address why the volume filled up or prevent it happening again.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-vague",
          label: "Escalate by saying \"the shared drive is down\"",
          description: "Hand off without the specific evidence.",
          stage: "escalate",
          quality: "weak",
          feedback: "You already found the specific cause — leaving out the capacity evidence means Infrastructure has to redo your investigation before they can start.",
          nextNodeId: "outcome-escalated-vague",
        },
        {
          id: "wait-it-out",
          label: "Assume space will free up on its own",
          description: "Take no action and see what happens.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "A full storage volume doesn't resolve itself, and multiple departments are already blocked from their shared files.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "You escalate with the capacity evidence and scope. Infrastructure confirms the volume filled up faster than expected due to a large batch of files added recently, frees up space, and restores the storage service.",
      evidence: ["Fictional training evidence: Infrastructure confirms the storage volume has been freed up and the shared drive service restored."],
      actions: [
        { id: "verify-broad", label: "Confirm with employees across the affected departments that the drive is accessible again", description: "Verify the fix worked broadly.", stage: "verify", quality: "strong", feedback: "This confirms the fix actually restored access for the people affected, not just that a change was made on the server.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify", label: "Close the ticket as soon as Infrastructure says it's restored", description: "Trust the fix without checking.", stage: "verify", quality: "weak", feedback: "The diagnosis and escalation were strong — the missing step is confirming with the actual affected departments before closing.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You confirmed widespread scope, used monitoring to find the storage volume was full, escalated with clear evidence, and verified access was restored across departments.",
        escalatedTeam: "infrastructure",
        modelResolution: "Confirming scope (multiple departments, a second device) ruled out a single device → checking server monitoring found the storage volume at full capacity → escalating with that specific evidence let Infrastructure fix it immediately → verifying with the affected departments confirmed the fix actually worked.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You correctly diagnosed a capacity problem and escalated with strong evidence, but closed the ticket without confirming the affected departments could actually access the drive again.",
        escalatedTeam: "infrastructure",
        modelResolution: "The diagnosis and escalation were solid — the missing step was verifying with the affected departments before closing, rather than trusting that Infrastructure's fix was sufficient.",
      },
    },
    "outcome-escalated-vague": {
      id: "outcome-escalated-vague",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary: "You escalated to the right team, but without the specific capacity evidence, so they have to investigate from scratch before they can fix anything.",
        escalatedTeam: "infrastructure",
        modelResolution: "The storage-capacity finding is exactly what makes an escalation actionable — naming the symptom without the evidence you already gathered wastes the investigation you did.",
      },
    },
  },
};
