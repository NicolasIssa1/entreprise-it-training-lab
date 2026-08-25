import { LearningTopic } from "@/lib/types";

// Foundational, defensive enterprise security awareness — NOT a cybersecurity
// specialist course. No exploit, bypass, or offensive-technique content of any
// kind. Security concepts genuinely cross all three teams; nothing here should be
// read as a confirmed description of DHL's actual security setup or a specific
// "security team" that this project has no knowledge of. See root CLAUDE.md.
export const securityTopics: LearningTopic[] = [
  {
    id: "mfa",
    title: "Multi-Factor Authentication (MFA)",
    category: "Security Fundamentals",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Requiring a second proof of identity beyond a password, so a stolen password alone isn't enough.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Explain what MFA adds beyond a password",
      "Distinguish a login failure from a factor-enrollment or device/time-sync issue",
      "Recognize that a single MFA failure doesn't automatically mean compromise",
    ],
    simpleExplanation: "MFA requires a second proof of identity beyond a password, so a stolen password alone isn't enough to get in.",
    eli10: "MFA is like a house that needs both a key and a fingerprint scan to get in — even if someone copies your key, they still can't get inside without your fingerprint too.",
    technicalExplanation:
      "MFA combines something you know (a password) with something you have (an authenticator app, a hardware key, a one-time code) or something you are (biometrics). Because password-only authentication can be beaten by a leaked or guessed password, adding a second, different-category factor makes account compromise significantly harder even if one factor is exposed.",
    businessPurpose:
      "Passwords alone are frequently reused, phished, or leaked in breaches elsewhere; requiring a second factor protects company accounts even when a password has already been compromised, at relatively low cost to the business.",
    commonProblems: [
      "A user's MFA prompt fails repeatedly after they get a new phone, because their authenticator app wasn't re-enrolled.",
      "A device's clock is out of sync, causing time-based one-time codes to be rejected even though they're technically correct.",
      "A user assumes any MFA failure means their account has been compromised, when it's often a device/enrollment issue.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is this one user, or many users failing MFA at once (pointing to a service-wide issue)?",
      "Distinguish where it's failing: the initial login, the MFA prompt itself, or factor enrollment on a new device.",
      "Check for a device/time-sync issue if using time-based codes.",
      "Check whether the identity/MFA service itself is healthy before assuming the user did something wrong.",
      "Escalate to whoever manages the identity platform if re-enrollment or a stuck account state is needed.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "MFA and factor categories (knowledge/possession/inherence) are foundational authentication theory." },
      { area: "Operating Systems", connection: "Time-based one-time codes depend on device clock synchronization, a systems-level detail." },
    ],
    practiceScenario: {
      scenario: "An employee's MFA prompt repeatedly fails after they replace their phone.",
      question: "What would you check before assuming their account has been compromised?",
      guidance:
        "Check whether the authenticator app was re-enrolled on the new device — a failed MFA prompt after a phone change is much more likely to be an enrollment/device issue than a compromise. Confirming the user's identity through another channel and helping them re-enroll is usually the fix, not treating it as a security incident by default.",
    },
    questionToAskAtWork: "How does this team distinguish an MFA enrollment issue from a genuine account compromise?",
    relatedTopicIds: ["authentication", "least-privilege", "directory-services"],
    keywords: ["multi-factor", "2FA", "authenticator", "one-time code"],
    prerequisiteTopicIds: ["authentication"],
  },
  {
    id: "least-privilege",
    title: "Least Privilege",
    category: "Security Fundamentals",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Giving users and services only the access they actually need — nothing more.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    learningOutcomes: [
      "Explain what least privilege means",
      "Explain why excessive permissions are risky even when convenient",
      "Connect least privilege to authorization/access control",
    ],
    simpleExplanation: "Least privilege means giving users and services only the access they actually need to do their job — nothing more.",
    eli10: "It's like giving a hotel cleaner a key that only opens the rooms they clean, not a master key to the whole building — so if that key is ever lost, the risk is much smaller.",
    technicalExplanation:
      "Least privilege is a design principle applied to permissions, roles, and service accounts: access should be scoped to what's needed for a specific task or role, and reviewed/removed when no longer needed. It reduces the potential damage from a mistake, a compromised account, or an insider risk, since a limited set of permissions limits what can go wrong.",
    businessPurpose:
      "Excess permissions accumulate quietly over time — a role change here, a \"just in case\" grant there — and create risk without adding value. Least privilege keeps the blast radius of any single compromised account or mistake as small as possible.",
    commonProblems: [
      "A user accumulates access from several past roles that was never removed.",
      "A service account is granted broad admin-level access for convenience, far beyond what it actually uses.",
      "Access requests are approved automatically without checking whether the requested scope is actually needed.",
    ],
    troubleshootingSteps: [
      "When investigating unexpected access, check what the user's current role actually requires.",
      "Compare granted permissions against actual usage, not just the original request.",
      "Distinguish \"this access is technically working\" from \"this access should exist at all.\"",
      "Recommend a scoped, appropriate grant instead of automatically approving the broadest option requested.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Least privilege is a foundational access-control design principle." },
      { area: "Software Engineering", connection: "Scoping service account permissions is a standard secure-design practice in system architecture." },
    ],
    practiceScenario: {
      scenario: "A user signs in successfully and can open a sensitive report they haven't needed for their role in over a year.",
      question: "Is this an authentication problem, and what principle does it violate?",
      guidance:
        "This isn't authentication — the user is who they say they are. It's a least-privilege violation: access that's no longer needed was never revoked. The fix is a permissions review, not a login or security-incident response.",
    },
    questionToAskAtWork: "How often are user permissions reviewed here to remove access that's no longer needed?",
    relatedTopicIds: ["authentication", "directory-services", "mfa"],
    keywords: ["access control", "minimal access", "permission scope"],
    prerequisiteTopicIds: ["authentication"],
    dontConfuseWith: [
      { topicId: "authentication", note: "Authentication verifies who someone is; least privilege is about limiting what they can do once verified — a permissions design principle, not a login check." },
    ],
  },
  {
    id: "endpoint-security",
    title: "Endpoint Security",
    category: "Security Fundamentals",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Protecting individual devices — laptops and desktops — from threats, and keeping them healthy.",
    primaryTeam: "infrastructure",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what endpoint security protects",
      "Describe what a junior employee should notice/escalate about device health",
      "Recognize endpoint tools as one layer of defense, not a complete solution",
    ],
    simpleExplanation: "Endpoint security protects individual devices — laptops, desktops — from threats, using tools that monitor for and respond to suspicious activity.",
    eli10: "If a company's network is a building, endpoints are the individual rooms — endpoint security is like having a smoke detector and lock in every single room, not just at the front door.",
    technicalExplanation:
      "Endpoint protection tools (antivirus and, increasingly, EDR — endpoint detection and response) monitor a device for known threats and suspicious behavior, and can alert or take automatic action. Endpoint health also includes staying patched and configured correctly — an unpatched or misconfigured device is a weaker link even with protection software installed.",
    businessPurpose:
      "Employee devices are a common entry point for security issues, since they connect to email, the internet, and internal systems all at once — protecting and monitoring them reduces the chance a single compromised device leads to broader impact.",
    commonProblems: [
      "An endpoint protection agent stops reporting or updating and nobody notices for a while.",
      "A device shows as \"unhealthy\" or out of date in a management dashboard, but the user isn't told or doesn't understand what to do.",
      "A device is assumed safe just because protection software is installed, even if it's outdated or misconfigured.",
    ],
    troubleshootingSteps: [
      "Confirm what specifically the endpoint tool is reporting (out of date, disabled, an actual detection) before treating it as an active threat.",
      "Check whether this is isolated to one device or a wider pattern across many devices.",
      "Avoid trying to personally fix a suspected active threat — escalate per your organization's process rather than improvising.",
      "Document what was observed and when, for whoever investigates further.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "Endpoint protection operates at the OS level, monitoring processes and system behavior." },
      { area: "Secure Computing", connection: "Endpoint detection and response is a core applied topic in enterprise security." },
    ],
    practiceScenario: {
      scenario: "A company laptop's endpoint protection dashboard shows the device as \"unhealthy\" with outdated protection.",
      question: "What would you do first — and what would you avoid doing?",
      guidance:
        "Check the specific reason it's flagged unhealthy (protection disabled? update failed? something detected?) and escalate per process. You'd avoid trying to personally investigate or remediate anything that looks like an active threat — that's a job for whoever handles security investigations, not a first-line troubleshooting step.",
    },
    questionToAskAtWork: "What's the process here when an endpoint shows as unhealthy or out of date — who gets notified, and what's expected of first-line support?",
    relatedTopicIds: ["patching-updates", "directory-services", "monitoring"],
    keywords: ["antivirus", "EDR", "device health"],
    dontConfuseWith: [
      { topicId: "monitoring", note: "General infrastructure monitoring watches server/service health; endpoint security specifically watches individual devices for threats and protection status." },
    ],
  },
  {
    id: "phishing-awareness",
    title: "Phishing & Social Engineering Awareness",
    category: "Security Fundamentals",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Recognizing attempts to trick people — not systems — into giving up credentials or information.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Recognize common phishing/social-engineering red flags",
      "Explain why urgency and pressure are manipulation tactics",
      "Know the appropriate reporting/escalation response",
    ],
    simpleExplanation: "Phishing and social engineering are attempts to trick people — not systems — into giving up credentials or information, often by impersonating someone trustworthy.",
    eli10: "It's like someone calling and pretending to be from the bank, sounding official and urgent, hoping you'll hand over your PIN before you stop to think about it.",
    technicalExplanation:
      "Phishing typically arrives as a message impersonating a trusted source (a colleague, IT, a vendor), often creating urgency, requesting credentials or sensitive information, or linking to a fake login page designed to capture what's typed. Because it targets people rather than technical systems, awareness and a clear reporting process are the primary defenses, not just technical filtering.",
    businessPurpose:
      "Even well-protected technical systems can be bypassed if someone is tricked into handing over their own credentials — phishing awareness reduces this human-layer risk, and a good reporting culture helps catch attempts before they spread.",
    commonProblems: [
      "An employee receives an urgent-sounding message asking them to re-enter their credentials on an unfamiliar page.",
      "A suspicious message is deleted or ignored instead of reported, so nobody else is warned.",
      "An employee feels embarrassed after almost falling for something and doesn't report it, missing a chance to protect others.",
    ],
    troubleshootingSteps: [
      "Do not click links or enter credentials in a message that feels urgent, unexpected, or slightly off.",
      "Check the sender's actual address and any links carefully, rather than trusting the displayed name.",
      "Report the message through the organization's reporting process rather than just deleting it.",
      "Preserve the original message as evidence rather than only forwarding a screenshot, if asked to.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Social engineering and the human factor in security are a recognized topic within secure computing." },
      { area: "Web Development", connection: "Fake login pages used in phishing often closely mimic real ones — easier to spot once you understand how legitimate pages are built." },
    ],
    practiceScenario: {
      scenario: "An employee receives an email that looks like it's from IT, urgently asking them to re-enter their company password on a linked page.",
      question: "What should the employee do, step by step?",
      guidance:
        "Don't click the link or enter credentials. Check the sender address and link destination carefully. Report the email through the organization's official reporting channel. If they already clicked or entered anything, report that too immediately rather than staying quiet out of embarrassment — fast reporting matters more than avoiding the mistake in the first place.",
    },
    questionToAskAtWork: "What's the process here for reporting a suspicious email, and what happens after it's reported?",
    relatedTopicIds: ["mfa", "authentication", "endpoint-security"],
    keywords: ["social engineering", "impersonation", "suspicious email"],
  },
  {
    id: "encryption-basics",
    title: "Encryption Basics",
    category: "Security Fundamentals",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Scrambling data so only someone with the right key can read it — in transit and at rest.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    learningOutcomes: [
      "Distinguish data in transit from data at rest",
      "Explain what HTTPS/TLS protects",
      "Explain plaintext vs. encrypted data at a conceptual level",
    ],
    simpleExplanation: "Encryption scrambles data so it can only be read by someone with the right key, protecting it whether it's moving across a network or sitting in storage.",
    eli10: "Encryption is like writing a letter in a code only you and the recipient know — anyone who intercepts it along the way just sees scrambled nonsense.",
    technicalExplanation:
      "Data in transit (moving across a network, like a website request) is commonly protected with HTTPS/TLS, which encrypts the connection between a client and server. Data at rest (stored on disk, in a database, in backups) can separately be encrypted so that even someone with direct access to the storage can't read it without the right key. Plaintext is unencrypted, readable data; encrypted data is unreadable without decryption.",
    businessPurpose:
      "Encryption protects sensitive company and customer data from being read if it's intercepted in transit or accessed without authorization at rest — a meaningful protection even if other defenses fail.",
    commonProblems: [
      "A website's HTTPS certificate expires, causing browser warnings even though the underlying encryption setup is otherwise fine.",
      "Sensitive data is stored unencrypted because encryption at rest was never configured.",
      "Encryption is assumed to be in place without ever being verified.",
    ],
    troubleshootingSteps: [
      "If a browser shows a certificate/encryption warning, check the certificate's validity first, at a conceptual level.",
      "Distinguish a data-in-transit issue (the connection itself) from a data-at-rest question (how it's stored).",
      "Don't assume \"HTTPS\" automatically means every part of the system is encrypted end to end — check what's actually covered.",
      "Escalate certificate or encryption configuration issues to whoever manages that system.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Encryption, confidentiality, and integrity are foundational secure-computing concepts." },
      { area: "Networking", connection: "TLS/HTTPS operates as a layer over standard network protocols to protect data in transit." },
    ],
    practiceScenario: {
      scenario: "Employees see a browser security warning when opening an internal website that was working fine yesterday.",
      question: "Is this necessarily evidence of an attack, and what would you check first?",
      guidance:
        "Not necessarily — an expired HTTPS certificate is a very common, non-malicious cause of this exact warning. Checking certificate validity and expiration is the sensible first step before assuming anything more serious.",
    },
    questionToAskAtWork: "How are certificate renewals and encryption-at-rest requirements tracked here?",
    relatedTopicIds: ["http-https", "vpn"],
    keywords: ["TLS", "data at rest", "data in transit", "plaintext"],
    prerequisiteTopicIds: ["http-https"],
  },
  {
    id: "vulnerabilities-patching",
    title: "Vulnerabilities & Security Patching",
    category: "Security Fundamentals",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "What a software vulnerability is, why vendors patch them, and how to weigh patching risk against exposure.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain what a software vulnerability is",
      "Explain the risk tradeoff between patching and staying unpatched",
      "Connect patching to change management and risk-based prioritization",
    ],
    simpleExplanation: "A vulnerability is a weakness in software that could be exploited; vendors release patches to fix these weaknesses, and applying them reduces risk.",
    eli10: "A vulnerability is like a lock with a known weak point. The manufacturer issuing a fix is like sending everyone an improved lock — but you still have to actually install it for it to help.",
    technicalExplanation:
      "Vulnerabilities are discovered in software over time and are typically fixed by vendor-released security patches. Not patching leaves a known weakness exposed; patching too hastily without testing risks its own disruption. Organizations commonly prioritize patches by severity and business impact, and apply them through a change management process for anything touching production.",
    businessPurpose:
      "Unpatched, known vulnerabilities are one of the most common ways systems are compromised, precisely because the weakness — and often the fix — is already publicly known. Timely, well-tested patching closes that window of exposure.",
    commonProblems: [
      "A critical security patch is delayed indefinitely because scheduling downtime is deprioritized.",
      "A patch is applied without testing and breaks something else, discouraging future prompt patching.",
      "Vulnerability severity isn't considered, so low-risk and high-risk patches get the same treatment.",
    ],
    troubleshootingSteps: [
      "When a vulnerability is reported, check its severity and whether it's actually exploitable in this environment.",
      "Check whether a vendor patch is already available.",
      "Follow the normal change management process for testing and scheduling the patch, adjusted for urgency if severity is high.",
      "Confirm the patch was actually applied and effective, not just scheduled.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Vulnerability management is a core applied secure-computing practice." },
      { area: "Software Engineering", connection: "Patch testing and safe rollout connect directly to release/change management practices." },
    ],
    practiceScenario: {
      scenario: "A newly disclosed vulnerability affects software used company-wide, and a vendor patch is available.",
      question: "Should it be applied immediately to every system without testing, given the risk?",
      guidance:
        "Not necessarily, immediately, everywhere, untested — severity and exploitability should guide urgency, but even urgent patches usually benefit from at least basic testing and a documented rollout, following change management, to avoid trading a security risk for a self-inflicted outage.",
    },
    questionToAskAtWork: "How are new vulnerabilities prioritized here — by severity, by system criticality, or some combination?",
    relatedTopicIds: ["patching-updates", "change-management", "endpoint-security"],
    keywords: ["CVE", "security patch", "vulnerability management"],
    prerequisiteTopicIds: ["patching-updates"],
    dontConfuseWith: [
      { topicId: "patching-updates", note: "Patching & Updates covers routine software maintenance generally; this topic focuses specifically on security-driven patching and vulnerability risk tradeoffs." },
    ],
  },
];
