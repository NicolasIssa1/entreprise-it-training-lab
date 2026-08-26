import { InvestigationScenario } from "@/lib/types";

// Fictional training scenario — no real DHL systems or data. See root CLAUDE.md.
export const vpnConnectivityScenario: InvestigationScenario = {
  id: "vpn-connectivity",
  title: "VPN Connects, But Internal Resources Stay Unavailable",
  description:
    "A remote employee's VPN client shows \"Connected,\" but internal resources still don't work — isolate which layer is actually failing.",
  difficulty: "Foundation",
  estimatedMinutes: 12,
  initialReport:
    "A remote employee reports their VPN client shows \"Connected,\" but they can't reach internal file shares or internal web tools. Regular internet browsing works fine.",
  suggestedBusinessImpact: "A small team",
  businessImpactNote:
    "It initially looks like one person's problem, but a quick scope check (see below) usually surfaces whether other remote employees are quietly having the same issue today.",
  relatedTopicIds: ["vpn", "dns", "ip-address", "escalation"],
  likelyTeams: ["support-network", "infrastructure"],
  learningObjectives: [
    "Isolate which layer is failing: internet, the VPN tunnel itself, DNS, or the internal resource.",
    "Recognize that a VPN client showing \"Connected\" doesn't guarantee full internal access.",
    "Tell an individual configuration issue apart from a shared VPN/DNS problem affecting multiple remote employees.",
    "Choose between a quick individual fix and a root-cause escalation, and understand the trade-off.",
  ],
  startNodeId: "start",
  modelFinalHypothesis: "dns",
  topicsToReview: ["vpn", "dns", "escalation"],
  modelDocumentation: {
    issueSummary: "A remote employee's VPN client showed \"Connected,\" but internal file shares and web tools were unreachable while general internet access worked normally.",
    scopeImpact: "Initially reported by one employee; a scope check found two other remote employees mentioning the same symptom today.",
    evidenceGathered: "VPN tunnel was active with a valid internal IP assigned. Internal resources were reachable by IP address but not by hostname while on VPN. The VPN client's assigned DNS server was pointing at a public DNS server instead of the internal one.",
    likelyCause: "A recent change to the VPN profile pushed the wrong internal DNS server setting to remote clients.",
    actionTaken: "Escalated with the DNS-over-VPN evidence and the note that multiple remote employees appeared affected.",
    escalation: "Escalated to the team managing VPN/DNS configuration (commonly Infrastructure or Support & Network — exact ownership varies by organization) rather than fixing only the one reporting employee.",
    verification: "Confirmed internal access was restored for the original employee and, where possible, the others who mentioned the same issue.",
  },
  nodes: {
    start: {
      id: "start",
      prompt:
        "You pick up the ticket. A remote employee's VPN client shows \"Connected,\" but internal file shares and internal web tools don't work. Regular internet browsing is fine.",
      diagnosticQuestions: [
        { id: "q-others", question: "Is anyone else affected?", answer: "A quick check in the team chat finds two other remote employees mentioning similar trouble today." },
        { id: "q-worked-before", question: "Did this work before?", answer: "Yes — the employee says it worked fine yesterday from the same location." },
        { id: "q-exact-error", question: "What exact error appears?", answer: "No error dialog — internal sites just spin/time out; file shares show \"network path not found.\"" },
        { id: "q-other-device", question: "Does this happen on another device?", answer: "The employee doesn't have a second device available to test with today." },
      ],
      actions: [
        {
          id: "check-tunnel-and-internet",
          label: "Confirm the VPN tunnel is actually active and that general internet access works",
          description: "Don't trust the \"Connected\" label alone — verify it.",
          stage: "evidence",
          quality: "strong",
          feedback: "Good — a client can say \"Connected\" while the tunnel or its routing is still broken; confirming both independently is the right first move.",
          nextNodeId: "tunnel-and-internet-ok",
        },
        {
          id: "check-scope",
          label: "Check whether other remote employees are having the same issue today",
          description: "Establish scope before assuming this is one person's problem.",
          stage: "scope",
          quality: "strong",
          feedback: "Good instinct — this changes whether you're looking at one misconfigured device or a shared VPN/DNS problem.",
          nextNodeId: "scope-checked",
        },
        {
          id: "reinstall-vpn-client",
          label: "Have the employee uninstall and reinstall the VPN client",
          description: "Try a full reset of the client.",
          stage: "resolve",
          quality: "weak",
          feedback: "That's a heavy step before confirming which layer is actually failing — the client is already reporting \"Connected,\" so the problem is more likely routing or DNS than the client install itself.",
          nextNodeId: "start",
        },
      ],
    },

    "tunnel-and-internet-ok": {
      id: "tunnel-and-internet-ok",
      prompt: "You verify the tunnel and general connectivity.",
      evidence: [
        "The VPN client shows an active tunnel with a valid internal IP address assigned.",
        "General internet browsing (non-internal sites) works normally.",
      ],
      actions: [
        { id: "check-scope-2", label: "Check whether other remote employees are affected today", description: "Establish scope.", stage: "scope", quality: "strong", feedback: "Good — worth confirming scope now that the tunnel itself checks out.", nextNodeId: "scope-checked" },
        { id: "test-by-ip", label: "Try reaching an internal resource by IP address instead of hostname", description: "Separate a routing problem from a naming problem.", stage: "evidence", quality: "strong", feedback: "Exactly the right next test — this tells you whether the tunnel can actually reach internal resources at all.", nextNodeId: "resource-by-ip" },
        { id: "check-dns-1", label: "Check whether internal hostnames resolve while on VPN", description: "Test name resolution over the tunnel.", stage: "evidence", quality: "strong", feedback: "Also a strong move — this gets you straight to whether DNS-over-VPN is working.", nextNodeId: "vpn-dns-checked" },
      ],
    },

    "scope-checked": {
      id: "scope-checked",
      prompt: "You check with the team.",
      evidence: ["Two other remote employees mention the same symptom in today's team chat — this may not be isolated to one device."],
      actions: [
        { id: "check-tunnel-2", label: "Confirm the VPN tunnel itself is active", description: "Verify routing independent of the client's status label.", stage: "evidence", quality: "strong", feedback: "Good — confirm the tunnel itself before digging further.", nextNodeId: "tunnel-and-internet-ok" },
        { id: "test-by-ip-2", label: "Try reaching an internal resource by IP address", description: "Separate routing from naming.", stage: "evidence", quality: "strong", feedback: "Good — this isolates whether the tunnel can reach internal resources at all.", nextNodeId: "resource-by-ip" },
        { id: "check-dns-2", label: "Check whether internal hostnames resolve while on VPN", description: "Test name resolution.", stage: "evidence", quality: "strong", feedback: "Good — with multiple employees affected, a shared DNS-over-VPN setting is a strong candidate to test.", nextNodeId: "vpn-dns-checked" },
      ],
    },

    "resource-by-ip": {
      id: "resource-by-ip",
      prompt: "You have the employee try an internal resource by IP address instead of hostname.",
      evidence: ["Internal resources ARE reachable by IP address — the tunnel is correctly passing traffic."],
      actions: [
        { id: "check-dns-3", label: "Check whether internal hostnames resolve while on VPN", description: "Test name resolution specifically.", stage: "evidence", quality: "strong", feedback: "Exactly right — if IP works but hostname doesn't, this strongly points to DNS.", nextNodeId: "vpn-dns-checked" },
        { id: "proceed-from-ip", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "reasonable", feedback: "Reasonable — you've ruled out a routing problem, though confirming the DNS setting directly would make your case airtight.", nextNodeId: "hub" },
      ],
    },

    "vpn-dns-checked": {
      id: "vpn-dns-checked",
      prompt: "You check DNS resolution while connected to VPN.",
      evidence: [
        "Internal hostnames fail to resolve while on VPN.",
        "The VPN client's assigned DNS server setting appears to point at a public DNS server instead of the internal one.",
      ],
      actions: [
        { id: "test-by-ip-3", label: "Also confirm internal resources are reachable by IP", description: "Rule out a routing problem too.", stage: "evidence", quality: "strong", feedback: "Good — this confirms the tunnel itself is fine and the problem is specifically DNS.", nextNodeId: "resource-by-ip" },
        { id: "proceed-from-dns", label: "You have enough to work with — move to a decision", description: "Stop investigating and decide next steps.", stage: "diagnose", quality: "strong", feedback: "Strong — IP-reachable-but-hostname-fails on VPN, with a visibly wrong DNS server assigned, is clear evidence.", nextNodeId: "hub" },
        { id: "assume-auth", label: "Assume this is an authentication problem", description: "Guess the cause is login-related.", stage: "diagnose", quality: "weak", feedback: "Nothing here points to authentication — the employee hasn't even reached a login prompt for the internal resource. This looks like a name-resolution problem, not an access-denied one.", nextNodeId: "vpn-dns-checked" },
      ],
    },

    hub: {
      id: "hub",
      prompt: "You have solid evidence: the tunnel works, IP-based access works, but internal hostname resolution over VPN is broken, and it may not be isolated to one employee. Decide how to proceed.",
      actions: [
        {
          id: "resolve-single-user",
          label: "Manually correct the DNS setting on this employee's VPN client",
          description: "Fix the immediate problem for the person who reported it.",
          stage: "resolve",
          quality: "reasonable",
          feedback: "This gets the reporting employee working again quickly, which has real value — but with two other employees possibly affected by the same setting, it doesn't address the likely shared cause.",
          nextNodeId: "post-resolve-partial",
        },
        {
          id: "escalate-with-evidence",
          label: "Escalate to the team managing VPN/DNS configuration, noting multiple remote employees are affected",
          description: "Hand off the root-cause fix with full evidence.",
          stage: "escalate",
          quality: "strong",
          feedback: "Strong — this evidence points at a shared configuration problem, and escalating with the scope and the specific DNS finding lets the right team fix it for everyone at once.",
          nextNodeId: "post-escalate",
        },
        {
          id: "escalate-vague",
          label: "Escalate by saying \"VPN is broken for remote employees\"",
          description: "Hand off without the specific evidence.",
          stage: "escalate",
          quality: "weak",
          feedback: "You did the work to isolate this to a DNS-over-VPN setting — not including that means the receiving team has to redo your investigation before they can start.",
          nextNodeId: "outcome-escalated-weak",
        },
        {
          id: "blame-home-network",
          label: "Tell the employee it's probably their home internet",
          description: "Attribute it to something outside the company's systems.",
          stage: "diagnose",
          quality: "unnecessary",
          feedback: "General internet access already tested fine, and the specific internal-only, DNS-shaped symptom over VPN doesn't fit a home-internet explanation.",
          nextNodeId: "hub",
        },
      ],
    },

    "post-resolve-partial": {
      id: "post-resolve-partial",
      prompt: "You manually correct the DNS setting on this employee's VPN client. Internal resources become reachable for them.",
      evidence: ["This employee's internal access is restored. The other two remote employees mentioned in chat have not been checked yet."],
      actions: [
        { id: "verify-and-flag", label: "Confirm the fix worked, and flag the likely shared cause to the team managing VPN configuration", description: "Close the loop and raise the broader risk.", stage: "verify", quality: "strong", feedback: "This is the best version of the individual fix — it helps this employee immediately and still routes the likely root cause to whoever can fix it for everyone.", nextNodeId: "outcome-resolved-partial-strong" },
        { id: "close-only", label: "Confirm the fix worked for this employee and close the ticket", description: "Close without flagging anything further.", stage: "verify", quality: "weak", feedback: "This employee is fixed, but the other two remote employees who mentioned the same symptom are left with the same likely misconfiguration and no one aware of the pattern.", nextNodeId: "outcome-resolved-partial-weak" },
      ],
    },

    "post-escalate": {
      id: "post-escalate",
      prompt:
        "You escalate with the DNS-over-VPN evidence and the note that multiple remote employees appear affected. The team managing VPN/DNS configuration finds a recent VPN profile change pushed the wrong internal DNS server to remote clients, and has corrected and redeployed the profile.",
      evidence: ["Fictional training evidence: the VPN profile's DNS setting has reportedly been corrected and redeployed to remote clients."],
      actions: [
        { id: "verify-broad", label: "Confirm with this employee and, where possible, the others mentioned in chat that access is restored", description: "Verify the root-cause fix worked broadly.", stage: "verify", quality: "strong", feedback: "This confirms the fix actually solved the shared problem, not just the one ticket in front of you.", nextNodeId: "outcome-resolved-verified-broad" },
        { id: "verify-narrow", label: "Confirm only with the original employee and close", description: "Verify just the one report.", stage: "verify", quality: "reasonable", feedback: "A real verification step, just a narrower one — you confirmed the fix for the person who reported it, but not for the others who may share the same cause.", nextNodeId: "outcome-resolved-verified-narrow" },
      ],
    },

    "outcome-resolved-partial-strong": {
      id: "outcome-resolved-partial-strong",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "reasonable",
        summary: "You isolated the problem to a DNS-over-VPN misconfiguration, fixed it directly for the reporting employee, and flagged the likely shared cause so it can be fixed at the source.",
        modelResolution: "Fixing the individual device is a legitimate, fast response — pairing it with a flag to whoever owns the VPN profile config is what prevents the same issue from resurfacing for other remote employees.",
      },
    },
    "outcome-resolved-partial-weak": {
      id: "outcome-resolved-partial-weak",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "resolved",
        quality: "weak",
        summary: "You correctly diagnosed and fixed the DNS-over-VPN issue for the reporting employee, but closed the ticket without flagging the likely shared cause — the other two employees are still affected.",
        modelResolution: "The diagnosis was correct. Given two other employees mentioned the same symptom, escalating the underlying VPN profile setting (in addition to the individual fix) would have prevented repeat tickets.",
      },
    },
    "outcome-resolved-verified-broad": {
      id: "outcome-resolved-verified-broad",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "strong",
        summary: "You isolated the DNS-over-VPN root cause, escalated with scope and evidence, and verified the fix restored access broadly, not just for the original report.",
        escalatedTeam: "infrastructure",
        modelResolution: "Confirming the tunnel worked and testing IP vs. hostname isolated this to DNS → escalating with the scope (multiple employees) and the specific setting let the receiving team fix the shared root cause once → verifying broadly confirmed it actually worked for everyone affected.",
      },
    },
    "outcome-resolved-verified-narrow": {
      id: "outcome-resolved-verified-narrow",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "reasonable",
        summary: "You isolated the root cause correctly and escalated with good evidence, but only verified the fix with the original employee, not the others who may have shared it.",
        escalatedTeam: "infrastructure",
        modelResolution: "The diagnosis and escalation were strong. Verifying with the other employees who mentioned the same symptom (not just the original reporter) would confirm the shared cause is actually fixed for everyone.",
      },
    },
    "outcome-escalated-weak": {
      id: "outcome-escalated-weak",
      prompt: "Investigation complete.",
      actions: [],
      outcome: {
        result: "escalated",
        quality: "weak",
        summary: "You escalated a real, correctly-suspected problem, but without the specific evidence gathered, so the receiving team has to redo the investigation before they can act.",
        escalatedTeam: "infrastructure",
        modelResolution: "The IP-vs-hostname test and the visibly wrong DNS server setting were exactly the evidence needed — including them in the escalation would have turned this into an immediately actionable ticket.",
      },
    },
  },
};
