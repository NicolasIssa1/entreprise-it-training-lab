import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, forms, or data. See root CLAUDE.md.
export const approvalFlowDuplicateNotificationsScenario: InvestigationScenario = {
  id: "approval-flow-duplicate-notifications",
  title: "Approval Flow Creates Duplicate Notifications",
  description:
    "An approval flow that updates its own tracked item after approval starts sending the same notification more than once. Practice recognizing a self-triggering loop and the idempotency fix for it.",
  difficulty: "Intermediate",
  estimatedMinutes: 12,
  initialReport:
    "Several employees report receiving the same \"your request was approved\" email two or three times for the same request, sometimes minutes apart. New requests don't seem to have the problem — only ones that have already been approved.",
  suggestedBusinessImpact: "A department",
  businessImpactNote:
    "Reported as an annoyance so far, but a flow that runs more times than intended on the same item is worth checking for other side effects too (e.g. anything else it updates or notifies), not just the visible duplicate email.",
  relatedTopicIds: ["approvals-and-notifications", "triggers-and-actions", "common-power-automate-failure-patterns"],
  likelyTeams: ["applications"],
  learningObjectives: [
    "Recognize a self-triggering loop: a flow's own action re-firing the trigger condition it's watching.",
    "Distinguish a notification-content bug from a repeat-processing bug.",
    "Apply the idea of idempotency — designing an action so repeating it doesn't repeat its side effect.",
    "Choose a fix that prevents recurrence, not just one that clears today's duplicate emails.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "application",
  topicsToReview: ["approvals-and-notifications", "triggers-and-actions"],
  modelDocumentation: {
    issueSummary: "An approval flow was sending the same approval-confirmation email two to three times per request, only after a request had already been approved once.",
    scopeImpact: "Affected every request that completed approval, not one isolated case — new, not-yet-approved requests were unaffected.",
    evidenceGathered: "Run History showed the flow running more than once against the same item shortly after approval. The trigger is configured as \"when an item is created or modified,\" and the flow's own action updates the item's status field after approval — which itself counts as a modification and re-fires the same trigger.",
    likelyCause: "A self-triggering loop: the flow's own status update after approval satisfies its own \"created or modified\" trigger condition, causing it to run again on the item it just processed.",
    actionTaken: "Added a condition immediately after the trigger that only proceeds if the item's status is still \"Pending,\" so a re-triggered run on an already-processed item exits without repeating the approval/notification steps.",
    escalation: "Not required — this was a configuration change within the flow itself.",
    verification: "Submitted and approved a new test request and confirmed exactly one notification was sent, with no repeat runs in Run History afterward.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Employees are receiving the same approval-confirmation email two or three times for the same request. New, not-yet-approved requests don't seem to have this problem.",
      diagnosticQuestions: [
        { id: "q-when", question: "When exactly do the duplicates arrive?", answer: "Always shortly after a request gets approved — not when it's first submitted." },
        { id: "q-content", question: "Are the duplicate emails identical, or do they contain different information?", answer: "They appear identical — same request, same approval message, sent more than once." },
        { id: "q-frequency", question: "Does this happen on every approval, or only sometimes?", answer: "It seems to happen on every approved request that's been checked so far, not just occasionally." },
        { id: "q-recent-change", question: "Was anything about this flow changed recently?", answer: "Not that anyone remembers — it's described as having \"always worked this way,\" though nobody had closely checked before." },
      ],
      actions: [
        {
          id: "check-scope",
          label: "Confirm whether this happens on every approved request or just a few",
          description: "Establish whether this is systematic or occasional.",
          stage: "scope",
          quality: "strong",
          feedback: "Good first step — confirming this happens consistently after approval (not randomly) points toward something structural in the flow, not a one-off glitch.",
          nextNodeId: "scope-checked",
        },
        {
          id: "assume-email-bug",
          label: "Assume the email action itself is misconfigured to send twice and start editing it",
          description: "Jump straight into changing the notification step.",
          stage: "resolve",
          quality: "weak",
          feedback: "Editing the email action without checking Run History risks fixing the wrong thing — the real question is whether the flow is running once and sending twice, or actually running more than once.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-checked": {
      id: "scope-checked",
      prompt: "You confirm the pattern across several recently-approved requests.",
      evidence: [
        "Every approved request checked so far received the confirmation email two or three times.",
        "Requests still awaiting approval have not shown any duplicate behavior.",
      ],
      actions: [
        {
          id: "check-run-history",
          label: "Open Run History for one of the affected requests",
          description: "See exactly how many times the flow actually ran.",
          stage: "evidence",
          quality: "strong",
          feedback: "Exactly the right move — this will tell you whether the flow ran once and sent duplicate emails, or actually ran multiple times on the same item.",
          nextNodeId: "run-history-checked",
        },
        {
          id: "check-email-action",
          label: "Check the email action's own configuration for a duplicate send",
          description: "Look at the notification step directly.",
          stage: "evidence",
          quality: "reasonable",
          feedback: "A reasonable check on its own, but without Run History it's hard to tell if this action is the problem or if the whole flow is simply running more than once.",
          nextNodeId: "email-action-checked",
        },
      ],
    },

    "email-action-checked": {
      id: "email-action-checked",
      prompt: "You review the email action's configuration.",
      evidence: [
        "The email action itself is configured normally — one send action, no loop wrapped around it, no obvious duplicate step.",
      ],
      actions: [
        {
          id: "now-check-run-history",
          label: "Now check Run History to see how many times the flow actually ran",
          description: "Since the action itself looks fine, check whether the whole flow is running more than once.",
          stage: "evidence",
          quality: "strong",
          feedback: "Good — ruling out the email action itself correctly redirects attention to whether the flow is being triggered more than once in the first place.",
          nextNodeId: "run-history-checked",
        },
      ],
    },

    "run-history-checked": {
      id: "run-history-checked",
      prompt: "You review Run History for the affected item.",
      evidence: [
        "The flow ran twice within a few minutes against the exact same item.",
        "The second run started almost immediately after the first run's final action completed.",
      ],
      actions: [
        {
          id: "check-trigger-condition",
          label: "Check exactly what the flow's trigger condition is configured as",
          description: "Look at what actually starts a run.",
          stage: "evidence",
          quality: "strong",
          feedback: "Good — a flow running twice back-to-back on the same item, right after its own actions complete, is a strong hint that the trigger is firing on the flow's own changes.",
          nextNodeId: "trigger-checked",
        },
        {
          id: "proceed-from-runhistory",
          label: "You have enough evidence — move to a decision",
          description: "Stop investigating and decide next steps.",
          stage: "diagnose",
          quality: "reasonable",
          feedback: "You have strong evidence of a double-run already, though confirming the exact trigger condition would make the fix more precise.",
          nextNodeId: "hub",
        },
      ],
    },

    "trigger-checked": {
      id: "trigger-checked",
      prompt: "You check the flow's trigger configuration.",
      evidence: [
        "The trigger is set to \"when an item is created or modified.\"",
        "One of the flow's own actions, after approval, updates the item's status field to \"Approved\" — which itself counts as a modification.",
        "That update satisfies the flow's own trigger condition, causing it to run again on the item it just finished processing.",
      ],
      actions: [
        {
          id: "proceed-to-hub",
          label: "You have a clear, evidenced cause — move to a decision",
          description: "Stop investigating and decide next steps.",
          stage: "diagnose",
          quality: "strong",
          feedback: "Strong — you've identified a self-triggering loop precisely: the flow's own status update re-satisfies the trigger it's watching.",
          nextNodeId: "hub",
        },
      ],
    },

    hub: {
      id: "hub",
      prompt:
        "You know the flow triggers on \"created or modified,\" and its own post-approval status update counts as a modification — causing it to re-run and re-send the notification. Decide how to proceed.",
      actions: [
        {
          id: "fix-add-status-guard",
          label: "Add a condition right after the trigger that only continues if the item's status is still \"Pending\"",
          description: "Make the flow idempotent — a re-triggered run on an already-processed item does nothing.",
          stage: "resolve",
          quality: "strong",
          feedback: "This is the strongest fix — it doesn't just reduce re-triggers, it makes the flow safe even if it does run again on the same item, since an already-processed item will simply exit without repeating any action.",
          nextNodeId: "post-resolve-guard",
        },
        {
          id: "fix-narrow-trigger",
          label: "Narrow the trigger to only fire on item creation, not modification",
          description: "Prevent the flow's own updates from re-firing it at all.",
          stage: "resolve",
          quality: "reasonable",
          feedback: "A reasonable fix for this specific case, but if the process ever legitimately needs to react to later modifications too, this would need revisiting — a status guard is usually the more durable solution.",
          nextNodeId: "post-resolve-trigger",
        },
        {
          id: "workaround-manual-dedupe",
          label: "Ask the team to just ignore duplicate emails for now",
          description: "Avoid touching the flow's configuration.",
          stage: "resolve",
          quality: "weak",
          feedback: "This doesn't fix the underlying repeat-processing problem — and if this flow does anything else besides sending an email, the same self-triggering loop could be causing other, less visible side effects too.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-config",
          label: "Escalate to whoever owns/maintains this flow, since you're not the original builder",
          description: "Hand off the fix rather than making the change yourself.",
          stage: "escalate",
          quality: "reasonable",
          feedback: "A reasonable choice if you aren't the flow's owner — escalating with the specific self-triggering-loop evidence gives the owner exactly what they need to apply the fix quickly.",
          nextNodeId: "post-escalate",
        },
      ],
    },

    "post-resolve-guard": {
      id: "post-resolve-guard",
      prompt: "You add a condition right after the trigger: only continue if the item's status is still \"Pending.\"",
      evidence: ["Fictional training evidence: a manual re-trigger against an already-approved item now exits immediately at the new condition, taking no further action."],
      actions: [
        { id: "verify-guard", label: "Submit and approve a new test request, then confirm exactly one email is sent and no repeat run occurs", description: "Check the fix actually prevents duplicates end-to-end.", stage: "verify", quality: "strong", feedback: "This confirms the fix works for a real, full approval cycle — not just that the condition exists in the flow's design.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify-guard", label: "Close this out without testing a real approval cycle", description: "Assume the condition change is sufficient.", stage: "verify", quality: "weak", feedback: "The fix is very likely correct, but skipping an end-to-end test leaves a real gap — condition logic that looks right can still behave differently once matched against real data.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "post-resolve-trigger": {
      id: "post-resolve-trigger",
      prompt: "You narrow the trigger to fire only on item creation, not on every modification.",
      evidence: ["Fictional training evidence: the flow's status update after approval no longer re-triggers a new run."],
      actions: [
        { id: "verify-trigger", label: "Submit and approve a new test request, then confirm exactly one email is sent", description: "Check the fix works for a real approval cycle.", stage: "verify", quality: "strong", feedback: "Confirming with a real test case is the right way to close this out, especially since narrowing the trigger changes what the flow will and won't react to going forward.", nextNodeId: "outcome-resolved-trigger-verified" },
        { id: "skip-verify-trigger", label: "Assume narrowing the trigger was sufficient without testing", description: "Skip the end-to-end check.", stage: "verify", quality: "weak", feedback: "This is likely fixed, but not testing means you can't yet be sure — and it's worth deliberately confirming the flow still reacts correctly to genuinely new requests.", nextNodeId: "outcome-resolved-trigger-unverified" },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt: "You escalate to the flow's owner with the specific evidence: the trigger reacts to the flow's own post-approval update, causing a self-triggering loop.",
      evidence: ["Fictional training evidence: the flow owner adds a status guard condition based on your findings and confirms it with a test approval."],
      actions: [
        { id: "verify-escalate", label: "Follow up to confirm the fix was applied and duplicates have stopped", description: "Close the loop rather than assuming the escalation was handled.", stage: "verify", quality: "strong", feedback: "Following up rather than assuming the handoff worked is what actually confirms this is resolved for the people who reported it.", nextNodeId: "outcome-escalated-verified" },
        { id: "skip-verify-escalate", label: "Consider it done once escalated, without following up", description: "Move on without confirming the outcome.", stage: "verify", quality: "weak", feedback: "Your diagnosis was strong, but without following up you can't be sure the fix was actually applied or that it worked.", nextNodeId: "outcome-escalated-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "strong",
        summary: "You identified the self-triggering loop precisely, applied an idempotency-style status guard that prevents recurrence even if the flow re-triggers again, and verified it end-to-end.",
        modelResolution: "Confirming the pattern (only after approval) → ruling out the email action itself → finding a double-run in Run History → tracing it to the flow's own status update satisfying its own trigger → fixing it with a status guard that makes the flow safe to re-trigger → verifying with a full real test cycle.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You correctly diagnosed and fixed the self-triggering loop with a status guard, but didn't test a real approval cycle to confirm it.",
        modelResolution: "The diagnosis and fix were correct — the missing step was an end-to-end test with a real request, rather than trusting the condition's logic alone.",
      },
    },
    "outcome-resolved-trigger-verified": {
      id: "outcome-resolved-trigger-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You fixed the duplication by narrowing the trigger, and verified it with a real approval cycle.",
        modelResolution: "Narrowing the trigger is a reasonable, verified fix for this case — a status guard would additionally protect against any other cause of a re-trigger in the future, worth keeping in mind if this flow evolves.",
      },
    },
    "outcome-resolved-trigger-unverified": {
      id: "outcome-resolved-trigger-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You applied a reasonable fix by narrowing the trigger, but didn't test it against a real approval cycle to confirm.",
        modelResolution: "The fix itself is reasonable; the missing step is confirming with a real end-to-end test rather than trusting the configuration change alone.",
      },
    },
    "outcome-escalated-verified": {
      id: "outcome-escalated-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You correctly diagnosed the self-triggering loop, escalated it to the flow's owner with specific evidence, and followed up to confirm the fix worked.",
        modelResolution: "Escalating with a precise cause (a self-triggering loop, not just \"duplicate emails\") let the owner apply the right fix quickly, and following up confirmed it actually worked.",
        escalatedTeam: "applications",
      },
    },
    "outcome-escalated-unverified": {
      id: "outcome-escalated-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "Your diagnosis and escalation were strong, but without a follow-up, you can't be sure the fix actually worked.",
        modelResolution: "The diagnostic work here was excellent — the missing step was confirming the outcome after escalating, rather than assuming the handoff was sufficient.",
        escalatedTeam: "applications",
      },
    },
  },
};
