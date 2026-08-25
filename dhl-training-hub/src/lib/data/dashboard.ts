import { DashboardData } from "@/lib/types";

// Reflects the current internship stage from ../../../internship-plan.md.
// Update this as the internship progresses — no confidential DHL facts, see root CLAUDE.md.
export const dashboardData: DashboardData = {
  dayNumber: 2,
  currentTeam: "infrastructure",
  todaysGoals: [
    "Understand the ticket lifecycle (open → investigate → document → resolve/close)",
    "Understand Infrastructure's core responsibilities",
    "Learn what SLA means in general enterprise IT",
    "Understand how tickets are typically assigned to teams",
    "Practice triaging 5 fake tickets in the Ticket Simulator",
  ],
  todaysQuestions: [
    "What are the most common tickets your team receives?",
    "How do you determine which tickets belong to Infrastructure?",
    "What happens when your team cannot resolve a ticket?",
  ],
  todaysPractice: "Work through at least 5 tickets in the Ticket Simulator, choosing a team, an urgency level, and writing your own first troubleshooting step before revealing the guidance.",
  progressSummary:
    "Day 1 complete: met the three IT/BPU teams. Day 2 in progress: sitting with Infrastructure, learning how the ticket dashboard concept works.",
};
