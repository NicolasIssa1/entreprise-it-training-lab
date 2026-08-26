import { InvestigationCompletionRecord, SkillEvidence, SkillId, SkillLevel, SkillProgress, SKILL_IDS } from "@/lib/types";
import { getSkillById, getTopicsForSkill, getQuizzesForSkill, getInvestigationsForSkill } from "@/lib/data/skills";
import { bestAttempt, QuizAttemptsMap } from "@/lib/quizAttempts";

/**
 * Readiness weighting (see CLAUDE.md / PRODUCT-ROADMAP.md for the full writeup):
 * Learning Completion 30% + Quiz Knowledge 30% + Practical Investigations 40%.
 * Practical performance is weighted highest on purpose — completing lesson
 * checkboxes alone can reach at most 30/100 on a skill.
 */
const LEARNING_WEIGHT = 0.3;
const KNOWLEDGE_WEIGHT = 0.3;
const PRACTICAL_WEIGHT = 0.4;

/** Grounded labels, never "Expert"/"Certified" — thresholds per CLAUDE.md. */
export function levelForScore(score: number): SkillLevel {
  if (score <= 0) return "Not Started";
  if (score < 25) return "Getting Started";
  if (score < 50) return "Building Foundation";
  if (score < 75) return "Practicing";
  return "Strong Foundation";
}

/**
 * Everything here is derived from three existing sources of truth —
 * completed Learn topics, quiz attempts, and Advanced Investigation completions
 * — never a second, independently-stored readiness score. See root CLAUDE.md:
 * a training indicator, not a validated professional assessment.
 */
export function calculateSkillProgress(
  skillId: SkillId,
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): SkillProgress {
  const skill = getSkillById(skillId);

  const topics = getTopicsForSkill(skillId);
  const learningCompleted = topics.filter((t) => completedTopics[t.id]).length;
  const learningPercentage = topics.length === 0 ? 0 : Math.round((learningCompleted / topics.length) * 100);

  const relevantQuizzes = getQuizzesForSkill(skillId);
  const attemptedQuizzes = relevantQuizzes.filter((q) => (quizAttemptsMap[q.id] ?? []).length > 0);
  // Unattempted quizzes count as 0 in the average (not excluded) — attempting one
  // easy quiz out of several relevant ones shouldn't be enough to look fully
  // knowledgeable in the skill.
  const knowledgeSum = relevantQuizzes.reduce((sum, q) => sum + (bestAttempt(quizAttemptsMap[q.id] ?? [])?.percentage ?? 0), 0);
  const knowledgePercentage = relevantQuizzes.length === 0 ? 0 : Math.round(knowledgeSum / relevantQuizzes.length);

  const relevantInvestigations = getInvestigationsForSkill(skillId);
  const completionByScenario = new Map(investigationCompletions.map((c) => [c.scenarioId, c]));
  const practicalCompleted = relevantInvestigations.filter((s) => completionByScenario.has(s.id)).length;
  const practicalSum = relevantInvestigations.reduce((sum, s) => sum + (completionByScenario.get(s.id)?.score ?? 0), 0);
  const practicalPercentage = relevantInvestigations.length === 0 ? 0 : Math.round(practicalSum / relevantInvestigations.length);

  const overall = Math.round(
    learningPercentage * LEARNING_WEIGHT + knowledgePercentage * KNOWLEDGE_WEIGHT + practicalPercentage * PRACTICAL_WEIGHT,
  );

  const evidence: SkillEvidence = {
    learning: { completed: learningCompleted, total: topics.length, percentage: learningPercentage },
    knowledge: { attempted: attemptedQuizzes.length, total: relevantQuizzes.length, percentage: knowledgePercentage },
    practical: { completed: practicalCompleted, total: relevantInvestigations.length, percentage: practicalPercentage },
  };

  return { skill, overall, level: levelForScore(overall), evidence };
}

export function calculateAllSkillProgress(
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): SkillProgress[] {
  return SKILL_IDS.map((id) => calculateSkillProgress(id, completedTopics, quizAttemptsMap, investigationCompletions));
}

/** Simple mean across the 6 skills — shown as "Overall Training Progress." */
export function calculateOverallTrainingProgress(skillProgresses: SkillProgress[]): number {
  if (skillProgresses.length === 0) return 0;
  return Math.round(skillProgresses.reduce((sum, s) => sum + s.overall, 0) / skillProgresses.length);
}
