import { DashboardData } from "@/lib/types";
import { internshipState } from "@/lib/data/internshipState";

// Curated "today" content. Day/team come from internshipState (the single source of
// truth) rather than being duplicated here — update internshipState, not this file,
// when the day/team changes. See ../../../internship-plan.md for the full narrative.
export const dashboardData: DashboardData = {
  dayNumber: internshipState.currentDayNumber,
  currentTeam: internshipState.currentTeam,
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
