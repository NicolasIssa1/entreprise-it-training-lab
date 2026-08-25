import { Ticket, TeamId } from "@/lib/types";

// All tickets are fake/generic training scenarios — no real DHL data. See root CLAUDE.md.
// Urgency levels (Critical/High/Medium/Low) are generic training categories, NOT
// confirmed DHL terminology.
export const tickets: Ticket[] = [
  {
    id: "TCK-1001",
    title: "Employee cannot connect to office Wi-Fi",
    department: "Finance",
    problem:
      "An employee reports their laptop shows \"connected, no internet\" on the office Wi-Fi network since this morning.",
    impact: "One employee unable to work from their desk.",
    status: "Open",
    plausibleTeams: ["support-network", "infrastructure"],
    recommendedTeam: "support-network",
    reasoning:
      "Wi-Fi connectivity for a single user is a classic first-line Support & Network issue — it's about network access, not a server or application problem.",
    suggestedTroubleshooting: [
      "Ask if other employees nearby are also affected (isolated vs widespread).",
      "Check the device's IP address — does it have a valid one, or a self-assigned 169.254.x.x address?",
      "Try reconnecting to the Wi-Fi network / forgetting and rejoining.",
      "Check the Wi-Fi access point covering that area for reported issues.",
    ],
    escalationNote:
      "If multiple employees in the same area are affected, escalate to check the access point or switch it connects to.",
    likelyRootCauses: [
      "Device-level Wi-Fi driver glitch",
      "DHCP failed to assign a valid IP address",
      "Access point in that area is degraded",
    ],
    exampleResolution:
      "Employee's laptop had a self-assigned IP address; reconnecting to the network triggered a fresh DHCP lease and resolved it.",
    documentationNotes:
      "Record the device, the symptom (connected but no internet), and the fix (reconnect / DHCP renew) for future reference.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1002",
    title: "Employee forgot their password",
    department: "HR",
    problem: "An employee is locked out of their account after too many failed login attempts.",
    impact: "One employee unable to log in to their workstation or applications.",
    status: "Open",
    plausibleTeams: ["support-network", "infrastructure"],
    recommendedTeam: "support-network",
    reasoning:
      "Password resets are a routine first-line support task — Support & Network typically handles account access requests directly.",
    suggestedTroubleshooting: [
      "Verify the employee's identity through the standard verification process.",
      "Check whether the account is locked due to failed attempts or genuinely expired.",
      "Reset the password following company policy and confirm the employee can log in.",
    ],
    escalationNote:
      "Escalate to Infrastructure only if the identity/directory system itself appears to be malfunctioning for multiple users.",
    likelyRootCauses: ["Forgotten password", "Account lockout after failed attempts", "Expired password policy"],
    exampleResolution: "Identity verified, password reset, employee regained access immediately.",
    documentationNotes: "Log that a reset occurred and confirm identity verification was completed — never log the password itself.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1003",
    title: "Internal application throws an error on form submission",
    department: "Operations",
    problem:
      "Users report an internal business application shows a generic error message whenever they submit a specific form.",
    impact: "Employees in Operations cannot complete a routine task until fixed.",
    status: "In Progress",
    plausibleTeams: ["applications"],
    recommendedTeam: "applications",
    reasoning:
      "A specific form throwing an error on submission points to application logic — this is squarely an Applications issue, not network or server.",
    suggestedTroubleshooting: [
      "Reproduce the error with the same form inputs.",
      "Check application logs around the time of the reported errors.",
      "Determine whether the error started after a recent deployment.",
      "Check if the error is tied to specific input values (validation bug) or all submissions.",
    ],
    escalationNote:
      "If logs point to a database or server-level failure rather than application code, loop in Infrastructure.",
    likelyRootCauses: [
      "A recent code deployment introduced a bug",
      "A validation rule rejecting valid input incorrectly",
      "An unhandled exception for a specific data case",
    ],
    exampleResolution: "Logs showed a null-value exception introduced in yesterday's deployment; a hotfix resolved it.",
    documentationNotes: "Document the exact input that triggers it, the log evidence, and the fix/deployment that resolved it.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1004",
    title: "Several employees cannot reach an internal server",
    department: "Multiple departments",
    problem:
      "Multiple employees across different desks report they cannot access a shared internal system; it times out for everyone.",
    impact: "Widespread — several teams unable to use a shared system.",
    status: "Escalated",
    plausibleTeams: ["infrastructure", "support-network"],
    recommendedTeam: "infrastructure",
    reasoning:
      "Multiple users failing to reach the same server (not just one network segment) points toward the server itself being down or overloaded — an Infrastructure issue. Support & Network would be involved first to rule out a shared network path, but the underlying fix is likely Infrastructure's.",
    suggestedTroubleshooting: [
      "Confirm it's the same server for all affected users (not a coincidence of separate issues).",
      "Check if affected users share a network segment/site (network cause) or are spread across sites (server cause).",
      "Check the server's health — is it up, is it responding, is it under heavy load?",
      "Check recent changes: patches, restarts, config changes on that server.",
    ],
    escalationNote:
      "This ticket already shows signs of needing escalation from Support & Network to Infrastructure due to the widespread, cross-site impact.",
    likelyRootCauses: [
      "The server is down or unresponsive",
      "The server is overloaded and timing out under load",
      "A shared network path to the server is degraded",
    ],
    exampleResolution: "The server had run out of available memory and was restarted; monitoring thresholds were adjusted to alert earlier next time.",
    documentationNotes:
      "Document impact scope (which teams/sites), root cause, and any monitoring/alerting changes made to catch it earlier.",
    hasMultipleCauses: true,
  },
  {
    id: "TCK-1005",
    title: "Office printer is offline",
    department: "Sales",
    problem: "A shared office printer shows as offline and nobody in the department can print.",
    impact: "One department unable to print documents.",
    status: "Open",
    plausibleTeams: ["support-network"],
    recommendedTeam: "support-network",
    reasoning: "Printer connectivity issues are a routine first-line Support & Network ticket.",
    suggestedTroubleshooting: [
      "Check if the printer has power and is connected to the network.",
      "Ping the printer's IP address to check network reachability.",
      "Check if the print queue on the server is stuck or full.",
      "Restart the printer and/or the print spooler service if needed.",
    ],
    escalationNote: "Escalate to Infrastructure only if the print server itself is down for multiple printers.",
    likelyRootCauses: ["Printer lost network connection", "Print queue stuck", "Printer powered off or in error state"],
    exampleResolution: "Printer had dropped off Wi-Fi after a power cycle; reconnecting it to the network resolved the issue.",
    documentationNotes: "Note printer ID/location and the specific fix so recurring printer issues can be tracked.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1006",
    title: "User cannot connect through VPN while working remotely",
    department: "IT",
    problem: "A remote employee reports the VPN client fails to connect, showing a timeout error.",
    impact: "One remote employee unable to access internal systems.",
    status: "Open",
    plausibleTeams: ["support-network"],
    recommendedTeam: "support-network",
    reasoning: "VPN connectivity issues for remote access are owned by Support & Network.",
    suggestedTroubleshooting: [
      "Confirm the employee's internet connection is otherwise working.",
      "Check if the VPN service/gateway is having a wider outage affecting other remote users.",
      "Verify the employee's VPN credentials/certificate haven't expired.",
      "Try an alternate VPN gateway/server if available.",
    ],
    escalationNote: "Escalate to Infrastructure if the VPN gateway server itself appears down for all remote users.",
    likelyRootCauses: ["Expired VPN credentials/certificate", "Local internet issue", "VPN gateway outage"],
    exampleResolution: "The employee's VPN certificate had expired; reissuing it resolved the connection.",
    documentationNotes: "Record whether this was isolated or part of a wider VPN issue, and the exact fix applied.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1007",
    title: "Business application is extremely slow during peak hours",
    department: "Customer Service",
    problem:
      "Employees report a core business application becomes very slow to respond every day between 9–11am, but works fine otherwise.",
    impact: "Reduced productivity for the whole Customer Service team during peak hours.",
    status: "In Progress",
    plausibleTeams: ["applications", "infrastructure", "support-network"],
    recommendedTeam: "applications",
    reasoning:
      "This looks application-related since it's tied to usage patterns (peak hours = peak load on the app/database), but it genuinely could be a server resource issue (Infrastructure) or a network bottleneck (Support & Network) — this is exactly the kind of ticket that needs investigation before assuming which team owns the fix.",
    suggestedTroubleshooting: [
      "Correlate the slowdown with user load, CPU/memory on the app server, and database query times.",
      "Check application logs for slow queries or timeouts during the peak window.",
      "Check server resource monitoring (CPU/memory/disk I/O) for the same time window.",
      "Rule out network congestion by checking latency to the application during peak hours.",
    ],
    escalationNote:
      "If server resource monitoring shows the bottleneck (e.g. CPU maxed out), this becomes an Infrastructure-led fix even though Applications investigates first.",
    likelyRootCauses: [
      "Inefficient database queries under peak load",
      "Underprovisioned server resources for peak traffic",
      "Network congestion at peak usage times",
    ],
    exampleResolution:
      "Investigation found a slow, unindexed database query that only became a bottleneck under peak load; adding an index resolved it.",
    documentationNotes: "Document the investigation trail across teams — this is a good example of a ticket needing cross-team collaboration.",
    hasMultipleCauses: true,
  },
  {
    id: "TCK-1008",
    title: "Internal website fails to load with a DNS-style error",
    department: "Marketing",
    problem:
      "Several employees report an internal website address won't load, showing a \"server not found\" style error in the browser.",
    impact: "A department-wide internal tool is unreachable.",
    status: "Open",
    plausibleTeams: ["support-network"],
    recommendedTeam: "support-network",
    reasoning:
      "A \"server not found\" browser error for a working internal address, affecting multiple users, is a classic symptom of a DNS resolution problem — owned by Support & Network.",
    suggestedTroubleshooting: [
      "Try reaching the internal system by its IP address directly instead of its name.",
      "Check if the issue affects all employees or only some (site/segment-specific DNS server).",
      "Check the DNS server's health and recent configuration changes.",
      "Flush local DNS cache on an affected machine as a quick test.",
    ],
    escalationNote: "Escalate to Infrastructure if the DNS server itself needs to be restarted or rebuilt.",
    likelyRootCauses: ["DNS record misconfigured or missing", "DNS server outage", "Stale DNS cache on affected machines"],
    exampleResolution: "A DNS record had been accidentally removed during maintenance; re-adding it resolved access for everyone.",
    documentationNotes: "Record which DNS record/server was affected and the change that caused it, to prevent repeat incidents.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1009",
    title: "Employee does not have permission to access a shared folder",
    department: "Legal",
    problem: "An employee reports they get \"access denied\" trying to open a shared folder they say they need for their role.",
    impact: "One employee unable to access files needed for their work.",
    status: "Open",
    plausibleTeams: ["infrastructure", "applications"],
    recommendedTeam: "infrastructure",
    reasoning:
      "Shared folder / file-system permissions are typically an Infrastructure identity & access matter. If it turned out to be permission within a specific business application instead of a file share, it would shift to Applications — worth confirming which system is actually involved before assigning.",
    suggestedTroubleshooting: [
      "Confirm exactly which resource is being accessed — a network file share, or a permission inside an application?",
      "Check the employee's current group memberships against what's required for that resource.",
      "Confirm with the employee's manager whether access should be granted (authorization, not just a technical fix).",
      "Grant the correct access and verify the employee can now open the resource.",
    ],
    escalationNote: "If this is actually an application-level permission (not a file share), reroute to Applications.",
    likelyRootCauses: [
      "Employee was never added to the required access group",
      "A recent role change wasn't reflected in access group membership",
      "Access request was approved but not yet actioned",
    ],
    exampleResolution: "Employee was missing from the relevant access group after a recent role change; adding them resolved it.",
    documentationNotes: "Document manager approval and the exact group/permission granted — access changes should always be traceable.",
    hasMultipleCauses: true,
  },
  {
    id: "TCK-1010",
    title: "Application cannot connect to its database",
    department: "Finance",
    problem: "A finance reporting application shows a \"database connection failed\" error whenever anyone tries to run a report.",
    impact: "Finance team cannot generate any reports until resolved.",
    status: "Escalated",
    plausibleTeams: ["applications", "infrastructure"],
    recommendedTeam: "applications",
    reasoning:
      "Applications typically investigates first since the error surfaces in the app, but the actual cause could be the database server being down (Infrastructure) or the application's connection configuration/credentials being wrong (Applications) — genuinely ambiguous until investigated.",
    suggestedTroubleshooting: [
      "Check if the database server itself is up and reachable (ping/connect directly, bypassing the app).",
      "Check the application's database connection string/credentials for recent changes.",
      "Check database server logs for refused connections or resource exhaustion.",
      "Check whether other applications using the same database are also affected.",
    ],
    escalationNote:
      "If the database server itself is down or unreachable, escalate to Infrastructure; if it's a config/credentials issue, it stays with Applications.",
    likelyRootCauses: [
      "Database server is down or unreachable",
      "Application's database credentials expired or changed",
      "Database connection pool exhausted",
    ],
    exampleResolution: "A scheduled credential rotation on the database wasn't updated in the application's configuration; updating it restored the connection.",
    documentationNotes: "Document exactly where in the chain the failure was (app config vs database server) — important for the postmortem.",
    hasMultipleCauses: true,
  },
  {
    id: "TCK-1011",
    title: "Laptop has intermittent connectivity issues",
    department: "Procurement",
    problem: "An employee's laptop repeatedly drops its network connection throughout the day, both on Wi-Fi and when docked.",
    impact: "One employee experiencing repeated work interruptions.",
    status: "Open",
    plausibleTeams: ["support-network"],
    recommendedTeam: "support-network",
    reasoning: "A single device's intermittent connectivity across both Wi-Fi and wired connections is a first-line device/network troubleshooting case.",
    suggestedTroubleshooting: [
      "Check if the issue happens only on Wi-Fi, only when docked, or both (narrows down hardware vs network).",
      "Update or reinstall the network adapter driver.",
      "Test the laptop on a different network drop / access point to isolate device vs environment.",
      "Check for a faulty dock or cable if wired connections are also affected.",
    ],
    escalationNote: "Escalate to Infrastructure only if it turns out to be a wider network switch issue affecting that whole area.",
    likelyRootCauses: ["Outdated/faulty network driver", "Faulty docking station", "Local Wi-Fi interference"],
    exampleResolution: "A driver update for the laptop's network adapter resolved the intermittent drops.",
    documentationNotes: "Record whether it was hardware- or driver-related, since it affects whether a device swap is needed.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1012",
    title: "New deployment introduced a bug in an internal tool",
    department: "IT",
    problem: "Shortly after a scheduled release, users report a previously working feature in an internal tool now throws errors.",
    impact: "A specific feature is broken for all users of the internal tool.",
    status: "In Progress",
    plausibleTeams: ["applications"],
    recommendedTeam: "applications",
    reasoning: "A regression appearing right after a deployment is a textbook Applications issue tied to the software release process.",
    suggestedTroubleshooting: [
      "Confirm the timing correlation between the deployment and the first error reports.",
      "Review what changed in the deployment (release notes / change log).",
      "Reproduce the issue in a test environment using the new version.",
      "Consider rolling back the deployment if a quick fix isn't available.",
    ],
    escalationNote: "No escalation typically needed unless the rollback itself requires Infrastructure support.",
    likelyRootCauses: ["Untested code path in the new release", "Missing configuration change that should have shipped with the release", "Incompatible change to a shared component"],
    exampleResolution: "The deployment had missed a required configuration update; applying it and redeploying fixed the feature.",
    documentationNotes: "Document the root cause and add a check to the deployment process to prevent recurrence.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1013",
    title: "Backup job failed silently for a week",
    department: "IT",
    problem: "A routine audit discovers that a server's scheduled backup job has been failing every night for the past week without triggering any alert.",
    impact: "A week of backup coverage is missing for that server — no immediate outage, but real risk if data is lost now.",
    status: "Open",
    plausibleTeams: ["infrastructure"],
    recommendedTeam: "infrastructure",
    reasoning: "Backup jobs, monitoring, and alerting for servers are core Infrastructure responsibilities.",
    suggestedTroubleshooting: [
      "Check the backup job logs to find why it's been failing (storage full, credentials expired, target unreachable).",
      "Check why the failure alert didn't fire — is monitoring itself misconfigured?",
      "Run a manual backup immediately to restore coverage.",
      "Fix the underlying cause and confirm the next scheduled run succeeds.",
    ],
    escalationNote: "No escalation needed — this stays within Infrastructure, but should be flagged as a monitoring gap once resolved.",
    likelyRootCauses: ["Backup storage target ran out of space", "Backup credentials expired", "Alerting rule for backup failures was misconfigured"],
    exampleResolution: "The backup storage target had filled up; freeing space and re-running the backup restored coverage, and the alert rule was fixed.",
    documentationNotes: "This is a good example of documenting both the fix AND the monitoring gap that let it go unnoticed for a week.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1014",
    title: "Two integrated systems have fallen out of sync",
    department: "Operations",
    problem: "Data entered in one business system isn't appearing in a second system it's supposed to sync with, and nobody was alerted.",
    impact: "Operations team is working with inconsistent data across two systems.",
    status: "Open",
    plausibleTeams: ["applications"],
    recommendedTeam: "applications",
    reasoning: "Integration/sync failures between two business applications are an Applications responsibility.",
    suggestedTroubleshooting: [
      "Check the integration/API logs for failed sync calls around when the discrepancy started.",
      "Manually trigger a sync and observe whether it succeeds or fails.",
      "Check if one of the two systems had a recent change (API version, schema, credentials) that broke the integration.",
      "Estimate how much data is out of sync and whether a backfill is needed.",
    ],
    escalationNote: "Escalate to Infrastructure only if the sync failure is due to one system's server being unreachable.",
    likelyRootCauses: ["An API call in the integration started silently failing", "A schema/field change on one side broke the mapping", "Expired API credentials between the two systems"],
    exampleResolution: "One system's API had deprecated a field the integration relied on; updating the integration's mapping and backfilling missed data resolved it.",
    documentationNotes: "Document the sync gap window and how the backfill was verified for completeness.",
    hasMultipleCauses: false,
  },
  {
    id: "TCK-1015",
    title: "Monitoring alert: sustained high CPU usage on a server",
    department: "IT",
    problem: "An automated monitoring alert fires for a server showing sustained high CPU usage over the last 30 minutes, but no users have reported problems yet.",
    impact: "No confirmed user impact yet — investigating before it becomes one.",
    status: "In Progress",
    plausibleTeams: ["infrastructure"],
    recommendedTeam: "infrastructure",
    reasoning: "Server-level resource monitoring and response is core Infrastructure work, and catching this before it causes an outage is exactly the point of proactive monitoring.",
    suggestedTroubleshooting: [
      "Identify which process(es) are consuming the CPU.",
      "Check if this correlates with a scheduled job, a deployment, or unusual traffic.",
      "Decide whether to let it run, restart the process, or scale up resources.",
      "Confirm no other systems depending on this server are being affected.",
    ],
    escalationNote: "Escalate to Applications if the high-CPU process turns out to be application code needing a fix rather than an infra-level issue.",
    likelyRootCauses: ["A runaway or stuck process", "An unusually large scheduled batch job", "A genuine increase in legitimate load"],
    exampleResolution: "A stuck background process was identified and safely restarted, returning CPU usage to normal before any user-facing impact occurred.",
    documentationNotes: "Document this as a proactive catch — good example of monitoring working as intended.",
    hasMultipleCauses: false,
  },
];

export function getTicketById(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === id);
}

/**
 * Tickets relevant to a team, for the Team page's "Common Training Tickets" section.
 * Filters the existing ticket bank rather than duplicating ticket data per team.
 */
export function getTicketsForTeam(teamId: TeamId, limit = 4): Ticket[] {
  return tickets
    .filter((t) => t.recommendedTeam === teamId || t.plausibleTeams.includes(teamId))
    .slice(0, limit);
}
