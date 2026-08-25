import { LearningTopic } from "@/lib/types";

// General enterprise networking knowledge — not DHL-specific. See root CLAUDE.md.
export const networkingTopics: LearningTopic[] = [
  {
    id: "ip-address",
    title: "IP Address",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A numeric address that identifies a device on a network, so other devices know where to send data.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what an IP address is for",
      "Recognize a self-assigned (169.254.x.x) address as a DHCP symptom",
      "Distinguish static from dynamic addressing",
    ],
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
    relatedTopicIds: ["dhcp", "dns", "subnet", "nat"],
    keywords: ["IP", "addressing"],
    prerequisiteTopicIds: [],
  },
  {
    id: "dns",
    title: "DNS",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "The system that converts names like example.com into the IP addresses computers actually use.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what DNS resolves and why it's needed",
      "Use IP-vs-hostname testing to isolate a DNS problem",
      "Identify when a DNS problem is local (one device) versus service-wide",
    ],
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
    keywords: ["domain name", "hostname", "name resolution"],
    prerequisiteTopicIds: ["ip-address"],
  },
  {
    id: "dhcp",
    title: "DHCP",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "The service that automatically hands out IP addresses to devices when they join a network.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what DHCP automates",
      "Recognize new-devices-only symptoms as a DHCP pool clue",
      "Explain what a lease is",
    ],
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
    keywords: ["lease", "address pool", "auto-configuration"],
  },
  {
    id: "vpn",
    title: "VPN",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A secure, encrypted connection that lets a remote device reach a company's private network as if it were local.",
    primaryTeam: "support-network",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain what a VPN provides that a normal internet connection doesn't",
      "Apply Scope/Isolate to a VPN complaint (credentials vs. gateway vs. internet)",
      "Recognize when VPN issues affect one user versus many",
    ],
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
    relatedTopicIds: ["ip-address", "dns", "authentication", "firewall"],
    keywords: ["remote access", "tunnel"],
  },
  {
    id: "router",
    title: "Router",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A device that connects different networks together and directs traffic between them.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a router does",
      "Distinguish a router's job from a switch's job",
      "Recognize routing as a plausible cause when traffic between sites fails",
    ],
    simpleExplanation: "A router connects different networks together and decides how to forward traffic between them — for example, between an office network and the internet.",
    eli10: "A router is like a postal sorting hub between cities. It looks at where something's headed and sends it down the right road to get there.",
    technicalExplanation:
      "Routers operate primarily by forwarding traffic based on IP addresses between distinct networks (e.g. between a company's internal network and the internet, or between two office sites). This is different from a switch, which primarily connects devices within a single local network.",
    businessPurpose:
      "Routers are what let a company's internal network actually reach the outside world (and connect separate office sites together) — a routing failure can isolate an entire location even if every device inside it is working fine.",
    commonProblems: [
      "A router misconfiguration blocks traffic to a specific external destination while everything else works.",
      "A router failure isolates an entire site from other sites or the internet.",
      "Routing changes made for one purpose unintentionally affect an unrelated traffic path.",
    ],
    troubleshootingSteps: [
      "Confirm scope: is this affecting one destination, one site, or everything?",
      "Distinguish a routing problem (can't reach other networks) from a local connectivity problem (can't reach anything, even locally).",
      "Check for recent routing/configuration changes.",
      "Escalate to whoever manages the router/network infrastructure if the issue is beyond basic diagnosis.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Routing and IP forwarding between networks are core networking curriculum topics." },
      { area: "Algorithms", connection: "Routing decisions are based on algorithms (e.g. shortest-path style logic) even in simplified enterprise setups." },
    ],
    practiceScenario: {
      scenario: "An entire branch office suddenly can't reach the company's main systems or the internet, but devices within the office can still reach each other.",
      question: "Does this sound like a router problem or a switch problem, and why?",
      guidance:
        "Local connectivity (devices reaching each other) still working, but everything beyond the site failing, points toward the router — the device responsible for connecting this network to others — rather than the switch, which handles only local device-to-device connectivity.",
    },
    questionToAskAtWork: "How many layers of routing exist between a typical office device and an external service here?",
    relatedTopicIds: ["switch", "subnet", "nat"],
    keywords: ["routing", "gateway", "WAN link"],
    dontConfuseWith: [
      { topicId: "switch", note: "A switch primarily connects devices within a network; a router connects different networks and routes traffic between them." },
    ],
  },
  {
    id: "switch",
    title: "Switch",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "A device that connects devices within a local network, so they can send data directly to each other.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a switch does within a local network",
      "Distinguish a switch problem from a router problem",
      "Recognize a single-desk connectivity symptom as a possible switch-port issue",
    ],
    simpleExplanation: "A switch connects devices within the same local network — like the computers, printers, and phones in one office — so they can communicate directly.",
    eli10: "A switch is like a power strip for network cables. It gives many devices in the same room a shared, direct way to plug in and talk to each other.",
    technicalExplanation:
      "Switches operate primarily within a single local network, forwarding traffic between connected devices based on their network hardware addresses. Unlike a router, a switch doesn't typically make decisions about reaching other, separate networks — that's the router's job.",
    businessPurpose:
      "Nearly every wired device in an office connects through a switch — a failed switch or switch port can cut off connectivity for everyone plugged into it, even though the rest of the network is fine.",
    commonProblems: [
      "A single switch port fails, cutting off just the one device plugged into it.",
      "An entire switch fails, taking down every device connected to it at once.",
      "A cable or port issue is mistaken for a broader network outage.",
    ],
    troubleshootingSteps: [
      "Check whether the problem affects one desk/device or many devices on the same switch.",
      "Try a different cable or port to rule out a simple physical fault.",
      "If many devices on the same switch are affected, suspect the switch itself.",
      "Escalate to the team managing network hardware if the switch itself needs replacing or reconfiguring.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Layer 2 switching and local network forwarding are standard networking curriculum topics." },
      { area: "Computer Architecture", connection: "Understanding how hardware-level addressing works underpins how switches forward traffic." },
    ],
    practiceScenario: {
      scenario: "A new desk has no network connectivity, while every other desk in the same area works fine.",
      question: "What would you check first, given it's isolated to one desk?",
      guidance:
        "Start local: check the cable and the specific switch port that desk connects to, since a single-desk symptom (versus everyone in the area) points toward something specific to that connection rather than a broader network or router issue.",
    },
    questionToAskAtWork: "How are switch/port issues typically diagnosed here — remotely, or does someone need to check physically?",
    relatedTopicIds: ["router", "vlan", "ip-address"],
    keywords: ["Layer 2", "port", "local network"],
    dontConfuseWith: [
      { topicId: "router", note: "A switch connects devices within a network; a router connects different networks and routes traffic between them." },
    ],
  },
  {
    id: "firewall",
    title: "Firewall",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 6,
    shortDescription: "A system that allows or denies network traffic based on defined rules/policy.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a firewall rule does",
      "Recognize a firewall as a plausible cause when specific traffic is blocked but most traffic works",
      "Explain why firewall changes go through review",
    ],
    simpleExplanation: "A firewall controls network traffic by allowing or denying it based on rules — like which destinations, ports, or types of traffic are permitted.",
    eli10: "A firewall is like a guest list at a private event. Only people (traffic) matching the list get let in; everyone else is turned away at the door.",
    technicalExplanation:
      "Firewalls apply rules (often based on source/destination address, port, or protocol) to decide whether to allow or block traffic, and can sit at a network boundary or on individual devices. A common troubleshooting signature is traffic to most destinations working normally while one specific destination or port is blocked.",
    businessPurpose:
      "Firewalls protect a company's network from unwanted or malicious traffic, but overly restrictive or misconfigured rules can also block legitimate business traffic — like an application that needs to reach an external partner service.",
    commonProblems: [
      "A legitimate application or integration is blocked because a required rule was never added.",
      "A rule change made for security reasons unexpectedly blocks something business-critical.",
      "Traffic is intermittently blocked because of rule ordering or overlapping rules.",
    ],
    troubleshootingSteps: [
      "Confirm the specific traffic that's failing (source, destination, port) rather than assuming \"the network\" broadly.",
      "Check whether other traffic to/from the same systems works, narrowing it to something specific.",
      "Check for recent firewall rule changes around when the issue started.",
      "Escalate to whoever manages firewall policy — rule changes should go through review, not be made ad hoc.",
    ],
    universityConnections: [
      { area: "Secure Computing", connection: "Firewalls are a foundational network security control." },
      { area: "Networking", connection: "Understanding ports and protocols is necessary to reason about firewall rules." },
    ],
    practiceScenario: {
      scenario: "An internal application can reach every other system it needs except one external partner API, which times out.",
      question: "What would make you suspect a firewall rule rather than the partner API itself?",
      guidance:
        "Everything else working normally, with only this one specific destination failing, is a classic firewall-blocking pattern — worth checking whether a rule permits traffic to that specific destination/port before assuming the partner's service is at fault.",
    },
    questionToAskAtWork: "How are firewall rule change requests reviewed and approved here?",
    relatedTopicIds: ["vpn", "proxy", "change-management"],
    keywords: ["network security", "rules", "blocked traffic"],
  },
  {
    id: "subnet",
    title: "Subnet",
    category: "Networking",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "A logical subdivision of a network — dividing one address space into smaller, manageable segments.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain why networks are divided into subnets",
      "Recognize that two devices on different subnets need a router to communicate",
      "Connect subnetting to IP addressing",
    ],
    simpleExplanation: "A subnet is a logical subdivision of a larger network — splitting one address range into smaller segments, often for organization, security, or traffic management.",
    eli10: "If a whole company network is a city, subnets are its neighborhoods — each with its own defined boundary, making the city easier to organize and manage than one undivided sprawl.",
    technicalExplanation:
      "Subnetting divides an IP address range into smaller blocks, each acting as its own local network segment. Devices within the same subnet can typically communicate directly; reaching a device on a different subnet requires a router, even if both are on the same overall company network.",
    businessPurpose:
      "Subnetting lets a company organize its network logically — separating departments, sites, or types of devices — and contain the impact of network issues to a smaller segment rather than the whole company network.",
    commonProblems: [
      "A device is configured with the wrong subnet settings and can't reach devices it should be able to.",
      "Two subnets that should be able to communicate can't, because routing between them isn't configured.",
      "A subnet runs out of available addresses as more devices are added.",
    ],
    troubleshootingSteps: [
      "Confirm which subnet the affected device(s) are on.",
      "Check whether the issue is reaching devices within the same subnet, or only across subnets.",
      "If cross-subnet, check that routing between the subnets is correctly configured.",
      "Escalate to network infrastructure if subnet configuration itself needs changing.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Subnetting and IP address allocation are core, commonly-tested networking curriculum topics." },
      { area: "Algorithms", connection: "Calculating subnet ranges involves binary/bitwise reasoning over addresses." },
    ],
    practiceScenario: {
      scenario: "A user in one office area can reach colleagues' machines nearby but not a server used company-wide.",
      question: "Could a subnet boundary explain this, and how would you check?",
      guidance:
        "Yes — if the user's device and the server are on different subnets, reaching the server requires routing between subnets to be correctly configured, whereas reaching nearby colleagues (likely the same subnet) doesn't. Checking which subnet each side is on, and whether routing between them works, would confirm or rule this out.",
    },
    questionToAskAtWork: "How is the network here divided into subnets — by site, by department, or another approach?",
    relatedTopicIds: ["ip-address", "vlan", "router"],
    keywords: ["network segment", "CIDR", "address range"],
    prerequisiteTopicIds: ["ip-address"],
  },
  {
    id: "vlan",
    title: "VLAN",
    category: "Networking",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "A logical network segmentation technique — grouping devices as if on separate networks, without separate physical cabling.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what a VLAN accomplishes",
      "Recognize a VLAN misconfiguration as a possible cause of same-building connectivity gaps",
      "Distinguish VLANs from subnets conceptually",
    ],
    simpleExplanation: "A VLAN (Virtual LAN) logically groups devices as if they were on a separate network, even if they're physically connected to the same switches and cabling.",
    eli10: "A VLAN is like assigning different floors of one office building to different companies. They share the same building and elevators, but each floor operates as its own separate space.",
    technicalExplanation:
      "VLANs let network administrators segment traffic logically (e.g. separating departments, guest Wi-Fi, or device types) without needing separate physical switches for each group. Devices on different VLANs typically can't communicate directly without routing between them, similar to being on different subnets.",
    businessPurpose:
      "VLANs let a company isolate and organize network traffic for security and manageability — for example, keeping guest Wi-Fi traffic separate from internal corporate systems — without the cost of entirely separate physical network hardware.",
    commonProblems: [
      "A device is assigned to the wrong VLAN and can't reach resources it should have access to.",
      "A VLAN configuration change on a switch unexpectedly isolates a group of devices.",
      "Two devices that should be isolated from each other end up on the same VLAN by mistake.",
    ],
    troubleshootingSteps: [
      "Check which VLAN the affected device is currently on.",
      "Compare against which VLAN it should be on for its intended access.",
      "Check for recent switch/VLAN configuration changes.",
      "Escalate to network infrastructure for VLAN reassignment or configuration fixes.",
    ],
    universityConnections: [
      { area: "Networking", connection: "VLANs are a standard Layer 2 network segmentation concept in networking curricula." },
      { area: "Secure Computing", connection: "Logical segmentation is a common security control for limiting exposure between groups of systems." },
    ],
    practiceScenario: {
      scenario: "After a network change, some devices in one part of a building can't reach others in the same building, despite being physically connected to the same switches.",
      question: "What logical (not physical) explanation would you consider?",
      guidance:
        "A VLAN misconfiguration is a strong candidate — devices can be physically connected to the same hardware but logically separated onto different VLANs, so a recent VLAN assignment change could explain connectivity gaps that don't match the physical cabling layout.",
    },
    questionToAskAtWork: "How many VLANs are in use here, and what's the general logic for how devices get assigned to each?",
    relatedTopicIds: ["switch", "subnet"],
    keywords: ["virtual LAN", "segmentation"],
    prerequisiteTopicIds: ["switch"],
  },
  {
    id: "nat",
    title: "NAT",
    category: "Networking",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "Translating private/internal addresses to other addresses, commonly so internal devices can reach the internet.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what NAT translates and why",
      "Explain why many internal devices can share one public address",
      "Recognize NAT as relevant when troubleshooting external connectivity",
    ],
    simpleExplanation: "NAT (Network Address Translation) translates private, internal IP addresses to a different address — commonly a shared public one — so internal devices can communicate with the internet.",
    eli10: "NAT is like a company's shared reception desk. Many employees inside (private addresses) send mail out through one shared return address (the public one), and the desk keeps track of who gets replies routed back to them.",
    technicalExplanation:
      "Most enterprise networks use private IP address ranges internally, which aren't directly routable on the public internet. NAT, typically performed at the network boundary (often on a router or firewall), translates outgoing traffic to a public address and tracks the mapping so responses are routed back to the correct internal device.",
    businessPurpose:
      "NAT lets a company use a large number of internal devices without needing a unique public IP address for each one, and adds a layer of separation between internal addressing and the public internet.",
    commonProblems: [
      "A NAT configuration issue blocks internal devices from reaching the internet even though internal connectivity works fine.",
      "A service expecting incoming connections from outside doesn't work correctly because NAT wasn't configured to allow it.",
      "Troubleshooting confuses an internal (private) address with the external (translated) address the outside world actually sees.",
    ],
    troubleshootingSteps: [
      "Confirm whether internal connectivity works but external/internet connectivity doesn't (a NAT-boundary symptom).",
      "Check whether the issue is outbound (internal device reaching the internet) or inbound (external reaching an internal service).",
      "Check NAT/firewall configuration at the network boundary for recent changes.",
      "Escalate to network infrastructure for NAT/boundary configuration issues.",
    ],
    universityConnections: [
      { area: "Networking", connection: "NAT is a standard networking curriculum topic covering address translation and IPv4 address conservation." },
      { area: "Computer Architecture", connection: "Understanding address translation tables parallels other translation/mapping mechanisms in computing." },
    ],
    practiceScenario: {
      scenario: "Devices across an office can all reach each other and internal systems, but none of them can reach external websites.",
      question: "What network boundary function would you suspect?",
      guidance:
        "Internal connectivity working but external failing for everyone points toward the network boundary — where NAT and internet routing happen — rather than an internal switch/routing issue, since internal-only communication doesn't rely on NAT at all.",
    },
    questionToAskAtWork: "Where does NAT happen on this network — on the router, the firewall, or somewhere else?",
    relatedTopicIds: ["router", "firewall", "ip-address"],
    keywords: ["address translation", "private IP", "public IP"],
  },
  {
    id: "wifi",
    title: "Wi-Fi / Wireless Networking",
    category: "Networking",
    level: "Foundation",
    estimatedMinutes: 5,
    shortDescription: "Wireless network access — its own layer of potential failure, separate from the wired network behind it.",
    primaryTeam: "support-network",
    relatedTeams: [],
    learningOutcomes: [
      "Explain what a wireless access point does",
      "Recognize signal/interference issues as distinct from wired network issues",
      "Apply scope (one device vs. one area) to a Wi-Fi complaint",
    ],
    simpleExplanation: "Wi-Fi lets devices connect to a network wirelessly through access points, instead of a physical cable.",
    eli10: "Wi-Fi is like a radio station broadcasting the network signal through the air, and your device is the radio tuning in — walls, distance, and interference can all affect how well it comes through.",
    technicalExplanation:
      "Wireless access points bridge wireless devices onto the same underlying network as wired ones, but add their own set of variables: signal strength, interference, access point capacity, and authentication to join the wireless network. A Wi-Fi problem can be wireless-specific even when the wired network behind it is completely healthy.",
    businessPurpose:
      "Most modern offices depend heavily on Wi-Fi for day-to-day connectivity — an access point failure or coverage gap can disconnect an entire area of employees even though the core network is fine.",
    commonProblems: [
      "A specific area has poor or no Wi-Fi coverage due to access point placement or interference.",
      "An access point becomes overloaded with too many connected devices, degrading performance for everyone on it.",
      "A device fails to join Wi-Fi due to an authentication/credentials issue, distinct from a signal problem.",
    ],
    troubleshootingSteps: [
      "Confirm scope: one device, one area, or the whole building?",
      "Distinguish a signal/coverage problem (weak or no connection) from an authentication problem (can't join at all) from a wired-network problem (connected to Wi-Fi but nothing works).",
      "Check whether other devices in the same area have the same issue.",
      "Escalate to whoever manages wireless infrastructure for access-point-level issues.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Wireless networking fundamentals (access points, interference, roaming) are a standard networking topic." },
      { area: "Computer Architecture", connection: "Understanding wireless signal behavior touches on physical-layer concepts." },
    ],
    practiceScenario: {
      scenario: "Employees in one corner of an office report weak or dropped Wi-Fi, while the rest of the building is fine.",
      question: "What would you check first, given it's localized to one area?",
      guidance:
        "Check the access point(s) covering that specific area — coverage gaps, interference, or an overloaded/failing access point are the most likely localized causes, rather than something wrong with the network as a whole.",
    },
    questionToAskAtWork: "How is Wi-Fi coverage/capacity monitored here, and how are dead zones typically identified?",
    relatedTopicIds: ["ip-address", "dhcp"],
    keywords: ["wireless", "access point", "signal"],
  },
  {
    id: "proxy",
    title: "Proxy",
    category: "Networking",
    level: "Intermediate",
    estimatedMinutes: 6,
    shortDescription: "An intermediary that sits between a device and the destination it's trying to reach, for filtering, caching, or control.",
    primaryTeam: "support-network",
    relatedTeams: ["applications"],
    learningOutcomes: [
      "Explain what a proxy does at a basic level",
      "Recognize a proxy as relevant when some external destinations work and others don't",
      "Distinguish a proxy issue from a general connectivity issue",
    ],
    simpleExplanation: "A proxy is an intermediary server that sits between a device and the destination it's trying to reach — requests go through the proxy rather than directly.",
    eli10: "A proxy is like an assistant who makes calls on your behalf. You tell the assistant what you need, they make the call, and bring back the result — the other party talks to the assistant, not directly to you.",
    technicalExplanation:
      "Proxies are commonly used to filter or control outbound traffic (e.g. blocking certain categories of websites), cache frequently requested content, or provide a controlled path to external destinations. A device configured to use a proxy routes its traffic through it, so a proxy outage or misconfiguration can block access even when the underlying internet connection is fine.",
    businessPurpose:
      "Proxies let a company apply consistent policy (what's allowed, what's logged) to outbound traffic, and can reduce external bandwidth use through caching — but they also add a dependency that can itself become a point of failure.",
    commonProblems: [
      "A proxy configuration issue blocks legitimate destinations that should be allowed.",
      "The proxy service itself becomes unavailable, blocking all traffic that depends on it.",
      "A device's proxy settings are wrong or outdated after an infrastructure change.",
    ],
    troubleshootingSteps: [
      "Check whether the affected device is configured to use a proxy at all.",
      "Check whether the issue affects all external destinations or only specific ones (pointing at policy/filtering rather than a full outage).",
      "Test whether the same destination works from a device not using the proxy, to isolate the proxy as the cause.",
      "Escalate to whoever manages the proxy service for configuration or availability issues.",
    ],
    universityConnections: [
      { area: "Networking", connection: "Proxying and intermediary traffic handling are standard networking/systems concepts." },
      { area: "Web Services / REST APIs", connection: "Proxies frequently sit in front of web/API traffic specifically, relevant to how web requests actually travel." },
    ],
    practiceScenario: {
      scenario: "Employees working off-site through a proxy report that some external websites are unreachable, while most others work fine.",
      question: "What would this pattern suggest about the cause?",
      guidance:
        "Some destinations failing while most work suggests a policy/filtering rule at the proxy rather than a general connectivity outage — worth checking whether the blocked destinations are being explicitly filtered rather than assuming the proxy itself is fully down.",
    },
    questionToAskAtWork: "Is proxy usage mandatory for all outbound traffic here, or only in specific situations (like remote access)?",
    relatedTopicIds: ["firewall", "vpn"],
    keywords: ["intermediary", "content filtering", "caching"],
  },
  {
    id: "sd-wan",
    title: "SD-WAN",
    category: "Networking",
    level: "Intermediate",
    estimatedMinutes: 7,
    shortDescription: "A modern, centrally-managed, software-defined approach to connecting multiple office/site networks together.",
    primaryTeam: "support-network",
    relatedTeams: ["infrastructure"],
    learningOutcomes: [
      "Explain what SD-WAN manages at a conceptual level",
      "Explain how it differs from traditional site-to-site networking",
      "Recognize SD-WAN as one modern option among several, not a universal standard",
    ],
    simpleExplanation: "SD-WAN (Software-Defined Wide Area Network) is a modern approach to connecting multiple office/site networks together, managed centrally through software rather than configuring each network link by hand.",
    eli10: "Traditional site-to-site networking is like each store in a chain having its own separately negotiated delivery route. SD-WAN is like a head office managing all delivery routes centrally, able to reroute automatically if one road has a problem.",
    technicalExplanation:
      "SD-WAN centralizes management and monitoring of connections between sites, and can dynamically choose the best available path (e.g. switching between multiple internet/network links) based on current conditions, rather than relying on a single fixed connection per site. It's a widely-used modern enterprise networking approach, not the only option — this is a generic concept, and no assumption should be made about which specific technology any given organization uses.",
    businessPurpose:
      "For companies with many office locations, SD-WAN can improve reliability (automatically routing around a failing link) and simplify management compared to configuring and troubleshooting each site's connectivity individually.",
    commonProblems: [
      "A site's connectivity degrades because the SD-WAN's automatic path selection isn't behaving as expected.",
      "Central configuration changes affect multiple sites at once, unlike traditional per-site setups.",
      "Confusion between an SD-WAN management/control issue and an actual underlying link failure.",
    ],
    troubleshootingSteps: [
      "Confirm scope: one site, several sites, or all sites managed by the SD-WAN?",
      "Check whether this looks like a specific link failure or a broader central management/control issue.",
      "Check for recent centrally-pushed configuration changes.",
      "Escalate to whoever manages the SD-WAN platform, since site-level troubleshooting alone may not surface a central cause.",
    ],
    universityConnections: [
      { area: "Networking", connection: "SD-WAN builds on core WAN and routing concepts with centralized, software-driven management." },
      { area: "Cloud concepts", connection: "SD-WAN often integrates with cloud-hosted management and services, similar to other 'as-a-service' models." },
    ],
    practiceScenario: {
      scenario: "Three office sites managed by the same SD-WAN platform all report connectivity issues starting at the same time.",
      question: "What does the shared timing across multiple sites suggest?",
      guidance:
        "Multiple sites affected at once suggests a central cause — likely something at the SD-WAN management/control layer rather than three coincidental, unrelated local link failures — worth checking the central platform before troubleshooting each site individually.",
    },
    questionToAskAtWork: "Does this organization use SD-WAN or a more traditional site-to-site networking approach?",
    relatedTopicIds: ["router", "firewall"],
    keywords: ["software-defined WAN", "site connectivity"],
    prerequisiteTopicIds: ["router"],
  },
];
