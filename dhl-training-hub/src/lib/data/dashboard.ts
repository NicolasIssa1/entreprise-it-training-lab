import { DashboardData } from "@/lib/types";

// Curated "today" content — deliberately evergreen, generic starter goals/
// questions/practice, not tied to a specific day number or team (which team
// Nicolas is actually with on a given day is real information that changes;
// see internshipState.ts's comment on why currentTeam is never guessed from
// the date). The Dashboard hero itself derives the live day/date separately
// via useInternshipProgress — nothing here needs to track that anymore.
export const dashboardData: DashboardData = {
  todaysGoals: [
    "Understand the ticket lifecycle (open → investigate → document → resolve/close)",
    "Learn what SLA means in general enterprise IT",
    "Understand how tickets are typically assigned to teams",
    "Practice triaging 5 fake tickets in the Ticket Simulator",
  ],
  todaysQuestions: [
    "What are the most common tickets your team receives?",
    "How do you determine which team a ticket belongs to?",
    "What happens when your team cannot resolve a ticket?",
  ],
  todaysPractice: "Work through at least 5 tickets in the Ticket Simulator, choosing a team, an urgency level, and writing your own first troubleshooting step before revealing the guidance.",
};
