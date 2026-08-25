import { Team, TeamId } from "@/lib/types";

// General enterprise IT knowledge — mirrors the root ../../teams/*.md docs. This
// describes what a team of this TYPE commonly does industry-wide, not a confirmed
// description of any specific organization's team. No DHL-specific facts are
// asserted here — see root CLAUDE.md.
export const teams: Team[] = [
  {
    id: "infrastructure",
    name: "Infrastructure",
    tagline: "Keeps the servers, storage, and cloud that everything else runs on.",
    simpleExplanation:
      "Infrastructure is the team that keeps the \"computer stuff underneath everything\" running: servers, storage, and cloud resources that every business application depends on.",
    technicalExplanation:
      "Infrastructure teams commonly manage servers (physical/virtual), cloud provisioning, virtual machines, operating systems, storage (SAN/NAS, backups, capacity), identity & access (directory services, permissions), monitoring, availability (redundancy, failover, load balancing), and disaster recovery.",
    responsibilities: [
      "Provisioning and decommissioning servers/VMs",
      "Patching operating systems and applying security updates",
      "Managing backups and testing restores",
      "Monitoring system health and responding to alerts",
      "Managing identity and access permissions",
      "Capacity planning for storage and compute",
      "Disaster recovery planning and drills",
    ],
    exampleProblems: [
      "A server runs out of disk space and an application on it stops responding.",
      "A scheduled backup silently fails for a week before anyone notices.",
      "A VM host loses power and everything hosted on it goes offline.",
      "An employee can't access a shared drive because of a permissions issue.",
      "A monitoring alert for high CPU usage turns out to be a runaway process.",
    ],
    universityConnections: [
      { area: "Operating Systems", connection: "Patching servers, process/resource management" },
      { area: "Networking", connection: "How servers communicate, load balancing, DNS resolution" },
      { area: "Cloud concepts", connection: "VM provisioning, cloud storage, scaling" },
      { area: "Databases", connection: "Storage systems that databases run on top of" },
      { area: "Secure Computing", connection: "Identity/access management, vulnerability patching" },
      { area: "Algorithms", connection: "Scheduling, load balancing, resource allocation logic" },
    ],
    checklist: [
      "Can explain the difference between a physical server and a VM",
      "Can explain what a backup is and why testing restores matters",
      "Can explain what \"availability\" means and one way to achieve it",
      "Can explain what disaster recovery is in one sentence",
      "Can name 3 things that could cause a server-side outage",
      "Can explain identity/access management in simple terms",
    ],
    thingsToLearn: [
      "Which ticket categories does this team receive most often?",
      "How is escalation actually handled here?",
      "Which tools does the team use day to day?",
      "Which systems are managed locally versus centrally?",
    ],
  },
  {
    id: "applications",
    name: "Applications",
    tagline: "Builds and supports the software people actually use.",
    simpleExplanation:
      "The Applications team builds and supports the software employees and customers use day to day — the programs and internal tools that sit on top of Infrastructure's servers and networks.",
    technicalExplanation:
      "Application teams commonly manage business applications, APIs, databases, bug triage/fixes, integrations between systems, deployments/releases, authentication, application monitoring, and the overall software lifecycle.",
    responsibilities: [
      "Fixing bugs reported by users or found through monitoring",
      "Building and maintaining integrations between systems",
      "Managing releases and deployments of new application versions",
      "Supporting APIs used internally or by partners",
      "Investigating \"application is slow/broken\" tickets",
      "Coordinating with Infrastructure when an app issue is really a server/network issue",
    ],
    exampleProblems: [
      "An internal application throws an error when a user submits a form.",
      "A business application is extremely slow during peak hours.",
      "An application can't connect to its database after a maintenance window.",
      "Two integrated systems fall out of sync because an API call silently failed.",
      "A new deployment introduces a bug that wasn't caught in testing.",
    ],
    universityConnections: [
      { area: "Software Engineering", connection: "Lifecycle, testing, deployment practices" },
      { area: "Web Services / REST APIs", connection: "How applications talk to each other" },
      { area: "Databases / SQL", connection: "How application data is stored and queried" },
      { area: "Web Development", connection: "Building the business applications themselves" },
      { area: "Secure Computing", connection: "Authentication, authorization, secure API design" },
      { area: "Algorithms", connection: "Diagnosing and optimizing slow application logic" },
    ],
    checklist: [
      "Can explain what an API is in one sentence",
      "Can explain the difference between a bug and an outage",
      "Can explain what a deployment is and why it can go wrong",
      "Can explain why an app might be \"slow\" for reasons unrelated to its own code",
      "Can explain authentication vs authorization",
      "Can describe the software lifecycle in 4–5 stages",
    ],
    thingsToLearn: [
      "Which categories of tickets does this team receive most often?",
      "How do they find out an application issue is actually an infrastructure issue?",
      "What does their deployment/release process look like?",
      "Which tools does the team use day to day?",
    ],
  },
  {
    id: "support-network",
    name: "Support & Network",
    tagline: "The first line of contact — tickets, connectivity, and escalation.",
    simpleExplanation:
      "Support & Network is the team employees talk to first when something isn't working. They handle tickets, keep people connected (Wi-Fi, VPN, network access), and decide when to escalate.",
    technicalExplanation:
      "Support & Network teams commonly manage IT support/ticketing, troubleshooting, escalation, SLA tracking, Wi-Fi/LAN/WAN, VPN, DNS, DHCP, routers/switches, and IP addressing/connectivity.",
    responsibilities: [
      "Answering and triaging incoming tickets",
      "Resolving common issues directly (password resets, Wi-Fi, printers)",
      "Escalating issues that need Infrastructure or Applications expertise",
      "Monitoring SLA compliance (response/resolution time targets)",
      "Maintaining network hardware and connectivity",
      "Managing DNS/DHCP configuration",
    ],
    exampleProblems: [
      "An employee can't connect to Wi-Fi.",
      "An employee forgot their password.",
      "A user can't connect through VPN while working remotely.",
      "Several employees can't reach a particular server.",
      "A printer is offline.",
      "A device gets no IP address (possible DHCP issue).",
    ],
    universityConnections: [
      { area: "Networking", connection: "LAN/WAN/VPN/DNS/DHCP, routers/switches, IP addressing" },
      { area: "Operating Systems", connection: "Device-level connectivity troubleshooting" },
      { area: "Secure Computing", connection: "VPN security, access control" },
      { area: "Databases / SQL", connection: "Ticketing systems store tickets in a database" },
      { area: "Software Engineering", connection: "Ticketing/escalation workflow design" },
      { area: "Algorithms", connection: "SLA prioritization and routing logic" },
    ],
    checklist: [
      "Can explain the difference between LAN and WAN",
      "Can explain what DNS does in one sentence",
      "Can explain what DHCP does in one sentence",
      "Can explain what a VPN is for",
      "Can explain what SLA means and why it matters",
      "Can explain when a ticket should be escalated vs resolved directly",
    ],
    thingsToLearn: [
      "Which categories of tickets does this team receive most often?",
      "How is ticket priority/urgency actually determined here?",
      "What tools do they use to triage and route tickets?",
      "How does this team interact with Infrastructure and Applications day to day?",
    ],
  },
];

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}

/** Shared label lookup so pages don't each re-implement TeamId → display name. */
export function getTeamLabel(id: TeamId | "General" | string): string {
  if (id === "General") return "General";
  return getTeamById(id)?.name ?? id;
}
