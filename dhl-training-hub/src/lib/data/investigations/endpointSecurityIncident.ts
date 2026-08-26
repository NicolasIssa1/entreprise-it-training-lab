import { InvestigationScenario } from "@/lib/types";

// Fictional, defensive-only training scenario. No exploit, bypass, or offensive
// technique content anywhere — see root CLAUDE.md. Troubleshooting here is
// strictly about safe investigation, reporting, and escalation.
export const endpointSecurityIncidentScenario: InvestigationScenario = {
  id: "endpoint-security-incident",
  title: "Endpoint Protection Reports an Unhealthy Device",
  description:
    "A defensive-only investigation into an \"unhealthy\" endpoint — checking patch status and safely escalating a flagged file. No exploit or bypass content.",
  difficulty: "Foundation",
  estimatedMinutes: 12,
  initialReport:
    "The endpoint protection dashboard flags one employee's laptop as \"Unhealthy.\" The employee hasn't reported any problem — you noticed it while reviewing the dashboard.",
  suggestedBusinessImpact: "One user",
  businessImpactNote:
    "This is a single device with no user complaint — but monitoring exists precisely to catch issues before someone notices them, so \"nobody reported it\" isn't a reason to skip the assessment.",
  relatedTopicIds: ["endpoint-security", "patching-updates", "vulnerabilities-patching", "escalation"],
  likelyTeams: ["infrastructure", "support-network"],
  learningObjectives: [
    "Investigate an \"unhealthy\" endpoint status methodically instead of dismissing or panicking.",
    "Distinguish a routine patching/definitions gap from a genuine flagged security event.",
    "Never personally open, extract, or analyze a flagged/quarantined file — escalate it safely instead.",
    "Practice reporting a possible security-relevant event with clear, factual evidence.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "infrastructure",
  topicsToReview: ["endpoint-security", "patching-updates", "vulnerabilities-patching"],
  modelDocumentation: {
    issueSummary: "Endpoint protection dashboard flagged one employee's laptop as \"Unhealthy,\" with no user-reported problem.",
    scopeImpact: "One device.",
    evidenceGathered: "Two separate flags: outdated protection definitions from several missed update windows (device was offline/asleep during scheduled updates, not refusing them), and one blocked-file event three days ago where an email attachment was automatically quarantined before it could run.",
    likelyCause: "A routine missed-patch-window issue, unrelated to a separate but already-contained blocked-file event.",
    actionTaken: "Scheduled the device for a patch/definitions catch-up. Reported the blocked-file event through the safe escalation path for review rather than investigating it personally.",
    escalation: "The blocked-file event was reported for review to the function handling security-relevant events (commonly Infrastructure or Support & Network — exact ownership varies by organization); never investigated directly.",
    verification: "Confirmed the device returned to healthy status after patching, and that the file review was completed.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You notice the endpoint protection dashboard flags one employee's laptop as \"Unhealthy.\" The employee hasn't reported anything unusual.",
      diagnosticQuestions: [
        { id: "q-what-flagged", question: "What exactly does \"Unhealthy\" mean here?", answer: "The dashboard lists two separate flags: outdated protection definitions, and one recent blocked-file event." },
        { id: "q-user-impact", question: "Is this affecting the employee's ability to work?", answer: "No — the employee hasn't noticed anything unusual and hasn't reported a problem." },
        { id: "q-last-checkin", question: "When did the device last check in?", answer: "This morning — it's online and reporting normally." },
        { id: "q-missed-updates", question: "Has this device missed any recent updates?", answer: "It shows several missed patch/definition update cycles over the past two weeks." },
      ],
      actions: [
        {
          id: "check-dashboard-detail",
          label: "Open the dashboard entry to see exactly what's flagged",
          description: "Understand the specific flags before deciding anything.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — \"Unhealthy\" can mean several different things, and you need to know exactly what's flagged before you can respond appropriately.",
          nextNodeId: "detail-checked",
        },
        {
          id: "ignore-since-fine",
          label: "Ignore it since the employee hasn't reported a problem",
          description: "Assume it's not worth investigating.",
          stage: "resolve",
          quality: "weak",
          feedback: "An unhealthy status flagged by monitoring is worth investigating even without a user complaint — that's exactly the kind of issue monitoring exists to catch early.",
          nextNodeId: "start",
        },
      ],
    },

    "detail-checked": {
      id: "detail-checked",
      prompt: "You open the dashboard entry for this device.",
      evidence: [
        "Flag 1: protection definitions are outdated — several missed update cycles over the past two weeks.",
        "Flag 2: one blocked-file event three days ago, where the endpoint protection software automatically quarantined a file before it could run.",
      ],
      actions: [
        { id: "check-patch-history", label: "Check why the device has been missing update cycles", description: "Understand the patching gap.", stage: "evidence", quality: "strong", feedback: "Good — understanding why updates were missed tells you whether this is routine or something more concerning.", nextNodeId: "patch-history-checked" },
        { id: "check-blocked-file", label: "Check the details recorded about the blocked-file event", description: "Understand what was flagged and what happened.", stage: "evidence", quality: "strong", feedback: "Good — reading the recorded details is the safe way to understand a flagged event without touching the file itself.", nextNodeId: "blocked-file-checked" },
        {
          id: "open-the-file",
          label: "Open the quarantined file yourself to see what it is",
          description: "Investigate the file directly.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "Never open, extract, or run a flagged/quarantined file yourself, even out of curiosity — this is exactly the kind of action that can turn a contained event into an active incident. Let the appropriate escalation path handle a flagged file safely.",
          nextNodeId: "detail-checked",
        },
      ],
    },

    "patch-history-checked": {
      id: "patch-history-checked",
      prompt: "You check the device's update history.",
      evidence: [
        "The device was offline or in sleep mode during the last several scheduled update windows, rather than actively refusing updates.",
        "No sign of the update service itself being disabled.",
      ],
      actions: [
        { id: "check-blocked-file-2", label: "Also check the blocked-file event", description: "Understand the other flag too.", stage: "evidence", quality: "strong", feedback: "Good — both flags need attention; understanding each independently avoids missing something.", nextNodeId: "blocked-file-checked" },
        { id: "proceed-from-patch", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — you understand the patching gap, though you haven't yet looked closely at the blocked-file flag.", nextNodeId: "hub" },
      ],
    },

    "blocked-file-checked": {
      id: "blocked-file-checked",
      prompt: "You review the recorded details of the blocked-file event.",
      evidence: [
        "The file arrived as an email attachment three days ago and was automatically quarantined before it could run — endpoint protection acted as intended.",
        "There is no indication the file executed or that anything else unusual has happened on the device since.",
      ],
      actions: [
        { id: "check-patch-history-2", label: "Also check why the device has been missing update cycles", description: "Understand the other flag too.", stage: "evidence", quality: "strong", feedback: "Good — both flags need attention; this rounds out your understanding of the full \"Unhealthy\" status.", nextNodeId: "patch-history-checked" },
        { id: "proceed-from-file", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — you understand both what was blocked and that it was contained automatically, which is exactly what you need to decide next steps safely.", nextNodeId: "hub" },
        {
          id: "try-to-analyze-file",
          label: "Try to analyze the quarantined file's contents yourself",
          description: "Dig deeper into the file directly.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "Analyzing a flagged file safely is a job for whoever handles security-relevant reviews — doing it yourself risks releasing or triggering it, and isn't a step a general troubleshooting process should attempt.",
          nextNodeId: "blocked-file-checked",
        },
      ],
    },

    hub: {
      id: "hub",
      prompt:
        "You understand both flags: outdated definitions likely from missed update windows, and a blocked-file event that was contained automatically. Decide how to proceed.",
      actions: [
        {
          id: "safe-two-track",
          label: "Schedule a patch/definitions catch-up, and separately report the blocked-file event for a safe review",
          description: "Handle the routine issue directly; escalate the flagged file properly.",
          stage: "resolve",
          quality: "strong",
          feedback: "This is the right split — the patching gap is routine and safe to schedule directly, while the flagged file deserves a proper review by whoever handles that safely, even though it was already contained.",
          nextNodeId: "post-decision",
        },
        {
          id: "patch-only-ignore-file",
          label: "Schedule the patch catch-up and consider the blocked file already handled",
          description: "Treat the quarantine as the end of the story.",
          stage: "resolve",
          quality: "weak",
          feedback: "The file being quarantined automatically is good news, but a contained event still deserves to be reported and reviewed by someone with more context — \"quarantined\" isn't the same as \"reviewed and closed.\"",
          nextNodeId: "hub",
        },
        {
          id: "escalate-everything-caution",
          label: "Escalate the entire device as a potential active compromise, out of caution",
          description: "Treat this as a serious active incident.",
          stage: "escalate",
          quality: "reasonable",
          feedback: "When genuinely unsure, escalating is a reasonable, safe instinct — but the evidence you already gathered (a routine patch gap, a file already contained automatically) supports a more targeted response than a full incident escalation.",
          nextNodeId: "post-escalate-caution",
        },
        {
          id: "ignore-both",
          label: "Mark the device healthy since the employee hasn't complained",
          description: "Dismiss both flags.",
          stage: "resolve",
          quality: "weak",
          feedback: "Both flags are legitimate findings from monitoring, independent of whether the employee has noticed anything — dismissing them defeats the purpose of endpoint monitoring.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-decision": {
      id: "post-decision",
      prompt:
        "You schedule the device for a patch/definitions catch-up and separately report the blocked-file event through the safe escalation path for review.",
      evidence: [
        "Fictional training evidence: the device completes its patch/definitions catch-up successfully.",
        "Fictional training evidence: the review confirms the blocked file was correctly contained and closes the review with no further action needed on this device.",
      ],
      actions: [
        { id: "verify-both", label: "Confirm the device shows healthy status and that the file review was completed", description: "Check both threads were actually closed out.", stage: "verify", quality: "strong", feedback: "This confirms both issues were actually resolved, not just that you took action on each.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify-both", label: "Assume both are handled once scheduled/reported, without checking back", description: "Move on without confirming.", stage: "verify", quality: "weak", feedback: "You handled both flags appropriately — the missing step is confirming the patch actually completed and the file review actually closed, rather than assuming.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "post-escalate-caution": {
      id: "post-escalate-caution",
      prompt:
        "You escalate the entire device as a possible active compromise. The receiving team reviews it, confirms the evidence matches a routine missed-patch-window plus a properly contained blocked-file event, and closes it with no further action needed.",
      evidence: ["Fictional training evidence: the review confirms no active compromise and closes the escalation."],
      actions: [
        { id: "confirm-caution-outcome", label: "Confirm the device is patched and back to healthy status", description: "Close the loop on the routine part.", stage: "verify", quality: "strong", feedback: "Good closing step — confirming the device is actually healthy again finishes the loop.", nextNodeId: "outcome-resolved-caution" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You investigated an unreported \"Unhealthy\" flag methodically, correctly separated a routine patching gap from a flagged file, handled the routine part directly, escalated the flagged file safely without touching it, and verified both were actually closed out.",
        modelResolution: "Checking dashboard detail split one vague status into two specific, separately-actionable findings → the patch history showed a routine cause, handled directly → the blocked file was reported through the safe path, never opened or analyzed personally → verifying both were actually closed confirmed the full picture, not just that actions were taken.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You correctly diagnosed and handled both flags safely, but didn't confirm afterward that the patch catch-up and the file review both actually completed.",
        modelResolution: "The diagnosis and the safe handling of the flagged file were both correct. Checking back to confirm the device returned to healthy status and the review was closed is what turns \"actions taken\" into \"problem actually resolved.\"",
      },
    },
    "outcome-resolved-caution": {
      id: "outcome-resolved-caution",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "Escalating the whole device out of caution wasn't wrong — when genuinely unsure about a security-relevant event, that instinct is a reasonable one — but the specific evidence you'd already gathered supported a more targeted response, which would have used everyone's time more efficiently.",
        escalatedTeam: "infrastructure",
        modelResolution: "\"When in doubt, escalate\" is a legitimate safety instinct, especially for anything security-relevant. Here, the evidence you'd already gathered (routine patch gap, file already auto-contained) supported splitting this into a routine fix plus a smaller, targeted report rather than a full compromise escalation.",
      },
    },
  },
};
