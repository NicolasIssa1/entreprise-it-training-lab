import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario. All employees, devices, and evidence below are
// generic and made up for training purposes — no real DHL systems, hostnames, or
// data. See root CLAUDE.md.
export const dnsResolutionScenario: InvestigationScenario = {
  id: "dns-resolution",
  title: "Several Employees Can't Reach an Internal Portal",
  description:
    "A classic \"is it DNS?\" investigation — practice isolating a name-resolution failure from a real service outage.",
  difficulty: "Foundation",
  estimatedMinutes: 12,
  initialReport:
    "Multiple employees report that an internal web portal is unreachable. Their browsers show \"This site can't be reached\" / \"server not found\" errors. It was reportedly working yesterday.",
  suggestedBusinessImpact: "A department",
  businessImpactNote:
    "Early reports came from a handful of employees, but checking scope properly (see below) usually reveals a wider or narrower picture than the first few reports suggest — that's exactly why scope gets checked early rather than assumed.",
  relatedTopicIds: ["dns", "ip-address", "escalation"],
  likelyTeams: ["support-network", "infrastructure"],
  learningObjectives: [
    "Separate a name-resolution failure from a real service outage by testing IP vs. hostname.",
    "Check scope (who/how many are affected) before assuming a device-level cause.",
    "Escalate with specific evidence rather than a vague description.",
    "Verify a fix with the people who reported it, not just that a change was made.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "dns",
  topicsToReview: ["dns", "ip-address", "escalation"],
  modelDocumentation: {
    issueSummary: "Multiple employees unable to reach an internal portal by hostname; browser shows a \"server not found\" style error.",
    scopeImpact: "At least 4 employees across 2 desks, plus a phone on the same Wi-Fi — not limited to one device or one person.",
    evidenceGathered: "The portal responds normally when reached directly by IP address. The hostname does not resolve for any tested device.",
    likelyCause: "An incorrect or stale DNS record for the portal's hostname.",
    actionTaken: "Escalated to the team managing internal DNS with the IP-vs-hostname evidence.",
    escalation: "Escalated to Infrastructure (commonly involved in DNS zone management — exact ownership varies by organization) after confirming the service itself was reachable.",
    verification: "Confirmed with the originally affected employees that the portal now loads by hostname.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. Multiple employees say they can't open an internal web portal — their browsers show \"This site can't be reached\" or \"server not found.\" It was working yesterday.",
      diagnosticQuestions: [
        {
          id: "q-others",
          question: "Is anyone else affected, or is it just this one person?",
          answer: "At least four employees across two different desks have reported the same thing so far.",
        },
        {
          id: "q-when",
          question: "Did this work before, and when did it start?",
          answer: "Everyone agrees it was working yesterday afternoon; the first reports came in this morning.",
        },
        {
          id: "q-error",
          question: "What exact error appears?",
          answer: "\"This site can't be reached\" / \"server not found\" — a browser-level connection error, not an application error page.",
        },
        {
          id: "q-other-device",
          question: "Does this happen on another device, e.g. a phone on the same Wi-Fi?",
          answer: "One employee tried their phone on the same office Wi-Fi and got the identical error.",
        },
      ],
      actions: [
        {
          id: "check-scope",
          label: "Check how many people/desks are actually affected",
          description: "Confirm scope before assuming this is one device's problem.",
          stage: "scope",
          quality: "strong",
          feedback:
            "Good instinct — confirming scope early tells you whether this is a single device, a location, or something shared before you touch anything.",
          nextNodeId: "scope-confirmed",
        },
        {
          id: "restart-first-laptop",
          label: "Restart the first employee's laptop and consider it handled",
          description: "Try the fastest fix on the device in front of you.",
          stage: "resolve",
          quality: "weak",
          feedback:
            "Restarting one laptop might help that single device, but multiple unrelated employees are reporting the identical symptom — a device-level restart tells you nothing about a shared cause, and it isn't itself evidence of anything.",
          nextNodeId: "start",
        },
      ],
    },

    "scope-confirmed": {
      id: "scope-confirmed",
      prompt:
        "You confirm scope: four employees across two desks, plus one phone on the same Wi-Fi, all see the same browser error for the same portal.",
      evidence: [
        "Four employees across two desks are affected — not isolated to one machine.",
        "One employee's phone (same office Wi-Fi) reproduces the identical error.",
      ],
      actions: [
        {
          id: "try-by-ip",
          label: "Try reaching the portal by its IP address instead of the hostname",
          description: "Separate \"the service is down\" from \"the name isn't resolving.\"",
          stage: "evidence",
          quality: "strong",
          feedback:
            "Excellent — this is exactly how you tell a real outage apart from a name-resolution problem in one step.",
          nextNodeId: "ip-works",
        },
        {
          id: "check-hostname-resolution",
          label: "Check whether the hostname resolves at all (e.g. nslookup/ping)",
          description: "Test name resolution directly.",
          stage: "evidence",
          quality: "strong",
          feedback: "Also a strong first move — this gets you straight to whether name resolution itself is working.",
          nextNodeId: "hostname-fails",
        },
        {
          id: "check-access-point",
          label: "Assume it's a Wi-Fi problem and check the wireless access point",
          description: "Investigate the access point covering the affected desks.",
          stage: "evidence",
          quality: "reasonable",
          feedback:
            "Worth ruling out, but the phone reproducing the issue on the same Wi-Fi doesn't rule Wi-Fi out entirely — checking whether the name resolves or the service is reachable by IP will narrow this down faster.",
          nextNodeId: "wifi-checked",
        },
        {
          id: "escalate-now-scope",
          label: "Escalate straight away — let Infrastructure figure it out",
          description: "Hand this off immediately without further checks.",
          stage: "escalate",
          quality: "weak",
          feedback:
            "You can always escalate, but with nothing more than \"a few people can't reach a portal,\" the receiving team will have to ask the same scope/IP-vs-hostname questions before they can even start.",
          nextNodeId: "outcome-escalated-weak",
        },
      ],
    },

    "wifi-checked": {
      id: "wifi-checked",
      prompt: "You check the access point covering the affected desks.",
      evidence: [
        "The access point shows healthy status, normal client count, and no errors.",
        "Other websites and internal services over the same Wi-Fi are unaffected.",
      ],
      actions: [
        {
          id: "try-by-ip-2",
          label: "Try reaching the portal by its IP address",
          description: "Separate a real outage from a naming problem.",
          stage: "evidence",
          quality: "strong",
          feedback: "Right call — the Wi-Fi itself looking healthy points you toward testing the service directly.",
          nextNodeId: "ip-works",
        },
        {
          id: "check-hostname-resolution-2",
          label: "Check whether the hostname resolves at all",
          description: "Test name resolution directly.",
          stage: "evidence",
          quality: "strong",
          feedback: "Good — testing name resolution directly gets you to the answer quickly.",
          nextNodeId: "hostname-fails",
        },
      ],
    },

    "ip-works": {
      id: "ip-works",
      prompt: "You reach the portal directly by its IP address.",
      evidence: ["The portal loads normally and behaves correctly when accessed by IP address."],
      actions: [
        {
          id: "now-check-hostname",
          label: "Now check whether the hostname resolves",
          description: "The service itself works — confirm whether the name does too.",
          stage: "evidence",
          quality: "strong",
          feedback: "Exactly the next step — if the service works by IP, the failure is almost certainly in name resolution.",
          nextNodeId: "dns-confirmed",
        },
        {
          id: "tell-users-use-ip",
          label: "Tell everyone to just use the IP address from now on",
          description: "Work around it instead of investigating further.",
          stage: "resolve",
          quality: "weak",
          feedback:
            "That's a workaround, not a fix — IP addresses are hard for people to remember or type, and it doesn't address why the hostname stopped resolving in the first place.",
          nextNodeId: "ip-works",
        },
      ],
    },

    "hostname-fails": {
      id: "hostname-fails",
      prompt: "You test whether the hostname resolves.",
      evidence: ["The hostname does not resolve to any address — lookups fail or time out on every device tested."],
      actions: [
        {
          id: "now-check-ip",
          label: "Now confirm whether the service itself is reachable by IP",
          description: "Rule out a real outage before blaming DNS.",
          stage: "evidence",
          quality: "strong",
          feedback: "Correct sequencing — confirming the service is actually up by IP is what turns this into solid DNS evidence.",
          nextNodeId: "dns-confirmed",
        },
        {
          id: "flush-one-device",
          label: "Flush the DNS cache on one device and call it fixed",
          description: "Clear the local resolver cache on the device in front of you.",
          stage: "resolve",
          quality: "weak",
          feedback:
            "Worth trying on one device as a quick check, but this only clears a local cache — it won't explain or fix a hostname that fails to resolve for everyone, and you can't confirm anything from a single device.",
          nextNodeId: "hostname-fails",
        },
      ],
    },

    "dns-confirmed": {
      id: "dns-confirmed",
      prompt: "You now have both halves of the picture.",
      evidence: [
        "Fictional training evidence: the portal responds normally when reached directly by IP address.",
        "Fictional training evidence: the hostname does not resolve to any address on any device tested.",
      ],
      actions: [
        {
          id: "escalate-with-evidence",
          label: "Escalate to the team that manages internal DNS, with the evidence gathered",
          description: "Hand off with specific, useful evidence.",
          stage: "escalate",
          quality: "strong",
          feedback:
            "This is the strongest move here — you've isolated the failure to name resolution and you're escalating with exactly the evidence the receiving team needs to act quickly.",
          nextNodeId: "post-escalate",
        },
        {
          id: "flush-and-close",
          label: "Flush your own machine's DNS cache and mark the ticket resolved",
          description: "Try a local fix and close the ticket.",
          stage: "resolve",
          quality: "weak",
          feedback:
            "A local cache flush doesn't fix a hostname that fails to resolve for multiple devices — this would close the ticket without actually fixing anything for the people who reported it.",
          nextNodeId: "dns-confirmed",
        },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "You escalate with your evidence: multiple employees/devices affected, portal reachable by IP, hostname fails to resolve everywhere. A short time later, the receiving team reports the internal DNS record for the portal was stale and has now been corrected.",
      evidence: ["Fictional training evidence: the DNS record for the portal has reportedly been corrected."],
      actions: [
        {
          id: "verify-with-users",
          label: "Confirm with the originally affected employees that the portal now loads by hostname",
          description: "Check the fix actually worked for the people who reported it.",
          stage: "verify",
          quality: "strong",
          feedback: "This is the verification step that turns \"a change was made\" into \"the problem is actually resolved.\"",
          nextNodeId: "outcome-resolved-verified",
        },
        {
          id: "close-without-checking",
          label: "Close the ticket without checking back with anyone",
          description: "Assume the fix worked and move on.",
          stage: "verify",
          quality: "weak",
          feedback:
            "It happened to work out here, but closing a ticket on the assumption a fix worked — without confirming with the people who reported it — is a habit that eventually bites you.",
          nextNodeId: "outcome-resolved-unverified",
        },
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
          "You isolated a name-resolution failure from a real outage, escalated with specific evidence, and confirmed with the affected employees that the fix actually restored access.",
        escalatedTeam: "infrastructure",
        modelResolution:
          "Scope confirmed it wasn't one device → testing by IP vs. hostname isolated the failure to name resolution → escalating with that specific evidence let the receiving team act immediately → verifying with the originally affected employees confirmed the fix actually worked, not just that a record changed.",
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
          "You correctly isolated the problem to DNS and escalated with good evidence, but closed the ticket without confirming the fix actually restored access for the employees who reported it.",
        escalatedTeam: "infrastructure",
        modelResolution:
          "The diagnosis and escalation were solid — the missing step was verifying with the affected employees before closing, rather than assuming the fix worked once a change was reported.",
      },
    },

    "outcome-escalated-weak": {
      id: "outcome-escalated-weak",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary:
          "You escalated before gathering any evidence. The receiving team has to come back and ask the same questions — how many people, IP vs. hostname — that could have been answered up front, delaying the actual fix.",
        escalatedTeam: "infrastructure",
        modelResolution:
          "Escalating is often the right call, but escalating without evidence just moves the \"gather evidence\" step to someone else and adds a delay. Checking scope and testing IP vs. hostname first would have made this a same-message, same-evidence escalation.",
      },
    },
  },
};
