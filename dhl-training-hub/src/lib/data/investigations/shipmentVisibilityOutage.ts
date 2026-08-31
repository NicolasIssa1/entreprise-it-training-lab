import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, shipments, or data. See root
// CLAUDE.md. Business-impact investigation (Phase 7): the technical fault is
// simple, but the learner must reason about who is affected and how urgent it is.
export const shipmentVisibilityOutageScenario: InvestigationScenario = {
  id: "shipment-visibility-outage",
  title: "Customer Shipment Tracking Has Stopped Updating",
  description:
    "The customer-facing tracking page hasn't shown a new status in hours, even though shipments are still moving normally — reason about business impact before assuming the goods themselves are stuck.",
  difficulty: "Intermediate",
  estimatedMinutes: 13,
  initialReport:
    "Customer support says an unusually high number of customers are calling in asking why their shipment tracking page hasn't updated since this morning. Operations confirms shipments are still moving and being scanned normally at each stage.",
  suggestedBusinessImpact: "Organization-wide",
  businessImpactNote:
    "The physical shipments are fine, but the customer-facing tracking experience is broken for every customer checking their shipment right now — that's an organization-wide visibility problem even though the underlying operations team affected internally is small.",
  relatedTopicIds: ["shipment-visibility", "system-integration", "api", "application-monitoring", "escalation"],
  likelyTeams: ["applications"],
  learningObjectives: [
    "Distinguish a visibility/data-feed problem from an actual physical shipment problem.",
    "Recognize that a customer-facing outage can be organization-wide in impact even when the internal system is small.",
    "Use evidence (integration logs, timestamps) to isolate the failure to a specific cause rather than guessing.",
    "Escalate with clear business-impact framing, not just a technical symptom.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "authentication",
  topicsToReview: ["shipment-visibility", "technical-business-translation", "system-integration"],
  modelDocumentation: {
    issueSummary: "The customer-facing shipment tracking page stopped showing new status updates for all customers, even though shipments were still moving and being scanned normally in operations.",
    scopeImpact: "Every customer viewing shipment tracking — organization-wide from a customer-visibility standpoint — for roughly 6 hours before escalation.",
    evidenceGathered: "Operations confirmed shipments were scanning normally at each stage. The integration pulling scan data into the customer-facing tracking database had been failing since 07:10 with HTTP 401 Unauthorized errors. The API key used for that integration had expired overnight as part of a routine rotation schedule.",
    likelyCause: "The tracking integration's API key expired and was not renewed before the rotation took effect, causing every pull of new scan data to fail authentication.",
    actionTaken: "Escalated to Applications with the exact error, timestamp, and key-expiry correlation.",
    escalation: "Escalated to Applications, who own the tracking integration's credentials.",
    verification: "Confirmed new scan data began appearing on the tracking page within minutes of the key being renewed, and that the backlog of unshown updates caught up shortly after.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Customer support reports an unusually high volume of calls about tracking pages not updating. Operations says the actual shipments are moving and scanning normally.",
      diagnosticQuestions: [
        { id: "q-physical", question: "Are the shipments themselves actually delayed?", answer: "No — Operations confirms normal scan activity and movement at every stage." },
        { id: "q-since-when", question: "Since when have customers been reporting this?", answer: "Call volume started increasing around 9am, but the last confirmed tracking update for any customer appears to be around 07:00." },
        { id: "q-scope", question: "Is this affecting all customers or just some?", answer: "Support says it seems to be affecting everyone checking tracking right now, not a specific region or shipment type." },
      ],
      actions: [
        {
          id: "confirm-visibility-vs-physical",
          label: "Confirm this is a visibility/data problem, not a physical shipment problem",
          description: "Separate what's actually happening physically from what customers are seeing.",
          stage: "scope",
          quality: "strong",
          feedback: "Exactly the right instinct — Operations already confirmed shipments are moving normally, so the problem is specifically in the data reaching customers, not the shipments themselves.",
          nextNodeId: "scope-confirmed",
        },
        {
          id: "tell-support-shipments-lost",
          label: "Tell customer support to inform customers their shipments may be lost",
          description: "React to the volume of calls with the most alarming explanation.",
          stage: "diagnose",
          quality: "weak",
          feedback: "Operations already confirmed shipments are moving normally — telling customers their shipments may be lost would be both wrong and needlessly alarming before you've investigated anything.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-confirmed": {
      id: "scope-confirmed",
      prompt: "You confirm shipments are physically fine — this is specifically a tracking data/visibility issue.",
      evidence: [
        "Operations confirms shipments are scanning and moving normally at every stage today.",
        "The customer-facing tracking page has shown no new status updates for any shipment since approximately 07:00.",
      ],
      actions: [
        { id: "check-integration-logs", label: "Check the logs for the integration feeding the tracking page", description: "Find out what's actually failing.", stage: "evidence", quality: "strong", feedback: "Right call — the logs for whatever pulls scan data into the tracking page will show you exactly what's failing and since when.", nextNodeId: "logs-checked" },
        { id: "check-last-update-time", label: "Check the exact time of the last successful tracking update", description: "Pin down the failure window precisely.", stage: "evidence", quality: "strong", feedback: "Good — a precise timestamp lets you correlate this against anything that changed around the same time.", nextNodeId: "timestamp-checked" },
      ],
    },

    "logs-checked": {
      id: "logs-checked",
      prompt: "You check the tracking integration's logs.",
      evidence: ["Fictional training evidence: every attempt to pull new scan data has failed with HTTP 401 Unauthorized since 07:10 today."],
      actions: [
        { id: "check-recent-changes-a", label: "Check whether any credentials or configuration changed around 07:10", description: "Look for a triggering event.", stage: "evidence", quality: "strong", feedback: "Exactly right — a 401 error strongly suggests an authentication/credential problem, not a general outage.", nextNodeId: "cause-found" },
        { id: "assume-outage", label: "Assume the whole tracking platform is down", description: "Treat this as a general outage without further evidence.", stage: "diagnose", quality: "weak", feedback: "A specific 401 Unauthorized error on one integration is much more precise than 'the whole platform is down' — treating it as a general outage skips evidence you already have.", nextNodeId: "logs-checked" },
      ],
    },

    "timestamp-checked": {
      id: "timestamp-checked",
      prompt: "You check exactly when tracking updates last succeeded.",
      evidence: ["Fictional training evidence: the last successful tracking data pull completed at 07:09 today. Every attempt since has failed."],
      actions: [
        { id: "check-integration-logs-2", label: "Check the integration logs for the specific failure reason", description: "Find out what's actually failing at that time.", stage: "evidence", quality: "strong", feedback: "Good — now you have a precise window, the logs will tell you exactly what started failing.", nextNodeId: "logs-checked" },
        { id: "check-recent-changes-b", label: "Check whether anything changed around 07:09 (credentials, configuration)", description: "Look for a triggering event.", stage: "evidence", quality: "strong", feedback: "Good instinct — pinning a precise time is exactly what lets you correlate against recent changes.", nextNodeId: "cause-found" },
      ],
    },

    "cause-found": {
      id: "cause-found",
      prompt: "You check for recent changes around the failure window.",
      evidence: [
        "Fictional training evidence: the API key used by the tracking integration expired at 07:10 today as part of a routine, scheduled credential rotation.",
        "No renewed key was configured for the integration before the rotation took effect.",
      ],
      actions: [
        { id: "proceed-to-hub", label: "You have enough evidence — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — a 401 error starting the exact minute a scheduled key rotation completed, with no renewed key configured, is about as clear as evidence gets.", nextNodeId: "hub" },
        { id: "dismiss-rotation", label: "Assume the key rotation is unrelated", description: "Dismiss the timing as coincidence.", stage: "diagnose", quality: "weak", feedback: "The failure started in the exact same minute as the rotation — that's an extremely tight correlation to dismiss as coincidence.", nextNodeId: "cause-found" },
      ],
    },

    hub: {
      id: "hub",
      prompt:
        "You have clear evidence: shipments are physically fine, but the tracking integration has failed authentication (401) since the exact minute a scheduled API key rotation completed, with no renewed key configured. Every customer checking tracking is affected. Decide how to proceed.",
      actions: [
        {
          id: "escalate-with-evidence",
          label: "Escalate to Applications with the error, exact timestamp, and key-rotation correlation, framed as an organization-wide customer-visibility issue",
          description: "Hand off with everything needed to act immediately, and the right urgency framing.",
          stage: "escalate",
          quality: "strong",
          feedback: "This is exactly the escalation that gets fixed fast — specific error, specific cause, and a clear statement that every customer's visibility is affected right now, which sets the right urgency.",
          nextNodeId: "post-escalate",
        },
        {
          id: "restart-tracking-frontend",
          label: "Restart the customer-facing tracking website",
          description: "Try the fastest visible fix.",
          stage: "resolve",
          quality: "weak",
          feedback: "The website itself isn't broken — the integration feeding it data is failing authentication. Restarting the frontend won't fix an expired API key.",
          nextNodeId: "hub",
        },
        {
          id: "escalate-vague",
          label: "Escalate by saying \"tracking is broken\"",
          description: "Hand off without the specific evidence or impact framing.",
          stage: "escalate",
          quality: "weak",
          feedback: "You did the work to isolate this to a specific expired credential affecting every customer — not including that means Applications has to redo your investigation, and may not realize how urgent it is.",
          nextNodeId: "outcome-escalated-vague",
        },
        {
          id: "wait-it-out",
          label: "Assume the integration will recover automatically on its own retry schedule",
          description: "Take no action and see what happens.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "An expired credential won't fix itself on a retry — every attempt will keep failing with the same 401 until a renewed key is configured, and customer complaints will keep growing in the meantime.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "You escalate with the 401 evidence, exact timestamp, and rotation correlation, framed as an organization-wide customer-visibility issue. Applications confirms the integration's API key wasn't renewed during rotation, issues a new key, and updates the integration's configuration.",
      evidence: ["Fictional training evidence: Applications confirms a new API key has been configured for the tracking integration."],
      actions: [
        { id: "verify-resolve", label: "Confirm new tracking updates are actually reaching the customer-facing page and the backlog is catching up", description: "Check the fix actually worked for customers.", stage: "verify", quality: "strong", feedback: "This confirms the customer-facing impact is actually resolved, not just that a key was replaced on the backend.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify", label: "Close the ticket as soon as Applications says the key is renewed", description: "Trust the fix without checking the customer-facing result.", stage: "verify", quality: "weak", feedback: "The diagnosis and escalation were excellent — the missing step is confirming customers actually see updated tracking again, not just that a credential was replaced internally.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You correctly separated a visibility problem from a physical shipment problem, isolated it to an expired API key using logs and timestamps, escalated with clear business-impact framing, and verified customers actually saw tracking updates resume.",
        escalatedTeam: "applications",
        modelResolution: "Confirming shipments were physically fine first isolated the problem to the data feed → logs and timestamps pinpointed a 401 error starting exactly at a scheduled key rotation → escalating with that evidence and the organization-wide customer impact got it fixed fast → verifying tracking actually updated again for customers confirmed the fix, not just the backend change.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You traced the failure to a specific expired credential and escalated with strong evidence, but closed the ticket without confirming customers actually saw tracking resume.",
        escalatedTeam: "applications",
        modelResolution: "The diagnosis and escalation were excellent. The remaining step is confirming with the actual customer-facing page (or with Support) that tracking updates resumed, rather than trusting that a backend credential fix was automatically sufficient.",
      },
    },
    "outcome-escalated-vague": {
      id: "outcome-escalated-vague",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary: "You escalated to the right team, but without the specific evidence or business-impact framing, so they had to redo the investigation and may not have realized the urgency.",
        escalatedTeam: "applications",
        modelResolution: "The 401 error, exact timestamp, key-rotation correlation, and the fact every customer checking tracking is affected are exactly what turns \"tracking is broken\" into an escalation that gets prioritized and fixed quickly.",
      },
    },
  },
};
