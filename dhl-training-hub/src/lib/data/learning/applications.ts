import { LearningTopic } from "@/lib/types";

// General enterprise application-development/support knowledge — not DHL-specific.
// See root CLAUDE.md.
export const applicationsTopics: LearningTopic[] = [
  {
    id: "api",
    title: "API",
    category: "Applications",
    shortDescription: "A defined way for two software systems to exchange requests and data with each other.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
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
      "Escalate to whichever team owns the API being called, once you can point to a specific failing call.",
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
    relatedTopicIds: ["database", "authentication", "ticket"],
  },
  {
    id: "database",
    title: "Database",
    category: "Applications",
    shortDescription: "Where an application's data is stored, organized, and queried — a common single point of failure.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure"],
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
    relatedTopicIds: ["api", "server", "monitoring"],
  },
  {
    id: "authentication",
    title: "Authentication vs Authorization",
    category: "Applications",
    shortDescription: "Authentication proves who you are; authorization decides what you're allowed to do. Very different failures.",
    primaryTeam: "applications",
    relatedTeams: ["infrastructure", "support-network"],
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
      "Escalate to whichever team owns the affected system's access model.",
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
    relatedTopicIds: ["api", "vpn", "ticket"],
  },
];
