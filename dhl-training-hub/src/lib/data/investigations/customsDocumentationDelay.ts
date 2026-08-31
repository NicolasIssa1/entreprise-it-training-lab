import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems, shipments, customs
// authorities, or data. See root CLAUDE.md. Business-impact investigation
// (Phase 7): what first looks like a single delayed shipment turns out to be a
// systemic booking-system bug affecting several shipments — practicing
// reassessing business impact as evidence evolves, and resolving an immediate
// case without skipping the systemic escalation.
export const customsDocumentationDelayScenario: InvestigationScenario = {
  id: "customs-documentation-delay",
  title: "A Shipment Has Been Held at Customs for Five Days",
  description:
    "A customer's shipment is stuck awaiting customs clearance far longer than usual — reason about whether this is a routine hold or a documentation error, and whether the impact is really limited to one shipment.",
  difficulty: "Intermediate",
  estimatedMinutes: 13,
  initialReport:
    "A consignee is asking why their shipment has been \"awaiting customs\" for five days. The shipper says all paperwork was submitted through the normal booking system at the time of booking.",
  suggestedBusinessImpact: "A small team",
  businessImpactNote:
    "At first glance this looks contained to one shipment and its consignee — but don't finalize that judgment until you've checked whether anything about this shipment's documentation is actually unusual, or whether other shipments from the same period show the same pattern.",
  relatedTopicIds: ["customs-clearance", "shipping-documentation", "exception-management", "business-automation"],
  likelyTeams: ["applications"],
  learningObjectives: [
    "Distinguish a routine customs hold from an actual documentation error.",
    "Revise an initial business-impact assessment as new evidence reveals a broader, systemic cause.",
    "Resolve an immediate case without skipping the escalation needed to protect everyone else affected.",
    "Translate a booking-system defect into its concrete customs/business consequence.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "application",
  topicsToReview: ["customs-clearance", "shipping-documentation", "exception-management", "technical-business-translation"],
  modelDocumentation: {
    issueSummary:
      "A shipment was held at customs for five days awaiting a documentation review, longer than typical for this type of shipment.",
    scopeImpact:
      "Initially assessed as one shipment/one consignee, but investigation found two other shipments booked through the same origin office in the same week were also delayed with the same pattern — a small but real multi-shipment, multi-customer impact.",
    evidenceGathered:
      "The submitted goods classification code didn't match the commercial invoice description. Checking recent changes showed the booking system's classification field had silently defaulted to an outdated code after a form update three days earlier, whenever a booker didn't manually override it.",
    likelyCause:
      "A booking-form update introduced an incorrect default classification code, which was applied to any shipment where the field wasn't manually overridden, triggering customs holds for mismatched declarations.",
    actionTaken: "Manually corrected and resubmitted the held shipment's documentation to get it moving immediately.",
    escalation:
      "Escalated to Applications (owns the booking system) with the defaulting-bug evidence and a request to check and correct all shipments affected since the form update, not just this one.",
    verification:
      "Confirmed this shipment cleared customs after resubmission, and confirmed with Applications that the other affected shipments were identified and corrected once the fix shipped.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. A consignee is asking about a shipment held at customs for five days. The shipper insists all paperwork was submitted correctly at booking.",
      diagnosticQuestions: [
        { id: "q-normal-duration", question: "Is five days unusual for this type of customs review?", answer: "It's longer than typical, but customs timing does vary — worth checking the actual documentation before assuming an error." },
        { id: "q-other-shipments", question: "Are any other shipments showing the same pattern?", answer: "Not checked yet — worth looking into." },
        { id: "q-when-booked", question: "When was this shipment booked, relative to any recent system changes?", answer: "Booked three days after a routine update to the booking system's form." },
      ],
      actions: [
        {
          id: "confirm-scope-first",
          label: "Check whether this looks like a routine hold or an actual documentation problem, before assuming either",
          description: "Don't jump to a conclusion in either direction yet.",
          stage: "scope",
          quality: "strong",
          feedback: "Right instinct — five days is longer than typical, but that alone doesn't tell you whether it's a routine review or a real documentation error. Check the actual submission next.",
          nextNodeId: "scope-confirmed",
        },
        {
          id: "tell-consignee-error",
          label: "Tell the consignee this is definitely a paperwork mistake by the shipper",
          description: "Assume the cause before checking anything.",
          stage: "diagnose",
          quality: "weak",
          feedback: "You haven't checked the actual submitted documentation yet — customs delays aren't automatically evidence of an error, and blaming the shipper prematurely could be wrong and unhelpful.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-confirmed": {
      id: "scope-confirmed",
      prompt: "You treat this as needing evidence before any conclusion — routine hold, or an actual error.",
      evidence: [
        "The shipment has shown status \"customs hold — documentation review\" since day 1, with no further detail.",
        "This is a standard shipment type for this route, which doesn't typically warrant a five-day hold.",
      ],
      actions: [
        { id: "check-submitted-docs", label: "Check the actual documentation submitted for this shipment", description: "See exactly what was declared.", stage: "evidence", quality: "strong", feedback: "Good — comparing what was actually submitted against the goods is the most direct way to find out if there's a real mismatch.", nextNodeId: "doc-checked" },
        { id: "check-other-shipments", label: "Check whether other shipments from the same origin office show a similar pattern this week", description: "Look for a broader pattern before assuming this is isolated.", stage: "evidence", quality: "strong", feedback: "Good instinct — checking for a pattern early can save time if this turns out to be systemic rather than a one-off.", nextNodeId: "other-shipments-checked" },
      ],
    },

    "doc-checked": {
      id: "doc-checked",
      prompt: "You compare the submitted documentation against the shipment.",
      evidence: [
        "Fictional training evidence: the goods classification code submitted doesn't match the product description on the commercial invoice — a mismatch that would routinely trigger a manual customs review.",
      ],
      actions: [
        { id: "check-how-entered", label: "Check how that classification code was actually entered at booking", description: "Find out whether this was a one-off data entry mistake or something else.", stage: "evidence", quality: "strong", feedback: "Exactly right — a wrong code found is only half the picture; how it got there tells you whether this is a one-off or something bigger.", nextNodeId: "cause-found" },
        { id: "assume-random-review", label: "Assume this is just a random customs inspection, unrelated to the documentation", description: "Dismiss the mismatch you just found.", stage: "diagnose", quality: "weak", feedback: "You just found a real classification mismatch — that's a much more specific, verifiable explanation than assuming an unrelated random inspection.", nextNodeId: "doc-checked" },
      ],
    },

    "other-shipments-checked": {
      id: "other-shipments-checked",
      prompt: "You check other recent shipments from the same origin office.",
      evidence: [
        "Fictional training evidence: two other shipments booked through the same origin office this week show the same classification-code pattern and are also delayed at customs.",
      ],
      actions: [
        { id: "check-how-entered-2", label: "Check how the classification code is being entered/defaulted at booking for these shipments", description: "Find the common cause behind the pattern.", stage: "evidence", quality: "strong", feedback: "Good — a shared pattern across multiple shipments points toward a common cause, and the booking process is the obvious place to look next.", nextNodeId: "cause-found" },
        { id: "treat-as-coincidence", label: "Treat this as three unrelated coincidences", description: "Dismiss the shared pattern.", stage: "diagnose", quality: "weak", feedback: "Three shipments from the same office, with the same pattern, in the same week is a strong signal of a shared cause — not something to dismiss as coincidence without checking further.", nextNodeId: "other-shipments-checked" },
      ],
    },

    "cause-found": {
      id: "cause-found",
      prompt: "You investigate how the classification code ends up on these bookings.",
      evidence: [
        "Fictional training evidence: the booking system's classification code field started silently defaulting to an outdated code three days ago, right after a routine form update — applied whenever the person booking didn't manually override it.",
        "Every shipment booked through that form since the update, where the field wasn't manually overridden, carries the same incorrect default.",
      ],
      actions: [
        { id: "proceed-to-hub", label: "You have enough evidence — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — a defaulting bug introduced by a form update, affecting every un-overridden booking since, fully explains both this shipment and the pattern in the others.", nextNodeId: "hub" },
        { id: "dismiss-as-one-off", label: "Treat this shipment as a one-off data entry mistake and stop looking further", description: "Ignore that the same default affects every booking since the update.", stage: "diagnose", quality: "weak", feedback: "This isn't one person's mistake — it's a default applied automatically by the system to every booking since a specific update, which is a very different (and more urgent) kind of problem.", nextNodeId: "cause-found" },
      ],
    },

    hub: {
      id: "hub",
      prompt:
        "You have clear evidence: a booking-form update silently introduced an incorrect default classification code three days ago, affecting this shipment and at least two others from the same office. Decide how to proceed.",
      actions: [
        {
          id: "escalate-with-evidence",
          label: "Escalate to Applications with the defaulting-bug evidence, framed as affecting multiple shipments/customers, not just this one",
          description: "Get the systemic cause fixed for everyone affected.",
          stage: "escalate",
          quality: "strong",
          feedback: "This is the escalation that actually protects every affected customer, not just this one — specific evidence, and framed by its real, broader scope.",
          nextNodeId: "post-escalate",
        },
        {
          id: "fix-single-shipment-only",
          label: "Manually correct and resubmit just this shipment's documentation to get it moving",
          description: "Solve the immediate case in front of you.",
          stage: "resolve",
          quality: "reasonable",
          feedback: "This genuinely helps this consignee right away — but the same defaulting bug is still silently affecting other bookings until someone escalates it.",
          nextNodeId: "post-single-fix",
        },
        {
          id: "escalate-vague",
          label: "Escalate by saying \"a shipment is stuck in customs\"",
          description: "Hand off without the specific evidence or the broader pattern.",
          stage: "escalate",
          quality: "weak",
          feedback: "You found a specific defaulting bug affecting multiple shipments — leaving that out means Applications has to rediscover it, and may only fix this one case.",
          nextNodeId: "outcome-escalated-vague",
        },
        {
          id: "wait-for-customs",
          label: "Assume customs will eventually clear it on its own and take no action",
          description: "Take no action and hope it resolves itself.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "Customs won't reclassify goods on its own — the mismatched declaration needs to be corrected before this shipment (or the others like it) can clear.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-single-fix": {
      id: "post-single-fix",
      prompt: "You manually correct and resubmit this shipment's documentation. Customs clears it within a day.",
      evidence: ["Fictional training evidence: the corrected declaration cleared customs review the next morning."],
      actions: [
        {
          id: "now-escalate-systemic",
          label: "Now escalate the booking-form defaulting bug to Applications, since it's still affecting other shipments",
          description: "Don't stop at the case in front of you.",
          stage: "escalate",
          quality: "strong",
          feedback: "Good catch — resolving this shipment doesn't fix the underlying default still silently affecting other bookings. Escalating now protects everyone else.",
          nextNodeId: "post-escalate",
        },
        {
          id: "close-without-escalating",
          label: "Close this ticket now that the shipment has cleared",
          description: "Consider the job done once this one case is resolved.",
          stage: "verify",
          quality: "weak",
          feedback: "This specific shipment is fine, but the booking form is still defaulting to the wrong classification code for every new, un-overridden booking — closing here leaves that live.",
          nextNodeId: "outcome-resolved-partial",
        },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "Applications confirms the form-update bug, deploys a fix, and reviews shipments booked since the update — correcting classification codes for the affected ones, including any not yet resubmitted.",
      evidence: ["Fictional training evidence: Applications confirms the booking form default has been corrected and all shipments affected since the update have been reviewed."],
      actions: [
        { id: "verify-all-affected", label: "Confirm with Applications that every affected shipment (not just this one) has actually been corrected", description: "Check the fix actually covered the full scope, not just this case.", stage: "verify", quality: "strong", feedback: "This confirms the real business impact — every affected customer, not just the one who happened to complain first — was actually addressed.", nextNodeId: "outcome-resolved-verified" },
        { id: "skip-verify-scope", label: "Close the ticket once Applications says the form is fixed, without checking the other shipments", description: "Trust the fix without confirming its full scope.", stage: "verify", quality: "weak", feedback: "The form fix is necessary but not sufficient on its own — the other shipments already carrying the wrong code from before the fix still need to be confirmed corrected.", nextNodeId: "outcome-resolved-unverified" },
      ],
    },

    "outcome-resolved-verified": {
      id: "outcome-resolved-verified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary:
          "You correctly revised the scope from one shipment to a systemic booking-system defect, isolated the cause with evidence, escalated with clear business-impact framing, and verified every affected shipment — not just this one — was actually corrected.",
        escalatedTeam: "applications",
        modelResolution:
          "Checking the actual documentation (not assuming an error, or a random hold) found the mismatch → checking other shipments from the same office revealed a pattern, not a coincidence → tracing how the code was entered found a form-update defaulting bug → escalating with that evidence and its real multi-shipment scope got every affected customer fixed, not just the one who complained → verifying the full scope (not just the form fix) confirmed the business impact was actually resolved.",
      },
    },
    "outcome-resolved-unverified": {
      id: "outcome-resolved-unverified",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary:
          "You correctly identified the systemic defaulting bug and escalated it with strong evidence, but closed the ticket without confirming every affected shipment (not just this one) was actually corrected.",
        escalatedTeam: "applications",
        modelResolution:
          "The diagnosis and escalation were strong. The remaining step is confirming the fix's full scope with Applications — that every shipment affected since the form update was corrected, not only that the form itself was patched.",
      },
    },
    "outcome-resolved-partial": {
      id: "outcome-resolved-partial",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary:
          "You correctly diagnosed and fixed this consignee's shipment, which genuinely helped them — but closed the ticket without escalating the booking-form bug still silently affecting other shipments.",
        escalatedTeam: "applications",
        modelResolution:
          "Fixing this shipment was the right immediate action. The gap: the same defaulting bug keeps applying to every new, un-overridden booking until someone escalates it to Applications — resolving one visible case isn't the same as fixing the root cause affecting others who haven't complained yet.",
      },
    },
    "outcome-escalated-vague": {
      id: "outcome-escalated-vague",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary:
          "You escalated to the right team, but without the specific evidence or the multi-shipment pattern, so Applications had to rediscover the cause and may have only fixed this one case.",
        escalatedTeam: "applications",
        modelResolution:
          "The classification mismatch, the form-update timing, and the fact that at least two other shipments show the same pattern are exactly what turns \"a shipment is stuck\" into an escalation that gets the systemic bug — and everyone affected by it — fixed.",
      },
    },
  },
};
