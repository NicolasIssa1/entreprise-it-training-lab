import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, orders, or data. See root CLAUDE.md.
export const systemIntegrationFailureScenario: InvestigationScenario = {
  id: "system-integration-failure",
  title: "Two Business Applications Have Stopped Syncing",
  description:
    "Two integrated systems each work fine on their own, but data has silently stopped flowing between them — use logs and timestamps to find out why.",
  difficulty: "Intermediate",
  estimatedMinutes: 14,
  initialReport:
    "The order-management system and the shipping-tracking system normally sync every few minutes. Operations reports the shipping system hasn't shown any new orders since sometime yesterday, even though new orders are visible in the order-management system.",
  suggestedBusinessImpact: "A department",
  businessImpactNote:
    "Operations reported it, but the real impact is every order placed since the sync stopped — that number grows the longer it goes unnoticed, which is exactly why silent integration failures deserve prompt investigation.",
  relatedTopicIds: ["system-integration", "api", "application-logs", "authentication", "escalation"],
  likelyTeams: ["applications"],
  learningObjectives: [
    "Use logs and timestamps to correlate a sync failure with a specific recent change.",
    "Recognize that integration/API failures often show up as silent authentication errors, not crashes.",
    "Escalate a cross-system issue with clear, timestamped evidence rather than a vague description.",
    "Understand why restarting an application does not fix a broken integration credential.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "authentication",
  topicsToReview: ["system-integration", "api", "application-logs"],
  modelDocumentation: {
    issueSummary: "The shipping-tracking system stopped receiving new orders from the order-management system, even though both applications worked normally on their own.",
    scopeImpact: "Every order placed since roughly 14:00 the previous day — about 30 orders and growing — was missing from the shipping system.",
    evidenceGathered: "Both systems worked independently. Integration logs showed the sync job failing with HTTP 401 Unauthorized on every attempt since 13:58 the previous day. A routine credential rotation had been performed around 13:55, and the integration's stored credential did not appear to have been updated to match.",
    likelyCause: "The integration's stored API credential was not updated when the underlying credential was rotated, causing every sync attempt to fail authentication.",
    actionTaken: "Escalated with the log evidence, exact timestamps, and the credential-rotation correlation.",
    escalation: "Escalated to Applications, who own the integration's credential configuration.",
    verification: "Confirmed the missing orders appeared in the shipping system after the credential was corrected and a catch-up sync was triggered.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Operations says the shipping-tracking system hasn't shown any new orders since sometime yesterday, even though new orders are visible in the order-management system.",
      diagnosticQuestions: [
        { id: "q-scope", question: "How many orders are actually missing?", answer: "Every order placed since roughly 14:00 yesterday — about 30 orders and counting." },
        { id: "q-worked-before", question: "Did this work before?", answer: "Yes — the sync has run every few minutes for months without issue." },
        { id: "q-exact-error", question: "What exact error appears to Operations?", answer: "None — the shipping system just shows no new data. The sync runs silently in the background." },
        { id: "q-recent-change", question: "Did anything change recently?", answer: "IT mentions rotating some system credentials yesterday as routine housekeeping, but nobody has confirmed whether that's related." },
      ],
      actions: [
        {
          id: "check-both-standalone",
          label: "Confirm both systems work fine on their own",
          description: "Rule out either system being broken by itself.",
          stage: "scope",
          quality: "strong",
          feedback: "Good — confirming each system works independently tells you the problem is specifically in how they talk to each other, not either one being down.",
          nextNodeId: "standalone-confirmed",
        },
        {
          id: "restart-shipping-app",
          label: "Restart the shipping-tracking application",
          description: "Try the fastest fix on the system missing the data.",
          stage: "resolve",
          quality: "weak",
          feedback: "Restarting an app that's working fine on its own doesn't address a sync failure between two systems — nothing here suggests the shipping app itself is broken.",
          nextNodeId: "start",
        },
      ],
    },

    "standalone-confirmed": {
      id: "standalone-confirmed",
      prompt: "You confirm both systems independently.",
      evidence: [
        "Both the order-management system and the shipping-tracking system work normally on their own.",
        "The sync job between them runs on schedule, but has stopped moving any data since yesterday afternoon.",
      ],
      actions: [
        { id: "check-logs", label: "Check the integration/API logs for the sync job", description: "Look for the actual failure reason.", stage: "evidence", quality: "strong", feedback: "Exactly right — logs will show you what the sync job is actually failing on, not just that it's failing.", nextNodeId: "logs-checked" },
        { id: "check-timestamps", label: "Check exactly when the last successful sync occurred", description: "Establish a precise failure window.", stage: "evidence", quality: "strong", feedback: "Also strong — a precise timestamp is exactly what you'll need to correlate against any recent changes.", nextNodeId: "timestamp-checked" },
      ],
    },

    "logs-checked": {
      id: "logs-checked",
      prompt: "You check the integration logs.",
      evidence: ["Fictional training evidence: HTTP 401 Unauthorized on every sync attempt since yesterday around 14:00."],
      actions: [
        { id: "check-timestamps-2", label: "Check exactly when the last successful sync occurred", description: "Pin down the precise failure window.", stage: "evidence", quality: "strong", feedback: "Good — pinning down the exact timestamp will let you correlate this with any recent change.", nextNodeId: "timestamp-checked" },
        { id: "check-recent-changes", label: "Check whether anything changed around that time (credentials, config, deployments)", description: "Look for a triggering event.", stage: "evidence", quality: "strong", feedback: "Exactly right — a 401 error strongly suggests something about how the systems authenticate to each other changed.", nextNodeId: "recent-change-found" },
        { id: "assume-both-down", label: "Assume both systems must be down", description: "Treat this as a general outage.", stage: "diagnose", quality: "weak", feedback: "Both systems work fine individually, and the logs show a specific, clear error — 401 Unauthorized — which points at authentication between the two systems, not either one being down.", nextNodeId: "logs-checked" },
      ],
    },

    "timestamp-checked": {
      id: "timestamp-checked",
      prompt: "You check exactly when syncing last succeeded.",
      evidence: ["Fictional training evidence: the last successful sync completed at 13:58 yesterday. Every attempt since then has failed."],
      actions: [
        { id: "check-logs-2", label: "Check the integration/API logs for the specific failure reason", description: "Find out what's actually failing.", stage: "evidence", quality: "strong", feedback: "Good — now that you have a precise time window, the logs will tell you exactly what started failing then.", nextNodeId: "logs-checked" },
        { id: "check-recent-changes-2", label: "Check whether anything changed around 13:58 (credentials, config, deployments)", description: "Look for a triggering event.", stage: "evidence", quality: "strong", feedback: "Good — a precise timestamp is exactly what you need to correlate against recent changes.", nextNodeId: "recent-change-found" },
      ],
    },

    "recent-change-found": {
      id: "recent-change-found",
      prompt: "You check for recent changes around the failure window.",
      evidence: [
        "Fictional training evidence: a routine credential rotation was performed yesterday around 13:55.",
        "The integration's stored API credential does not appear to have been updated to match the rotation.",
      ],
      actions: [
        { id: "proceed-from-change", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — a 401 error starting within minutes of a credential rotation, on an integration whose credential wasn't updated, is about as clear as evidence gets.", nextNodeId: "hub" },
        { id: "assume-unrelated", label: "Assume the credential rotation is unrelated", description: "Dismiss the correlation as coincidence.", stage: "diagnose", quality: "weak", feedback: "The rotation happened about three minutes before the last successful sync and the first failure — that's an extremely tight correlation to dismiss as unrelated.", nextNodeId: "recent-change-found" },
      ],
    },

    hub: {
      id: "hub",
      prompt: "You have clear evidence: both systems work independently, syncing has failed with 401 Unauthorized since shortly after a credential rotation, and the integration's stored credential wasn't updated. Decide how to proceed.",
      actions: [
        {
          id: "escalate-with-evidence",
          label: "Escalate to Applications with the log evidence, timestamps, and the credential-rotation correlation",
          description: "Hand off with everything needed to act immediately.",
          stage: "escalate",
          quality: "strong",
          feedback: "This is exactly the kind of escalation that gets fixed fast — specific error, specific timestamps, and a specific, testable cause.",
          nextNodeId: "post-escalate",
        },
        {
          id: "restart-both",
          label: "Restart both applications and hope the sync resumes",
          description: "Try a full reset of both systems.",
          stage: "resolve",
          quality: "weak",
          feedback: "Restarting an application doesn't update a stored credential — a 401 error is an authentication failure, and a restart won't fix invalid credentials.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-vague",
          label: "Escalate by saying \"the integration is broken\"",
          description: "Hand off without the specific evidence.",
          stage: "escalate",
          quality: "weak",
          feedback: "You did the work to trace this to a specific credential problem — not including that means Applications has to redo your investigation before they can start.",
          nextNodeId: "outcome-escalated-vague",
        },
        {
          id: "wait-for-retry",
          label: "Assume the sync job will eventually retry successfully on its own",
          description: "Take no action and see what happens.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "The sync has failed continuously for almost a day with the identical error — there's no evidence it will self-resolve, and roughly 30 orders are already missing from the shipping system.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "You escalate with the 401 evidence, exact timestamps, and the credential-rotation correlation. Applications confirms the integration's stored credential wasn't updated during the rotation, corrects it, and triggers a manual sync to catch up the backlog.",
      evidence: ["Fictional training evidence: Applications confirms the integration credential has been corrected and a catch-up sync has been triggered."],
      actions: [
        { id: "verify-resolve", label: "Confirm the missing orders now appear in the shipping system", description: "Check the fix actually worked.", stage: "verify", quality: "strong", feedback: "This confirms the backlog actually caught up, not just that a credential was changed.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify", label: "Close the ticket as soon as Applications says it's fixed", description: "Trust the fix without checking.", stage: "verify", quality: "weak", feedback: "The diagnosis and escalation were excellent — the missing step is confirming the actual missing orders showed up, not just that a credential was updated.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You isolated a silent integration failure to a specific credential problem using logs and timestamps, escalated with clear evidence, and verified the backlog of orders actually caught up.",
        escalatedTeam: "applications",
        modelResolution: "Confirming both systems worked independently isolated the problem to the integration itself → logs and timestamps pinpointed a 401 error starting right after a credential rotation → escalating with that specific, timestamped evidence let Applications fix it immediately → verifying the missing orders appeared confirmed the backlog was actually resolved.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You traced the failure to a specific credential problem and escalated with strong evidence, but closed the ticket without confirming the missing orders actually appeared.",
        escalatedTeam: "applications",
        modelResolution: "The diagnosis and escalation were excellent. The remaining step is confirming with Operations (or directly in the shipping system) that the actual missing orders showed up, not just trusting that the credential fix was sufficient.",
      },
    },
    "outcome-escalated-vague": {
      id: "outcome-escalated-vague",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary: "You escalated to the right team, but without the specific log and timestamp evidence, so they have to redo the investigation before they can fix anything.",
        escalatedTeam: "applications",
        modelResolution: "The 401 error, the exact failure timestamp, and the credential-rotation correlation are exactly what turns \"the integration is broken\" into an escalation someone can act on immediately.",
      },
    },
  },
};
