import { LearningTopic } from "@/lib/types";

// General enterprise infrastructure knowledge — not DHL-specific. See root CLAUDE.md.
export const infrastructureTopics: LearningTopic[] = [
  {
    id: "server",
    title: "Server",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A computer (or software role) that provides services or data to other computers on request.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain what a server does in plain terms",
      "Recognize when a shared-server outage looks like many unrelated problems",
      "List basic health checks for a suspected server issue",
    ],
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
    relatedTopicIds: ["virtual-machine", "monitoring", "cloud", "capacity-performance"],
    keywords: ["host", "backend machine"],
  },
  {
    id: "virtual-machine",
    title: "Virtual Machine",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A software-based computer that runs on a physical machine, sharing hardware with other VMs.",
    primaryTeam: "infrastructure",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what a hypervisor does",
      "Distinguish a VM-level problem from a host-level problem",
      "Explain why VMs improve hardware utilization",
    ],
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
    keywords: ["VM", "virtualization", "hypervisor"],
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "Renting computing resources (servers, storage, services) from a provider instead of owning the hardware.",
    primaryTeam: "infrastructure",
    relatedTeams: [],
    learningOutcomes: [
      "Explain the difference between IaaS, PaaS, and SaaS at a high level",
      "Explain why 'cloud' is more than 'someone else's computer'",
      "Know to check a provider's status page before troubleshooting internally",
    ],
    simpleExplanation:
      "Cloud computing means using computing resources — servers, storage, databases — that live in someone else's data center and are rented on demand, instead of buying and running your own hardware.",
    eli10: "Cloud computing is like renting a moving van for a day instead of buying your own truck. You get what you need, when you need it, and you're not responsible for maintaining it when you're done.",
    technicalExplanation:
      "Cloud providers offer compute, storage, and networking as on-demand services, often billed by usage. Companies commonly use a mix of cloud and on-premises infrastructure (\"hybrid cloud\"). Common service models include infrastructure-as-a-service (raw VMs/storage), platform-as-a-service (managed runtime), and software-as-a-service (fully managed applications). It's more than \"someone else's computer\": providers also offer elasticity (scaling on demand), managed services, and global redundancy that would be expensive to replicate in-house.",
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
    keywords: ["IaaS", "PaaS", "SaaS", "hybrid cloud"],
  },
  {
    id: "monitoring",
    title: "Monitoring",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Automated tracking of system health, so problems are caught before — or as soon as — they affect users.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    learningOutcomes: [
      "Explain what monitoring is for",
      "Distinguish monitoring from logging",
      "Recognize when an alert deserves investigation even without a user complaint",
    ],
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
    relatedTopicIds: ["server", "virtual-machine", "incident", "logging"],
    keywords: ["alerting", "observability", "metrics"],
    dontConfuseWith: [
      { topicId: "logging", note: "Monitoring watches live metrics/status and alerts in real time; logging records historical events for later investigation." },
    ],
  },
  {
    id: "storage",
    title: "Storage",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Where data physically lives — disks, arrays, and cloud storage — and why running out of it breaks things.",
    primaryTeam: "infrastructure",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what storage capacity planning is for",
      "Recognize storage-related symptoms (writes failing, disk full errors)",
      "Distinguish storage from backup",
    ],
    simpleExplanation: "Storage is where data physically lives — on disks, disk arrays, or cloud storage services — that servers and applications read from and write to.",
    eli10: "Storage is like a warehouse's shelf space. Everything a business keeps has to sit somewhere, and if the shelves are full, nothing new can be put away.",
    technicalExplanation:
      "Enterprise storage ranges from local disks on a single server to shared storage systems (SAN/NAS) that many servers use, to cloud object/block storage. Capacity, performance (how fast data can be read/written), and redundancy (protecting against a single disk failure) are all separate concerns that need planning.",
    businessPurpose:
      "When storage runs low, applications can fail to save data, logs stop being written, and services can crash outright — often with little warning until the space is nearly gone.",
    commonProblems: [
      "A storage volume fills up gradually until writes start failing, seemingly \"out of nowhere.\"",
      "Old logs, backups, or temporary files aren't cleaned up and slowly consume capacity.",
      "Storage performance degrades under heavy load even though there's plenty of free space.",
    ],
    troubleshootingSteps: [
      "Check current storage utilization on the affected system before assuming another cause.",
      "Identify what's consuming space, and whether it's growing unexpectedly fast.",
      "Check whether this is a capacity problem (out of space) or a performance problem (slow reads/writes).",
      "Free space safely if urgent, then investigate why usage grew so it doesn't recur.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "File systems, disk allocation, and storage management are core OS topics." },
      { area: "Databases / SQL", connection: "Database performance and growth are directly tied to underlying storage capacity and speed." },
    ],
    practiceScenario: {
      scenario: "An application starts throwing intermittent errors when saving new records, though it was working fine yesterday.",
      question: "What infrastructure-level cause would you rule out early?",
      guidance:
        "Check the storage volume the application (or its database) writes to — a nearly-full disk is a classic cause of intermittent \"sometimes it works, sometimes it doesn't\" write failures, since failures often start right as capacity runs out.",
    },
    questionToAskAtWork: "How is storage capacity monitored here, and at what threshold does someone get alerted?",
    relatedTopicIds: ["backup-restore", "capacity-performance", "server"],
    keywords: ["disk space", "SAN", "NAS", "capacity"],
  },
  {
    id: "backup-restore",
    title: "Backup & Restore",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Copies of data kept so it can be recovered after loss — distinct from disaster recovery.",
    primaryTeam: "infrastructure",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what a backup is and why testing restores matters",
      "Distinguish backup from disaster recovery",
      "Recognize a monitoring gap that let a backup failure go unnoticed",
    ],
    simpleExplanation: "A backup is a copy of data kept separately so it can be restored if the original is lost, corrupted, or deleted.",
    eli10: "A backup is like a spare key. You hope you never need it, but if you're locked out, it's the only thing that gets you back in.",
    technicalExplanation:
      "Backups are typically scheduled, stored separately from the original (often off-site or in a different system), and periodically tested by actually restoring from them — an untested backup is a hope, not a guarantee. Backup is about recovering data; it's one ingredient of disaster recovery, not the same thing.",
    businessPurpose:
      "Without reliable backups, a single deletion, corruption, or hardware failure can mean permanent data loss — which for business-critical data can mean real financial and operational damage.",
    commonProblems: [
      "A backup job fails silently and nobody notices until a restore is actually needed.",
      "Backups run successfully but were never tested, and the restore itself fails when it matters.",
      "Backup storage runs out of space, causing the most recent backups to be incomplete.",
    ],
    troubleshootingSteps: [
      "Check backup job logs to see whether the last scheduled run actually succeeded.",
      "Check why a failure alert didn't fire, if one should have.",
      "If a restore is urgently needed, verify you're restoring from a known-good, complete backup.",
      "After resolving, confirm the next scheduled backup run succeeds before considering it fixed.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "File system snapshots and backup mechanisms are a standard OS/systems topic." },
      { area: "Databases / SQL", connection: "Database backup/restore (and consistency during backup) is a core database administration concept." },
    ],
    practiceScenario: {
      scenario: "A routine audit discovers a server's backup job has silently failed every night for a week.",
      question: "What two things need fixing here — not just one?",
      guidance:
        "First, restore backup coverage immediately (run a manual backup now). Second — and easy to overlook — fix why the failure alert never fired, since that monitoring gap is what let a week of missing coverage go unnoticed in the first place.",
    },
    questionToAskAtWork: "How often are restores actually tested here, versus just trusting that backups succeeded?",
    relatedTopicIds: ["disaster-recovery", "storage", "monitoring"],
    keywords: ["backup", "restore", "data recovery"],
    dontConfuseWith: [
      { topicId: "disaster-recovery", note: "Backup is copying data for recovery; disaster recovery is the broader plan for restoring critical services after a major disruption." },
    ],
  },
  {
    id: "high-availability",
    title: "High Availability",
    category: "Infrastructure",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Reducing downtime by removing single points of failure — distinct from backup and from disaster recovery.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain what a single point of failure is",
      "Distinguish high availability from backup and from disaster recovery",
      "Give an example of redundancy in an enterprise system",
    ],
    simpleExplanation: "High availability (HA) means designing a system so that if one component fails, another can take over — minimizing downtime rather than just recovering from it afterward.",
    eli10: "It's like a building with two staircases. If one is blocked, people can still get out using the other — nobody has to wait for the first one to be fixed.",
    technicalExplanation:
      "HA is commonly achieved through redundancy (multiple servers, load balancing, failover clusters) so that no single component's failure takes down the whole service. HA is about minimizing downtime for likely, smaller-scale failures — it's a different concern from backup (recovering lost data) and disaster recovery (recovering from a major, larger-scale disruption).",
    businessPurpose:
      "For services where even short downtime is costly, high availability design reduces how often users notice a failure at all, rather than relying on people to fix things quickly after the fact.",
    commonProblems: [
      "A system is assumed to be highly available, but a single, unnoticed component turns out to be a single point of failure.",
      "Redundant components exist, but failover was never actually tested and doesn't work when needed.",
      "HA is confused with backup, leading to false confidence that data loss can't happen.",
    ],
    troubleshootingSteps: [
      "When one component fails, check whether failover to a redundant component actually occurred.",
      "If failover didn't happen, investigate why — misconfiguration is a common cause.",
      "Identify whether the failure point was supposed to be redundant, or was always a single point of failure.",
      "After resolving, consider whether this exposes a gap in the HA design worth flagging.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "Failover clustering and redundancy are systems-design concepts covered in distributed/OS curricula." },
      { area: "Cloud concepts", connection: "Cloud platforms often provide built-in HA features (multiple zones/regions) as a service model." },
    ],
    practiceScenario: {
      scenario: "A server hosting a critical application fails, but users report no interruption at all.",
      question: "What most likely happened, from an HA perspective?",
      guidance:
        "A redundant server or component likely took over automatically (failover), which is exactly what high availability design is meant to achieve — the failure still happened, but it didn't translate into user-visible downtime.",
    },
    questionToAskAtWork: "Which systems here are designed for high availability, and which aren't — and how is that decided?",
    relatedTopicIds: ["disaster-recovery", "load-balancer", "server"],
    keywords: ["redundancy", "failover", "uptime"],
    dontConfuseWith: [
      { topicId: "disaster-recovery", note: "High availability minimizes downtime from likely component failures; disaster recovery restores service after a major disruption." },
    ],
  },
  {
    id: "disaster-recovery",
    title: "Disaster Recovery",
    category: "Infrastructure",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "The plan for restoring critical services after a major disruption — bigger in scope than backup or HA alone.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    learningOutcomes: [
      "Explain what disaster recovery covers that backup alone doesn't",
      "Explain why DR plans need to be tested, not just written",
      "Distinguish DR from high availability",
    ],
    simpleExplanation: "Disaster recovery (DR) is the plan and systems for restoring critical services after a major disruption — like a data center outage, not just one server crashing.",
    eli10: "If high availability is having a spare staircase, disaster recovery is the plan for what happens if the whole building burns down — where do people go, and how does the business keep functioning?",
    technicalExplanation:
      "DR planning typically defines which systems are critical, how quickly they need to be restored (recovery time objective) and how much data loss is tolerable (recovery point objective), and the actual process for standing services back up — often in a different location or environment. DR plans rely on backups but go well beyond them, and are only as good as their last successful test.",
    businessPurpose:
      "Major disruptions (data center failures, large-scale outages, and similar events) are rare but severe — DR planning is what determines whether a company can keep operating, or how quickly it can, when one occurs.",
    commonProblems: [
      "A DR plan exists on paper but has never actually been tested.",
      "Recovery time/data loss expectations aren't clearly defined, so \"restored\" means different things to different people.",
      "DR planning covers infrastructure but forgets dependencies (e.g. an application that also needs manual reconfiguration).",
    ],
    troubleshootingSteps: [
      "Confirm the scope of the disruption — is this genuinely DR-scale, or a smaller incident?",
      "Check which systems are classified as critical and what their recovery targets are.",
      "Follow the documented DR process rather than improvising under pressure.",
      "After recovery, verify functionality end-to-end, not just that systems are technically running.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "System recovery and state restoration are systems-level concerns underlying DR." },
      { area: "Software Engineering", connection: "DR planning resembles designing for failure — a recognized non-functional requirement." },
    ],
    practiceScenario: {
      scenario: "A company's primary data center becomes completely unavailable due to a major outage.",
      question: "Why isn't having good backups alone enough in this situation?",
      guidance:
        "Backups protect the data, but restoring full service after a data-center-scale disruption also requires somewhere to restore to, a way to redirect users/traffic, and coordination across systems — that broader plan and process is what disaster recovery covers.",
    },
    questionToAskAtWork: "Has the DR plan here ever been tested with a real failover exercise, or only documented?",
    relatedTopicIds: ["backup-restore", "high-availability", "capacity-performance"],
    keywords: ["DR", "recovery time objective", "recovery point objective"],
  },
  {
    id: "load-balancer",
    title: "Load Balancer",
    category: "Infrastructure",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "Distributes incoming traffic across multiple servers so no single one gets overwhelmed.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain what a load balancer does",
      "Recognize when uneven load points to a load-balancer issue",
      "Explain how load balancers support high availability",
    ],
    simpleExplanation: "A load balancer distributes incoming requests across multiple servers, so no single server gets overwhelmed and the workload is shared.",
    eli10: "A load balancer is like a host at a busy restaurant directing customers to whichever open table is ready, instead of everyone crowding around one table while others sit empty.",
    technicalExplanation:
      "Load balancers sit in front of a group of servers and route each incoming request to one of them, often based on current load, health checks, or simple rotation. If a server becomes unhealthy, a load balancer can stop sending it traffic — which also makes load balancers a key part of high availability.",
    businessPurpose:
      "Without load balancing, traffic could overwhelm one server while others sit idle, causing unnecessary slowness or outages even when the business has enough total capacity.",
    commonProblems: [
      "A load balancer's health checks are misconfigured, sending traffic to a server that's actually unhealthy.",
      "Uneven distribution means one server is overloaded while others are underused.",
      "The load balancer itself becomes a bottleneck or single point of failure if not itself redundant.",
    ],
    troubleshootingSteps: [
      "Check whether the problem is on all servers behind the load balancer, or just one.",
      "Check the load balancer's health-check configuration and current server status.",
      "Check for uneven traffic distribution across the server pool.",
      "If only one backend server is affected, investigate that server directly rather than the load balancer.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Load balancing is a classic distributed-systems and networking concept." },
      { area: "Algorithms", connection: "Distribution strategies (round-robin, least-connections) are algorithmic scheduling decisions." },
    ],
    practiceScenario: {
      scenario: "One server behind a load balancer is running at very high CPU while three identical servers next to it are nearly idle.",
      question: "What would you investigate — the servers, or the load balancer?",
      guidance:
        "This uneven pattern points toward the load balancer's distribution behavior or health-check configuration rather than the busy server itself necessarily being broken — check how it's routing traffic before assuming the overloaded server has its own separate problem.",
    },
    questionToAskAtWork: "How does the load balancer here decide a server is unhealthy and should stop receiving traffic?",
    relatedTopicIds: ["high-availability", "server", "capacity-performance"],
    keywords: ["traffic distribution", "health check", "failover"],
  },
  {
    id: "patching-updates",
    title: "Patching & Updates",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Applying security and software fixes to systems in a controlled way, balancing risk against staying current.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain why patching is necessary despite the risk of disruption",
      "Recognize a patch window as a plausible cause of an unexpected short outage",
      "Connect patching to change management",
    ],
    simpleExplanation: "Patching is applying updates to operating systems, applications, or firmware — often for security fixes, sometimes for new features or bug fixes.",
    eli10: "Patching is like getting routine maintenance on a car. Skip it too long and small issues (or vulnerabilities) build up; but you also don't want mechanics working on the engine while you're driving on the highway.",
    technicalExplanation:
      "Patches are typically tested before wide rollout, scheduled for low-impact windows, and applied following a change process for anything touching production. Unpatched systems can be vulnerable to known security issues, but poorly tested patches can also cause their own outages — patching is a balance, not a pure \"always update immediately\" rule.",
    businessPurpose:
      "Unpatched systems are a common source of security vulnerabilities and stability issues; a company that delays patching indefinitely accumulates risk, but one that patches carelessly risks self-inflicted outages.",
    commonProblems: [
      "A patch window causes an unexpected short outage that wasn't clearly communicated in advance.",
      "Critical security patches are delayed indefinitely because scheduling downtime is deprioritized.",
      "A patch is applied without testing and breaks compatibility with an existing application.",
    ],
    troubleshootingSteps: [
      "If an outage coincides with a known maintenance/patch window, check that connection first.",
      "Check what specifically was patched or updated, and when.",
      "If a patch is the suspected cause, check whether a rollback is available.",
      "Confirm patches went through the normal change process, especially for production-impacting ones.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Patch management is a core practical control against known vulnerabilities." },
      { area: "Operating Systems", connection: "Understanding what a patch actually changes at the OS/software level helps assess its risk." },
    ],
    practiceScenario: {
      scenario: "A brief, unexpected outage occurs overnight, and it turns out a scheduled patch window ran during that time.",
      question: "What should be checked to confirm (or rule out) the patch as the cause?",
      guidance:
        "Check exactly what was patched, whether the outage timing lines up precisely with the patch window, and whether similar systems that received the same patch show the same symptom — this separates \"caused by the patch\" from \"coincidentally happened at the same time.\"",
    },
    questionToAskAtWork: "How are patch windows scheduled and communicated here, and how urgent security patches get handled differently from routine ones?",
    relatedTopicIds: ["change-management", "server", "monitoring"],
    keywords: ["updates", "vulnerability fix", "maintenance window"],
  },
  {
    id: "directory-services",
    title: "Directory Services / Enterprise Identity",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 7,
    shortDescription: "The central system tracking users, groups, and devices — the foundation authentication and permissions build on.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications", "support-network"],
    learningOutcomes: [
      "Explain what a directory service manages",
      "Distinguish directory services from authentication itself",
      "Recognize that specific identity platforms are examples, not the only option",
    ],
    simpleExplanation: "A directory service is a central system that tracks an organization's users, groups, computers/devices, and the permissions tied to them.",
    eli10: "It's like a company's master employee directory and org chart combined — who exists, which teams/groups they're part of, and what that membership grants them access to.",
    technicalExplanation:
      "Directory services store identities (users, devices) and group memberships, and are commonly integrated with authentication systems so a single set of credentials can grant access across many applications. Technologies such as Microsoft Active Directory or Entra ID are well-known examples of identity/directory platforms, but organizations can and do use different solutions — no specific platform should be assumed.",
    businessPurpose:
      "A central directory means access can be granted, changed, or revoked in one place rather than separately in every application — which matters both for efficiency and for security (e.g. quickly removing access when someone leaves).",
    commonProblems: [
      "A new employee's account is created but missing the group memberships their role requires.",
      "A directory service outage blocks logins across many otherwise-healthy applications at once.",
      "Group membership changes don't propagate to every connected system at the same time.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is this one user, one application, or many systems at once?",
      "If many unrelated applications fail to authenticate at once, suspect the directory service itself.",
      "Check the affected user's group memberships against what their role should require.",
      "Distinguish a directory/identity problem (who they are, what groups they're in) from an application-specific permission problem.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Centralized identity management is a core enterprise security architecture concept." },
      { area: "Databases / SQL", connection: "A directory service is fundamentally a specialized, hierarchical database of identities." },
    ],
    practiceScenario: {
      scenario: "A new employee's account works for email, but they're missing access to several systems their role should include.",
      question: "What would you check first — application permissions, or something more central?",
      guidance:
        "Check the employee's group memberships in the directory service first — if access to several unrelated systems is missing at once, it's more efficient to check whether they were added to the right groups centrally than to investigate each application's permissions individually.",
    },
    questionToAskAtWork: "What identity/directory platform is used here, and how are group memberships kept in sync with role changes?",
    relatedTopicIds: ["authentication", "high-availability"],
    keywords: ["Active Directory", "identity provider", "user groups"],
    dontConfuseWith: [
      { topicId: "authentication", note: "A directory service stores identities and group memberships; authentication is the act of verifying who someone is, often checking against that directory." },
    ],
  },
  {
    id: "logging",
    title: "Logging",
    category: "Infrastructure",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "Recording events and activity so past behavior can be investigated later — distinct from live monitoring.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Distinguish logging from monitoring",
      "Explain why logs matter most after something has already gone wrong",
      "Recognize a missing-logs gap during an investigation",
    ],
    simpleExplanation: "Logging is recording events and activity from systems and applications — errors, requests, changes — so they can be reviewed later.",
    eli10: "Logging is like a ship's logbook. It doesn't steer the ship, but when something goes wrong, the logbook is how you reconstruct exactly what happened and when.",
    technicalExplanation:
      "Logs are typically timestamped records generated by applications, operating systems, and infrastructure components, often collected centrally so they can be searched across systems. Logs are historical evidence for investigation, whereas monitoring is about real-time metrics and alerting — the two are complementary, not the same thing.",
    businessPurpose:
      "When something fails, logs are often the only detailed record of what actually happened — without them, root cause analysis becomes guesswork instead of evidence-based investigation.",
    commonProblems: [
      "Logs exist but are scattered across systems with no central place to search them.",
      "Logging is too sparse to reconstruct what happened, or too noisy to find the relevant entry.",
      "Logs are lost or rotated out before anyone realizes they're needed for an investigation.",
    ],
    troubleshootingSteps: [
      "Identify which system(s) would have logged the relevant activity.",
      "Narrow the time window using known symptoms (when did users first notice the problem?).",
      "Look for errors, warnings, or unusual patterns just before the failure, not only at the moment of failure.",
      "Cross-reference logs from multiple systems if the issue could span more than one.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Structured logging is standard engineering practice for debuggable, maintainable systems." },
      { area: "Data Mining", connection: "Searching and correlating large log volumes is a practical pattern-analysis task." },
    ],
    practiceScenario: {
      scenario: "An application crashed overnight and nobody was watching at the time. There's no live monitoring alert to review.",
      question: "What would you turn to instead, and why?",
      guidance:
        "Application and system logs from around the crash time — since nobody observed it live, logs are the primary evidence left to reconstruct what happened, what errors preceded it, and what may have triggered it.",
    },
    questionToAskAtWork: "Are logs centralized and searchable here, or scattered per system?",
    relatedTopicIds: ["monitoring", "application-logs", "root-cause-analysis"],
    keywords: ["logs", "audit trail", "event history"],
    dontConfuseWith: [
      { topicId: "monitoring", note: "Logging records historical events for later investigation; monitoring watches live metrics/status and alerts in real time." },
    ],
  },
  {
    id: "capacity-performance",
    title: "Capacity & Performance",
    category: "Infrastructure",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "Ensuring systems have enough resources for expected demand, and stay responsive as usage grows.",
    primaryTeam: "infrastructure",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain the difference between a capacity problem and a performance problem",
      "Recognize gradual capacity growth as a distinct pattern from a sudden spike",
      "Connect capacity planning to monitoring",
    ],
    simpleExplanation: "Capacity is whether a system has enough resources (CPU, memory, storage, network) to handle expected demand; performance is how fast and responsive it actually is under that demand.",
    eli10: "Capacity is how many seats a restaurant has; performance is how fast the kitchen serves food even when every seat is full. A restaurant can have enough seats but still be slow, or be fast but run out of seats.",
    technicalExplanation:
      "Capacity planning forecasts future demand and ensures resources scale ahead of it, while performance monitoring/tuning addresses how efficiently existing resources are used. A system can have plenty of capacity but poor performance (inefficient code, bad queries), or good performance that degrades once capacity limits are approached.",
    businessPurpose:
      "As a business grows — more employees, more transactions, more data — systems that weren't planned for that growth degrade gradually, often only becoming an obvious problem once a threshold is crossed, by which point users are already affected.",
    commonProblems: [
      "Performance degrades gradually over months as usage grows, without a single clear trigger.",
      "A system performs fine in testing but not under real production-scale load.",
      "Capacity is sized for average demand but not for predictable peaks (e.g. month-end processing).",
    ],
    troubleshootingSteps: [
      "Distinguish a sudden change (something broke) from a gradual trend (growth outpacing capacity).",
      "Check resource utilization trends over time, not just the current snapshot.",
      "Check whether the issue correlates with a known peak period or growth in usage.",
      "Separate \"needs more capacity\" from \"needs more efficient use of existing capacity\" before proposing a fix.",
    ],
    universityConnections: [
      { area: "Algorithms", connection: "Performance problems often trace back to algorithmic complexity, not just hardware limits." },
      { area: "Operating Systems", connection: "Resource scheduling and contention are core OS-level performance concepts." },
    ],
    practiceScenario: {
      scenario: "A reporting system has run acceptably for a year, but has grown noticeably slower month over month, with no single recent change to blame.",
      question: "Is this most likely a sudden fault, or a capacity/performance trend — and how would you confirm it?",
      guidance:
        "A gradual, monthly worsening trend without a specific triggering change points toward capacity/performance growth rather than a discrete fault. Checking historical monitoring data for a steady upward trend in resource usage or response time (rather than a sudden jump) would confirm this.",
    },
    questionToAskAtWork: "How is capacity growth tracked here — is it reactive, or planned ahead of known growth?",
    relatedTopicIds: ["monitoring", "load-balancer", "application-performance"],
    keywords: ["scaling", "throughput", "resource planning"],
  },
];
