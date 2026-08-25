import { DailyLogEntry } from "@/lib/types";

// Seed data mirroring ../../../daily/day-01.md and day-02.md. Only facts explicitly
// known — no invented DHL specifics. See root CLAUDE.md.
export const seedDailyLogEntries: DailyLogEntry[] = [
  {
    id: "seed-day-01",
    date: "2026-08-24",
    dayNumber: 1,
    team: "General",
    observed: "Met almost all of the IT/BPU teams; my buddy introduced me around to employees.",
    learned: "IT/BPU is structured into three teams: Infrastructure, Applications, and Support & Network.",
    newTerminology: "IT/BPU",
    toolsConcepts: "",
    questionsAsked: "",
    answerSummary: "",
    didNotUnderstand: "Not yet clear how the three teams divide work day-to-day.",
    toResearchLater: "General enterprise IT team structures, for context before Day 2.",
    practiceCompleted: "",
    tomorrowsGoals: "Sit with Infrastructure and learn about the ticket dashboard.",
  },
  {
    id: "seed-day-02",
    date: "2026-08-25",
    dayNumber: 2,
    team: "infrastructure",
    observed: "Shown the concept of a ticket dashboard by the Infrastructure team.",
    learned:
      "Tickets are opened, investigated, a solution is documented, and tickets are resolved/closed. Some tickets have an informal one-to-two-day resolution expectation.",
    newTerminology: "Ticket dashboard, ticket lifecycle",
    toolsConcepts: "Ticket dashboard concept",
    questionsAsked: "",
    answerSummary: "",
    didNotUnderstand: "Official SLA / priority structure — not yet known, not assumed.",
    toResearchLater: "How SLA and priority are generally defined in enterprise IT (generic, not DHL-specific).",
    practiceCompleted: "Started using the Ticket Simulator to practice triaging fake tickets.",
    tomorrowsGoals: "Learn more about Infrastructure's specific responsibilities in detail.",
  },
];
