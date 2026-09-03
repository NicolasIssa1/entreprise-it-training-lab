import { InvestigationScenario, LearningTopic, Quiz, QuizQuestion, TrainingAssignment } from "@/lib/types";

/**
 * Builds the natural-language question that pre-fills the Tutor's composer
 * for a given "Ask Tutor about X" entry point (see tutorLinks.ts's `prompt`
 * param and TutorChat.tsx, which only ever seeds the composer's text state
 * with this — it never triggers a request). Centralized here so every entry
 * point (Learn, Quiz, Investigation, Progress, Skills, Assignments, BPO)
 * builds its question the same documented way instead of a string
 * hand-written per call site. Every function takes only static curriculum
 * data or ids already public within the app — never Daily Log, CV Tracker,
 * BPO Project Prep, or Tutor conversation content (see root CLAUDE.md).
 */

/** One lesson, from the generic Learn topic page. A small per-category
 * branch (not 100+ hand-written strings) gives the phrasing genuinely
 * relevant flavor — e.g. a Business & Logistics topic invites connecting it
 * to the systems that support it; a Security topic asks "why," which is
 * usually the more useful angle for foundational security awareness. */
export function buildTopicTutorPrompt(topic: LearningTopic): string {
  switch (topic.category) {
    case "Business & Logistics":
      return `Can you explain ${topic.title} in simple terms, and then connect it to the technology systems used in enterprise logistics?`;
    case "BPO & Process Automation":
      return `Can you explain ${topic.title}, and how it fits into understanding and improving a business process before automating it?`;
    case "Security Fundamentals":
      return `Can you explain ${topic.title} clearly, why enterprises rely on it, and the key things I should remember?`;
    default:
      return `Can you explain ${topic.title} clearly — first simply, then technically — and show me why it matters in enterprise IT?`;
  }
}

/** Mid-assessment, question not yet submitted — must never leak toward the
 * correct answer, so the question only asks for the underlying concept. */
export function buildQuizCoachPrompt(quiz: Quiz): string {
  return `Can you help me understand the concept behind this ${quiz.title} question, without revealing which answer is correct?`;
}

/** Post-submission answer review for one specific question — the question's
 * own text is already static quiz content sent to the Tutor via
 * quizReviewContext, so including it here just makes the pre-filled
 * question concrete rather than generic. */
export function buildQuizReviewPrompt(question: QuizQuestion): string {
  return `Can you walk me through the reasoning for this question and clarify anything I might have misunderstood: "${question.prompt}"?`;
}

/** Mid-investigation — coach mode, so the prompt itself asks to be guided
 * rather than told the answer (reinforces the app's own non-disclosure rule
 * at the UI layer, not just the system prompt). */
export function buildInvestigationCoachPrompt(scenario: InvestigationScenario): string {
  return `Help me think through the "${scenario.title}" investigation using a structured troubleshooting approach — please guide me with questions rather than giving away the answer.`;
}

/** Post-completion review — the scenario is done, so this can safely ask to
 * discuss what happened. */
export function buildInvestigationReviewPrompt(scenario: InvestigationScenario): string {
  return `Can you walk me through the reasoning path for the "${scenario.title}" investigation and explain what I could have done differently?`;
}

/** Generic progress-coach entry (Dashboard/Progress/Analytics) — deliberately
 * asks the Tutor to reason over the progress summary already computed by
 * this app rather than inventing a score-specific claim here. */
export function buildProgressTutorPrompt(): string {
  return "Based on my current structured training progress in this app, what should I focus on next and why?";
}

/** From a specific skill card — names the skill, but never asserts a
 * fabricated "weak/strong" verdict; the Tutor already receives the real
 * skill levels via progressSummary and can speak to that itself. */
export function buildSkillTutorPrompt(skillName: string): string {
  return `Based on my current progress, what should I focus on next to build my ${skillName} skill?`;
}

/** From a Training Assignment (Dashboard's CurrentAssignmentCard, or the
 * /assignments list) — names the assignment so the Tutor's progress-coach
 * mode can ground its answer in that specific template. */
export function buildAssignmentTutorPrompt(assignment: Pick<TrainingAssignment, "title">): string {
  return `Help me understand what I should focus on next for my "${assignment.title}" assignment.`;
}
