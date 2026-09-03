import { LearningTopic } from "@/lib/types";

// Business & Logistics Foundations (Phase 7) — generic enterprise business and
// freight-forwarding/logistics concepts, taught from a technology professional's
// perspective: technical system -> business process -> employee/customer impact
// -> operational consequence. All content is generic industry knowledge or
// fictional example workflows — never a confirmed description of DHL's actual
// processes, systems, org structure, or SLAs. Real workflows vary by
// organization, shipment type, country, and transport mode. See root CLAUDE.md.
export const businessLogisticsTopics: LearningTopic[] = [
  // ---------------------------------------------------------------------
  // Part B — Enterprise Business Foundations
  // ---------------------------------------------------------------------
  {
    id: "business-process",
    title: "Business Process",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A repeatable sequence of steps an organization follows to get a business outcome done.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Explain what a business process is, separate from the software that supports it",
      "Recognize that a technical failure is really a broken step in a larger process",
      "Connect a system outage to which business process it interrupts",
    ],
    simpleExplanation:
      "A business process is a repeatable set of steps an organization follows to get something done — approving an order, onboarding an employee, moving a shipment. Software usually supports these steps, but the process is the goal; the system is just the tool.",
    eli10:
      "Think of a recipe for making a sandwich: get bread, add filling, cut it, serve it. A business process is the company's recipe for getting something done — and the computer systems are just the kitchen tools that make each step faster.",
    technicalExplanation:
      "A business process is a sequence of activities, often crossing multiple people, teams, and systems, that together produce a defined business outcome (a completed order, an approved request, a delivered shipment). Processes are commonly modeled as a flow of steps with inputs, outputs, and handoffs. Enterprise software exists to make each step faster, more consistent, and auditable — but the process itself is defined by the business, not by the software; a company can (and does) redesign a process independently of what tool implements it.",
    businessPurpose:
      "Consistent, well-defined processes are what let a large organization operate reliably at scale, with predictable outcomes and clear accountability for each step — rather than every case being handled ad hoc. Understanding the process behind a system is what lets a technology professional see why a bug or outage actually matters.",
    commonProblems: [
      "An IT professional fixes the technical symptom (a failed API call) without understanding which business process it was actually supporting, so they can't explain the real-world impact.",
      "A process has an undocumented manual step (someone re-keys data by hand) that nobody remembers exists, until the system that normally avoids it goes down.",
      "A new system is built to replicate an old process exactly, including steps that only existed because of an old system's limitations.",
    ],
    troubleshootingSteps: [
      "When something breaks, ask: which business process does this system actually support, from start to finish?",
      "Identify who initiates the process, who is affected by a step failing, and what happens downstream if it doesn't complete.",
      "Distinguish a process problem (the steps themselves are wrong or missing) from a system problem (the steps are right, but the tool implementing them is broken).",
      "When describing an incident, state the process impact, not just the technical symptom — that is what a business stakeholder actually needs to hear.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Requirements gathering is fundamentally about understanding the business process a system needs to support." },
      { area: "Databases", connection: "A business process's data (an order, a request, a shipment) usually maps to records moving through defined states in a database." },
    ],
    practiceScenario: {
      scenario: "An API that submits customer orders starts failing. A junior developer reports: \"the order API is returning errors.\"",
      question: "What's missing from that report, from a business-process perspective?",
      guidance:
        "It doesn't say which business process is interrupted or who's affected. A stronger report identifies the process (order submission), the impact (customers/staff cannot complete new orders), and the scope (all orders, or only some) — the technical detail is necessary, but not sufficient on its own.",
    },
    questionToAskAtWork: "For a system I support, what's the actual business process it exists to enable, from start to finish?",
    relatedTopicIds: ["operational-workflow", "business-critical-application", "system-integration", "technical-business-translation"],
    keywords: ["process", "workflow", "business outcome", "handoff"],
  },
  {
    id: "operational-workflow",
    title: "Operational Workflow",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The day-to-day sequence of tasks that keeps a business function running, often spanning systems and teams.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Distinguish a one-time business process design from the ongoing daily workflow that executes it",
      "Identify where a workflow depends on a specific system being available",
      "Explain why a workflow interruption compounds the longer it's unnoticed",
    ],
    simpleExplanation:
      "An operational workflow is the actual day-to-day rhythm of tasks that keeps a business function running — the recurring, practical version of a business process, happening continuously rather than as a one-off.",
    eli10:
      "If a business process is the recipe, the operational workflow is the kitchen actually cooking hundreds of meals every day, back to back, without stopping — and if one station in that kitchen jams, the whole line backs up.",
    technicalExplanation:
      "Operational workflows are the recurring execution of a business process at scale — orders processed every minute, shipments updated continuously, reports generated on a schedule. Workflows commonly depend on specific systems being available at specific times, and often on data flowing correctly between systems via integrations. A workflow interruption is different from a one-off process failure: because it's continuous, the backlog and impact grow every minute it isn't fixed.",
    businessPurpose:
      "Workflows are how a business actually operates minute to minute, not just how it's designed on paper. A technology professional who understands the live workflow behind a system knows why a delay of 10 minutes is very different from a delay of 10 hours, and can prioritize accordingly.",
    commonProblems: [
      "A batch job that feeds a workflow silently fails, and nobody notices until a large backlog has built up.",
      "A workflow depends on a system being available during specific hours (e.g. business hours in a particular time zone), and this dependency isn't documented anywhere.",
      "A workflow interruption is treated as a one-time incident, when the real question is how much backlog accumulated while it was down.",
    ],
    troubleshootingSteps: [
      "When a workflow-supporting system fails, ask how long it's actually been failing, not just when it was noticed.",
      "Estimate the backlog: how much work is queued up or missing because the workflow paused?",
      "Check whether the workflow will catch up automatically once the system recovers, or whether missed items need to be manually reprocessed.",
      "Communicate both the outage and the backlog size — the two are not the same piece of information.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Workflow modeling and scheduled/batch job design are common software engineering concerns in enterprise systems." },
      { area: "Databases", connection: "Backlogs are usually visible as queued or pending records in a database, which is often the fastest way to quantify impact." },
    ],
    practiceScenario: {
      scenario: "A scheduled job that updates shipment statuses fails silently at 2am and isn't discovered until 10am.",
      question: "What's the first question to ask, and why does it matter more than the technical cause?",
      guidance:
        "How many hours of shipment updates are missing, and does the job auto-catch-up or need manual reprocessing? The backlog size, not just the root cause, determines the real business impact and how urgently it needs fixing.",
    },
    questionToAskAtWork: "For the systems I support, which ones run continuous workflows, and what happens to the backlog if one pauses?",
    relatedTopicIds: ["business-process", "operational-dependency", "monitoring", "application-monitoring"],
    keywords: ["workflow", "batch job", "backlog", "continuous operations"],
    prerequisiteTopicIds: ["business-process"],
  },
  {
    id: "customer-journey",
    title: "Customer Journey",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The full sequence of steps and touchpoints a customer experiences, across every system involved.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what a customer journey is and why it usually spans multiple systems",
      "Identify which point in a journey a given system or API actually supports",
      "Recognize that a technical issue at one step can affect trust across the whole journey",
    ],
    simpleExplanation:
      "A customer journey is the full path a customer takes when interacting with a business — from first finding out about a service, to using it, to getting support afterward — often crossing several different systems along the way.",
    eli10:
      "It's like tracking every step of ordering a pizza: browsing the menu, placing the order, watching the delivery map, and calling if something's wrong. Each step might use a different app or team behind the scenes, but to the customer, it's one experience.",
    technicalExplanation:
      "A customer journey maps every touchpoint a customer has with an organization — a website, a booking system, a tracking page, a support line — often backed by different systems that must appear seamless to the customer even though they're technically separate. A failure in one system at one step (e.g. a tracking page not updating) can damage trust in the entire journey, even if every other system is working perfectly.",
    businessPurpose:
      "Customers judge a company by the whole journey, not by which internal system happens to be responsible for a given step. Understanding the journey helps a technology professional see why a seemingly small technical issue (a slow page, a stale status) can have an outsized effect on customer trust and satisfaction.",
    commonProblems: [
      "A tracking page shows outdated information because it pulls from a system that hasn't synced recently, but customers assume the shipment itself is stuck.",
      "A booking confirmation email is delayed because of an unrelated email service issue, causing customers to think their booking failed.",
      "Different systems along the journey show inconsistent information (e.g. a status update in one place but not another), confusing the customer.",
    ],
    troubleshootingSteps: [
      "Identify which step of the customer journey a failing system actually supports, from the customer's point of view.",
      "Check whether the issue is visible to customers directly (a broken page) or indirect (stale data behind a page that loads fine).",
      "Consider whether customers might misinterpret a technical symptom as a completely different problem (e.g. 'my shipment is stuck' when it's really 'the tracking page hasn't synced').",
      "When communicating a fix, consider whether affected customers need to be proactively informed, not just whether the system is fixed.",
    ],
    universityConnections: [
      { area: "Web Development", connection: "Customer-facing journeys are typically implemented as connected web/mobile experiences spanning multiple backend systems." },
      { area: "Software Engineering", connection: "Designing consistent state across multiple systems along a journey is a recognized distributed-systems challenge." },
    ],
    practiceScenario: {
      scenario: "Customers report their shipment tracking page hasn't updated in two days, even though the shipment is actually moving normally.",
      question: "Is the shipment itself necessarily the problem?",
      guidance:
        "Not necessarily — this looks like a customer-journey/visibility problem, not a shipment problem. The tracking page likely isn't receiving updated status data, even though the underlying operation is fine. Investigating the data feed behind the tracking page is the right next step, not assuming the shipment is stuck.",
    },
    questionToAskAtWork: "For a system I support, which point in the customer's overall journey does it actually represent?",
    relatedTopicIds: ["internal-vs-customer-facing-systems", "shipment-visibility", "business-critical-application"],
    keywords: ["customer experience", "touchpoint", "customer trust"],
  },
  {
    id: "internal-vs-customer-facing-systems",
    title: "Internal vs. Customer-Facing Systems",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Distinguishing systems employees use internally from systems customers interact with directly.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
    learningOutcomes: [
      "Distinguish internal systems from customer-facing systems",
      "Explain why an outage's urgency often depends on which type of system is affected",
      "Recognize that the two are frequently connected via integrations",
    ],
    simpleExplanation:
      "Internal systems are used by employees to do their jobs (an order-processing tool, an internal dashboard); customer-facing systems are what customers directly see and use (a website, a tracking page, a booking portal). The same business process often touches both.",
    eli10:
      "It's like a restaurant: the kitchen's systems (internal) help staff prepare food, while the menu and ordering app (customer-facing) is what diners actually see. Both matter, but a broken menu app is visible to every diner immediately, while a kitchen tool issue might not be, at first.",
    technicalExplanation:
      "Internal systems typically support employee workflows and are not directly exposed to customers; customer-facing systems are directly used by, or visible to, external customers. The two are commonly connected — a customer-facing tracking page usually pulls its data from an internal operational system via an API or integration. An outage's visibility and urgency profile often differs sharply depending on which side is affected: an internal tool outage may only slow employees down, while a customer-facing outage is immediately visible externally and can affect reputation.",
    businessPurpose:
      "Knowing whether a broken system is internal or customer-facing changes how urgently and how publicly an issue needs to be handled — a customer-facing outage often needs faster action and external communication, while an internal one may allow more room to investigate calmly.",
    commonProblems: [
      "An internal system outage is treated as low-urgency, without checking whether it also feeds a customer-facing system downstream.",
      "A customer-facing outage is fixed technically, but no one considers whether affected customers need to be told anything.",
      "Confusing which system is actually broken — customers report a 'website' issue that's really caused by an internal system it depends on.",
    ],
    troubleshootingSteps: [
      "When triaging, ask: is this system visible to customers directly, used only internally, or does it feed a customer-facing system?",
      "If internal, check whether any customer-facing system depends on it before assuming the impact is contained.",
      "If customer-facing, consider both the technical fix and whether any customer communication is warranted.",
      "Trace a customer-reported symptom back to the actual internal system responsible, rather than assuming the customer-facing layer itself is at fault.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Separating internal and customer-facing system boundaries is a common enterprise architecture pattern." },
      { area: "Web Services", connection: "APIs are the typical mechanism connecting an internal system's data to a customer-facing interface." },
    ],
    practiceScenario: {
      scenario: "An internal warehouse system goes down for two hours. It also happens to feed the customer-facing tracking page.",
      question: "Should this be treated as a low-urgency internal issue?",
      guidance:
        "No — because it feeds a customer-facing system, the real impact extends beyond internal staff to every customer viewing stale or missing tracking information. Checking downstream dependencies before deciding urgency is the key step here.",
    },
    questionToAskAtWork: "Which of the systems I support are purely internal, which are customer-facing, and which internal systems feed a customer-facing one?",
    relatedTopicIds: ["business-critical-application", "system-integration", "customer-journey", "shipment-visibility"],
    keywords: ["internal system", "customer-facing", "external visibility"],
    dontConfuseWith: [
      { topicId: "customer-journey", note: "Customer journey describes the customer's overall experience across steps; internal vs. customer-facing is about which side of the boundary a specific system sits on." },
    ],
  },
  {
    id: "business-critical-application",
    title: "Business-Critical Application",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A system whose failure would seriously disrupt core business operations — not every application is equally critical.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what makes an application \"business-critical\" rather than just important",
      "Recognize that criticality depends on the process it supports, not the technology itself",
      "Connect business-critical status to why some systems get stronger availability/backup investment",
    ],
    simpleExplanation:
      "A business-critical application is one whose failure would seriously disrupt core operations — not every system is equally important, and treating them all the same wastes effort where it matters least and under-protects where it matters most.",
    eli10:
      "In a hospital, the systems tracking patients' vital signs are critical — if they go down, it's an emergency. A system showing the cafeteria menu is not. Businesses have the same mix of \"must never go down\" and \"nice to have\" systems.",
    technicalExplanation:
      "Criticality is a judgment about business impact, not a technical property — an application is business-critical because of the process it supports (order processing, payment, safety systems), not because of its underlying technology stack. Organizations commonly classify systems by criticality to prioritize investment: business-critical systems typically warrant stronger monitoring, redundancy (high availability), and disaster recovery planning than lower-criticality systems, because the cost of downtime is much higher.",
    businessPurpose:
      "Resources for resilience (redundancy, monitoring, fast incident response) are finite — classifying systems by business criticality lets an organization invest where an outage would actually hurt most, rather than spreading effort evenly across systems with very different real-world importance.",
    commonProblems: [
      "A system is assumed to be low-priority because it seems small or old, without checking what business process actually depends on it.",
      "A genuinely business-critical system lacks adequate monitoring or backup because its criticality was never formally assessed.",
      "During an incident, effort is spread evenly across several affected systems instead of prioritizing the most business-critical one first.",
    ],
    troubleshootingSteps: [
      "When multiple systems are affected by an incident, ask which one is actually most business-critical before deciding what to fix first.",
      "Don't assume a system's technical complexity reflects its business importance — a simple system can be critical, and a complex one can be low-stakes.",
      "Check whether a business-critical system has appropriate monitoring, backup, and recovery plans in place — and flag it if it doesn't.",
      "When reporting an incident, state clearly whether a business-critical system was involved — this changes how it should be prioritized.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Criticality assessment informs architectural decisions like redundancy, failover design, and testing rigor." },
      { area: "Operating Systems", connection: "High availability and failover techniques are frequently applied specifically to the systems judged most business-critical." },
    ],
    practiceScenario: {
      scenario: "Two systems fail at the same time: an internal expense-reporting tool, and the system that processes customer payments.",
      question: "Which should be prioritized, and why?",
      guidance:
        "The payment system — it's clearly more business-critical, since its failure directly stops revenue-generating transactions and affects customers immediately, while an expense tool outage mostly just delays internal admin work.",
    },
    questionToAskAtWork: "How are systems here classified by business criticality, and does that classification actually match how they're monitored and backed up?",
    relatedTopicIds: ["operational-dependency", "high-availability", "disaster-recovery", "business-continuity"],
    keywords: ["critical system", "core operations", "downtime cost"],
    prerequisiteTopicIds: ["business-process"],
  },
  {
    id: "operational-dependency",
    title: "Operational Dependency",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "How one system, team, or process silently relies on another — and why mapping these out matters before something breaks.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    learningOutcomes: [
      "Explain what an operational dependency is with a concrete example",
      "Recognize that a hidden dependency is often discovered only when it fails",
      "Trace a single failure to its full set of downstream effects",
    ],
    simpleExplanation:
      "An operational dependency exists when one system, team, or process relies on another to function — often invisibly, until the thing it depends on stops working.",
    eli10:
      "It's like a line of dominoes: you might not notice how connected they are until you knock one over and watch the rest fall too. Businesses have invisible dominoes like this between systems all the time.",
    technicalExplanation:
      "Operational dependencies are the (often undocumented) relationships between systems, teams, or processes where one cannot function correctly without another. A single authentication service, a shared database, or a specific integration can silently underpin many seemingly unrelated business functions. Dependency mapping — understanding what actually relies on what — is a key input to both incident response (what else might be affected) and business continuity planning (what needs redundancy).",
    businessPurpose:
      "Unmapped dependencies are one of the most common causes of surprising, wide-reaching outages — a single shared component fails, and suddenly several 'unrelated' business functions stop working at once. Understanding dependencies in advance lets an organization prioritize resilience investment and respond faster when something does fail.",
    commonProblems: [
      "A shared authentication or identity service goes down, and several supposedly independent applications unexpectedly stop working too.",
      "Nobody realizes a business-critical process depends on a specific old system until that system is decommissioned or fails.",
      "During an incident, the full blast radius isn't understood until users from unrelated departments start reporting problems.",
    ],
    troubleshootingSteps: [
      "When one system fails, ask: what else depends on it, directly or indirectly?",
      "Check for shared components (authentication, a common database, a network path) that could explain seemingly unrelated symptoms appearing together.",
      "Distinguish a coincidence (two unrelated issues happening at once) from a shared dependency (one root cause with multiple visible symptoms).",
      "Document discovered dependencies so the next investigation doesn't have to rediscover them from scratch.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Dependency mapping is closely related to system architecture diagrams and service dependency graphs." },
      { area: "Operating Systems", connection: "Shared infrastructure components (a directory service, a network path) creating cross-cutting dependencies is a systems-level concept." },
    ],
    practiceScenario: {
      scenario: "A single identity/authentication service has an outage. Within minutes, three unrelated business applications all start failing at once.",
      question: "Is this most likely three coincidental failures, or one root cause?",
      guidance:
        "One root cause — a shared dependency like authentication failing tends to produce exactly this pattern: multiple, seemingly unrelated systems failing simultaneously, because they all quietly depend on the same underlying service.",
    },
    questionToAskAtWork: "Is there a documented map of which systems depend on which shared services here — and who maintains it?",
    relatedTopicIds: ["business-critical-application", "business-continuity", "high-availability", "system-integration"],
    keywords: ["dependency", "shared service", "blast radius", "downstream impact"],
  },
  {
    id: "business-continuity",
    title: "Business Continuity",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "An organization's ability to keep operating, at least at a reduced level, through a disruption.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain business continuity as an organizational concept, distinct from a specific IT technique",
      "Connect business continuity planning to high availability, backup, and disaster recovery",
      "Recognize that continuity planning covers people and process, not just technology",
    ],
    simpleExplanation:
      "Business continuity is an organization's ability to keep operating — even if only partially — through a disruption, whether that's a technical outage, a natural event, or something else entirely.",
    eli10:
      "It's a backup plan for the whole business, not just the computers — like a shop that keeps a manual paper order pad ready in case the till system ever goes down, so customers can still be served.",
    technicalExplanation:
      "Business continuity planning identifies the business's most critical functions, the risks that could disrupt them, and the plans (technical and non-technical) to keep operating through a disruption — which may include manual fallback procedures, alternate facilities, or staff cross-training, not only IT redundancy. High availability, backup/restore, and disaster recovery are specific technical tools that support continuity for IT systems, but continuity itself is a broader organizational discipline covering people, process, and technology together.",
    businessPurpose:
      "A disruption is inevitable eventually — power outages, natural events, major system failures, even pandemics. Organizations that have planned for continuity in advance can keep serving customers and meet obligations even during a serious disruption, while unprepared organizations risk losing customers, revenue, and trust.",
    commonProblems: [
      "A continuity plan exists on paper but was never tested, so nobody actually knows if it works during a real disruption.",
      "Continuity planning focuses only on IT systems and ignores the people/process side (who does what if the normal systems are unavailable).",
      "A plan assumes key staff will be available during a disruption, without accounting for the disruption also affecting people (e.g. a regional event).",
    ],
    troubleshootingSteps: [
      "During a major disruption, check whether a documented continuity plan exists for the affected function before improvising from scratch.",
      "Distinguish the technical recovery task (getting systems back up) from the continuity task (keeping the business function running in the meantime).",
      "After any significant disruption, review what worked and update the continuity plan — a plan that's never revised falls out of date.",
      "Consider whether the disruption itself might also affect the people expected to execute the plan.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "High availability and failover — technical continuity tools — are core operating-systems/infrastructure topics." },
      { area: "Software Engineering", connection: "Designing systems with graceful degradation (partial function instead of total failure) directly supports continuity goals." },
    ],
    practiceScenario: {
      scenario: "A regional data center outage takes down a company's main order system for several hours.",
      question: "Is buying more server redundancy the complete answer to business continuity here?",
      guidance:
        "Not by itself — redundancy is one technical tool, but real continuity also asks: is there a manual fallback for taking orders in the meantime, and are staff trained to use it? Business continuity is broader than any single technical fix.",
    },
    questionToAskAtWork: "Is there a business continuity plan for the function I'm supporting, and has it ever actually been tested?",
    relatedTopicIds: ["high-availability", "disaster-recovery", "backup-restore", "operational-dependency"],
    keywords: ["continuity plan", "resilience", "fallback procedure"],
    prerequisiteTopicIds: ["operational-dependency"],
    dontConfuseWith: [
      { topicId: "disaster-recovery", note: "Disaster recovery is the specific technical process of restoring IT systems/data after a disruption; business continuity is the broader organizational plan for keeping the business itself running, which disaster recovery supports." },
    ],
  },
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "An organization's ongoing shift from manual/legacy processes toward digital systems and data-driven operations.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
    learningOutcomes: [
      "Explain digital transformation as an ongoing organizational shift, not a single project",
      "Identify realistic risks of digital transformation, not just its benefits",
      "Connect digital transformation to automation and system integration",
    ],
    simpleExplanation:
      "Digital transformation is an organization's ongoing shift from manual or legacy processes toward digital systems, data, and automation — changing not just tools, but often how work actually gets done.",
    eli10:
      "It's like a shop switching from a handwritten ledger to a computer system — not just typing the same numbers into a screen, but rethinking how sales, stock, and orders all connect once they're digital.",
    technicalExplanation:
      "Digital transformation typically involves replacing manual/paper processes with digital systems, connecting previously separate systems via integrations, and using the resulting data for better decision-making (reporting, analytics, automation). It's rarely a single project with a fixed end date — it's an ongoing shift in how an organization operates, often touching many systems and teams over years. Poorly managed digital transformation can create new risks: rushed system replacements, incomplete data migrations, and staff resistance to changed workflows.",
    businessPurpose:
      "Digital processes are typically faster, more consistent, and more measurable than manual ones, and they generate data that supports better business decisions. Organizations that transform effectively can operate more efficiently and adapt faster than competitors relying on manual, disconnected processes.",
    commonProblems: [
      "A legacy manual process is digitized without actually improving it, just automating an inefficient workflow exactly as it was.",
      "Data from an old system is migrated incompletely or inaccurately into a new one, causing downstream reporting or operational errors.",
      "Staff resist or work around a new digital system because it wasn't designed with their actual day-to-day workflow in mind.",
    ],
    troubleshootingSteps: [
      "When a new digital system replaces a manual process, check whether the underlying process was actually improved or just automated as-is.",
      "During a system migration, verify data completeness and accuracy, not just that the new system technically works.",
      "If staff are avoiding a new system, investigate whether it fails to support a real part of their workflow, rather than assuming it's just resistance to change.",
      "Track whether a transformation project is actually achieving its intended business outcome, not just whether it was technically delivered.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Migrating legacy systems and integrating previously siloed applications are classic software engineering challenges in digital transformation projects." },
      { area: "Data Mining", connection: "Digital transformation generates far more structured data than manual processes, enabling analytics and data mining that weren't previously possible." },
    ],
    practiceScenario: {
      scenario: "A company replaces a paper-based warehouse checklist with a digital app, but warehouse staff keep filling out paper anyway and re-entering it later.",
      question: "Is this a training problem or something deeper?",
      guidance:
        "Possibly deeper — if staff consistently avoid a new tool, it's worth investigating whether it actually fits their real workflow (e.g. no signal in parts of the warehouse, a clunky interface) rather than assuming it's simply reluctance to change.",
    },
    questionToAskAtWork: "What's an example of a process here that has moved from manual/paper to digital, and what changed beyond just the tool?",
    relatedTopicIds: ["business-automation", "system-integration", "operational-kpi", "technology-in-logistics"],
    keywords: ["digitization", "modernization", "legacy system", "transformation"],
  },
  {
    id: "business-automation",
    title: "Automation (Business Context)",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Using software to perform a repetitive business task without a person doing it manually each time.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain automation as a business tool, distinct from any specific technology",
      "Identify what makes a task a good or poor candidate for automation",
      "Recognize risks of automating a broken process",
    ],
    simpleExplanation:
      "Automation uses software to perform a repetitive business task — sending a confirmation email, updating a status, generating a report — without a person doing it manually each time.",
    eli10:
      "It's like a vending machine instead of a shop assistant: once it's set up correctly, it does the same simple job over and over, faster and more consistently than a person doing it by hand every time.",
    technicalExplanation:
      "Business automation applies to repetitive, well-defined, high-volume tasks — data entry, notifications, scheduled reports, routine approvals — replacing manual execution with a system that performs the same steps reliably every time. Good automation candidates are stable (the process doesn't change constantly), well-understood (the steps are clearly defined), and repetitive (it happens often enough to justify the setup effort). Automating a poorly understood or frequently changing process tends to create brittle systems that break in confusing ways.",
    businessPurpose:
      "Automation reduces manual effort, human error, and processing time for high-volume repetitive tasks, freeing people to focus on judgment-based work automation can't easily replace. It also makes execution more consistent, since the same logic runs every time.",
    commonProblems: [
      "A messy, poorly understood manual process is automated exactly as-is, hard-coding its inconsistencies into a system that's now harder to change.",
      "An automated task silently starts failing (e.g. an email notification stops sending) and, because no human is doing it manually anymore, nobody notices for a while.",
      "A process that changes frequently is automated with rigid logic, requiring constant developer intervention every time the business rules shift.",
    ],
    troubleshootingSteps: [
      "When an automated task appears to have stopped, check monitoring/logs first — automation removes the natural human noticing that something isn't happening.",
      "Before automating a new process, confirm it's genuinely stable and well-understood, not just repetitive.",
      "When an automated process breaks, check how long it's been broken, since nobody was manually double-checking its output.",
      "Consider whether recent business rule changes might be the cause, if a previously reliable automation starts behaving unexpectedly.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Automation is typically implemented as scheduled jobs, workflow engines, or scripted integrations — standard software engineering constructs." },
      { area: "Artificial Intelligence", connection: "More advanced automation increasingly uses AI/ML for tasks too variable for fixed rules — a natural extension of basic rules-based automation." },
    ],
    practiceScenario: {
      scenario: "An automated system that emails shipment confirmations to customers has been silently failing for three days.",
      question: "Why is this more dangerous than if a person had been doing the task manually?",
      guidance:
        "Because automation removed the natural human check — a person doing this manually would likely have noticed something was off. Automated tasks need their own monitoring specifically because nobody is watching them do the work anymore.",
    },
    questionToAskAtWork: "What tasks here have been automated, and how would anyone actually notice if the automation quietly stopped working?",
    relatedTopicIds: ["digital-transformation", "business-process", "monitoring", "application-monitoring", "automation-opportunity-assessment"],
    keywords: ["automation", "scheduled task", "manual process"],
  },
  {
    id: "operational-kpi",
    title: "KPI / Operational Metric",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A measurable indicator an organization tracks to judge how well an operational process is performing.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Explain what a KPI is and why organizations track them",
      "Give an example of a technical failure that would show up in a business KPI",
      "Recognize the difference between a technical metric and a business KPI",
    ],
    simpleExplanation:
      "A KPI (Key Performance Indicator) is a measurable indicator an organization tracks to judge how well an operational process is performing — like on-time delivery rate, average resolution time, or order accuracy.",
    eli10:
      "It's like a report card grade for a specific part of the business — instead of grading a student, it's grading \"how often do shipments arrive on time?\" or \"how fast do we answer support tickets?\"",
    technicalExplanation:
      "Operational KPIs are quantitative measures tied to business outcomes (on-time delivery rate, order accuracy, average handling time, system uptime as it relates to a business function), tracked over time to spot trends and problems. They differ from purely technical metrics (CPU usage, response time in milliseconds) in that a KPI is framed around a business outcome, even though it's frequently derived from underlying technical data. A technical incident often shows up indirectly as a KPI dip — a slow API doesn't just have a technical response-time number, it can also drag down an order-completion-rate KPI.",
    businessPurpose:
      "KPIs let a business objectively track whether operations are improving, staying steady, or degrading, and where to focus attention — technology professionals who understand which KPI a system affects can explain the business value of fixing it, not just the technical fix itself.",
    commonProblems: [
      "A technical fix is completed, but nobody checks whether the related business KPI actually recovered afterward.",
      "A KPI dips and is investigated purely as a business problem, when the actual root cause is a specific technical issue.",
      "Technical metrics (like server response time) are tracked in isolation, without connecting them to the business KPI they actually influence.",
    ],
    troubleshootingSteps: [
      "When investigating a KPI dip, ask what underlying systems and processes feed that KPI.",
      "Check whether a recent technical incident lines up in time with the KPI change.",
      "After a technical fix, verify the related KPI actually recovered, not just that the technical symptom is gone.",
      "When reporting a fix upward, connect it to the business KPI it improved, where relevant — that's often what stakeholders actually care about.",
    ],
    universityConnections: [
      { area: "Databases", connection: "KPIs are usually calculated from operational data stored in databases, aggregated over time." },
      { area: "Data Mining", connection: "Identifying which technical factors correlate with a KPI change is a practical application of basic data analysis." },
    ],
    practiceScenario: {
      scenario: "A company's \"on-time delivery rate\" KPI drops noticeably over one week. Around the same time, a shipment-tracking integration had intermittent failures.",
      question: "Is the drop necessarily proof that deliveries were actually late?",
      guidance:
        "Not necessarily — it's worth investigating whether deliveries were genuinely late, or whether the tracking integration's failures caused delivery completions to be recorded late or inaccurately, which would look identical in the KPI without reflecting a real operational problem.",
    },
    questionToAskAtWork: "Which business KPI does the system I support most directly affect, and how would I know if a technical issue was dragging it down?",
    relatedTopicIds: ["technical-business-translation", "application-monitoring", "capacity-performance"],
    keywords: ["KPI", "metric", "on-time delivery", "performance indicator"],
  },

  // ---------------------------------------------------------------------
  // Part C/D/E — Logistics Foundations, Freight Forwarding, Shipment Lifecycle
  // ---------------------------------------------------------------------
  {
    id: "logistics",
    title: "Logistics",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Planning and managing the movement and storage of goods from origin to destination.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Define logistics and its core activities",
      "Explain why logistics is a coordination problem, not just a transportation one",
      "Identify where technology commonly supports logistics operations",
    ],
    simpleExplanation:
      "Logistics is the planning and management of moving and storing goods — figuring out how, when, and by what route something gets from one place to another, and where it's kept along the way.",
    eli10:
      "If you're organizing a school trip, logistics is deciding which bus, which route, when to leave, where to stop, and what to do if the bus breaks down — for goods instead of people, and usually at a much bigger scale.",
    technicalExplanation:
      "Logistics covers transportation, warehousing, inventory management, and the coordination between them, aiming to move goods efficiently, reliably, and cost-effectively. It's fundamentally a coordination and information problem as much as a physical one: knowing where goods are, what condition they're in, and what needs to happen next, often across multiple companies and systems working together. Enterprise software (transport management, warehouse management, tracking systems) exists specifically to manage this coordination at scale.",
    businessPurpose:
      "Poor logistics directly costs money (wasted transport capacity, spoiled or delayed goods, warehousing inefficiency) and damages customer trust (late or lost shipments). Good logistics is a genuine competitive advantage in industries where speed and reliability matter to customers.",
    commonProblems: [
      "Goods sit unnecessarily in a warehouse because information about their next step wasn't communicated promptly.",
      "A shipment is routed inefficiently because systems tracking capacity and location aren't properly integrated.",
      "A logistics process assumes a single company handles the entire journey, when in reality multiple companies (carriers, forwarders) are actually involved.",
    ],
    troubleshootingSteps: [
      "When a logistics issue is reported, identify which stage (transport, warehousing, coordination between the two) is actually affected.",
      "Check whether the issue is physical (goods are genuinely delayed) or informational (goods are fine, but the system tracking them is wrong).",
      "Consider how many separate organizations are actually involved in this shipment's journey before assuming one company is fully responsible.",
      "Trace where in the flow of information a delay or error was introduced.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Route optimization and scheduling in logistics are classic applied algorithms/operations-research problems." },
      { area: "Databases", connection: "Tracking inventory and shipment state across a logistics network relies heavily on well-structured operational databases." },
    ],
    practiceScenario: {
      scenario: "A shipment sits in a warehouse for two extra days without moving, even though transport capacity was available the whole time.",
      question: "Is this necessarily a transportation problem?",
      guidance:
        "Not necessarily — this looks more like a coordination/information problem: transport was available, so the likely cause is a missed handoff, a status not being updated, or instructions not reaching the right system in time, rather than a lack of capacity.",
    },
    questionToAskAtWork: "Which logistics stages (transport, warehousing, coordination) does the technology I work with actually touch?",
    relatedTopicIds: ["supply-chain", "freight-forwarding", "warehouse-operations", "shipment-lifecycle"],
    keywords: ["logistics", "transportation", "warehousing", "coordination"],
  },
  {
    id: "supply-chain",
    title: "Supply Chain",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The full network of organizations and steps involved in producing and delivering a product to its end user.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Distinguish a supply chain from logistics specifically",
      "Explain why a single link's failure can affect the whole chain",
      "Recognize supply chains as multi-organization, multi-system networks",
    ],
    simpleExplanation:
      "A supply chain is the full network of organizations, steps, and resources involved in getting a product from raw materials all the way to the end customer — of which logistics (moving and storing goods) is one major part.",
    eli10:
      "Think of everyone involved in getting a toy onto a store shelf: the factory that makes it, the people who supply its parts, the ships and trucks that move it, and the store that sells it. That whole chain of companies working together is the supply chain.",
    technicalExplanation:
      "A supply chain includes suppliers, manufacturers, distributors, logistics providers, and retailers, connected by flows of goods, information, and money. Because it spans multiple independent organizations, coordination typically depends on information systems and data exchange (often via APIs or standardized documents) between otherwise separate companies. A disruption at any single link (a supplier delay, a logistics bottleneck, a system outage at one partner) can ripple through the whole chain, sometimes called the 'bullwhip effect' when small disruptions amplify further downstream.",
    businessPurpose:
      "Modern products often depend on dozens of suppliers and partners across the world — understanding supply chain dependencies helps a business anticipate risk, plan for disruption, and make smarter sourcing/logistics decisions, rather than being surprised by a failure several links away.",
    commonProblems: [
      "A delay at one supplier isn't visible to downstream partners until it's already causing a shortage further along the chain.",
      "Different organizations in the chain use incompatible systems, requiring manual data re-entry that introduces errors and delay.",
      "A minor disruption early in the chain amplifies into a much larger disruption by the time it reaches the end customer.",
    ],
    troubleshootingSteps: [
      "When investigating a supply/inventory issue, ask how far upstream (toward suppliers) the actual cause might be, not just the most visible symptom.",
      "Check whether the organizations involved actually share timely information, or whether visibility gaps are contributing to the problem.",
      "Distinguish a problem within one organization's own operations from a problem in how it coordinates with supply chain partners.",
      "Consider how a small delay early in the chain might already be amplifying by the time it's visible.",
    ],
    universityConnections: [
      { area: "Web Services", connection: "APIs and data exchange standards are what let independent supply chain partners' systems actually communicate." },
      { area: "Algorithms", connection: "Supply chain optimization (inventory levels, demand forecasting) is a significant applied area for algorithms and operations research." },
    ],
    practiceScenario: {
      scenario: "A retailer notices a specific product is frequently out of stock, despite normal customer demand.",
      question: "Where should investigation start — the store, or somewhere else?",
      guidance:
        "Somewhere else, likely upstream — a persistent stock issue with steady demand often points to a supply chain problem further back (a supplier delay, a logistics bottleneck) rather than anything the store itself is doing wrong.",
    },
    questionToAskAtWork: "How many separate organizations are typically involved in getting a shipment from origin to destination in this kind of business?",
    relatedTopicIds: ["logistics", "operational-dependency", "system-integration"],
    keywords: ["supply chain", "supplier", "bullwhip effect", "sourcing"],
    dontConfuseWith: [
      { topicId: "logistics", note: "Logistics is specifically about moving and storing goods; supply chain is the broader network of organizations (including suppliers and manufacturers) that logistics operates within." },
    ],
  },
  {
    id: "freight-forwarding",
    title: "Freight Forwarding",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 8,
    shortDescription: "How a freight forwarder coordinates the companies, transport, documents, and processes needed to move goods.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain in simple terms what a freight forwarder does",
      "List the areas a forwarder typically coordinates",
      "Understand why forwarding is a coordination role, not a single fixed operating model",
    ],
    simpleExplanation:
      "A freight forwarder helps a company move goods from one place to another by coordinating the companies, transport, documents, and processes involved — acting as an organizer rather than owning the trucks, ships, or planes themselves.",
    eli10:
      "Imagine you need to send a big package across the world using a plane, then a truck, then another truck. A freight forwarder is like a travel agent for that package — they book each leg of the journey, sort out the paperwork, and keep track of it, so you don't have to coordinate three separate companies yourself.",
    technicalExplanation:
      "A freight forwarder typically does not own the ships, planes, or trucks that physically move goods (those are carriers) — instead, a forwarder coordinates the overall movement on behalf of a shipper. This commonly includes: arranging transportation across one or more carriers and modes (air, ocean, road); preparing and managing shipping documentation; handling or coordinating customs processes; planning routing between origin and destination, including any transfers; providing shipment visibility/status updates back to the shipper; and managing exceptions (delays, damage, missing documents) as they arise. The exact scope of services a forwarder provides varies significantly by company, shipment type, and region — there is no single universal operating model, and it's a mistake to assume every forwarder (or every shipment) works identically.",
    businessPurpose:
      "Moving goods internationally usually requires coordinating several independent companies, multiple transport legs, and country-specific customs requirements — expertise most shippers don't have in-house. A freight forwarder provides that coordination and expertise as a service, reducing the shipper's operational burden and risk.",
    commonProblems: [
      "A shipment is delayed because a document required for one leg of the journey wasn't prepared or forwarded in time.",
      "A handoff between two carriers (e.g. air to road) is poorly coordinated, causing goods to sit idle at a transfer point.",
      "A shipper assumes 'the forwarder' physically controls transportation, and is confused when a delay is actually caused by an underlying carrier.",
    ],
    troubleshootingSteps: [
      "When a shipment issue is reported, first identify which party is actually responsible for the affected step — the forwarder coordinating it, or the underlying carrier performing it.",
      "Check whether a required document was prepared and reached the right party in time for the next step in the journey.",
      "Look specifically at handoff points between transport legs or between companies — these are common places for delays to originate.",
      "When escalating, be specific about which leg of the journey and which company is implicated, rather than describing the whole shipment as generically 'stuck.'",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Forwarder systems commonly integrate with multiple external carrier and customs systems — a real-world system-integration challenge." },
      { area: "Web Services", connection: "Coordinating with several carriers' systems typically relies on APIs or standardized data exchange between different companies' platforms." },
    ],
    practiceScenario: {
      scenario: "A shipment is delayed at a transfer point between an ocean carrier and a road carrier. The shipper contacts the freight forwarder to ask what happened.",
      question: "Does the forwarder necessarily control what happens at that transfer point directly?",
      guidance:
        "Not necessarily — the forwarder coordinates the overall journey but doesn't typically own the ships or trucks. The forwarder's role here is to investigate with the relevant carrier(s), find out what caused the transfer delay, and communicate back to the shipper — coordination and visibility, not direct physical control.",
    },
    questionToAskAtWork: "In this kind of business, what parts of the shipment journey are typically coordinated by a forwarder versus performed directly by a carrier?",
    relatedTopicIds: ["shipping-parties", "shipment-lifecycle", "customs-clearance", "exception-management"],
    keywords: ["freight forwarder", "forwarding", "coordination", "logistics provider"],
    prerequisiteTopicIds: ["logistics", "supply-chain"],
    dontConfuseWith: [
      { topicId: "shipping-parties", note: "A freight forwarder coordinates a shipment's journey; a carrier is the company that physically transports it. The forwarder is a coordination role, not a transport operator." },
    ],
  },
  {
    id: "shipment-lifecycle",
    title: "Shipment Lifecycle",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "A simplified, generic sequence of stages a shipment typically moves through, from request to completion.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Describe a simplified generic shipment lifecycle stage by stage",
      "Identify roughly where in the lifecycle a given system typically operates",
      "Explain why real workflows vary by organization, shipment type, and mode",
    ],
    simpleExplanation:
      "A shipment lifecycle is the sequence of stages a shipment generally passes through — from a customer requesting it, to it actually being delivered and the process being completed.",
    eli10:
      "It's like tracking a letter: someone decides to send it, it gets picked up, sorted, moved along its route, checked at any borders, and finally delivered — with a few status updates along the way.",
    technicalExplanation:
      "A commonly used simplified, generic shipment lifecycle looks roughly like: customer requests shipment → quotation/booking → pickup → origin processing → carrier movement → customs/destination processing → delivery → completion. Each stage is typically supported by different systems and often different companies — a booking system, a warehouse/origin system, a carrier's own tracking system, customs systems, and a delivery confirmation step. Actual workflows vary significantly by organization, shipment type (documents vs. freight), country, and transport mode — this is a simplified generic model for learning purposes, not a description of any one company's exact internal process.",
    businessPurpose:
      "Understanding the lifecycle lets a technology professional quickly place a reported issue in context — knowing roughly which stage a system supports helps identify what's actually affected and who else might depend on that stage completing.",
    commonProblems: [
      "A status update is missing for one stage, making it look like a shipment is stuck when it has actually progressed but simply wasn't recorded.",
      "A handoff between stages (e.g. origin processing to carrier movement) fails silently, with no clear owner noticing the gap.",
      "A customer perceives 'no update' as 'nothing is happening,' when the shipment may genuinely be mid-transit with the next update simply not due yet.",
    ],
    troubleshootingSteps: [
      "When a shipment issue is reported, first identify roughly which lifecycle stage it concerns.",
      "Check whether the system responsible for that stage is functioning normally, separate from whether the physical shipment itself has a problem.",
      "Look specifically at the handoff into and out of the affected stage — many issues originate at a transition, not within a single stage.",
      "Avoid assuming this exact lifecycle model applies identically everywhere — confirm the actual stages relevant to the specific organization and shipment type.",
    ],
    universityConnections: [
      { area: "Databases", connection: "A shipment's lifecycle is typically modeled as a record moving through defined status states in a database." },
      { area: "Software Engineering", connection: "State-machine design (a shipment moving between well-defined states) is a common software engineering pattern for exactly this kind of lifecycle." },
    ],
    practiceScenario: {
      scenario: "A customer sees no tracking update for 24 hours and assumes their shipment is lost.",
      question: "Is 'no update' the same as 'nothing has happened'?",
      guidance:
        "Not necessarily — depending on the stage (e.g. mid-transit on a long transport leg), a lack of update can be entirely normal. The right response is to check the shipment's actual last known stage and expected next update, not to assume the worst from silence alone.",
    },
    questionToAskAtWork: "What does the shipment lifecycle actually look like for the systems I'm exposed to, and where are the biggest handoff points?",
    relatedTopicIds: ["freight-forwarding", "shipment-visibility", "exception-management", "shipping-documentation"],
    keywords: ["shipment lifecycle", "booking", "pickup", "delivery", "shipment stages"],
    prerequisiteTopicIds: ["freight-forwarding"],
  },

  // ---------------------------------------------------------------------
  // Part C — remaining logistics foundation topics
  // ---------------------------------------------------------------------
  {
    id: "transport-modes",
    title: "Transport Modes (Air, Ocean, Road)",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The main ways goods physically move — air, ocean, and road — each with different tradeoffs.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Describe the general tradeoffs between air, ocean, and road freight",
      "Explain why a shipment might combine multiple modes",
      "Recognize that mode choice affects expected transit time and typical documentation",
    ],
    simpleExplanation:
      "Goods generally move by air (fast, expensive, best for smaller/urgent shipments), ocean (slow, cost-effective, best for large volumes), or road (flexible, typically used for shorter distances or the final legs of a journey) — often combined within a single shipment's journey.",
    eli10:
      "It's like choosing how to send a gift: overnight courier if it's urgent and small (air), a slow cargo ship if you have a huge amount and aren't in a rush (ocean), or a delivery van for getting it the last few miles to someone's door (road).",
    technicalExplanation:
      "Air freight generally offers the fastest transit times at the highest cost per unit, suited to urgent or high-value, lower-volume shipments. Ocean freight offers the lowest cost per unit for large volumes, but with much longer transit times and dependence on port schedules. Road freight is typically used for shorter distances, cross-border moves within a region, or as a connecting leg (e.g. from a port or airport to a final destination). Multimodal shipments combine modes within one journey — for example, ocean freight for the long haul, then road freight for final delivery — introducing handoff points between modes as a common source of delay if not well coordinated.",
    businessPurpose:
      "Choosing the right mode (or combination) is a direct cost/speed tradeoff that affects a business's operating costs and customer expectations — understanding this helps a technology professional make sense of why transit time estimates and documentation requirements differ so much between shipments.",
    commonProblems: [
      "A shipment's expected transit time is misjudged because the mode (e.g. ocean vs. air) wasn't correctly accounted for.",
      "A handoff between modes (e.g. ocean to road at a port) is delayed, and it's unclear which system or party owns that specific transfer.",
      "Documentation requirements differ by mode, and a document prepared for one mode isn't valid or sufficient for another leg using a different mode.",
    ],
    troubleshootingSteps: [
      "When investigating a delay, check which mode(s) are involved in this specific shipment's journey.",
      "For a multimodal shipment, identify exactly where the handoff between modes occurs — that's a common point of failure.",
      "Compare the actual elapsed time against what's realistic for the mode(s) involved before assuming something has gone wrong.",
      "Check whether documentation requirements differ across the modes used in this specific journey.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Choosing an optimal combination of transport modes for cost/time tradeoffs is a classic routing/optimization problem." },
      { area: "Databases", connection: "Tracking systems typically need to represent which mode a shipment is currently using, since expected behavior differs by mode." },
    ],
    practiceScenario: {
      scenario: "A shipment moves by ocean freight for three weeks, then needs to switch to road freight for final delivery. It sits at the port for two extra days after the ship arrives.",
      question: "Is this necessarily unusual?",
      guidance:
        "Not necessarily, but it's worth checking — some delay at a mode handoff (unloading, customs, arranging the next carrier) is common, but two days deserves investigation into where in that handoff process the shipment is actually stuck, rather than assuming it's routine or ignoring it.",
    },
    questionToAskAtWork: "For shipments I might encounter here, which transport modes are typically involved, and where do mode handoffs usually occur?",
    relatedTopicIds: ["shipment-lifecycle", "freight-forwarding", "shipment-visibility"],
    keywords: ["air freight", "ocean freight", "road freight", "multimodal", "transit time"],
  },
  {
    id: "shipping-parties",
    title: "Shipper, Consignee & Carrier",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The core parties in a shipment: who sends it, who receives it, and who physically transports it.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Define shipper, consignee, and carrier",
      "Distinguish a carrier from a freight forwarder",
      "Identify which party is relevant to a given shipment question",
    ],
    simpleExplanation:
      "The shipper sends the goods, the consignee receives them, and the carrier is the company that physically transports them — three distinct roles that are easy to confuse but matter a lot when tracing where a problem actually sits.",
    eli10:
      "If you're mailing a package: you're the shipper, your friend receiving it is the consignee, and the delivery company driving the van is the carrier. Three different people, three different jobs.",
    technicalExplanation:
      "The shipper is the party sending the goods (often the seller or the business initiating the shipment); the consignee is the party receiving them (often the buyer or end recipient); the carrier is the company that physically operates the transport (an airline, ocean shipping line, or trucking company) and moves goods from one point to another. A carrier is distinct from a freight forwarder — the forwarder coordinates and arranges the shipment, while the carrier performs the actual physical movement, and a single shipment may involve multiple different carriers across its journey (e.g. one carrier for the ocean leg, another for the final road leg).",
    businessPurpose:
      "Clearly identifying which party is actually responsible for a given step is essential to resolving shipment issues efficiently — misdirecting a question to the wrong party (e.g. asking a forwarder something only the physical carrier can answer) wastes time during an already time-sensitive investigation.",
    commonProblems: [
      "A delay is escalated to the wrong party because the difference between the forwarder and the actual carrier for that leg wasn't clear.",
      "Contact or documentation details for the consignee are incomplete, delaying final delivery even though the shipment itself arrived on time.",
      "A shipper assumes visibility into every step, when parts of the journey are actually only visible to the specific carrier operating that leg.",
    ],
    troubleshootingSteps: [
      "When investigating an issue, identify precisely which party — shipper, consignee, or which specific carrier — is relevant to the step in question.",
      "Check whether the question or escalation is actually addressed to the party who has the ability to answer it.",
      "For a multi-leg journey, identify which specific carrier is operating the leg currently in question, rather than treating 'the carrier' as one single entity.",
      "Verify consignee details are complete and correct before assuming a delivery delay is a transport problem.",
    ],
    universityConnections: [
      { area: "Databases", connection: "Shipment records typically need distinct fields for shipper, consignee, and carrier(s), since each plays a different role in the data model." },
      { area: "Software Engineering", connection: "Systems integrating with multiple carriers must model each carrier as a separate external party with its own data/API characteristics." },
    ],
    practiceScenario: {
      scenario: "A shipment has two legs: an ocean carrier for the long haul, and a separate road carrier for final delivery. The customer asks why the shipment hasn't been delivered yet, two days after the ship arrived at port.",
      question: "Which party should be checked first?",
      guidance:
        "The road carrier responsible for the final leg — the ocean carrier's job (the long-haul transport) is already complete. The delay is most likely somewhere between port arrival and the final-leg handoff to the road carrier.",
    },
    questionToAskAtWork: "For a typical shipment here, how many different carriers might actually be involved across its full journey?",
    relatedTopicIds: ["freight-forwarding", "shipment-lifecycle", "transport-modes"],
    keywords: ["shipper", "consignee", "carrier", "freight forwarder vs carrier"],
    dontConfuseWith: [
      { topicId: "freight-forwarding", note: "A carrier physically transports goods; a freight forwarder coordinates the overall shipment across one or more carriers without necessarily owning any transport itself." },
    ],
  },
  {
    id: "customs-clearance",
    title: "Customs & Customs Clearance",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "The government process and paperwork required for goods to legally cross a border.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what customs clearance is and why it exists",
      "Identify why customs delays are a common bottleneck in international shipments",
      "Recognize customs clearance as a legal/regulatory process, not just a logistics step",
    ],
    simpleExplanation:
      "Customs is the government process that checks and approves goods crossing a border, based on required paperwork, duties, and regulations. Customs clearance is the step where a shipment passes this check successfully and is allowed to continue.",
    eli10:
      "It's like airport security, but for cargo crossing into a country — officials check the paperwork and sometimes the goods themselves to make sure everything is allowed in, correctly declared, and any required fees are paid, before letting it continue on its way.",
    technicalExplanation:
      "Customs clearance requires accurate, complete documentation (commonly including a description of the goods, their value, origin, and classification) submitted to the relevant government authority, along with any applicable duties or taxes. Requirements vary significantly by country, goods type, and trade agreements in place — there's no single universal customs process. Because it's a legal/regulatory step outside any single company's direct control, customs is a common and sometimes unpredictable bottleneck: incomplete documentation, misclassified goods, or a routine inspection can all delay a shipment regardless of how efficiently the rest of the journey was handled.",
    businessPurpose:
      "Every country regulates what crosses its borders for security, taxation, and legal reasons — customs clearance is a non-negotiable step for international trade. Businesses that consistently provide accurate, complete documentation experience fewer customs delays than those that don't, since incomplete submissions are a leading cause of holds.",
    commonProblems: [
      "A shipment is held at customs because required documentation is missing or contains errors.",
      "Goods are misclassified, resulting in an incorrect duty calculation or an unnecessary inspection.",
      "A customs delay is escalated as if it were a transport or system problem, when the shipment is actually just awaiting a routine regulatory review.",
    ],
    troubleshootingSteps: [
      "When a shipment is delayed at a border, first confirm whether it's genuinely awaiting customs clearance rather than a transport-related issue.",
      "Check whether all required documentation was submitted, complete and accurate, for that specific country and goods type.",
      "Distinguish a routine customs hold (normal processing time) from an actual documentation problem requiring correction.",
      "When escalating a customs delay, be clear that it may be outside the immediate control of the shipper, forwarder, or carrier, and set expectations accordingly.",
    ],
    universityConnections: [
      { area: "Databases", connection: "Customs documentation data (goods classification, value, origin) must be stored accurately and consistently to avoid clearance errors." },
      { area: "Web Services", connection: "Many customs authorities now support electronic submission via APIs, integrating customs data exchange directly into shipment systems." },
    ],
    practiceScenario: {
      scenario: "A shipment has been \"awaiting customs\" for five days, longer than the customer expected.",
      question: "What should be checked before assuming something has gone wrong?",
      guidance:
        "Whether the submitted documentation was actually complete and accurate for that country and goods type, and whether five days is unusual for that specific customs process — customs timing varies by country and situation, so it's worth confirming what's actually normal before treating this as an error.",
    },
    questionToAskAtWork: "What documentation is typically required for customs clearance in the shipments this organization handles, and how often are shipments held for incomplete documentation?",
    relatedTopicIds: ["shipping-documentation", "shipment-lifecycle", "exception-management"],
    keywords: ["customs", "customs clearance", "duties", "border", "documentation"],
    prerequisiteTopicIds: ["shipment-lifecycle"],
    dontConfuseWith: [
      { topicId: "shipping-documentation", note: "Shipping documentation is the broader set of paperwork used throughout a shipment's journey; customs clearance is one specific regulatory process that depends on some of that documentation being correct." },
    ],
  },
  {
    id: "warehouse-operations",
    title: "Warehouse",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A facility for storing goods between transport legs — increasingly dependent on connected technology.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure", "applications"],
    learningOutcomes: [
      "Explain a warehouse's role in a logistics journey",
      "Identify the technology commonly used in a modern warehouse",
      "Recognize why network/device issues in a warehouse have operational, not just IT, consequences",
    ],
    simpleExplanation:
      "A warehouse stores goods temporarily between stages of their journey — receiving them, holding them, and preparing them for the next leg — and modern warehouses rely heavily on connected devices and software to track what's where.",
    eli10:
      "A warehouse is like a big waiting room for packages between buses — they arrive, wait until their next ride is ready, get sorted, and head out again. Workers use handheld scanners and computers to keep track of exactly where everything is.",
    technicalExplanation:
      "Warehouse operations typically include receiving goods, storing them (often tracked to specific locations within the facility), picking/packing for onward shipment, and dispatching. Modern warehouses commonly rely on barcode/RFID scanning, handheld devices connected over Wi-Fi, and a warehouse management system (WMS) that tracks inventory location and status in real time. Because these processes depend on continuous network connectivity and device availability, a Wi-Fi outage or device failure in a warehouse isn't just an IT inconvenience — it can directly stop physical goods movement, since staff may be unable to scan, confirm, or update records for what's happening.",
    businessPurpose:
      "Efficient warehouse operations reduce how long goods sit idle and how often errors (wrong item, wrong location, lost inventory) occur — both of which directly affect delivery speed and cost. As warehouses become more digitally dependent, their technology reliability becomes directly tied to physical operational capability.",
    commonProblems: [
      "A Wi-Fi outage in part of a warehouse prevents staff from scanning items, stalling receiving or dispatch in that area even though the rest of the network is fine.",
      "A handheld scanner device runs out of battery or loses its connection mid-task, leaving an inventory update incomplete.",
      "Physical inventory doesn't match what the warehouse management system reports, because a scan was missed or failed silently.",
    ],
    troubleshootingSteps: [
      "When warehouse staff report they \"can't process\" goods, check network/device connectivity in that specific area before assuming a process or training issue.",
      "Determine whether the issue is isolated to part of the warehouse (suggesting a local access point or device problem) or affects the whole facility.",
      "Check whether inventory records and physical stock have diverged, and if so, from around what time — that narrows down when the underlying issue started.",
      "Escalate promptly — a warehouse connectivity issue has an immediate physical-operations impact, not just a technical one.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Reliable Wi-Fi coverage across a large physical facility is a practical wireless-networking design problem." },
      { area: "Databases", connection: "A warehouse management system's inventory data must stay closely synchronized with real-world physical stock." },
    ],
    practiceScenario: {
      scenario: "Staff in one section of a warehouse report their handheld scanners have stopped working, while the rest of the warehouse operates normally.",
      question: "What would you check first?",
      guidance:
        "Whether that section shares a specific Wi-Fi access point or network segment — a localized, section-specific outage points strongly at a local connectivity issue rather than a warehouse-wide system failure.",
    },
    questionToAskAtWork: "How much of the warehouse operation here depends on continuous network connectivity, and what happens physically if it goes down?",
    relatedTopicIds: ["wifi", "shipment-lifecycle", "technology-in-logistics"],
    keywords: ["warehouse", "WMS", "barcode scanning", "inventory"],
  },
  {
    id: "shipment-visibility",
    title: "Shipment Visibility & Tracking",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "The ability to know where a shipment is and what state it's in, including its estimated arrival time.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what shipment visibility means and why it matters to customers and operations",
      "Distinguish a visibility/tracking-data problem from an actual physical shipment problem",
      "Explain what an ETA is and why it's an estimate rather than a guarantee",
    ],
    simpleExplanation:
      "Shipment visibility is the ability to know where a shipment currently is and what state it's in — including an ETA (estimated time of arrival) — usually shown to customers and staff through a tracking system.",
    eli10:
      "It's like a food delivery app showing a moving dot on a map — you're not seeing the actual food, you're seeing a system's best current information about where it is and roughly when it'll arrive.",
    technicalExplanation:
      "Shipment visibility relies on status updates flowing from operational systems (a carrier's tracking system, a warehouse system, a customs system) into a tracking interface, often through integrations or APIs. An ETA is a calculated estimate based on typical transit times and current known status — it is inherently an estimate, not a guarantee, and can shift as new information becomes available. A critical distinction: a tracking page showing no update, an outdated status, or an inaccurate ETA does not necessarily mean the physical shipment itself has a problem — it may simply mean the data feed behind the tracking page has stalled or hasn't caught up yet.",
    businessPurpose:
      "Customers and internal operations both rely heavily on visibility to plan — a customer waiting on goods, or a warehouse expecting an inbound shipment, both need accurate status information to make decisions. Poor visibility damages trust even when the physical shipment itself is perfectly fine, since perceived problems are often just as costly as real ones.",
    commonProblems: [
      "A tracking page shows stale information because the integration feeding it status updates has failed or fallen behind.",
      "An ETA becomes inaccurate because it was calculated before a delay occurred and was never recalculated.",
      "Customers assume a lack of a status update means a shipment is lost, when it's more often a normal gap between scheduled updates or a data feed delay.",
    ],
    troubleshootingSteps: [
      "When a shipment 'looks stuck' on a tracking system, first check whether the underlying data feed/integration is healthy, before assuming the physical shipment has an issue.",
      "Check the timestamp of the last known real update versus the current time — a large gap suggests a data problem, not necessarily a shipment problem.",
      "If the ETA looks wrong, check whether it's ever been recalculated since a known delay occurred.",
      "When resolving a visibility issue, verify that the fix actually restores accurate ongoing updates, not just a single manual correction.",
    ],
    universityConnections: [
      { area: "Web Services", connection: "Shipment tracking typically integrates data from multiple external systems (carriers, customs) via APIs into a single customer-facing view." },
      { area: "Databases", connection: "ETA calculation and status history rely on well-maintained, timestamped operational data." },
    ],
    practiceScenario: {
      scenario: "A customer calls to say their shipment tracking page hasn't changed in three days, and they're worried it's lost.",
      question: "What's the first thing to check?",
      guidance:
        "Whether the tracking integration/data feed for that shipment is functioning normally — a stalled data feed is a very common, non-alarming explanation, and should be ruled in or out before assuming anything has actually happened to the physical shipment.",
    },
    questionToAskAtWork: "What systems and integrations feed the shipment visibility/tracking experience here, and what happens if one of them falls behind?",
    relatedTopicIds: ["customer-journey", "system-integration", "application-monitoring", "exception-management"],
    keywords: ["tracking", "visibility", "ETA", "estimated time of arrival", "shipment status"],
    prerequisiteTopicIds: ["shipment-lifecycle"],
    dontConfuseWith: [
      { topicId: "monitoring", note: "General infrastructure monitoring watches whether systems are healthy; shipment visibility is a customer/business-facing concept about knowing a shipment's real-world status and ETA." },
    ],
  },
  {
    id: "last-mile-delivery",
    title: "Last Mile",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The final leg of a shipment's journey to the end recipient — often the most complex and costly part.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what \"last mile\" means in a shipment's journey",
      "Explain why the last mile is often disproportionately complex and costly",
      "Recognize common last-mile failure points",
    ],
    simpleExplanation:
      "The last mile is the final leg of a shipment's journey — from a local hub or facility to the actual end recipient — and it's often the most complex, unpredictable, and expensive part of the whole journey, despite covering the shortest distance.",
    eli10:
      "Getting a package most of the way around the world can be surprisingly easy compared to the final few streets to someone's actual front door — traffic, wrong addresses, and nobody home all happen right at the very end.",
    technicalExplanation:
      "While long-haul transport (ocean, air, cross-country road) can be relatively efficient at scale, the last mile involves individual deliveries to specific addresses — dealing with variable traffic, incorrect or incomplete addresses, delivery windows, and recipient availability. Per-shipment cost is typically much higher for the last mile than for the long-haul legs, because it can't be as easily consolidated at scale. Last-mile visibility and exception handling (a failed delivery attempt, a wrong address, a recipient not present) are common points where technology (routing, real-time tracking, delivery confirmation) makes a significant operational difference.",
    businessPurpose:
      "Because the last mile is disproportionately expensive and failure-prone, it heavily shapes overall delivery cost and customer satisfaction — a shipment that traveled flawlessly for thousands of miles can still leave a bad impression if the final delivery attempt fails.",
    commonProblems: [
      "A delivery fails because of an incomplete or incorrect address that wasn't caught earlier in the shipment lifecycle.",
      "A recipient isn't available at the delivery attempt, requiring a costly re-delivery or pickup arrangement.",
      "Last-mile tracking data isn't as granular as long-haul tracking, leaving a visibility gap right at the point customers care about most.",
    ],
    troubleshootingSteps: [
      "When a delivery issue is reported, check specifically whether it occurred during the last-mile leg versus earlier in the journey.",
      "Verify address and recipient contact details are complete and accurate — a very common root cause of last-mile failures.",
      "Check whether a failed delivery attempt was properly logged and whether the recipient was notified with next steps.",
      "Consider whether last-mile visibility gaps (compared to earlier legs) are contributing to customer confusion, even if the delivery itself is on track.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Last-mile route optimization (visiting many addresses efficiently) is a well-known algorithmic problem (related to the vehicle routing problem)." },
      { area: "Databases", connection: "Accurate, validated address data is a foundational data-quality requirement for reliable last-mile delivery." },
    ],
    practiceScenario: {
      scenario: "A shipment travels smoothly for two weeks across multiple countries, then fails delivery twice at the final address.",
      question: "Where should the investigation focus?",
      guidance:
        "The last-mile leg specifically — since the rest of the journey was clearly fine, the repeated failure is very likely address, access, or recipient-availability related, not a problem with the long-haul transport that already succeeded.",
    },
    questionToAskAtWork: "What does last-mile delivery typically look like for this organization's shipments, and what's the most common reason a delivery attempt fails?",
    relatedTopicIds: ["shipment-lifecycle", "exception-management", "shipping-documentation"],
    keywords: ["last mile", "final delivery", "delivery attempt", "address"],
  },
  {
    id: "shipping-documentation",
    title: "Documentation",
    category: "Business & Logistics",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The paperwork (physical or digital) that accompanies a shipment and enables each stage of its journey.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain why shipping documentation exists and what it's generally used for",
      "Recognize documentation errors as a common root cause of shipment delays",
      "Understand documentation as data that must flow correctly between systems and parties",
    ],
    simpleExplanation:
      "Shipping documentation is the paperwork — increasingly digital — that describes a shipment, proves who owns it, and enables each stage of its journey, from carriers to customs to final delivery.",
    eli10:
      "It's like a passport and ticket for a package — proof of what it is, who it belongs to, and permission to move through each step of its trip, without which it can get stuck at almost any stage.",
    technicalExplanation:
      "Shipping documentation commonly includes details like a description of the goods, their value and quantity, the parties involved (shipper, consignee, carrier), and transport-specific paperwork required for a given mode or route. Increasingly, this data exists digitally and must flow accurately between systems — a booking system, a carrier's system, a customs system — often via integrations rather than physical paper handoffs. Because so many downstream steps (customs clearance, carrier handoff, final delivery) depend on this data being accurate and complete, an error introduced early in documentation can cascade into delays much later in the journey.",
    businessPurpose:
      "Accurate documentation is what allows goods to legally and efficiently move through each stage of a shipment's journey — errors or omissions are one of the most common root causes of delays across the entire logistics industry, not because transport is slow, but because paperwork wasn't right.",
    commonProblems: [
      "A data entry error (wrong quantity, wrong classification) early in the process isn't caught until it causes a hold much later, at customs or delivery.",
      "Documentation exists in one system but wasn't properly transmitted to another system that needs it for the next stage.",
      "A document required for one leg of a multimodal journey wasn't prepared in the format or content required for that specific mode.",
    ],
    troubleshootingSteps: [
      "When a shipment is delayed, check whether it's actually a documentation completeness/accuracy issue before assuming a transport or system failure.",
      "Trace where the documentation originated and whether it was correctly transmitted to every system/party that needed it downstream.",
      "Check for early data entry errors that might only be causing visible problems much later in the journey.",
      "When correcting a documentation error, verify the correction actually propagates to every downstream system that already received the incorrect version.",
    ],
    universityConnections: [
      { area: "Databases", connection: "Shipping documentation is fundamentally structured data that must stay consistent across multiple connected systems." },
      { area: "Web Services", connection: "Digital documentation exchange between shippers, forwarders, carriers, and customs authorities typically relies on APIs or standardized electronic data formats." },
    ],
    practiceScenario: {
      scenario: "A shipment is held at a border. Investigation shows the goods description submitted doesn't match what's physically in the shipment.",
      question: "Where did this problem most likely originate?",
      guidance:
        "Early in the process, likely at initial data entry or booking — a mismatch discovered at the border is very often the visible symptom of an error introduced much earlier, not something that developed during transport.",
    },
    questionToAskAtWork: "How does documentation for a shipment actually flow between the systems and parties involved here, and where are errors most often introduced?",
    relatedTopicIds: ["customs-clearance", "shipment-lifecycle", "system-integration"],
    keywords: ["documentation", "paperwork", "bill of lading (generic concept)", "data accuracy"],
  },
  {
    id: "exception-management",
    title: "Exception Management",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "How an organization detects, handles, and communicates when a shipment deviates from its expected plan.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Explain what an exception is in a logistics context",
      "Describe a reasonable general process for handling a shipment exception",
      "Connect exception management to escalation and communication, not just detection",
    ],
    simpleExplanation:
      "An exception is any point where a shipment deviates from its expected plan — a delay, damage, a missing document, a failed delivery attempt. Exception management is how an organization detects these deviations, decides what to do, and communicates about them.",
    eli10:
      "It's like a school bus running late: someone needs to notice it's late, figure out why, decide what to do (wait, reroute, notify parents), and actually tell the people affected — rather than just silently hoping it sorts itself out.",
    technicalExplanation:
      "Exception management typically involves: detection (a system flags a shipment as delayed, missing a scan, or otherwise off-plan), triage (assessing how serious the deviation is and what's causing it), resolution or escalation (fixing what can be fixed directly, or escalating to the right party/team), and communication (informing affected stakeholders — customers, operations, partners — proportionate to the exception's severity). A mature exception-management process treats exceptions as expected, routine parts of operating at scale (not every shipment is perfect), and focuses on catching and handling them quickly, rather than being surprised each time one occurs.",
    businessPurpose:
      "At scale, some percentage of shipments will always deviate from plan — the business differentiator is how quickly exceptions are caught and how well they're communicated, not whether they occur at all. Poor exception management turns small, recoverable problems into major customer-trust failures through silence and delay.",
    commonProblems: [
      "An exception isn't detected until a customer complains, because no automated monitoring flags shipments deviating from their expected timeline.",
      "An exception is detected but not triaged correctly, treating a minor delay with the same urgency as a serious, high-impact one (or vice versa).",
      "An exception is resolved technically, but affected customers or internal stakeholders are never actually informed.",
    ],
    troubleshootingSteps: [
      "When investigating a shipment issue, ask whether it was actually detected proactively by a system, or only discovered reactively via a complaint.",
      "Assess the exception's actual severity and scope before deciding how urgently to escalate or communicate.",
      "Identify the right party to resolve the specific exception — not every exception needs the same team or escalation path.",
      "After resolving the underlying cause, confirm whether affected stakeholders were actually informed, not just that the system is fixed.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Exception detection is typically implemented as automated monitoring/alerting rules comparing actual state against an expected plan." },
      { area: "AI / Machine Learning", connection: "More advanced exception management increasingly uses predictive models to flag shipments likely to deviate before they actually do." },
    ],
    practiceScenario: {
      scenario: "A shipment is now three days behind its expected schedule. It was only discovered when the customer called to ask where it was.",
      question: "What's the real underlying gap here, beyond the specific delay itself?",
      guidance:
        "The lack of proactive detection — the actual delay is one problem, but the fact that nobody noticed until the customer complained points to a monitoring/exception-detection gap that will keep causing this pattern until it's addressed directly.",
    },
    questionToAskAtWork: "How are shipment exceptions typically detected here — proactively by a system, or reactively through complaints — and how are they communicated once found?",
    relatedTopicIds: ["shipment-visibility", "escalation", "incident", "application-monitoring"],
    keywords: ["exception", "delay", "escalation", "shipment deviation"],
    prerequisiteTopicIds: ["shipment-visibility"],
  },

  // ---------------------------------------------------------------------
  // Part F/J — Technology mapping and IT-to-business translation
  // ---------------------------------------------------------------------
  {
    id: "technology-in-logistics",
    title: "Technology in Logistics",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 8,
    shortDescription: "How core IT concepts (network, database, API, monitoring, availability) each support a specific logistics function.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
    learningOutcomes: [
      "Map several core IT concepts to the specific logistics function each one supports",
      "Explain why thinking beyond \"the technical component\" matters for a junior IT professional",
      "Give an example of a technology system commonly used in logistics operations",
    ],
    simpleExplanation:
      "Every core IT concept already learned — networking, databases, APIs, authentication, monitoring, availability — has a direct, concrete job to do in a logistics business. Learning to map \"this technology\" to \"this business function\" is what turns technical knowledge into business understanding.",
    eli10:
      "It's like realizing the traffic lights you studied in physics class are the exact same traffic lights that keep your city's roads from turning into chaos — the same technical thing you learned in isolation is quietly running something real and important.",
    technicalExplanation:
      "Concrete mappings a technology professional in a logistics business should recognize: a reliable NETWORK lets employees access operational systems from warehouses, offices, and depots. A DATABASE stores shipment, customer, and business records that every other system reads from and writes to. An API allows separate systems (a booking platform, a carrier's system, a customs system) to exchange operational information without manual re-entry. AUTHENTICATION confirms an employee's identity before they can act in a system; AUTHORIZATION then controls which specific business functions they're allowed to perform once identified. MONITORING detects degradation (a slow API, a failing integration) before it grows into a larger operational impact. HIGH AVAILABILITY reduces disruption to the specific business services that depend on a given system staying up. BACKUP and DISASTER RECOVERY support the business's ability to keep or restore its data and operations if a system or its data becomes unavailable. Systems commonly used specifically in logistics include transport management systems (planning and tracking transport), warehouse management systems (tracking inventory and warehouse operations), and customs/trade-compliance systems.",
    businessPurpose:
      "A technology professional who can explain why a technical component matters in business terms — not just what it does technically — communicates more effectively with non-technical stakeholders, prioritizes work more sensibly, and understands the real stakes of what they're maintaining.",
    commonProblems: [
      "A technical fix is completed and reported purely in technical terms, leaving business stakeholders unclear on what it actually means for operations.",
      "Monitoring exists for a system's technical health, but nobody has connected it to the specific business function that system supports.",
      "A junior technology professional understands each concept (API, database, monitoring) in isolation, but hasn't connected any of them to what the business is actually trying to accomplish.",
    ],
    troubleshootingSteps: [
      "For any system, ask: which specific IT concept(s) is this built on, and which specific business function does each one actually enable?",
      "When something technical fails, state its business consequence explicitly, not just its technical symptom.",
      "When evaluating monitoring or availability investment, ask what business function would actually be protected by it.",
      "Practice restating a purely technical problem statement in terms of the business process and people it affects.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Reliable connectivity between sites (warehouses, offices, depots) is foundational networking applied directly to a real business need." },
      { area: "Web Services", connection: "APIs connecting separate logistics systems (booking, carriers, customs) are a direct, practical application of REST API concepts." },
      { area: "Secure Computing", connection: "Authentication and authorization directly gate who can perform which operational actions in logistics systems." },
    ],
    practiceScenario: {
      scenario: "A junior IT employee is told: \"the shipment API is down.\" They report it upward exactly that way.",
      question: "What's missing, and how would you restate it in business terms?",
      guidance:
        "The business consequence: something like \"the API failure is preventing new booking information from reaching the warehouse system, which may delay pickup scheduling for new shipments until it's restored.\" The technical detail stays, but now a non-technical stakeholder understands what's actually at stake.",
    },
    questionToAskAtWork: "For a system I work with, can I explain in one sentence which specific business function it enables — not just what the system technically does?",
    relatedTopicIds: ["technical-business-translation", "system-integration", "monitoring", "high-availability", "authentication", "database"],
    keywords: ["technology mapping", "transport management system", "warehouse management system", "IT and business"],
    prerequisiteTopicIds: ["shipment-visibility", "business-critical-application"],
  },
  {
    id: "technical-business-translation",
    title: "Technical-to-Business Translation",
    category: "Business & Logistics",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Practicing turning a technical symptom into a plain statement of who is affected and what business process is disrupted.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
    learningOutcomes: [
      "Translate a technical symptom into a business-impact statement",
      "Explain why \"the API is down\" is an incomplete incident description on its own",
      "Practice the technical symptom → affected system → affected process → operational impact chain",
    ],
    simpleExplanation:
      "Technical-to-business translation is the practice of restating a technical symptom (\"DNS resolution failed\") as a plain statement of what it actually means for people and operations (\"employees can't reach the application by its normal address, so they can't do their work through it\").",
    eli10:
      "It's like a doctor explaining a diagnosis: \"your white blood cell count is elevated\" is accurate, but \"your body is fighting an infection\" is what actually helps you understand what's happening and why it matters.",
    technicalExplanation:
      "The translation follows a consistent chain: technical symptom → affected system → affected users/process → operational impact → urgency. For example: DNS resolution failed (symptom) → the application's normal address stops working (affected system) → employees using that workflow can't reach it (affected process) → dependent business tasks are delayed (operational impact) → urgency depends on how business-critical that workflow is. Another example: a database connection pool is exhausted (symptom) → the application serving requests slows or fails (affected system) → users performing dependent tasks experience failures or extreme slowness (affected process) → those business tasks are delayed or blocked (operational impact). This isn't about abandoning technical precision — both the technical detail and the business translation matter, for different audiences.",
    businessPurpose:
      "Business stakeholders, customers, and even other technical teams outside the immediate context usually need the business translation to make good decisions (how urgent is this, who should be told, what should we communicate) — a purely technical description, however accurate, doesn't answer those questions on its own.",
    commonProblems: [
      "An incident report states only the technical symptom, leaving readers to guess at the actual business impact.",
      "A translation jumps straight from symptom to impact without identifying the actual affected process in between, producing a vague or inaccurate impact statement.",
      "Urgency is assessed purely on technical severity, without considering how business-critical the affected process actually is.",
    ],
    troubleshootingSteps: [
      "Start from the technical symptom, then explicitly name the system it affects, then the process, then the operational impact — don't skip a step in the chain.",
      "Check who exactly is affected (one team, a department, all customers) before writing an impact statement — vague scope makes urgency hard to judge.",
      "Distinguish immediate impact (what's broken right now) from a broader impact if the issue continues (a growing backlog, a widening customer effect).",
      "Pair, don't replace — keep the precise technical detail for the technical audience, and add the business translation for everyone else.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Writing clear incident reports and postmortems that connect technical cause to business impact is a real professional software engineering skill." },
      { area: "Networking", connection: "DNS and connectivity failures are common, concrete technical symptoms that map directly onto real business-workflow disruption." },
    ],
    practiceScenario: {
      scenario: "A technical report reads only: \"Database connection pool exhausted at 14:02.\"",
      question: "Rewrite this with the full technical symptom → affected system → affected process → operational impact chain.",
      guidance:
        "Something like: \"At 14:02, the database connection pool was exhausted, causing the order-processing application to slow and intermittently fail. Employees and customers submitting new orders during this window experienced failures or long delays, meaning some orders may need to be re-submitted or manually reconciled.\" Notice each link in the chain is now explicit, not implied.",
    },
    questionToAskAtWork: "The next time I report or hear about a technical issue, can I state its business impact in one clear sentence, not just its technical cause?",
    relatedTopicIds: ["technology-in-logistics", "operational-kpi", "business-process", "priority"],
    keywords: ["business translation", "impact statement", "incident communication"],
    dontConfuseWith: [
      { topicId: "priority", note: "Priority & Business Impact is about how IT decides what to work on first; technical-to-business translation is the communication skill of restating a technical symptom in plain business-impact terms for any audience." },
    ],
  },
];
