import { LearningTopic } from "@/lib/types";

// General enterprise IT service management (ITSM) knowledge — not DHL-specific.
// Terminology and process vary by organization; nothing here should be read as a
// confirmed description of DHL's actual practices. See root CLAUDE.md.
export const itsmTopics: LearningTopic[] = [
  {
    id: "ticket",
    title: "Ticket",
    category: "IT Service Management",
    shortDescription:
      "The record IT teams use to track a reported issue or request from start to resolution.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    simpleExplanation:
      "A ticket is a written record of an IT issue or request — created when something goes wrong or someone needs something done, and updated until it's resolved.",
    eli10:
      "A ticket is like a food order slip at a restaurant. Someone writes down what you asked for, the kitchen works from that slip, and it isn't \"done\" until the slip is marked complete.",
    technicalExplanation:
      "A ticket typically has a unique ID, a reporter, a description, an assigned owner/team, a status (e.g. Open, In Progress, Resolved), and a history of updates. It's the unit of work most IT service management (ITSM) tools are built around.",
    businessPurpose:
      "Without tickets, IT issues get reported informally — a hallway conversation, a chat message — and are easy to lose track of. Tickets create accountability and a record, so a company can see what's broken, who's fixing it, and whether it's actually resolved.",
    commonProblems: [
      "A ticket is logged with too little information to act on (e.g. \"my laptop doesn't work\").",
      "A ticket sits unassigned because it's unclear which team owns it.",
      "A ticket is marked resolved before the reporter has confirmed the issue is actually fixed.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is this affecting one person, one team, or many?",
      "Read the ticket for symptoms as described, not as assumed.",
      "Identify what evidence is missing (screenshots, error messages, timestamps) and ask for it.",
      "Check whether this matches a known issue already being tracked.",
      "Only escalate or reassign once you're confident which team the evidence points to.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Ticketing tools are themselves software systems with their own data model and workflow." },
      { area: "Databases / SQL", connection: "Every ticket is a row in a database, with a status field and update history." },
    ],
    practiceScenario: {
      scenario: "An employee submits: \"My laptop doesn't work.\" The description contains no further information.",
      question: "What information would you want before assigning the ticket?",
      guidance:
        "Before assigning, you'd want: what exactly happens (won't turn on? an error? slow?), when it started, whether it's new or ongoing, and whether other devices/people are affected. Assigning a vague ticket to a team wastes their time re-asking the same questions — clarifying first is usually faster overall.",
    },
    questionToAskAtWork: "What information do you wish every ticket included, that's usually missing?",
    relatedTopicIds: ["incident", "sla", "escalation"],
  },
  {
    id: "incident",
    title: "Incident",
    category: "IT Service Management",
    shortDescription:
      "An unplanned event where a service is disrupted or degraded — a specific type of ticket, not every ticket.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    simpleExplanation:
      "An incident is when something that was working is now broken or degraded. Not every ticket is an incident — a password reset request is a ticket, but it isn't really \"a service is down.\"",
    eli10:
      "If a ticket is an order slip, an incident is the slip you write when the kitchen's oven just broke and orders are backing up — it's specifically about something that was working now not working.",
    technicalExplanation:
      "In common ITSM frameworks, an incident is an unplanned interruption or reduction in quality of a service. Incidents are usually tracked with severity/priority and resolved to restore service, sometimes followed by a separate root-cause investigation afterward. Exact terminology and process vary a lot by organization.",
    businessPurpose:
      "Distinguishing incidents from routine requests lets a company respond fast to things that are actively hurting the business, instead of treating a password reset and a company-wide outage with the same urgency.",
    commonProblems: [
      "A routine request gets logged and treated as if it were an incident, consuming urgent-response resources.",
      "A real service disruption is logged as a low-priority request and doesn't get attention fast enough.",
      "Teams disagree on whether something \"counts\" as an incident.",
    ],
    troubleshootingSteps: [
      "Ask: was something working before, and is it now broken or degraded? If yes, it's incident-shaped.",
      "Establish scope: how many users/services are affected right now?",
      "Gather symptoms and evidence (error messages, when it started, what changed recently).",
      "Determine if this is isolated or part of a wider pattern (check for related reports).",
      "Escalate based on business impact, not just how it was worded by the reporter.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Distinguishing defect types (bug vs. outage vs. request) mirrors how issue trackers classify work." },
      { area: "Operating Systems", connection: "Many incidents trace back to resource exhaustion or process failures at the OS level." },
    ],
    practiceScenario: {
      scenario: "A user reports: \"I can't find the button to export my report to PDF.\"",
      question: "Is this most likely an incident, or a different kind of ticket?",
      guidance:
        "This sounds like a \"how do I\" question, not an incident — nothing that used to work is now broken. It might still be a valid ticket (a support/how-to request), just not one requiring incident-level urgency.",
    },
    questionToAskAtWork: "How does your team decide whether something counts as an incident versus a routine request?",
    relatedTopicIds: ["ticket", "priority", "escalation"],
  },
  {
    id: "sla",
    title: "SLA",
    category: "IT Service Management",
    shortDescription:
      "A target for how quickly IT should respond to or resolve issues — organization-specific, not universal.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    simpleExplanation:
      "An SLA (Service Level Agreement) is a target that says how quickly a certain kind of issue should be responded to or resolved.",
    eli10:
      "An SLA is like a pizza place promising \"30 minutes or it's free.\" It's a promise about time, agreed in advance — not a guarantee of a specific outcome beyond that timing commitment.",
    technicalExplanation:
      "SLAs typically define response-time and resolution-time targets per priority level, often paired with escalation rules for when targets are at risk of being missed. They're set independently by each organization — there is no universal SLA standard, and definitions vary widely between companies.",
    businessPurpose:
      "SLAs let a business predict how disruptions will be handled, and let IT teams justify staffing/prioritization decisions with agreed targets rather than ad hoc judgment calls. Important: this project's Ticket Simulator uses generic training urgency labels (Critical/High/Medium/Low) for practice purposes only — DHL's official SLA structure has not been confirmed anywhere in this project, and nothing here should be read as DHL's actual policy.",
    commonProblems: [
      "An SLA target is missed without anyone noticing until the reporter complains.",
      "SLA targets exist but priority is assigned inconsistently, so the \"clock\" starts at the wrong urgency.",
      "SLA compliance is tracked, but the root causes of repeated breaches are never investigated.",
    ],
    troubleshootingSteps: [
      "Check what SLA target applies to this ticket's priority level, if any is defined.",
      "Confirm when the clock actually started (report time vs. acknowledgement time).",
      "Check whether the SLA is at risk or already breached, and flag it early rather than late.",
      "If breach is likely, communicate proactively rather than waiting to be asked.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "SLAs are a form of non-functional requirement — a measurable target, not a feature." },
      { area: "Algorithms", connection: "SLA-based queues often use priority scheduling concepts to decide what gets worked on next." },
    ],
    practiceScenario: {
      scenario: "A low-impact request has been open for several hours while a company-wide outage is also happening.",
      question: "Which work should receive attention first, and why?",
      guidance:
        "The company-wide outage, because its business impact and urgency are far higher, even if the low-impact request's SLA clock has technically been running longer. SLA targets exist per priority level specifically so low-impact work doesn't out-compete high-impact work just by being older.",
    },
    questionToAskAtWork: "What happens here when an SLA is at risk of being missed — is there a proactive alert, or is it discovered after the fact?",
    relatedTopicIds: ["priority", "incident", "escalation"],
  },
  {
    id: "priority",
    title: "Priority & Business Impact",
    category: "IT Service Management",
    shortDescription: "How IT decides what to work on first — based on impact and urgency, not who complains loudest.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    simpleExplanation: "Priority is how an organization decides what gets attention first when multiple things need doing at once.",
    eli10:
      "If a doctor's waiting room has a person with a broken arm and a person with a paper cut, priority is why the broken arm gets seen first — even if the paper cut patient arrived earlier or is complaining more.",
    technicalExplanation:
      "Priority is commonly derived from two factors: impact (how many users/business processes are affected, and how severely) and urgency (how quickly the situation will get worse or how time-sensitive it is). Different organizations combine these differently — there's no single universal formula, and priority definitions are set locally.",
    businessPurpose:
      "Without a structured priority approach, IT resources get allocated based on who shouts loudest or who asks first, which doesn't reliably protect the business's most critical processes.",
    commonProblems: [
      "Priority is assigned based on the reporter's seniority or tone rather than actual impact.",
      "Urgency and impact get conflated — something urgent-sounding but low-impact crowds out something quietly high-impact.",
      "Priority is set once and never revisited as a situation evolves.",
    ],
    troubleshootingSteps: [
      "Ask: how many people/processes are actually affected right now?",
      "Ask: how quickly does this get worse if nothing is done?",
      "Separate the reporter's tone/urgency from the actual measurable impact.",
      "Re-check priority if new information changes the picture (e.g. more users start reporting the same thing).",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Priority queues and scheduling algorithms are a direct real-world parallel." },
      { area: "Software Engineering", connection: "Triage and backlog prioritization are standard practice in agile/software delivery too." },
    ],
    practiceScenario: {
      scenario:
        "A senior manager reports a minor cosmetic issue on their own dashboard as \"extremely urgent,\" while a quieter ticket reports that an order-processing system is throwing errors for all users.",
      question: "Which one is actually higher priority, and why?",
      guidance:
        "The order-processing errors, because the impact (all users, a business-critical process) is far higher than a cosmetic issue affecting one person — regardless of how each was worded or who reported it. Priority should track actual impact and urgency, not the reporter's tone or role.",
    },
    questionToAskAtWork: "When impact and urgency point in different directions, how does your team decide priority?",
    relatedTopicIds: ["sla", "incident", "escalation"],
  },
  {
    id: "escalation",
    title: "Escalation",
    category: "IT Service Management",
    shortDescription:
      "Moving an issue to the right expertise (functional) or raising its visibility (hierarchical) — two different things.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    simpleExplanation:
      "Escalation means moving an issue further — either to someone with more specific expertise, or to someone with more authority/visibility because of how serious it is.",
    eli10:
      "If a shop assistant can't answer your question, escalation is them calling the specialist in the back (functional) — or, if you're extremely unhappy, asking to speak to the manager (hierarchical). Those are two different reasons to escalate.",
    technicalExplanation:
      "Functional escalation moves a ticket to a team/person with the required technical skill to resolve it. Hierarchical (management) escalation raises visibility up a management chain because of severity, delay, or business risk — it's about awareness and decision-making authority, not technical skill. Exact terms and processes vary by organization and shouldn't be assumed to match any specific company's formal process.",
    businessPurpose:
      "Escalation paths make sure hard problems reach people who can actually solve them, and serious problems reach people who can make resourcing/risk decisions — without every issue needing to go through every layer.",
    commonProblems: [
      "An issue is escalated functionally but nobody escalates it hierarchically, even though business risk is growing.",
      "An issue is escalated to management prematurely, before the team closest to it has had a real chance to investigate.",
      "Escalation happens, but context/evidence gathered so far isn't passed along, forcing the next person to start over.",
    ],
    troubleshootingSteps: [
      "Decide: does this need different expertise (functional) or higher visibility/authority (hierarchical) — or both?",
      "Before escalating, summarize what's known: scope, symptoms, evidence, what's been tried.",
      "Escalate functionally when you've confirmed it's outside your team's scope, not just because it's hard.",
      "Escalate hierarchically when business impact, delay, or risk genuinely warrants more visibility.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Escalation paths are a form of workflow/process design, similar to an exception passing up a call stack." },
      { area: "Operating Systems", connection: "Analogous to interrupt handling — routine work vs. something that needs higher-priority attention." },
    ],
    practiceScenario: {
      scenario: "A first-line support agent has spent 20 minutes on a networking issue that's clearly outside their expertise, with no progress.",
      question: "What kind of escalation is this, and what should be handed over?",
      guidance:
        "This is functional escalation — moving to a team with networking expertise. What should be handed over: the scope (who's affected), symptoms observed, what's already been tried/ruled out, and any evidence (error messages, timestamps) — so the next team doesn't have to start from zero.",
    },
    questionToAskAtWork: "What happens when your team can't resolve a ticket — who does it go to, and how is that decided?",
    relatedTopicIds: ["ticket", "incident", "priority"],
  },
];
