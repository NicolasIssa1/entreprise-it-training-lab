import { TeamQuestions } from "@/lib/types";

// Generic, intelligent questions a trainee could ask any large enterprise IT team.
// Not DHL-specific — see root CLAUDE.md.
export const teamQuestions: TeamQuestions[] = [
  {
    team: "infrastructure",
    questions: [
      "What are the most common tickets your team receives?",
      "How do you determine which tickets belong to Infrastructure?",
      "What happens when your team cannot resolve a ticket?",
      "How is escalation handled?",
      "What happens if an SLA is missed?",
      "Which systems do you monitor most often?",
      "Which tools do you use most?",
      "How does Infrastructure interact with Applications?",
      "How does Infrastructure interact with Support & Network?",
    ],
  },
  {
    team: "applications",
    questions: [
      "How do you decide whether something is a bug versus expected behavior?",
      "What does your deployment/release process look like?",
      "How do you find out an application issue is actually an infrastructure issue?",
      "How do you prioritize which bugs get fixed first?",
      "What monitoring do you rely on to catch application problems early?",
      "How do you test changes before they go live?",
      "How does Applications interact with Infrastructure?",
      "How does Applications interact with Support & Network?",
    ],
  },
  {
    team: "support-network",
    questions: [
      "What's the most common type of ticket you see in a typical day?",
      "How do you decide when to escalate versus resolve directly?",
      "How is ticket priority/urgency actually determined here?",
      "What does the SLA process look like in practice?",
      "What tools do you use to triage and route tickets?",
      "How do you handle a ticket that could belong to more than one team?",
      "How does Support & Network interact with Infrastructure?",
      "How does Support & Network interact with Applications?",
    ],
  },
];

export function getQuestionsForTeam(teamId: string): TeamQuestions | undefined {
  return teamQuestions.find((q) => q.team === teamId);
}
