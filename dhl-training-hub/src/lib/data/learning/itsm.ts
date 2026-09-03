import { LearningTopic } from "@/lib/types";

// General enterprise IT service management (ITSM) knowledge — not DHL-specific.
// Terminology and process vary by organization; nothing here should be read as a
// confirmed description of DHL's actual practices. Where ITIL-style concepts are
// referenced, they're described as common enterprise concepts, not universal
// company rules. See root CLAUDE.md.
export const itsmTopics: LearningTopic[] = [
  {
    id: "ticket",
    title: "Ticket",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription:
      "The record IT teams use to track a reported issue or request from start to resolution.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Explain what a ticket is and why it exists",
      "Identify what information a well-formed ticket needs",
      "Recognize when a ticket is too vague to act on",
    ],
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
    relatedTopicIds: ["incident", "sla", "escalation", "service-request", "ticket-assignment"],
    keywords: ["work item", "case", "request record"],
  },
  {
    id: "incident",
    title: "Incident",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription:
      "An unplanned event where a service is disrupted or degraded — a specific type of ticket, not every ticket.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish an incident from a routine ticket",
      "Recognize incident-shaped symptoms in a vague report",
      "Explain why incident vs. request classification affects response speed",
    ],
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
    relatedTopicIds: ["ticket", "priority", "escalation", "problem-management", "root-cause-analysis"],
    keywords: ["outage", "disruption", "service down"],
    dontConfuseWith: [
      { topicId: "problem-management", note: "An incident is one disruptive event; a problem is the underlying cause behind one or more incidents." },
      { topicId: "service-request", note: "An incident is something broken; a service request is a user asking for something standard, like access." },
    ],
  },
  {
    id: "sla",
    title: "SLA",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription:
      "A target for how quickly IT should respond to or resolve issues — organization-specific, not universal.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish response time from resolution time",
      "Explain why SLA targets are organization-specific",
      "Recognize when an SLA is at risk of being breached",
    ],
    simpleExplanation:
      "An SLA (Service Level Agreement) is a target that says how quickly a certain kind of issue should be responded to or resolved.",
    eli10:
      "An SLA is like a pizza place promising \"30 minutes or it's free.\" It's a promise about time, agreed in advance — not a guarantee of a specific outcome beyond that timing commitment.",
    technicalExplanation:
      "SLAs commonly define two distinct kinds of targets per priority level. Response time is how quickly the issue should be acknowledged — someone has looked at it and confirmed it's being worked, even if it isn't fixed yet. Resolution time is how quickly the underlying problem should ideally be fixed or the service restored. These are often paired with escalation rules for when either target is at risk of being missed. Every organization defines its own response and resolution targets and priority categories — there is no universal SLA standard, and definitions vary widely between companies.",
    businessPurpose:
      "SLAs let a business predict how disruptions will be handled, and let IT teams justify staffing/prioritization decisions with agreed targets rather than ad hoc judgment calls. Important: this project's Ticket Simulator uses generic training urgency labels (Critical/High/Medium/Low) for practice purposes only, and none of this describes real response/resolution time targets — DHL's official SLA structure, including any specific response or resolution times, has not been confirmed anywhere in this project, and nothing here should be read as DHL's actual policy.",
    commonProblems: [
      "An SLA target is missed without anyone noticing until the reporter complains.",
      "SLA targets exist but priority is assigned inconsistently, so the \"clock\" starts at the wrong urgency.",
      "Response time is met (someone acknowledged it quickly) but resolution time is missed, and the reporter reasonably still feels ignored.",
      "SLA compliance is tracked, but the root causes of repeated breaches are never investigated.",
    ],
    troubleshootingSteps: [
      "Check what SLA target applies to this ticket's priority level — both response time (acknowledgement) and resolution time (fix), if defined.",
      "Confirm when each clock actually started (report time vs. acknowledgement time).",
      "Check whether either target is at risk or already breached, and flag it early rather than late.",
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
    keywords: ["service level", "response time", "resolution time"],
  },
  {
    id: "priority",
    title: "Priority & Business Impact",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "How IT decides what to work on first — based on impact and urgency, not who complains loudest.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish impact from urgency",
      "Explain why priority isn't just about who complains loudest",
      "Re-evaluate priority as new information arrives",
    ],
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
    relatedTopicIds: ["sla", "incident", "escalation", "technical-business-translation"],
    keywords: ["impact", "urgency", "triage"],
  },
  {
    id: "escalation",
    title: "Escalation",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription:
      "Moving an issue to the right expertise (functional) or raising its visibility (hierarchical) — two different things.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish functional from hierarchical escalation",
      "Identify what context should travel with an escalated ticket",
      "Recognize when escalation is genuinely warranted",
    ],
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
    relatedTopicIds: ["ticket", "incident", "priority", "exception-management", "troubleshooting-a-broken-flow"],
    keywords: ["handoff", "escalate", "raise visibility"],
  },
  {
    id: "service-request",
    title: "Service Request",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "A user asking for something standard — like access or approved software — not something broken.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish a service request from an incident",
      "Recognize why standard requests can often be handled with a predictable process",
      "Identify what approval a request might need before being actioned",
    ],
    simpleExplanation:
      "A service request is a user asking for something standard and expected — like access to a system, a new laptop, or approved software — rather than reporting that something is broken.",
    eli10:
      "An incident is calling the fire department because something's on fire. A service request is calling to ask for a smoke detector to be installed — routine, planned, nothing's wrong.",
    technicalExplanation:
      "Service requests are typically fulfilled through a predictable, often partly standardized process (sometimes with a catalog of pre-approved items), which may include an approval step before the request is actioned. They're tracked as tickets like incidents are, but the nature of the work — routine fulfillment rather than diagnosing a fault — is different.",
    businessPurpose:
      "Treating routine requests with a predictable process (rather than ad hoc, case-by-case handling) makes fulfillment faster and more consistent, and keeps incident responders focused on things that are actually broken.",
    commonProblems: [
      "A request is treated with incident-level urgency, pulling attention from real outages.",
      "A request sits with no clear approver, so nothing happens until someone chases it.",
      "The same recurring request is handled differently by different people because there's no standard process.",
    ],
    troubleshootingSteps: [
      "Confirm this is a request (something standard being asked for) rather than something broken.",
      "Check whether it needs approval, and from whom, before being actioned.",
      "Check if a standard/known process already exists for this exact request.",
      "Fulfill and confirm with the requester that they now have what they asked for.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Standardized request/fulfillment workflows resemble form-driven business process automation." },
      { area: "Databases / SQL", connection: "A request catalog is typically just structured reference data behind the scenes." },
    ],
    practiceScenario: {
      scenario: "A new employee's manager submits a ticket asking for the employee to get access to a shared drive and standard software.",
      question: "Is this an incident or a service request, and does that change how urgently it needs handling?",
      guidance:
        "This is a service request — nothing is broken, someone is asking for something standard. It still matters and has its own expected turnaround, but it doesn't carry the same urgency framing as a live outage, and may need manager/owner approval before being actioned.",
    },
    questionToAskAtWork: "Which requests here go through a standard catalog/process, and which still need manual handling?",
    relatedTopicIds: ["ticket", "incident", "knowledge-base"],
    keywords: ["access request", "standard request", "fulfillment"],
    dontConfuseWith: [
      { topicId: "incident", note: "A service request asks for something standard; an incident reports something that broke." },
    ],
  },
  {
    id: "problem-management",
    title: "Problem Management",
    category: "IT Service Management",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Investigating the underlying cause behind one or more incidents, not just fixing the symptom each time.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish a problem from an incident",
      "Explain why fixing symptoms repeatedly without addressing the cause is costly",
      "Recognize when a pattern of incidents suggests an underlying problem",
    ],
    simpleExplanation:
      "A problem is the underlying cause behind one or more incidents. Where an incident is one disruptive event, a problem is the \"why does this keep happening\" investigation behind it.",
    eli10:
      "If your car keeps breaking down on the same stretch of road, each breakdown is an incident. Figuring out that a pothole is causing it — that's problem management.",
    technicalExplanation:
      "Problem management typically starts after a significant incident, or after the same/similar incidents recur, and investigates root cause rather than just restoring service quickly. It often produces a known error record and a longer-term fix, which may itself go through change management to be implemented safely.",
    businessPurpose:
      "Restoring service quickly (incident response) and preventing the same disruption from happening again (problem management) are both valuable, but they're different jobs — without the second, a company can end up firefighting the same fire repeatedly.",
    commonProblems: [
      "Recurring incidents are each treated as new, so the underlying cause is never investigated.",
      "A root cause is identified but the fix is never prioritized because nothing is actively broken right now.",
      "Problem investigation drags on so long that lessons aren't captured before people move on.",
    ],
    troubleshootingSteps: [
      "Look for a pattern: has this same or similar incident happened before?",
      "Separate \"what fixed it this time\" (symptom relief) from \"why did it happen\" (root cause).",
      "Gather evidence across multiple occurrences, not just the most recent one.",
      "Document findings so the fix can be planned and prioritized, even if it takes time.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Root-causing recurring defects rather than patching symptoms is standard engineering discipline." },
      { area: "Data Mining", connection: "Spotting a pattern across many past incidents is a real-world pattern-recognition task." },
    ],
    practiceScenario: {
      scenario: "The same application has crashed and been restarted five times this month, each time logged as a separate, quickly-resolved incident.",
      question: "What's missing from how this has been handled so far?",
      guidance:
        "Each crash was treated as an isolated incident and \"resolved\" by restarting — but nobody investigated why it keeps crashing. That's exactly the gap problem management fills: looking at the pattern across all five events to find and fix the actual cause.",
    },
    questionToAskAtWork: "Is there a formal problem management process here, or are recurring issues handled case by case?",
    relatedTopicIds: ["incident", "root-cause-analysis", "change-management"],
    keywords: ["root cause", "recurring incident", "known error"],
    dontConfuseWith: [
      { topicId: "incident", note: "An incident is one disruptive event; a problem is the underlying cause behind one or more incidents." },
    ],
  },
  {
    id: "root-cause-analysis",
    title: "Root Cause Analysis",
    category: "IT Service Management",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "Finding why something actually failed, instead of stopping at the first fix that makes symptoms go away.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Distinguish a symptom fix from a root cause fix",
      "Describe the \"5 Whys\" technique conceptually",
      "Identify what evidence supports a root-cause conclusion",
    ],
    simpleExplanation:
      "Root cause analysis (RCA) is the process of figuring out why something actually failed, rather than stopping once the immediate symptom is gone.",
    eli10:
      "If a smoke alarm keeps going off, taking the battery out fixes the noise (the symptom) but not the fire risk. RCA asks \"why is there smoke in the first place?\"",
    technicalExplanation:
      "RCA typically involves building a timeline of what happened, gathering evidence (logs, error messages, changes made), and looking for repeated patterns across occurrences. \"5 Whys\" — repeatedly asking why something happened, each answer prompting the next why — is a commonly used technique, but it's one option among several, not a mandatory or universal framework.",
    businessPurpose:
      "Fixing only the symptom (e.g. restarting a crashed service) gets things working again quickly, but if the underlying cause isn't found, the same disruption is likely to recur — costing the business repeated impact for the same root issue.",
    commonProblems: [
      "Investigation stops at the first plausible explanation instead of verifying it with evidence.",
      "A fix is applied and the incident closed before anyone confirms the fix addressed the actual cause.",
      "RCA happens but the findings are never shared, so the same mistake is investigated again later by someone else.",
    ],
    troubleshootingSteps: [
      "Build a timeline: what happened, in what order, right before the failure?",
      "Gather evidence at each step — logs, error messages, recent changes.",
      "Ask \"why\" repeatedly on each finding until you reach something you can actually act on.",
      "Check for repeated patterns across past occurrences of the same or similar issue.",
      "Verify the proposed root cause actually explains the observed symptoms before closing it out.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Debugging methodology — reproducing, isolating, and explaining a defect — is essentially applied RCA." },
      { area: "Algorithms", connection: "Systematically narrowing down a cause resembles binary-search style elimination." },
    ],
    practiceScenario: {
      scenario: "A server ran out of memory and crashed. Restarting it fixed the immediate outage.",
      question: "Has the root cause been found just by restarting the server?",
      guidance:
        "No — restarting resolved the symptom (the crash), not necessarily the cause (why memory ran out). RCA would ask why memory usage grew unbounded: a memory leak in an application, an unexpected spike in load, or a misconfigured limit are all possible next questions to investigate.",
    },
    questionToAskAtWork: "Does this team use a specific RCA technique, or does it vary by the kind of issue?",
    relatedTopicIds: ["problem-management", "incident", "knowledge-base", "five-whys-root-cause"],
    keywords: ["5 whys", "root cause", "postmortem"],
  },
  {
    id: "change-management",
    title: "Change Management",
    category: "IT Service Management",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Why companies control and review changes to production systems, rather than changing them freely.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Explain why uncontrolled production changes are risky",
      "List the typical stages a change goes through",
      "Explain what a rollback plan is for",
    ],
    simpleExplanation:
      "Change management is the process a company uses to review, test, and approve modifications to production systems before they happen — rather than letting anyone change things whenever they feel like it.",
    eli10:
      "It's like renovating a bridge that's still in use. You don't just start knocking down a support beam — you plan it, check it's safe, tell people, and have a way to stop if something goes wrong.",
    technicalExplanation:
      "A typical change process includes a request or proposal describing what will change and why, a risk assessment, testing before it reaches production, an approval step, a planned implementation window, validation that it worked, and a rollback plan in case it didn't. Exact steps, approval authority, and how formal the process is vary widely by organization and by how risky the change is.",
    businessPurpose:
      "Production systems often run business-critical processes. An unreviewed, untested change can cause an outage with real business impact — change management exists to catch risk before it becomes an incident, not to slow things down for its own sake.",
    commonProblems: [
      "An urgent change is made without documentation or testing \"to save time,\" and causes an outage.",
      "A change is approved but nobody has a rollback plan when it goes wrong.",
      "So many changes require heavy approval that people start working around the process entirely.",
    ],
    troubleshootingSteps: [
      "When investigating an incident, ask: what changed recently? Changes are among the most common root causes.",
      "Check whether a recent change was documented, tested, and approved — or made informally.",
      "If a bad change is the suspected cause, check whether a rollback is available and safe to use.",
      "After resolving, confirm whether the change process itself needs adjusting to prevent a repeat.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Change management mirrors release management, code review, and CI/CD gating in software delivery." },
      { area: "Secure Computing", connection: "Reviewing changes before they reach production is a core risk-management control." },
    ],
    practiceScenario: {
      scenario: "A production application requires an urgent configuration change to fix a customer-facing issue.",
      question: "Why might making the change immediately, without documentation or testing, be risky — even though the intent is to help?",
      guidance:
        "An untested change can introduce a new, possibly worse problem, and without documentation nobody else knows what changed if something goes wrong afterward — making it harder to diagnose or roll back. Urgency doesn't remove the value of a quick risk check and a way to undo the change if needed.",
    },
    questionToAskAtWork: "What does the change approval process look like here for something small versus something high-risk?",
    relatedTopicIds: ["incident", "problem-management", "root-cause-analysis"],
    keywords: ["change control", "rollback", "release approval"],
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base / Knowledge Article",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "Documenting resolved issues so the next person doesn't have to solve the same problem from scratch.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Explain why documenting a fix helps beyond the immediate ticket",
      "Recognize situations where checking a knowledge base first would save time",
      "Identify what makes a knowledge article actually useful",
    ],
    simpleExplanation:
      "A knowledge base is a collection of articles documenting how known issues were diagnosed and fixed, so future tickets with the same symptoms can be resolved faster.",
    eli10:
      "It's like a recipe book built from past cooking mistakes. Once someone figures out why a cake keeps collapsing, writing it down means nobody has to rediscover it the hard way.",
    technicalExplanation:
      "Knowledge articles typically capture the symptom, the diagnosis process, the fix, and any relevant context (affected systems, workarounds). Good knowledge bases are searchable and kept up to date; stale or inaccurate articles can do more harm than having none.",
    businessPurpose:
      "Without shared documentation, the same investigation gets repeated by different people every time a familiar issue recurs — wasting time and giving inconsistent fixes. Documentation also speeds up onboarding new team members.",
    commonProblems: [
      "A fix is found but never documented, so the next person starts from zero.",
      "An article exists but is outdated, leading someone to apply a fix that no longer applies.",
      "Knowledge articles are written but nobody searches them before starting an investigation.",
    ],
    troubleshootingSteps: [
      "Before deep investigation, check whether a similar issue has already been documented.",
      "If a knowledge article's fix doesn't work, verify it's still accurate before assuming your case is different.",
      "After resolving something non-trivial, document the symptom and fix while it's fresh.",
      "Flag outdated articles rather than silently working around them.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Documentation and knowledge sharing are a recognized part of maintainable systems, not an afterthought." },
      { area: "Databases / SQL", connection: "A knowledge base is a searchable, structured content store, much like any other queryable dataset." },
    ],
    practiceScenario: {
      scenario: "Three different support agents independently spend 30 minutes each solving the same VPN certificate issue over one week, because nobody documented the first fix.",
      question: "What process or tool gap does this reveal?",
      guidance:
        "This is exactly the gap a knowledge base fills — the first agent's fix should have been documented so the next two could resolve it in minutes instead of independently reinvestigating. It also connects back to the Ticket Simulator's own \"documentation notes\" field on each resolved ticket.",
    },
    questionToAskAtWork: "Is there a knowledge base here, and how often is it actually used before starting a new investigation?",
    relatedTopicIds: ["ticket", "root-cause-analysis", "service-request"],
    keywords: ["documentation", "runbook", "known fix"],
  },
  {
    id: "ticket-assignment",
    title: "Ticket Assignment & Queue Management",
    category: "IT Service Management",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "How incoming tickets get routed to the right person or team, and why queues need active management.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Explain what a ticket queue is",
      "Identify common causes of tickets sitting unworked",
      "Recognize the difference between assignment and ownership",
    ],
    simpleExplanation:
      "Ticket assignment is how an incoming ticket ends up with a specific person or team; a queue is the holding area of tickets waiting to be picked up or triaged.",
    eli10:
      "It's like a hospital triage desk. New patients (tickets) arrive, someone quickly assesses what's wrong, and directs them to the right department — otherwise everyone just piles up in the waiting room.",
    technicalExplanation:
      "Tickets may be assigned automatically (based on category, keywords, or rules), manually by a triager, or picked up from a shared queue by whoever's available. Queues need active management — unassigned or unowned tickets can sit indefinitely if nobody is responsible for monitoring the queue itself.",
    businessPurpose:
      "A ticket that's correctly logged but never assigned to anyone provides no value to the business — queue management is what turns a logged issue into someone's active work.",
    commonProblems: [
      "A ticket sits in a shared queue because everyone assumes someone else will pick it up.",
      "Auto-assignment rules misroute a ticket to the wrong team based on misleading keywords.",
      "A ticket is \"assigned\" to a person who is out of office, with nobody monitoring for that.",
    ],
    troubleshootingSteps: [
      "Check whether a ticket is truly unassigned, or assigned but not yet actioned.",
      "If auto-routed, check whether the routing rule matched correctly for this specific case.",
      "For aging queue items, check whether the assignee is actually available to work it.",
      "Escalate stuck queue items rather than letting them age silently.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Queueing and routing logic is a direct real-world instance of queueing theory and scheduling." },
      { area: "Software Engineering", connection: "Rule-based auto-assignment is a small business-logic engine in most ITSM tools." },
    ],
    practiceScenario: {
      scenario: "A ticket about a slow application was auto-assigned to Support & Network based on the word \"network\" in the description, but the actual cause turns out to be database performance.",
      question: "What does this reveal about auto-assignment rules?",
      guidance:
        "Keyword-based routing is a useful first pass but not infallible — it can misroute based on surface wording rather than actual cause. Whoever picks it up should be able to reassign it once investigation points elsewhere, rather than treating the initial assignment as fixed.",
    },
    questionToAskAtWork: "Is ticket assignment here automated, manually triaged, or a mix — and how are misroutes corrected?",
    relatedTopicIds: ["ticket", "escalation", "priority"],
    keywords: ["queue", "routing", "triage"],
  },
];
