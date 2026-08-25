import { LearningTopic } from "@/lib/types";

// General enterprise application-development/support knowledge — not DHL-specific.
// See root CLAUDE.md.
export const applicationsTopics: LearningTopic[] = [
  {
    id: "api",
    title: "API",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A defined way for two software systems to exchange requests and data with each other.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what an API is in plain terms",
      "Recognize an API/integration problem versus an application's own logic problem",
      "Distinguish an API from a REST API specifically",
    ],
    simpleExplanation: "An API (Application Programming Interface) is a defined way for one piece of software to ask another piece of software to do something or return data.",
    eli10: "An API is like a waiter. You tell the waiter what you want, the waiter takes the request to the kitchen, and brings the result back — you never have to go into the kitchen yourself.",
    technicalExplanation:
      "APIs define a contract: what requests are allowed, what data they need, and what response to expect — commonly implemented today as web APIs using HTTP and JSON, though other styles exist. Systems integrate by calling each other's APIs rather than sharing internal code or databases directly.",
    businessPurpose:
      "If an integration API fails, two business systems may stop exchanging information — e.g. orders stop reaching a fulfillment system — even though each system looks fine in isolation.",
    commonProblems: [
      "An API call fails silently, and the two systems quietly drift out of sync.",
      "An API changes (a field is renamed or removed) and breaks something that depended on the old version without warning.",
      "Authentication between systems (API keys/tokens) expires, blocking calls that used to work.",
    ],
    troubleshootingSteps: [
      "Confirm each system works correctly on its own, isolating the problem to the integration itself.",
      "Check logs on both sides for failed API calls around when the problem started.",
      "Check whether anything changed recently — a deployment, a credential rotation, an API version change.",
      "Try manually triggering the integration/API call and observe the exact error.",
      "Escalate to whichever team is responsible for the API being called, once you can point to a specific failing call.",
    ],
    universityConnections: [
      { area: "Web Services / REST APIs", connection: "Directly matches — request/response design, HTTP methods, status codes." },
      { area: "Software Engineering", connection: "APIs are a core interface-design and integration concept." },
    ],
    practiceScenario: {
      scenario: "Two applications work individually, but data stopped syncing between them.",
      question: "What kind of component might you investigate?",
      guidance:
        "Since each application works fine alone, the problem is likely in the integration between them — the API calls, credentials, or data mapping connecting the two systems, not either application's core logic.",
    },
    questionToAskAtWork: "How do you find out an integration/API problem before other teams notice the data is out of sync?",
    relatedTopicIds: ["rest-apis", "system-integration", "authentication"],
    keywords: ["interface", "integration"],
    dontConfuseWith: [
      { topicId: "rest-apis", note: "API is the general concept of one system calling another; REST is one common style/convention for designing web APIs specifically." },
    ],
  },
  {
    id: "database",
    title: "Database",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Where an application's data is stored, organized, and queried — a common single point of failure.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a database does for an application",
      "Distinguish a database being down from an application failing to connect to it",
      "Explain why database problems often make an otherwise-healthy app unusable",
    ],
    simpleExplanation: "A database is where an application's data is stored — records, accounts, transactions — organized so it can be searched and updated efficiently.",
    eli10: "A database is like a very well-organized filing cabinet. An application doesn't remember things itself; it asks the filing cabinet to store or retrieve information whenever it needs to.",
    technicalExplanation:
      "Applications read and write data by sending queries to a database (commonly using SQL for relational databases). Databases run as their own service, often on dedicated infrastructure, and applications connect to them over a network using credentials and a connection pool.",
    businessPurpose:
      "Since most business applications are essentially useless without their data, a database problem — even a brief one — can make an otherwise perfectly healthy application completely unusable.",
    commonProblems: [
      "An application can't connect to its database (credentials, network, or the database being down).",
      "A slow or unindexed query becomes a bottleneck under heavy load, even though it worked fine with less data.",
      "A database runs out of available connections, so new requests start failing even though the database itself is up.",
    ],
    troubleshootingSteps: [
      "Check whether the database itself is up and reachable, independent of the application.",
      "Check the application's connection details/credentials for recent changes.",
      "Check database logs for refused connections, errors, or resource exhaustion.",
      "Check whether other applications sharing the same database are also affected.",
      "Escalate to Infrastructure if the database server itself is down; keep it with Applications if it's a config/query issue.",
    ],
    universityConnections: [
      { area: "Databases / SQL", connection: "Directly matches — queries, indexing, connections, and performance." },
      { area: "Algorithms", connection: "Query performance often comes down to indexing and algorithmic complexity of lookups." },
    ],
    practiceScenario: {
      scenario: "A reporting application shows \"database connection failed\" whenever anyone tries to run a report.",
      question: "What would you check first — and is this necessarily an Applications-only problem?",
      guidance:
        "First check whether the database server itself is reachable at all, independent of the application. It's genuinely ambiguous: it could be the database server being down (Infrastructure) or the application's connection configuration/credentials being wrong (Applications) — that's exactly why this needs investigation rather than an assumption either way.",
    },
    questionToAskAtWork: "When an application can't reach its database, how do you tell whether it's the database, the network, or the application's configuration?",
    relatedTopicIds: ["database-connectivity", "server", "monitoring"],
    keywords: ["SQL", "data store", "records"],
    dontConfuseWith: [
      { topicId: "database-connectivity", note: "The database is the data store itself; database connectivity is specifically about the application's ability to reach and authenticate to it." },
    ],
  },
  {
    id: "authentication",
    title: "Authentication vs Authorization",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Authentication proves who you are; authorization decides what you're allowed to do. Very different failures.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
    learningOutcomes: [
      "Explain the difference between authentication and authorization",
      "Diagnose which one failed from the error message a user sees",
      "Apply this distinction to speed up access-issue troubleshooting",
    ],
    simpleExplanation:
      "Authentication answers \"who are you?\" — like logging in. Authorization answers \"what are you allowed to do?\" — like whether you can open a specific report once you're logged in.",
    eli10: "Authentication is showing your ID at the door to prove who you are. Authorization is whether your ID lets you into the VIP room once you're already inside the building.",
    technicalExplanation:
      "Authentication verifies identity (passwords, tokens, certificates, multi-factor methods). Authorization checks permissions for a verified identity, typically via roles or access control lists. A user can be successfully authenticated and still be denied by authorization — these are separate systems and separate failure points.",
    businessPurpose:
      "Getting this distinction wrong wastes troubleshooting time — resetting a password won't fix a permissions problem, and reviewing permissions won't fix an expired account. Correctly identifying which one failed is often the fastest path to a fix.",
    commonProblems: [
      "A user can log in but can't access something they need — often mistaken for a login/authentication problem.",
      "A user's permissions aren't updated after a role change, so access lags behind their actual responsibilities.",
      "An authentication system issue (e.g. an expired certificate) is mistaken for a permissions/authorization issue.",
    ],
    troubleshootingSteps: [
      "Ask first: can the user log in at all? If no, it's authentication. If yes, but something specific is blocked, it's likely authorization.",
      "Check what error is actually shown — \"invalid credentials\" points to authentication; \"access denied\" points to authorization.",
      "Check the user's current permissions/group membership against what's required for the specific resource.",
      "Confirm with the resource owner or manager whether access should be granted, before just changing settings.",
      "Escalate to whichever team is responsible for the affected system's access model.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Authentication and authorization (access control) are foundational security concepts." },
      { area: "Software Engineering", connection: "Most applications implement both as distinct layers — this maps directly to real system design." },
    ],
    practiceScenario: {
      scenario: "A user reaches the login page but their credentials are rejected.",
      question: "Is this authentication or authorization?",
      guidance:
        "This is authentication — the system is failing to verify who they are (rejecting their credentials) before authorization would ever come into play. If the user could log in fine but then got blocked from a specific report, that would be authorization instead.",
    },
    questionToAskAtWork: "When access issues come in, how do you quickly tell whether it's a login/authentication problem or a permissions/authorization problem?",
    relatedTopicIds: ["directory-services", "vpn", "ticket", "mfa", "least-privilege"],
    keywords: ["login", "permissions", "access control"],
  },
  {
    id: "http-https",
    title: "HTTP & HTTPS",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The protocol web and API traffic runs on, and the encrypted version most enterprise traffic actually uses.",
    primaryTeam: "applications",
    relatedTeams: ["support-network"],
    learningOutcomes: [
      "Explain what HTTP is used for",
      "Explain what HTTPS adds on top of HTTP",
      "Recognize a certificate warning as an HTTPS-layer symptom",
    ],
    simpleExplanation: "HTTP is the protocol web browsers and applications use to request and receive data from servers. HTTPS is the same thing, encrypted, so the data can't be read or tampered with in transit.",
    eli10: "HTTP is sending a postcard — anyone handling it along the way can read it. HTTPS is sending the same message in a sealed, tamper-evident envelope.",
    technicalExplanation:
      "HTTP defines requests (like GET or POST) and responses (including status codes such as 200 for success or 404 for not found) between a client and a server. HTTPS wraps this in encryption (TLS), using a certificate to verify the server's identity and protect the data in transit. Most enterprise web and API traffic today uses HTTPS by default.",
    businessPurpose:
      "Nearly every internal and external web application depends on HTTP/HTTPS working correctly; a broken or expired certificate can make an otherwise perfectly healthy application appear broken or untrustworthy to users.",
    commonProblems: [
      "An HTTPS certificate expires, causing browsers to show security warnings even though the application itself works fine.",
      "A status code is misread — e.g. treating any failure the same instead of distinguishing a client error from a server error.",
      "Traffic that should be HTTPS is accidentally served over plain HTTP.",
    ],
    troubleshootingSteps: [
      "Check what HTTP status code is actually being returned, if any — it narrows down the type of failure significantly.",
      "If a browser shows a certificate warning, check the certificate's validity and expiration date.",
      "Distinguish \"the request never reached the server\" from \"the server responded with an error.\"",
      "Escalate certificate issues to whoever manages the application's certificates, since renewal is often a scheduled task that was missed.",
    ],
    universityConnections: [
      { area: "Web Services / REST APIs", connection: "HTTP is the transport nearly all modern web APIs are built on." },
      { area: "Secure Computing", connection: "HTTPS/TLS encryption and certificate validation are core secure-communication concepts." },
    ],
    practiceScenario: {
      scenario: "Employees see a browser security warning when opening an internal website that was working fine yesterday.",
      question: "What would you check first, at a conceptual level — without needing deep certificate management skills?",
      guidance:
        "Check whether the site's HTTPS certificate has expired — a lapsed certificate is one of the most common causes of a sudden, unexplained security warning on a previously-working site, and is often simply a missed renewal rather than an attack or deeper fault.",
    },
    questionToAskAtWork: "How are certificate renewals tracked here, so they don't lapse unexpectedly?",
    relatedTopicIds: ["rest-apis", "api", "encryption-basics"],
    keywords: ["HTTP status code", "TLS", "certificate"],
  },
  {
    id: "rest-apis",
    title: "REST APIs",
    category: "Applications",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "A common style/convention for designing web APIs, built on HTTP — one option among several, not the only one.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what makes an API \"RESTful\" at a basic level",
      "Recognize REST as one API style among several",
      "Connect HTTP methods/status codes to REST API behavior",
    ],
    simpleExplanation: "A REST API is a common style of designing web APIs, where each request typically targets a specific piece of data (a \"resource\") using standard HTTP methods.",
    eli10: "If an API is a waiter taking requests, a REST API is a waiter who follows a very consistent, predictable ordering system — the same style of request always works the same way, no matter which \"dish\" you're ordering.",
    technicalExplanation:
      "REST (Representational State Transfer) APIs typically organize functionality around resources (e.g. \"a customer,\" \"an order\"), addressed by URLs, and use standard HTTP methods (GET to read, POST to create, PUT/PATCH to update, DELETE to remove) along with HTTP status codes to indicate the result. It's a widely-used convention, not the only API style — other approaches exist and are also common in enterprise systems.",
    businessPurpose:
      "Consistent, predictable API design (like REST conventions) makes it faster for different teams and even different companies to integrate systems together, since developers can rely on familiar patterns rather than learning something bespoke each time.",
    commonProblems: [
      "An API technically works but doesn't follow consistent conventions, making it harder to integrate with and more error-prone.",
      "A client misinterprets an HTTP status code, treating a client-side error as if it were a server failure or vice versa.",
      "A REST API's structure changes (a resource's shape changes) and breaks existing integrations without warning.",
    ],
    troubleshootingSteps: [
      "Identify which resource/endpoint is being called and what HTTP method is being used.",
      "Check the HTTP status code returned — it usually indicates whether the problem is on the client side or server side.",
      "Compare the actual request/response against the documented API contract for that endpoint.",
      "Check if this endpoint's behavior recently changed (a version or schema change).",
    ],
    universityConnections: [
      { area: "Web Services / REST APIs", connection: "Directly matches — resource modeling, HTTP methods, and status codes are core REST concepts." },
      { area: "Software Engineering", connection: "API contract design and versioning are standard software engineering practice." },
    ],
    practiceScenario: {
      scenario: "An integration that previously worked now consistently receives a 404 (\"not found\") status when calling a specific REST endpoint.",
      question: "What does a 404 specifically suggest, versus other possible errors?",
      guidance:
        "A 404 suggests the requested resource/endpoint itself isn't being found — commonly because a URL/endpoint path changed, was removed, or the specific record being requested no longer exists — which is a different investigation path than, say, a 500 error suggesting a server-side failure.",
    },
    questionToAskAtWork: "Do the APIs used here mostly follow REST conventions, or is there a mix of styles?",
    relatedTopicIds: ["api", "http-https", "json"],
    keywords: ["resource", "HTTP methods", "status code"],
    prerequisiteTopicIds: ["http-https", "api"],
    dontConfuseWith: [
      { topicId: "api", note: "API is the general concept of one system calling another; REST is one common style/convention for designing web APIs specifically." },
    ],
  },
  {
    id: "json",
    title: "JSON",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "A lightweight, text-based data format most modern web APIs use to exchange structured data.",
    primaryTeam: "applications",
    relatedTeams: [],
    learningOutcomes: [
      "Recognize what JSON looks like structurally",
      "Explain why JSON is commonly used for API data",
      "Recognize malformed/unexpected JSON as a plausible integration failure cause",
    ],
    simpleExplanation: "JSON (JavaScript Object Notation) is a lightweight, text-based way of structuring data — using named fields and values — that most modern web APIs use to send and receive information.",
    eli10: "JSON is like a neatly labeled shipping form. Instead of a paragraph of prose, it lists each piece of information under a clear label, so the person receiving it (or a computer) can read it precisely.",
    technicalExplanation:
      "JSON represents data as nested objects (key-value pairs) and arrays (lists), using a small, consistent, human-readable syntax. Its simplicity and language-independence made it the de facto standard data format for REST APIs and many other data-exchange scenarios.",
    businessPurpose:
      "Because JSON is a shared, predictable format, systems built by completely different teams — or different companies — can exchange data reliably without needing to agree on a custom format each time.",
    commonProblems: [
      "A field expected in the JSON is missing or renamed, breaking whatever depended on reading it.",
      "Malformed JSON (a syntax error) causes a receiving system to fail to parse the response at all.",
      "A data type mismatch (e.g. a number sent as text) causes unexpected downstream behavior.",
    ],
    troubleshootingSteps: [
      "If an integration fails, check the actual raw response for valid JSON structure before assuming a logic bug.",
      "Compare the JSON's fields against what the receiving system expects.",
      "Check whether an expected field is missing, renamed, or has an unexpected type.",
      "Check if this started right after one side of the integration changed its data format.",
    ],
    universityConnections: [
      { area: "Web Services / REST APIs", connection: "JSON is the standard payload format for most REST APIs covered in web services curricula." },
      { area: "Programming", connection: "Parsing and serializing structured data is a fundamental programming task." },
    ],
    practiceScenario: {
      scenario: "An integration that reads data from a partner API starts failing right after the partner deploys an update.",
      question: "What would you check in the actual API response, rather than just the integration's own code?",
      guidance:
        "Check the raw JSON response itself for structural changes — a renamed or removed field, a changed data type, or malformed JSON are all common causes when a previously-working integration breaks right after the other side changes something.",
    },
    questionToAskAtWork: "Are there shared standards here for what a JSON API response should look like, or does each integration do its own thing?",
    relatedTopicIds: ["rest-apis", "api"],
    keywords: ["data format", "payload", "serialization"],
  },
  {
    id: "system-integration",
    title: "System Integration",
    category: "Applications",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Connecting separate systems so they exchange data reliably — where a lot of enterprise complexity actually lives.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain why enterprises need multiple systems to work together",
      "Recognize integration-specific failure modes (sync gaps, data drift)",
      "Apply isolation thinking to a multi-system data problem",
    ],
    simpleExplanation: "System integration is the practice of connecting separate software systems — often built by different teams or vendors — so they can exchange data and work together.",
    eli10: "If each business application is its own department with its own filing system, integration is the messenger service making sure information gets passed accurately between departments instead of everyone working from outdated copies.",
    technicalExplanation:
      "Integrations commonly use APIs, scheduled data syncs, or message queues to move data between systems. Because integrated systems are maintained independently, they can drift out of sync when one side changes without the other being updated — a distinct failure mode from either system simply being \"down.\"",
    businessPurpose:
      "Large companies rarely run on one single system — integration is what lets separately-built systems (finance, HR, operations, customer-facing tools) function as one coherent business process instead of isolated silos.",
    commonProblems: [
      "Two systems fall out of sync silently, and nobody notices until the data discrepancy causes a real business problem.",
      "One system's update breaks an integration that depended on its old behavior.",
      "An integration has no monitoring, so failures are only caught when someone notices missing or wrong data downstream.",
    ],
    troubleshootingSteps: [
      "Confirm each system works correctly in isolation before suspecting the integration layer.",
      "Check integration logs for failed sync attempts around when the discrepancy started.",
      "Estimate how much data is affected and for how long, to gauge the scope of a backfill if needed.",
      "Check whether a recent change on either side (schema, API version, credentials) broke the connection.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Integration architecture and handling partial failure between systems is a core distributed-systems concern." },
      { area: "Databases / SQL", connection: "Keeping data consistent across systems touches directly on data consistency concepts." },
    ],
    practiceScenario: {
      scenario: "Data entered in one business system isn't appearing in a second system it's supposed to sync with, and nobody was alerted.",
      question: "What's the first thing to establish before trying to fix it?",
      guidance:
        "Establish scope and evidence first: how long has the sync been failing, how much data is affected, and what does the integration log show at the point it started failing — fixing the connection without knowing this risks leaving a data gap unresolved.",
    },
    questionToAskAtWork: "Which integrations here are considered most business-critical, and how are they monitored?",
    relatedTopicIds: ["api", "application-logs", "database"],
    keywords: ["data sync", "middleware", "interoperability"],
  },
  {
    id: "deployment-release",
    title: "Deployment & Release",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The process of shipping a new version of an application into use — and a common source of new issues.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a deployment is",
      "Recognize a deployment as a likely cause when a regression appears right after one",
      "Explain what a rollback is for",
    ],
    simpleExplanation: "A deployment is the process of releasing a new version of an application — new features, fixes, or changes — into an environment where people actually use it.",
    eli10: "Deployment is like swapping in a new, updated recipe at a restaurant. Most of the time it's an improvement, but if something's wrong with the new recipe, customers notice quickly.",
    technicalExplanation:
      "Deployments typically move through stages (development, testing, sometimes staging) before reaching production, often following a change management process for anything business-critical. A rollback — reverting to the previous working version — is a common safety net when a deployment introduces a serious issue.",
    businessPurpose:
      "Deployments are how a company delivers improvements, but a bad deployment can introduce new problems just as easily as fix old ones — the timing correlation between \"something broke\" and \"something was just deployed\" is one of the most useful clues in troubleshooting.",
    commonProblems: [
      "A regression (a previously-working feature breaks) appears right after a deployment.",
      "A deployment is missing a required configuration change, causing partial failures.",
      "A deployment works in testing but fails under real production conditions.",
    ],
    troubleshootingSteps: [
      "Check the timing: did the issue start right after a deployment?",
      "Review what actually changed in the deployment (release notes/change log).",
      "Try to reproduce the issue in a test environment using the new version.",
      "Consider a rollback if a quick fix isn't available and the impact is significant.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Deployment pipelines, environments, and release practices are core software delivery topics." },
      { area: "Software Engineering", connection: "Rollback strategies connect directly to version control and release management." },
    ],
    practiceScenario: {
      scenario: "Shortly after a scheduled release, users report a previously-working feature in an internal tool now throws errors.",
      question: "What's the first correlation worth checking?",
      guidance:
        "Check whether the timing lines up with the deployment — a regression appearing right after a release is a strong first lead, worth checking the deployment's change log before investigating unrelated causes.",
    },
    questionToAskAtWork: "What does the deployment process look like here — how often are releases shipped, and what testing happens first?",
    relatedTopicIds: ["change-management", "application-logs", "system-integration"],
    keywords: ["release", "rollback", "regression"],
  },
  {
    id: "application-logs",
    title: "Application Logs",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "The application-level record of what happened — often the fastest way to understand why something failed.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what application logs typically capture",
      "Recognize a repeated error pattern in logs as a pre-failure warning sign",
      "Connect application logs to the general Logging concept",
    ],
    simpleExplanation: "Application logs are records an application writes about its own activity — requests handled, errors encountered, and significant events — useful for understanding what actually happened.",
    eli10: "Application logs are like a diary the application keeps of everything notable it did. When something goes wrong, reading the diary entries around that time usually explains a lot.",
    technicalExplanation:
      "Applications typically log errors, warnings, and significant events with timestamps, often at different severity levels. Well-structured logs let a developer or support engineer trace exactly what the application was doing right before a failure, rather than guessing.",
    businessPurpose:
      "Application logs are frequently the fastest, most direct evidence available when investigating a failure — without them, diagnosing an application problem often means guessing or trying to reproduce the issue blind.",
    commonProblems: [
      "Logs show a repeated error for some time before an eventual outage, but nobody was reviewing them.",
      "Logging is too sparse to understand what actually happened.",
      "Logs are excessively noisy, burying the genuinely important entries.",
    ],
    troubleshootingSteps: [
      "Narrow the time window using known symptoms (when did the problem start?).",
      "Search logs for errors or warnings just before and during the failure.",
      "Look for a repeated pattern, not just a single occurrence, which may indicate an underlying recurring issue.",
      "Cross-reference with recent deployments or changes around the same time.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Structured application logging is a standard, expected engineering practice." },
      { area: "Data Mining", connection: "Finding patterns across large volumes of log entries is a practical analysis task." },
    ],
    practiceScenario: {
      scenario: "Application logs show the same warning message repeated dozens of times in the hour before an outage, but nobody reviewed them at the time.",
      question: "What does this reveal about how the outage might have been prevented?",
      guidance:
        "The repeated warning was likely an early signal of a developing problem — if logs had been actively monitored or alerted on, the pattern might have been caught before it escalated into a full outage, similar to how proactive monitoring aims to catch issues early.",
    },
    questionToAskAtWork: "Are application logs reviewed proactively here, or mainly after something has already gone wrong?",
    relatedTopicIds: ["logging", "monitoring", "root-cause-analysis"],
    keywords: ["error logs", "stack trace", "log levels"],
  },
  {
    id: "application-monitoring",
    title: "Application Monitoring",
    category: "Applications",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Watching an application's own health (errors, response times, usage) — the application-layer counterpart to infrastructure monitoring.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what application monitoring tracks that infrastructure monitoring doesn't",
      "Recognize rising error rates as an application-health signal",
      "Connect application monitoring to catching problems before users report them",
    ],
    simpleExplanation: "Application monitoring tracks an application's own health from the inside — error rates, response times, and usage patterns — rather than just the server it runs on.",
    eli10: "If infrastructure monitoring checks whether the kitchen's equipment is running, application monitoring checks whether the meals are actually coming out right and on time.",
    technicalExplanation:
      "Application monitoring commonly tracks metrics like error rates, request latency, and throughput specific to the application's own behavior, which can reveal problems (like a slow code path or a rising error rate) even when the underlying server infrastructure looks perfectly healthy.",
    businessPurpose:
      "A server can look completely healthy (normal CPU, memory, disk) while the application running on it is actually failing for users — application-level monitoring is what catches that gap.",
    commonProblems: [
      "Error rates climb gradually and go unnoticed because only infrastructure metrics are being watched.",
      "Response times degrade for a specific feature while overall server health looks normal.",
      "Application monitoring exists but alerts are too noisy to act on, so they get ignored.",
    ],
    troubleshootingSteps: [
      "Check the application's own error rate and response time trends, not just server-level metrics.",
      "Identify whether a specific feature/endpoint is affected or the whole application.",
      "Correlate any change in application metrics with recent deployments.",
      "Escalate to Infrastructure only if application metrics point toward an underlying resource constraint.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Application performance monitoring (APM) is a widely used discipline in modern software delivery." },
      { area: "Data Mining", connection: "Detecting an abnormal trend in error rates is a practical anomaly-detection task." },
    ],
    practiceScenario: {
      scenario: "Server-level monitoring shows everything normal (CPU, memory, disk), but users report a specific feature failing intermittently.",
      question: "What kind of monitoring would you expect to catch this that infrastructure monitoring wouldn't?",
      guidance:
        "Application-level monitoring — tracking that specific feature's error rate or response time directly — since a healthy server doesn't guarantee the application logic running on it is behaving correctly for every feature.",
    },
    questionToAskAtWork: "What application-level metrics are tracked here, beyond basic server health?",
    relatedTopicIds: ["monitoring", "application-performance", "application-logs"],
    keywords: ["APM", "error rate", "latency"],
  },
  {
    id: "database-connectivity",
    title: "Database Connectivity",
    category: "Applications",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "Specifically about an application's ability to reach and authenticate to its database — not the database itself.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Distinguish database connectivity from database health",
      "List the layers a connection failure could occur at (network, credentials, pool)",
      "Apply isolation thinking to a 'can't connect' error",
    ],
    simpleExplanation: "Database connectivity is specifically about whether an application can successfully reach and authenticate to its database — a distinct concern from whether the database itself is healthy.",
    eli10: "The database being healthy is like a library being open. Connectivity is whether you personally have a working library card and can actually get through the door — the library can be fine while your card doesn't work.",
    technicalExplanation:
      "A connectivity failure can occur at several distinct layers: network reachability (can the application even reach the database host), authentication (are the credentials valid), or connection pool exhaustion (the database is reachable and credentials are fine, but no connections are available). Each layer needs a different fix.",
    businessPurpose:
      "Misdiagnosing a connectivity issue as \"the database is down\" when it's actually a credentials or network problem (or vice versa) leads to wasted effort — correctly isolating which layer failed is the fastest path to resolution.",
    commonProblems: [
      "Database credentials are rotated/changed but the application's configuration isn't updated to match.",
      "A network path or firewall rule between the application and database breaks after infrastructure changes.",
      "The database's connection pool is exhausted, so new connection attempts fail even though existing ones still work.",
    ],
    troubleshootingSteps: [
      "Check whether the database itself is up and reachable independently (bypassing the application).",
      "Check whether the application's stored credentials/connection string are current.",
      "Check for network-path issues between the application and the database specifically.",
      "Check whether the database's connection pool has available capacity.",
      "Escalate to Infrastructure if the root cause is network/server-level rather than application configuration.",
    ],
    universityConnections: [
      { area: "Databases / SQL", connection: "Connection pooling and authentication to a database are core database administration concepts." },
      { area: "Networking", connection: "Reaching a database over a network involves the same reachability concepts as any other network path." },
    ],
    practiceScenario: {
      scenario: "A finance application shows \"database connection failed\" for every user, and this started right after a scheduled credential rotation.",
      question: "What layer of connectivity does the timing point to?",
      guidance:
        "The timing strongly suggests a credentials problem — the application's stored connection details likely weren't updated to match the newly-rotated database credentials, rather than the database or network being unhealthy.",
    },
    questionToAskAtWork: "How are database credential rotations coordinated with the applications that depend on them, to avoid this kind of gap?",
    relatedTopicIds: ["database", "authentication", "capacity-performance"],
    keywords: ["connection pool", "connection string", "credentials"],
    prerequisiteTopicIds: ["database"],
    dontConfuseWith: [
      { topicId: "database", note: "The database is the data store itself; database connectivity is specifically about the application's ability to reach and authenticate to it." },
    ],
  },
  {
    id: "caching",
    title: "Caching",
    category: "Applications",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "Temporarily storing frequently-used data closer at hand, to avoid repeating expensive work — a common source of stale data.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a cache is for",
      "Recognize stale data as a plausible caching symptom",
      "Explain the basic idea of cache invalidation",
    ],
    simpleExplanation: "Caching means temporarily storing a copy of frequently-needed data somewhere faster to access, so the application doesn't have to redo expensive work (like a slow database query) every single time.",
    eli10: "Caching is like keeping a jar of pre-made sandwiches at the front counter for the most popular order, instead of making it fresh from scratch every single time someone asks.",
    technicalExplanation:
      "Caches store a copy of data for a period of time, trading a small risk of staleness for a significant speed improvement. Cache invalidation — knowing when a cached copy is no longer accurate and needs refreshing — is a well-known hard problem: caching too aggressively causes stale data; not caching enough loses the performance benefit.",
    businessPurpose:
      "Caching can dramatically improve application performance under load, but when misused it can also show users outdated information — a company relying on cached data needs to balance speed against freshness deliberately.",
    commonProblems: [
      "Users see outdated (stale) data because a cache wasn't refreshed after the underlying data changed.",
      "A cache becomes a performance bottleneck itself under very high load.",
      "Clearing a cache too aggressively removes the performance benefit it was meant to provide.",
    ],
    troubleshootingSteps: [
      "If data looks outdated, check whether it's coming from a cache rather than the live source.",
      "Check how and when that cache is supposed to refresh or invalidate.",
      "Test whether clearing/bypassing the cache resolves the symptom, confirming caching as the cause.",
      "Investigate why invalidation didn't happen as expected, rather than just clearing the cache as a permanent fix.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Cache design and eviction strategies are a classic algorithms/data-structures topic." },
      { area: "Operating Systems", connection: "Caching appears throughout computing, from CPU caches to OS-level disk caching." },
    ],
    practiceScenario: {
      scenario: "A user updates their profile information, but an application continues showing the old details for several minutes afterward.",
      question: "What would you suspect, and how would you test it?",
      guidance:
        "Suspect a cache showing stale data rather than a failed update — testing this could involve checking whether the underlying data was actually updated correctly (it likely was) while the displayed/cached version simply hasn't refreshed yet.",
    },
    questionToAskAtWork: "Which parts of the application(s) here use caching, and how is stale data usually reported and resolved?",
    relatedTopicIds: ["application-performance", "database"],
    keywords: ["cache invalidation", "stale data", "performance"],
  },
  {
    id: "application-performance",
    title: "Application Performance",
    category: "Applications",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Why an application is slow could involve code, database, network, infrastructure, an external API, load, or cache — not just 'the app.'",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "List several distinct possible causes behind 'the app is slow'",
      "Explain why performance investigation requires isolating the layer at fault",
      "Avoid oversimplifying slowness as purely an application code issue",
    ],
    simpleExplanation: "Application performance is how fast and responsive an application is under real use — and \"slow\" can come from many different places, not just the application's own code.",
    eli10: "If a meal takes a long time to arrive at a restaurant, it could be the kitchen, a slow supplier delivery, an overwhelmed waiter, or a full dining room — \"the app is slow\" is just as vague as \"the meal is slow\" until you investigate further.",
    technicalExplanation:
      "Application slowness can originate in application code itself, a slow database query, network latency, underlying infrastructure resource limits, a slow external API dependency, unusually high load, or an ineffective/missing cache. Good performance troubleshooting isolates which layer is actually responsible rather than assuming it's \"an Applications problem\" by default.",
    businessPurpose:
      "A slow application has real business cost (lost productivity, frustrated users, sometimes lost revenue) — but fixing the wrong layer (e.g. adding more application servers when the real bottleneck is a database query) wastes effort without solving the problem.",
    commonProblems: [
      "Performance degrades under peak load but is fine otherwise, pointing at capacity rather than a code defect.",
      "A single slow external dependency (a third-party API) drags down the whole application's responsiveness.",
      "An unindexed database query becomes a bottleneck only once data volume grows.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is this everyone, certain users, certain features, or certain times?",
      "Check application-level metrics (response times, error rates) alongside infrastructure metrics (CPU, memory).",
      "Check whether an external dependency (API, database) is the slow component rather than the application itself.",
      "Check whether this correlates with load (peak times) or a specific recent change.",
      "Narrow down to one layer with evidence before proposing a fix, rather than guessing.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Performance issues frequently trace back to algorithmic complexity in code or queries." },
      { area: "Software Engineering", connection: "Performance profiling and bottleneck isolation are standard engineering practices." },
    ],
    practiceScenario: {
      scenario: "Employees report a core business application is extremely slow every day between 9 and 11am, but it works fine the rest of the day.",
      question: "List at least three genuinely different possible causes before assuming which one it is.",
      guidance:
        "Possible causes include: peak-hour user load exceeding capacity, a database query that only becomes slow under heavy concurrent use, a scheduled batch job competing for resources at that time, network congestion during peak hours, or an external API dependency that's slower under its own peak load — the right fix depends entirely on which of these the evidence actually points to.",
    },
    questionToAskAtWork: "When 'the app is slow' comes in, what's the first thing checked here to narrow down which layer is responsible?",
    relatedTopicIds: ["capacity-performance", "caching", "monitoring", "database"],
    keywords: ["slowness", "latency", "bottleneck"],
  },
];
