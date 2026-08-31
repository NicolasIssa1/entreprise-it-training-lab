import { InvestigationCompletionRecord, Recommendation, SkillAnalyticsEntry } from "@/lib/types";
import { calculateAllSkillProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";
import { QuizAttemptsMap } from "@/lib/quizAttempts";

function activitySummaryFor(evidence: SkillAnalyticsEntry["progress"]["evidence"]): string {
  const parts = [
    `${evidence.learning.completed}/${evidence.learning.total} lesson${evidence.learning.total === 1 ? "" : "s"}`,
    `${evidence.knowledge.attempted}/${evidence.knowledge.total} assessment${evidence.knowledge.total === 1 ? "" : "s"} attempted`,
    `${evidence.practical.completed}/${evidence.practical.total} investigation${evidence.practical.total === 1 ? "" : "s"} completed`,
  ];
  return parts.join(", ");
}

/**
 * Skill analytics (Phase 8 Part B) — a thin presentation wrapper around the
 * existing Phase 4 skill calculation (calculateAllSkillProgress) and Phase 4
 * recommendation engine (getRecommendations). Deliberately does NOT
 * recompute a skill score a second way — see root CLAUDE.md's "no second,
 * independently-stored readiness score" rule, which applies just as much to
 * a second *derivation path* as to a second stored value.
 */
export function computeSkillAnalytics(
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): SkillAnalyticsEntry[] {
  const skillProgresses = calculateAllSkillProgress(completedTopics, quizAttemptsMap, investigationCompletions);
  const recommendations = getRecommendations(
    { completedTopics, quizAttemptsMap, investigationCompletions, skillProgresses },
    // Generous limit — we filter per skill below, so we want the fuller
    // candidate list, not just the top few shown on /progress.
    20,
  );

  const bySkill = new Map<string, Recommendation>();
  for (const r of recommendations) {
    if (r.skillId && !bySkill.has(r.skillId)) bySkill.set(r.skillId, r);
  }

  return skillProgresses.map((progress) => ({
    progress,
    recommendedAction: bySkill.get(progress.skill.id) ?? null,
    activitySummary: activitySummaryFor(progress.evidence),
  }));
}
