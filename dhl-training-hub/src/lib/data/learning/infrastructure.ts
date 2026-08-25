import { LearningTopic } from "@/lib/types";

// General enterprise infrastructure knowledge — not DHL-specific. See root CLAUDE.md.
export const infrastructureTopics: LearningTopic[] = [
  {
    id: "server",
    title: "Server",
    category: "Infrastructure",
    shortDescription: "A computer (or software role) that provides services or data to other computers on request.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    simpleExplanation: "A server is a computer that provides something — data, a service, a webpage — to other computers (\"clients\") that ask for it.",
    eli10:
      "A server is like a kitchen in a restaurant. Customers don't cook their own meals; they send requests to the kitchen, and the kitchen sends results back.",
    technicalExplanation:
      "A server can be physical hardware or a virtual machine, running an operating system and one or more services (web server, database server, application server, etc.) that listen for and respond to requests from clients over a network.",
    businessPurpose:
      "If a server hosting a critical business application becomes unavailable, every employee who depends on that application may lose access at once — a single point of failure can have a very wide blast radius.",
    commonProblems: [
      "A server runs out of disk space and the application on it stops responding.",
      "A server is overloaded (too many requests, too little CPU/memory) and becomes slow or unresponsive.",
      "A server host loses power or crashes and everything hosted on it goes offline.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is one server affected, or several? One application, or many?",
      "Check whether the server is reachable at all (network-level) before assuming it's the application.",
      "Check basic health: is it up, is it responding, what do CPU/memory/disk look like?",
      "Check what changed recently — deployments, patches, configuration.",
      "Compare against a known-good baseline if one exists (monitoring history).",
      "Escalate if the cause is outside your team's scope (e.g. a networking issue reaching the server).",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "Processes, resource management, and scheduling all happen on the server's OS." },
      { area: "Networking", connection: "Clients reach servers over a network — routing, DNS, and ports are all involved." },
    ],
    practiceScenario: {
      scenario: "Twenty employees suddenly cannot reach the same internal application.",
      question: "What would make you suspect a shared infrastructure issue rather than twenty unrelated problems?",
      guidance:
        "The fact that it's the same application, affecting many unrelated people at the same time, strongly points to one shared cause — most likely the server (or something between the users and it) rather than twenty coincidental individual issues. You'd check the server's health and reachability before investigating each user individually.",
    },
    questionToAskAtWork: "How do you first tell whether a \"server down\" report is really the server, or something upstream like networking or DNS?",
    relatedTopicIds: ["virtual-machine", "monitoring", "cloud"],
  },
  {
    id: "virtual-machine",
    title: "Virtual Machine",
    category: "Infrastructure",
    shortDescription: "A software-based computer that runs on a physical machine, sharing hardware with other VMs.",
    primaryTeam: "infrastructure",
    relatedTeams: [],
    simpleExplanation: "A virtual machine (VM) is a computer that exists as software, running on top of a real physical machine, acting like its own independent computer.",
    eli10:
      "A VM is like an apartment building. One physical building (the host machine) is divided into separate apartments (VMs), each with its own locked door, so tenants don't interfere with each other even though they share the same structure.",
    technicalExplanation:
      "A hypervisor runs on physical hardware and creates isolated virtual machines, each with its own virtual CPU, memory, storage, and operating system. This lets one physical server run many independent workloads, improving utilization and flexibility compared to one OS per physical machine.",
    businessPurpose:
      "Virtualization lets a company run many applications/services on shared hardware efficiently, and makes it much faster to provision, resize, or move a workload than buying and configuring a new physical machine each time.",
    commonProblems: [
      "A physical host runs out of resources (CPU/memory), degrading every VM on it at once.",
      "A VM is misconfigured with too few resources for its actual workload.",
      "A host failure takes down every VM it was hosting, if there's no redundancy.",
    ],
    troubleshootingSteps: [
      "Check whether the problem affects one VM or many VMs on the same host — that distinguishes a VM-level issue from a host-level issue.",
      "Check the VM's own resource usage (CPU/memory/disk) versus the host's.",
      "Check for recent changes to the VM's configuration or resource allocation.",
      "If multiple VMs on one host are affected, investigate the host itself, not each VM individually.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "Virtualization and hypervisors are a core OS/systems topic — abstraction over real hardware." },
      { area: "Cloud concepts", connection: "VMs are the building block most cloud compute services are built on." },
    ],
    practiceScenario: {
      scenario: "Three unrelated applications, each running on its own VM, all become slow at the same time.",
      question: "What would you check first, given they're unrelated applications?",
      guidance:
        "Since the applications are otherwise unrelated, a shared cause is likely — check whether all three VMs run on the same physical host, and if so, check that host's resource usage. A host-level resource problem can look like three separate application problems if you only look at each VM individually.",
    },
    questionToAskAtWork: "How do you decide how many resources (CPU/memory) to give a new VM before you know its real workload?",
    relatedTopicIds: ["server", "cloud", "monitoring"],
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    category: "Infrastructure",
    shortDescription: "Renting computing resources (servers, storage, services) from a provider instead of owning the hardware.",
    primaryTeam: "infrastructure",
    relatedTeams: [],
    simpleExplanation:
      "Cloud computing means using computing resources — servers, storage, databases — that live in someone else's data center and are rented on demand, instead of buying and running your own hardware.",
    eli10: "Cloud computing is like renting a moving van for a day instead of buying your own truck. You get what you need, when you need it, and you're not responsible for maintaining it when you're done.",
    technicalExplanation:
      "Cloud providers offer compute, storage, and networking as on-demand services, often billed by usage. Companies commonly use a mix of cloud and on-premises infrastructure (\"hybrid cloud\"). Common service models include infrastructure-as-a-service (raw VMs/storage), platform-as-a-service (managed runtime), and software-as-a-service (fully managed applications).",
    businessPurpose:
      "Cloud computing lets a company scale resources up or down quickly without buying physical hardware in advance, which affects how fast new systems can be delivered and how costs are managed.",
    commonProblems: [
      "Costs grow unexpectedly because usage isn't monitored or resources aren't cleaned up.",
      "A cloud service outage (at the provider level) affects a company's systems and is outside that company's direct control.",
      "Confusion between what the cloud provider manages versus what the company's own team is responsible for.",
    ],
    troubleshootingSteps: [
      "Check the cloud provider's own status page before assuming the fault is internal.",
      "Confirm whether the affected resource is provider-managed or something the internal team configured.",
      "Check recent changes to configuration, scaling settings, or permissions.",
      "Escalate to the team responsible for the cloud account/subscription if it's a provider-level or billing/access issue.",
    ],
    universityConnections: [
      { area: "Cloud concepts", connection: "Directly matches — service models, elasticity, and shared responsibility." },
      { area: "Networking", connection: "Cloud infrastructure is inherently distributed across many physical machines and locations." },
    ],
    practiceScenario: {
      scenario: "A company's application, hosted with a cloud provider, becomes unreachable for all users at the same time as a global outage is being reported publicly.",
      question: "What's the first thing worth checking before troubleshooting internally?",
      guidance:
        "Check the cloud provider's public status page first. If it confirms a provider-wide outage, the useful next step is usually monitoring and communicating impact, not deep internal troubleshooting — the cause and fix are outside the company's control in that case.",
    },
    questionToAskAtWork: "Which parts of our infrastructure are cloud-based versus on-premises, and who manages each?",
    relatedTopicIds: ["virtual-machine", "server", "monitoring"],
  },
  {
    id: "monitoring",
    title: "Monitoring",
    category: "Infrastructure",
    shortDescription: "Automated tracking of system health, so problems are caught before — or as soon as — they affect users.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    simpleExplanation: "Monitoring means automatically watching systems (servers, applications, networks) and generating alerts when something looks wrong.",
    eli10: "Monitoring is like a smoke detector. It doesn't put out fires, but it tells you the moment something's wrong, so you can react before it gets much worse.",
    technicalExplanation:
      "Monitoring systems collect metrics (CPU, memory, response times, error rates, uptime) and logs, compare them against thresholds or expected patterns, and raise alerts when something crosses a threshold or looks anomalous. Good monitoring aims to catch problems before users report them.",
    businessPurpose:
      "Monitoring reduces the time between something breaking and someone finding out — every minute an outage goes undetected is a minute of unnecessary business impact.",
    commonProblems: [
      "An alert fires but nobody is watching it, or it's routed to the wrong place.",
      "Alert thresholds are set too sensitively (constant false alarms) or not sensitively enough (real problems missed).",
      "A system silently fails without any monitoring in place at all (a monitoring gap).",
    ],
    troubleshootingSteps: [
      "When an alert fires, confirm it reflects a real current problem, not stale or flapping data.",
      "Check what metric triggered it and how far outside normal range it is.",
      "Check for correlated alerts — is this isolated, or part of a bigger pattern?",
      "Check whether this is a known, expected event (e.g. a scheduled batch job) before treating it as an incident.",
    ],
    universityConnections: [
      { area: "Data Mining", connection: "Anomaly detection in monitoring data is a real-world application of pattern recognition." },
      { area: "Algorithms", connection: "Threshold-based and statistical alerting are algorithmic decisions about when to notify a human." },
    ],
    practiceScenario: {
      scenario: "An automated alert fires for sustained high CPU usage on a server, but no users have reported any problem yet.",
      question: "Is this worth investigating even though nobody has complained?",
      guidance:
        "Yes — that's the point of monitoring: catching problems before they cause visible impact. Investigating now (what process is using the CPU, is it expected) can prevent the issue from ever becoming a user-facing incident at all.",
    },
    questionToAskAtWork: "Which systems do you monitor most closely, and what usually triggers an alert here?",
    relatedTopicIds: ["server", "virtual-machine", "incident"],
  },
];
