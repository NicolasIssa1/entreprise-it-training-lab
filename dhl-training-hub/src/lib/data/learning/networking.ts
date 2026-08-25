import { LearningTopic } from "@/lib/types";

// General enterprise networking knowledge — not DHL-specific. See root CLAUDE.md.
export const networkingTopics: LearningTopic[] = [
  {
    id: "ip-address",
    title: "IP Address",
    category: "Networking",
    shortDescription: "A numeric address that identifies a device on a network, so other devices know where to send data.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    simpleExplanation: "An IP address is a number that identifies a device on a network, similar to a street address for mail.",
    eli10: "An IP address is like a house address. Without it, a letter (data) has no way to know which house (device) to go to.",
    technicalExplanation:
      "Devices on a network communicate using IP addresses, which can be assigned statically (fixed, manually set) or dynamically (via DHCP, from a pool, often changing over time). Private networks typically use private address ranges, translated to public addresses at the network boundary.",
    businessPurpose:
      "Every device — laptops, servers, printers — needs a valid IP address to communicate at all. Addressing problems can look like \"nothing works\" from a user's perspective, even though most of the network is healthy.",
    commonProblems: [
      "A device fails to get an IP address and shows no network connectivity at all.",
      "Two devices are accidentally assigned the same IP address, causing intermittent conflicts.",
      "A device holds onto an old/incorrect IP address after a network change.",
    ],
    troubleshootingSteps: [
      "Check whether the device has a valid IP address at all, or a self-assigned/fallback one.",
      "Check whether this is one device or many — one suggests a device issue, many suggests a shared cause.",
      "Try releasing and renewing the address (re-requesting from DHCP) as a first test.",
      "Compare against a known-working device on the same network.",
      "Escalate if the issue points to the DHCP service or network infrastructure itself.",
    ],
    universityConnections: [
      { area: "Networking", connection: "IP addressing, subnetting, and address allocation are foundational networking topics." },
      { area: "Operating Systems", connection: "The OS network stack is what requests, holds, and uses the IP address." },
    ],
    practiceScenario: {
      scenario: "A laptop shows \"no internet access\" and its IP address starts with 169.254.",
      question: "What does that specific address range suggest, and what would you check next?",
      guidance:
        "A 169.254.x.x address is a self-assigned fallback address a device uses when it couldn't get a real address from DHCP — it suggests a DHCP/network problem, not a general internet outage. Next: check whether other devices on the same network are affected, and try renewing the address.",
    },
    questionToAskAtWork: "How are IP addresses typically assigned here — mostly dynamic, or are some devices static?",
    relatedTopicIds: ["dhcp", "dns", "vpn"],
  },
  {
    id: "dns",
    title: "DNS",
    category: "Networking",
    shortDescription: "The system that converts names like example.com into the IP addresses computers actually use.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    simpleExplanation: "DNS converts names such as example.com into IP addresses computers can use.",
    eli10: "DNS is similar to your phone contacts. You remember a person's name, while your phone remembers the number.",
    technicalExplanation:
      "When a device needs to reach a named service, it queries a DNS server, which resolves the name to an IP address (possibly via several steps/servers). Internal company services often have their own internal DNS records, separate from public internet DNS.",
    businessPurpose:
      "A DNS outage can make otherwise healthy systems appear unavailable because users cannot resolve service names — the server itself might be perfectly fine, but nobody can find it by name.",
    commonProblems: [
      "A DNS record is missing, wrong, or was accidentally removed during maintenance.",
      "A DNS server itself becomes slow or unavailable, delaying every lookup that depends on it.",
      "A device has a stale cached DNS entry after a change was made.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is this everyone, or one user/device?",
      "Check whether the hostname resolves at all — try a DNS lookup directly.",
      "Test whether the target is reachable by IP address instead of hostname, to isolate DNS from the underlying service.",
      "Check which DNS server the device is configured to use.",
      "Compare against another working device on the same network.",
      "Escalate if the DNS service itself appears unavailable, rather than one record being wrong.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Name resolution, DNS hierarchy, and caching are core networking curriculum topics." },
      { area: "Operating Systems", connection: "DNS resolution and caching happen through the OS's resolver and network stack on each device." },
    ],
    practiceScenario: {
      scenario: "An employee can access a server by IP address but not by hostname.",
      question: "What would you investigate first?",
      guidance:
        "Since it works by IP but not by name, the server itself is reachable — the problem is specifically in name resolution. Check whether the hostname resolves at all, which DNS server is configured, and whether other devices can resolve it. If nobody can resolve it, suspect the DNS record or server; if it's just this device, suspect its configuration or cache.",
    },
    questionToAskAtWork: "When DNS-related tickets are escalated here, which team normally takes ownership?",
    relatedTopicIds: ["ip-address", "dhcp", "vpn"],
  },
  {
    id: "dhcp",
    title: "DHCP",
    category: "Networking",
    shortDescription: "The service that automatically hands out IP addresses to devices when they join a network.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    simpleExplanation: "DHCP automatically gives devices an IP address (and other network settings) when they connect to a network, so nobody has to configure it by hand.",
    eli10: "DHCP is like a coat check at an event. You hand in your coat (device joins the network), and you're automatically given a numbered ticket (IP address) — you didn't have to pick your own number.",
    technicalExplanation:
      "A DHCP server leases IP addresses (and settings like the default gateway and DNS servers) to devices for a limited time, renewing the lease periodically. If DHCP is unavailable or its address pool is exhausted, new devices can't get a working address.",
    businessPurpose:
      "DHCP failing means new or reconnecting devices can't get on the network at all — a DHCP outage can look like a total network outage to affected users, even though switches/routers are fine.",
    commonProblems: [
      "The DHCP server's pool of available addresses runs out, so new devices can't get one.",
      "The DHCP service itself goes down, and devices reconnecting can't renew their lease.",
      "A misconfigured DHCP setting (e.g. wrong DNS server handed out) causes downstream problems that look unrelated to DHCP.",
    ],
    troubleshootingSteps: [
      "Check whether the affected device has any IP address at all, or a fallback/self-assigned one.",
      "Check whether this is isolated to one device or affecting many devices on the same network.",
      "Try manually releasing and renewing the device's address.",
      "Check whether the DHCP service is reachable and has available addresses left in its pool.",
      "Escalate if the DHCP service itself appears down or exhausted.",
    ],
    universityConnections: [
      { area: "Networking", connection: "DHCP is a standard protocol covered in most networking courses." },
      { area: "Operating Systems", connection: "The OS network stack requests and manages the DHCP lease automatically." },
    ],
    practiceScenario: {
      scenario: "Several new laptops added to the office today can't get online, while existing laptops still work fine.",
      question: "What would make you suspect a DHCP issue specifically?",
      guidance:
        "New devices failing while existing (already-connected) devices keep working points at address assignment, not general connectivity — existing devices already have a lease and aren't requesting a new one yet. Checking whether the DHCP pool has run out of available addresses would be a strong next step.",
    },
    questionToAskAtWork: "Is DHCP managed centrally here, or per site/location?",
    relatedTopicIds: ["ip-address", "dns", "vpn"],
  },
  {
    id: "vpn",
    title: "VPN",
    category: "Networking",
    shortDescription: "A secure, encrypted connection that lets a remote device reach a company's private network as if it were local.",
    primaryTeam: "support-network",
    relatedTeams: ["applications"],
    simpleExplanation: "A VPN (Virtual Private Network) creates a secure connection between a device and a company's network over the internet, so someone working remotely can reach internal systems safely.",
    eli10: "A VPN is like a secure private tunnel between your laptop and the company.",
    technicalExplanation:
      "A VPN client establishes an encrypted tunnel to a VPN gateway, after authenticating the user/device. Once connected, the device can reach internal resources as though it were on the company's local network. VPN issues can stem from authentication, the client, the network path, or the gateway itself.",
    businessPurpose:
      "VPNs let remote and traveling employees securely access internal systems; when VPN access fails, affected employees may be unable to do most of their job at all, even though nothing at the office is actually broken.",
    commonProblems: [
      "A user's VPN credentials or certificate expire, blocking their connection.",
      "The VPN gateway itself becomes overloaded or unavailable, affecting many remote users at once.",
      "A user's local internet connection is the real problem, not the VPN.",
    ],
    troubleshootingSteps: [
      "Confirm the user's general internet connection works independently of the VPN.",
      "Check whether this is isolated to one user or affecting many remote users at once.",
      "Check whether the user's VPN credentials/certificate are valid and not expired.",
      "Try an alternate VPN gateway/server if one is available, to isolate a gateway-specific issue.",
      "Escalate to the team managing the VPN gateway if it appears to be a service-wide problem.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Tunneling and remote access are core networking topics." },
      { area: "Secure Computing", connection: "VPNs rely on authentication and encryption — directly relevant to secure systems design." },
    ],
    practiceScenario: {
      scenario: "A remote employee's VPN client shows a timeout error when trying to connect.",
      question: "What would you rule out before assuming the VPN gateway itself is down?",
      guidance:
        "First rule out the basics: is their general internet connection working at all? Are their VPN credentials/certificate still valid? Is anyone else currently failing to connect to the same gateway? Only after ruling those out would a gateway-wide outage be the leading suspect.",
    },
    questionToAskAtWork: "When VPN issues are reported, how do you tell a credentials problem apart from a gateway/service problem?",
    relatedTopicIds: ["ip-address", "dns", "authentication"],
  },
];
