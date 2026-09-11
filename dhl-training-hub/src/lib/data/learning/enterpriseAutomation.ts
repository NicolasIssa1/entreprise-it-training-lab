import { LearningTopic } from "@/lib/types";

// Enterprise Automation — SharePoint, Outlook email workflows, and Power BI, plus the
// architecture topic tying the whole Microsoft 365 automation stack together. Deliberately
// does NOT re-teach Power Automate mechanics or Excel automation patterns — the "BPO &
// Process Automation" category (see bpoAutomation.ts) already covers triggers/actions,
// conditions/branching, loops, connectors, approvals/notifications, exception handling,
// troubleshooting, and Excel automation patterns in depth. This category cross-links to
// that content rather than duplicating it, per root CLAUDE.md's "never duplicate an
// existing topic" rule. All content is generic and fictional (e.g. "Global Logistics Co.",
// "Supplier ABC") — never a confirmed description of any specific company's real systems,
// permissions, or data. See root CLAUDE.md's confidentiality rules.
export const enterpriseAutomationTopics: LearningTopic[] = [
  {
    id: "enterprise-automation-overview",
    title: "The Enterprise Automation Stack",
    category: "Enterprise Automation",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription:
      "The mental model behind most Microsoft 365 business automation: an event happens, Power Automate reacts, SharePoint stores it, Excel structures it, Power BI reports on it.",
    primaryTeam: "applications",
    relatedTeams: ["support-network", "infrastructure"],
    learningOutcomes: [
      "Describe the Email/Event → Power Automate → SharePoint → Excel → Power BI chain in order",
      "Explain what each layer is responsible for, in one sentence each",
      "Recognize why the order matters — each layer depends on the one before it being done well",
    ],
    simpleExplanation:
      "A huge amount of everyday enterprise automation is really one repeating pattern: something happens (an email arrives, a form is submitted), Power Automate notices and reacts, the result gets stored in SharePoint, the data gets organized in a structured Excel table, and Power BI turns that structured data into a dashboard someone can actually look at. Learn this one chain and you can recognize it in almost any \"can you automate this?\" request.",
    eli10:
      "Imagine a mail sorting room. A letter arrives (the event). A sorter reads it and decides what to do (Power Automate). It gets filed in the right drawer (SharePoint). Someone copies the important details onto a tidy spreadsheet (Excel). Once a week, someone turns that spreadsheet into a chart for the boss (Power BI). Each person only does their one job, but together they turn a pile of letters into a useful report.",
    technicalExplanation:
      "The stack, layer by layer: (1) Email/Business Event — the trigger condition, e.g. a new email in Outlook, a scheduled time, a file landing somewhere, or a form submission; (2) Power Automate — the orchestration layer that reacts to the event, applies conditions/filters, and performs actions across the other services (see \"Microsoft Power Automate Fundamentals\" for the mechanics); (3) SharePoint — the durable, permissioned storage layer where files and structured lists live, so the result isn't sitting in one person's inbox or downloads folder; (4) Excel — the structured-data layer, where information is normalized into a clean table with consistent columns, so it can be reliably read by other tools (see \"Excel Automation Patterns & Limitations\"); (5) Power BI — the reporting/visualization layer, which connects to the structured data (often directly in SharePoint/Excel) and turns it into dashboards and reports people actually consume. Each layer is a real dependency: Power BI only produces something useful if the Excel data underneath it is clean; the Excel data is only reliable if SharePoint gives it one canonical, permissioned home; SharePoint only receives the right file if Power Automate's trigger and filtering logic are correct.",
    businessPurpose:
      "Large organizations run this exact chain, in some form, dozens of times over — supplier reports, expense approvals, onboarding paperwork, incident logs. Recognizing the pattern means a new automation request can be mapped onto a known, well-understood shape instead of being designed from nothing every time.",
    commonProblems: [
      "A request is scoped as \"build a Power BI dashboard\" when the real blocker is that no structured, reliable data source exists yet further upstream.",
      "Automation is built for one layer (e.g. \"save the attachment\") without anyone thinking through what the next layer downstream actually needs from it.",
      "The chain is assumed to be fully automatic end-to-end, when in practice a step (like confirming the Excel data is genuinely a Table, not just a range) still needs a person to set it up correctly first.",
    ],
    troubleshootingSteps: [
      "When something \"isn't working,\" identify which layer of the chain is actually broken before assuming the whole automation is at fault.",
      "Check each layer's output feeds the next layer in the format it expects — e.g. Power BI needs a real structured table, not a loose collection of files.",
      "Trace backward from a bad report (Power BI) through the data (Excel), the storage (SharePoint), and the automation (Power Automate) to the original event — the root cause is very often upstream of where the symptom shows up.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "This is a data pipeline — event source, processing layer, storage layer, transformation layer, presentation layer — the same architecture taught for any ETL/reporting system, just built with no-code enterprise tools instead of custom code." },
    ],
    practiceScenario: {
      scenario: "A stakeholder says: \"Our Power BI dashboard is showing the wrong numbers again.\"",
      question: "Where should you actually start looking first, and why?",
      guidance: "Start upstream, not at Power BI itself: check the Excel/structured data it's reading from, then the SharePoint file it lives in, then the Power Automate flow that populates it, then the original trigger event. Power BI is usually reporting exactly what it's given — the dashboard is rarely where the real problem originates.",
    },
    questionToAskAtWork: "For a given business process, which of these five layers already exists reliably, and which one is actually missing or broken?",
    relatedTopicIds: ["sharepoint-fundamentals", "power-automate-fundamentals", "excel-automation-patterns", "outlook-email-workflow-automation", "power-bi-fundamentals", "digital-transformation"],
    keywords: ["enterprise automation", "microsoft 365", "automation stack", "sharepoint", "power automate", "power bi", "excel"],
  },
  {
    id: "sharepoint-fundamentals",
    title: "SharePoint Fundamentals",
    category: "Enterprise Automation",
    level: "Foundation",
    estimatedMinutes: 8,
    shortDescription: "Sites, document libraries, lists, permissions, and version history — the shared, structured home automation and teams both depend on.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what a SharePoint site, document library, folder, and list each are",
      "Describe basic SharePoint permission concepts at a beginner level",
      "Explain why businesses use SharePoint instead of saving files locally or emailing them around",
      "Distinguish SharePoint from OneDrive at a simple level",
    ],
    simpleExplanation:
      "SharePoint is a shared, organized place to store files and structured lists of information so a whole team — and any automation — can reliably find and use them, instead of everything living on one person's laptop or scattered across email attachments.",
    eli10:
      "Imagine a shared family filing cabinet instead of everyone keeping their own private pile of papers in their room. Everyone knows exactly which drawer to open, some drawers are locked for privacy, and there's a note on each paper showing who last touched it and when.",
    technicalExplanation:
      "A SharePoint site is a dedicated space for a team, department, or project. Inside a site, a document library stores files (often organized into folders, though good practice increasingly favors metadata/columns over deep folder nesting), while a list stores structured, row-based data (similar in shape to a spreadsheet or a lightweight database table, with typed columns) — useful for tracking things like requests, assets, or approvals without needing a file at all. Permissions control who can view, edit, or manage a site/library/list, typically inherited from the site down to folders/files unless deliberately broken to grant different access — least-privilege thinking applies here exactly as it does anywhere else (see the Security Fundamentals category's \"Least Privilege\" topic). Version history automatically keeps prior versions of a file as it's edited, so an accidental overwrite or bad edit can be recovered without anyone needing a separate backup process. SharePoint vs. OneDrive, at a simple level: OneDrive is personal cloud storage tied to one individual's account, intended for that person's own working files; SharePoint is built for shared, team/organizational content with structured permissions and durability that doesn't depend on any one person's account.",
    businessPurpose:
      "A file saved to one person's laptop or personal inbox is invisible to the rest of the team and to any automation — if that person is out sick, changes role, or simply forgets, the process breaks. SharePoint gives automation (and colleagues) a single, permissioned, durable location to depend on, which is exactly why it's the standard \"storage layer\" in the enterprise automation stack.",
    commonProblems: [
      "A file is saved to someone's personal OneDrive \"just for now\" and a workflow or colleague quietly starts depending on it being there.",
      "Permissions are granted more broadly than actually needed, \"just to avoid access requests later\" — the opposite of least privilege.",
      "Deep, inconsistent folder structures make it hard for both people and automation to reliably find the right file.",
      "Someone overwrites a shared file with bad data and doesn't realize version history could have recovered the previous version.",
    ],
    troubleshootingSteps: [
      "Confirm the file/list actually lives in the shared SharePoint location it's supposed to, not a personal OneDrive or local folder.",
      "Check whether the account (person or automation connection) trying to access it actually has permission to that specific site/library.",
      "If content looks wrong or missing, check version history before assuming the data is genuinely lost.",
      "Prefer structured columns/metadata over ever-deeper folder nesting when a location seems to be getting hard to navigate.",
    ],
    universityConnections: [
      { area: "Databases", connection: "A SharePoint list is conceptually a lightweight, typed table with row-level records — the same idea as a database table, accessed through a much simpler no-code interface." },
      { area: "Secure Computing", connection: "SharePoint permission inheritance and least-privilege access control are the same access-control concepts taught in any security fundamentals course, applied to a real collaboration tool." },
    ],
    practiceScenario: {
      scenario: "A finance team asks you to create a structured location for supplier reports and make sure future automation can save files there reliably.",
      question: "What would you set up, and what would you check before calling it done?",
      guidance: "A dedicated document library (or a clearly named folder inside an existing one) on the finance team's SharePoint site, with permissions scoped to the finance team plus whatever service account the automation will use — and confirm that account actually has write access before the automation goes live, rather than assuming it does.",
    },
    questionToAskAtWork: "Where does this file or data actually live day to day — a shared SharePoint location, or someone's personal storage — and who has access to it?",
    relatedTopicIds: ["enterprise-automation-overview", "connectors-and-data-sources", "least-privilege"],
    prerequisiteTopicIds: ["enterprise-automation-overview"],
    dontConfuseWith: [
      { topicId: "power-automate-fundamentals", note: "SharePoint is where automation results are stored; Power Automate is what decides what to store and when. A flow that saves nowhere useful, and a well-organized SharePoint site nothing ever writes to, are two different, equally common problems." },
    ],
    keywords: ["sharepoint", "document library", "sharepoint site", "sharepoint list", "onedrive", "permissions", "version history"],
  },
  {
    id: "outlook-email-workflow-automation",
    title: "Outlook & Email Workflow Automation",
    category: "Enterprise Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Treating an email as a business event: sender/subject/attachment filtering, avoiding duplicate processing, and basic security hygiene.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain why an email is often the \"trigger\" event for a business automation",
      "Describe sender, subject, and attachment-name filtering, and why each is used",
      "Explain the risk of processing the same email twice, and a general approach to avoiding it",
      "Recognize basic security considerations specific to automating around email",
    ],
    simpleExplanation:
      "Lots of enterprise processes actually start with an email — a supplier's daily report, a customer complaint, a signed form. Treating \"a specific kind of email arrived\" as a trigger, and being precise about which emails actually count, is most of what makes email-based automation reliable instead of chaotic.",
    eli10:
      "Imagine a mailroom that only cares about a specific kind of letter — say, ones from one supplier, with a particular word in the subject, that have an attachment. Everything else, it ignores. And once it's opened and filed a letter, it puts a stamp on it so it never accidentally opens the exact same letter twice.",
    technicalExplanation:
      "An automated flow watching a mailbox typically filters on some combination of: sender address (e.g. only from a specific, known account), subject line (contains a specific keyword or pattern), and attachment presence/filename (e.g. contains \"daily report\", or a specific file extension) — narrowing a noisy inbox down to exactly the messages that should start the process. Duplicate processing is a real, common failure mode: if a flow reruns, or a sender accidentally resends the same email, the same attachment can be saved and processed twice unless the flow explicitly checks for that (e.g. checking whether a file with that name/date already exists in the destination before saving again, or tracking processed message IDs). Mailbox folder structure matters too — some designs move or mark a message as read/processed once handled, both as a record and to avoid reprocessing it on the next run. Basic security considerations specific to email automation: never assume an email's claimed sender name is trustworthy without checking the actual address; be cautious about flows that automatically open/process attachments from outside the organization; and never route sensitive attachments to personal or externally-shared locations as part of an automation (see Security Fundamentals' phishing-awareness and least-privilege topics).",
    businessPurpose:
      "Email remains one of the most common ways information enters an organization from outside it (suppliers, customers, partners) — reliable, precise email-triggered automation turns that inbound flow into structured, trustworthy data instead of a manually-managed inbox someone has to babysit every morning.",
    commonProblems: [
      "A filter is too broad (e.g. subject \"contains report\") and catches unrelated emails that happen to use similar wording.",
      "A filter is too narrow or brittle (e.g. an exact subject match) and breaks the moment the sender phrases something slightly differently.",
      "The same email or attachment gets processed more than once because nothing checks for a prior match.",
      "An automation is built to open/process attachments from any sender without verifying the source first.",
    ],
    troubleshootingSteps: [
      "Confirm the exact filter conditions configured (sender, subject, attachment name) against the real emails involved — don't assume the filter matches what was intended.",
      "Check whether a message was actually processed once already before assuming it was missed.",
      "If duplicates appear downstream, check for a missing \"already processed?\" check rather than assuming the trigger itself is broken.",
      "Verify a sender's actual email address, not just the display name, before trusting an automated process built around it.",
    ],
    universityConnections: [
      { area: "Web Services", connection: "Filtering incoming email by sender/subject/attachment is the same pattern as filtering incoming webhook or API events — narrow a noisy event stream down to exactly the events that matter." },
      { area: "Secure Computing", connection: "Verifying sender identity before automated processing, and never routing sensitive attachments to unapproved locations, are the same phishing-awareness and data-handling principles taught generally, applied specifically to automation design." },
    ],
    practiceScenario: {
      scenario: "Global Logistics Co.'s Operations team gets a daily Excel report by email from Supplier ABC. Twice this month the report was accidentally processed twice, creating duplicate records.",
      question: "What would you check or add to prevent this going forward?",
      guidance: "Add an explicit duplicate check before saving/processing — e.g. confirm no file with that exact name and date already exists in the destination, or track which message IDs have already been handled — rather than assuming a flow that reacts to \"a new email\" can never see the same logical report twice.",
    },
    questionToAskAtWork: "For this email-triggered process, what exactly counts as \"the same email arriving twice,\" and is there anything actually stopping it from being processed twice?",
    relatedTopicIds: ["enterprise-automation-overview", "power-automate-fundamentals", "phishing-awareness"],
    prerequisiteTopicIds: ["enterprise-automation-overview"],
    keywords: ["outlook", "email automation", "sender filter", "attachment filter", "duplicate processing", "mailbox"],
  },
  {
    id: "power-bi-fundamentals",
    title: "Power BI Fundamentals",
    category: "Enterprise Automation",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Datasets, reports, dashboards, visuals, and refresh — turning structured data from Excel/SharePoint into something people actually look at.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what a dataset, report, and dashboard each are in Power BI, and how they relate",
      "Describe importing data from Excel/SharePoint and what a refresh does",
      "Explain, at a beginner level, why relationships between tables matter",
      "Explain why organizations invest in dashboards rather than sharing raw spreadsheets",
    ],
    simpleExplanation:
      "Power BI takes structured data — often from Excel or SharePoint — and turns it into visuals (charts, tables, maps) that people can actually read at a glance, gathered into reports and dashboards, refreshed on a schedule so the numbers stay current.",
    eli10:
      "If Excel is a big table of numbers, Power BI is turning that table into a picture — a bar chart, a map with colored regions, a big number on a screen — so someone can understand it in five seconds instead of reading five hundred rows.",
    technicalExplanation:
      "A dataset is the underlying data Power BI connects to — often an Excel table, a SharePoint list, or a database — optionally with some light transformation/cleanup applied on the way in. A report is a set of visuals (bar charts, line charts, tables, maps, cards) built against that dataset, usually across multiple pages. A dashboard is a single-page, curated collection of pinned visuals (sometimes pulled from multiple reports), designed for a quick, at-a-glance view rather than deep exploration. At a beginner level, a relationship connects two tables via a shared field (e.g. a \"Supplier ID\" column present in both a shipments table and a suppliers table), letting a report combine data that lives in separate places without duplicating it — the same underlying idea as a foreign key in a relational database. Refresh re-pulls the latest data from the source (Excel/SharePoint/database) on a schedule or on demand, so the dashboard doesn't silently go stale — a dashboard connected to a source that never refreshes is really just a very elaborate screenshot.",
    businessPurpose:
      "Decision-makers rarely have time to read a raw spreadsheet — a well-built dashboard turns the same data into something that can be understood in seconds, supports faster and better-informed decisions, and (when connected properly) stays current automatically instead of needing someone to manually rebuild a chart every week.",
    commonProblems: [
      "A dashboard connects to a copy or export of the data instead of the live source, so it quietly stops matching reality.",
      "Refresh isn't scheduled (or fails silently), so the dashboard looks current but is actually showing old data.",
      "The underlying data isn't structured cleanly (see Excel Automation Patterns & Limitations), so visuals are wrong or misleading even though the dashboard itself is built correctly.",
      "A relationship between two tables is set up incorrectly, silently duplicating or dropping rows in the combined view.",
    ],
    troubleshootingSteps: [
      "If numbers look wrong, check the underlying dataset and its refresh status before assuming the visual/report itself is broken (see \"The Enterprise Automation Stack\" — the root cause is very often upstream).",
      "Confirm when the data was last successfully refreshed, not just whether a refresh is scheduled.",
      "Check that relationships between tables are set up on the correct shared field, especially after any change to the source data's structure.",
      "Trace a suspicious number back to its source row(s) in the underlying data rather than trying to debug the visual alone.",
    ],
    universityConnections: [
      { area: "Databases", connection: "Datasets, relationships, and refresh map directly onto tables, foreign keys, and ETL/materialized-view refresh in traditional database and data-warehousing concepts." },
      { area: "Data Mining", connection: "Turning structured data into digestible visuals for decision-making is the same core goal as data visualization taught in data mining/analytics coursework, using an enterprise no-code tool instead of a plotting library." },
    ],
    practiceScenario: {
      scenario: "A manager says a Power BI dashboard \"looks the same as last week even though the underlying spreadsheet has definitely changed.\"",
      question: "What would you check first?",
      guidance: "Whether the dataset has actually refreshed since the spreadsheet changed — check the last refresh time/status before assuming anything about the visuals themselves is wrong. A stale or failed refresh is a far more common cause than a broken chart.",
    },
    questionToAskAtWork: "What does this dashboard actually connect to, how often does it refresh, and how would we know if a refresh silently failed?",
    relatedTopicIds: ["enterprise-automation-overview", "excel-automation-patterns", "operational-kpi"],
    prerequisiteTopicIds: ["sharepoint-fundamentals", "power-automate-fundamentals", "excel-automation-patterns", "outlook-email-workflow-automation"],
    keywords: ["power bi", "dashboard", "report", "dataset", "refresh", "data visualization", "relationships"],
  },
];
