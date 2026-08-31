import { Quiz } from "@/lib/types";

// Fictional, generic scenario-based questions testing applied business/logistics
// judgment — not acronyms or definitions. See root CLAUDE.md.
export const businessLogisticsQuiz: Quiz = {
  id: "quiz-business-logistics-foundation",
  title: "Business & Logistics Foundation Assessment",
  description:
    "Tests understanding of how enterprise IT connects to business processes, plus generic freight-forwarding and logistics fundamentals.",
  category: "Business & Logistics",
  difficulty: "Foundation",
  estimatedMinutes: 12,
  relatedTopicIds: [
    "business-process",
    "freight-forwarding",
    "shipping-parties",
    "shipment-visibility",
    "customs-clearance",
    "exception-management",
    "technical-business-translation",
  ],
  relatedPathIds: ["business-logistics-foundations"],
  passingGuidance:
    "A strong score here suggests you can connect a technical system to the business process it supports and reason about impact, not just recall logistics vocabulary.",
  questions: [
    {
      id: "bl-q1",
      prompt: "What best describes a freight forwarder's role in moving goods internationally?",
      type: "single-choice",
      options: [
        { id: "a", text: "The company that physically owns and operates the ships, planes, or trucks" },
        { id: "b", text: "A coordinator that arranges transport, documentation, customs, and visibility across one or more carriers, without necessarily owning any transport itself" },
        { id: "c", text: "A government agency that inspects goods at the border" },
        { id: "d", text: "The customer requesting the shipment" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "A freight forwarder coordinates the overall movement — transport, documentation, customs, routing, visibility, exceptions — typically without owning the ships, planes, or trucks themselves.",
      misconceptionExplanations: {
        a: "That describes a carrier, not a forwarder — forwarders coordinate; carriers physically transport.",
      },
      relatedTopicIds: ["freight-forwarding"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q2",
      prompt: "A shipment has an ocean leg and a road leg to final delivery. Who is most likely responsible for the ocean leg itself?",
      type: "single-choice",
      options: [
        { id: "a", text: "The freight forwarder, directly and personally" },
        { id: "b", text: "The ocean carrier operating that specific leg" },
        { id: "c", text: "The consignee" },
        { id: "d", text: "Customs authorities" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "The carrier physically transporting a given leg (here, the ocean carrier) is responsible for that leg. The forwarder coordinates across legs and carriers but doesn't typically operate the transport itself.",
      relatedTopicIds: ["shipping-parties", "freight-forwarding"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q3",
      prompt: "An integration that syncs booking data between two systems fails silently overnight. What's the most important thing to determine first?",
      type: "single-choice",
      options: [
        { id: "a", text: "Which programming language the integration was written in" },
        { id: "b", text: "How many bookings are affected, and since when — to understand the actual backlog and business impact" },
        { id: "c", text: "Whether the office Wi-Fi is working" },
        { id: "d", text: "Nothing — silent failures don't need investigation until someone complains" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "For a continuous workflow integration, the backlog size (how much data is missing, and for how long) is what actually determines urgency and business impact — not the technical cause alone.",
      relatedTopicIds: ["operational-workflow", "system-integration"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q4",
      prompt: "A customer's shipment tracking page hasn't updated in three days, but the shipment is actually still moving normally. What does this most likely indicate?",
      type: "single-choice",
      options: [
        { id: "a", text: "The shipment is definitely lost" },
        { id: "b", text: "A visibility/tracking data feed issue, separate from the physical shipment itself" },
        { id: "c", text: "Customs has seized the goods" },
        { id: "d", text: "The carrier has gone out of business" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "A stale tracking page commonly reflects a data/integration problem feeding the tracking system, not necessarily a problem with the physical shipment — these are two separate things worth distinguishing before assuming the worst.",
      relatedTopicIds: ["shipment-visibility"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q5",
      prompt: "Which of these is the clearest example of a business-critical application, all else equal?",
      type: "single-choice",
      options: [
        { id: "a", text: "An internal tool that generates a monthly newsletter" },
        { id: "b", text: "A system that processes customer orders and payments" },
        { id: "c", text: "A tool that displays the office cafeteria menu" },
        { id: "d", text: "A personal note-taking app used by one employee" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "Criticality is about business impact if the system fails — an order/payment system's failure directly disrupts revenue and customers, unlike the other examples.",
      relatedTopicIds: ["business-critical-application"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q6",
      prompt: "A shipment is held at a border for five days awaiting customs. Is this automatically evidence of a system or process failure?",
      type: "single-choice",
      options: [
        { id: "a", text: "Yes, always — customs holds are never routine" },
        { id: "b", text: "Not necessarily — it's worth checking whether documentation was complete/accurate and whether the delay is normal for that customs process, before assuming an error" },
        { id: "c", text: "Yes, but only if the shipment is by air freight" },
        { id: "d", text: "No — customs delays should never be investigated" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "Customs timing varies by country and situation. The right response is to check documentation completeness and whether the delay is actually unusual, rather than assuming either extreme.",
      relatedTopicIds: ["customs-clearance"],
      difficulty: "Intermediate",
    },
    {
      id: "bl-q7",
      prompt: "Which statement best reflects good exception-management practice at scale?",
      type: "single-choice",
      options: [
        { id: "a", text: "Exceptions should never happen if operations are run correctly" },
        { id: "b", text: "Some exceptions are expected at scale; the goal is detecting them proactively, triaging severity, and communicating clearly" },
        { id: "c", text: "Every exception should be escalated to the most senior team available, regardless of severity" },
        { id: "d", text: "Exceptions only matter if a customer complains about them" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "At scale, some deviation from plan is inevitable. Mature exception management focuses on proactive detection, appropriate triage, and clear communication — not eliminating exceptions or waiting for complaints.",
      relatedTopicIds: ["exception-management"],
      difficulty: "Intermediate",
    },
    {
      id: "bl-q8",
      prompt: "\"Database connection pool exhausted\" is reported as an incident with no further detail. What's missing for a business stakeholder?",
      type: "single-choice",
      options: [
        { id: "a", text: "Nothing — this is already a complete report" },
        { id: "b", text: "A translation of which application/process is affected and what operational impact that has on users or customers" },
        { id: "c", text: "The exact version number of the database software" },
        { id: "d", text: "A joke to lighten the mood" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "The technical symptom alone doesn't tell a business stakeholder what's actually at stake — the affected system, process, and operational impact need to be stated explicitly.",
      relatedTopicIds: ["technical-business-translation"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q9",
      prompt: "A Wi-Fi outage affects one section of a warehouse. Staff there can no longer scan inbound goods. What kind of impact is this?",
      type: "single-choice",
      options: [
        { id: "a", text: "Purely an IT inconvenience with no physical operational impact" },
        { id: "b", text: "A direct physical-operations impact — goods can't be received/processed in that area until connectivity is restored" },
        { id: "c", text: "A customs issue" },
        { id: "d", text: "A last-mile delivery issue" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "In a modern warehouse, network connectivity is directly tied to physical operations — if staff can't scan, goods can't be processed, regardless of how \"minor\" the outage sounds technically.",
      relatedTopicIds: ["warehouse-operations"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q10",
      prompt: "A shipment travels flawlessly for two weeks internationally, then fails delivery twice at the final address. Where should investigation focus?",
      type: "single-choice",
      options: [
        { id: "a", text: "The ocean carrier that handled the long-haul leg" },
        { id: "b", text: "The last-mile delivery leg — address accuracy, access, or recipient availability" },
        { id: "c", text: "The original booking system" },
        { id: "d", text: "Customs clearance, since that's always the most likely cause" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "Since the long-haul portion clearly succeeded, a repeated final-delivery failure points squarely at the last-mile leg — commonly an address, access, or availability issue.",
      relatedTopicIds: ["last-mile-delivery"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q11",
      prompt: "Which of the following are examples of a core IT concept mapped to a specific business function? (Select all that apply)",
      type: "multi-select",
      options: [
        { id: "a", text: "Authentication confirms an employee's identity before they can act in a system" },
        { id: "b", text: "Monitoring detects degradation before it grows into a larger operational impact" },
        { id: "c", text: "A database has no real connection to any business process" },
        { id: "d", text: "High availability reduces disruption to the business services that depend on a system staying up" },
      ],
      correctOptionIds: ["a", "b", "d"],
      explanation:
        "Authentication, monitoring, and high availability are all core IT concepts with a direct, concrete business function. Databases very much do connect to business processes — they store the operational records those processes depend on.",
      relatedTopicIds: ["technology-in-logistics"],
      difficulty: "Foundation",
    },
    {
      id: "bl-q12",
      prompt: "An organization's \"on-time delivery rate\" KPI drops sharply during a week when a shipment-tracking integration had intermittent failures. What should be investigated?",
      type: "single-choice",
      options: [
        { id: "a", text: "Whether deliveries were genuinely late, or whether the tracking issue caused delivery completions to be recorded incorrectly" },
        { id: "b", text: "Nothing — a KPI drop is always accurate and needs no further investigation" },
        { id: "c", text: "Only the carrier's performance, since KPIs are never affected by IT issues" },
        { id: "d", text: "The company's marketing strategy" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "A KPI is often calculated from underlying system data — a data/integration issue can distort a KPI without reflecting an actual change in real-world performance, so both possibilities need checking.",
      relatedTopicIds: ["operational-kpi"],
      difficulty: "Intermediate",
    },
    {
      id: "bl-q13",
      prompt: "Why is it inaccurate to describe a single fixed workflow (e.g. \"customer requests → booking → pickup → delivery\") as the exact process every logistics company follows?",
      type: "single-choice",
      options: [
        { id: "a", text: "It isn't inaccurate — every company follows exactly this workflow" },
        { id: "b", text: "Actual workflows vary by organization, shipment type, country, and transport mode — this is a simplified generic model for learning, not one company's exact internal process" },
        { id: "c", text: "Logistics companies don't use structured workflows at all" },
        { id: "d", text: "Only air freight shipments have a defined lifecycle" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "Real shipment workflows vary meaningfully across organizations, shipment types, countries, and transport modes — the simplified lifecycle is a generic learning model, never a confirmed description of any one company's actual process.",
      relatedTopicIds: ["shipment-lifecycle"],
      difficulty: "Foundation",
    },
  ],
};
