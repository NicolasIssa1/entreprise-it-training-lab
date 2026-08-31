import {
  InvestigationAnalytics,
  InvestigationAreaScore,
  InvestigationCompletionRecord,
  InvestigationCompletionSummary,
  InvestigationScenario,
  LearningCategory,
} from "@/lib/types";
import { investigationScenarios, getScenarioById } from "@/lib/data/investigations";
import { getTopicById } from "@/lib/data/learning";
import { average } from "@/lib/analytics/pureCalculations";

/** A scenario's "primary area" for grouping — the most common Learn category
 * among its own relatedTopicIds (its single source of truth for topic
 * relationships), not a second hand-maintained scenario-to-category map.
 * Ties keep whichever category appears first. */
export function primaryCategoryForScenario(scenario: InvestigationScenario): LearningCategory | null {
  const counts = new Map<LearningCategory, number>();
  for (const topicId of scenario.relatedTopicIds) {
    const category = getTopicById(topicId)?.category;
    if (category) counts.set(category, (counts.get(category) ?? 0) + 1);
  }
  let best: LearningCategory | null = null;
  let bestCount = 0;
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }
  return best;
}

/**
 * Investigation analytics (Phase 8 Part D) — derived entirely from
 * investigation-completions (already-stored score + resultCategory, computed
 * once by investigationScoring.ts at completion time) joined with each
 * scenario's own static metadata. Never recomputes a score, and never exposes
 * a scenario's hidden outcome/root-cause text — only the same summary already
 * shown on the completed-investigation results screen.
 *
 * Known limitation (see docs/ANALYTICS.md): InvestigationCompletionRecord
 * doesn't store whether the learner resolved or escalated, only the training
 * quality category — so that resolve-vs-escalate distinction isn't shown here
 * rather than being guessed from since-changed in-progress state.
 */
export function computeInvestigationAnalytics(completions: InvestigationCompletionRecord[]): InvestigationAnalytics {
  const summaries: InvestigationCompletionSummary[] = completions
    .map((record) => {
      const scenario = getScenarioById(record.scenarioId);
      if (!scenario) return null;
      return {
        scenario,
        completedAt: record.completedAt,
        score: record.score,
        resultCategory: record.resultCategory,
        primaryCategory: primaryCategoryForScenario(scenario),
      };
    })
    .filter((s): s is InvestigationCompletionSummary => s !== null)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const scoresByCategory = new Map<LearningCategory, number[]>();
  for (const summary of summaries) {
    if (!summary.primaryCategory) continue;
    const list = scoresByCategory.get(summary.primaryCategory) ?? [];
    list.push(summary.score);
    scoresByCategory.set(summary.primaryCategory, list);
  }

  const areaScores: InvestigationAreaScore[] = [...scoresByCategory.entries()]
    .map(([category, scores]) => ({ category, averageScore: average(scores), completedCount: scores.length }))
    .sort((a, b) => b.averageScore - a.averageScore);

  // With only one distinct area, "strongest" and "focus" would just be the
  // same category shown twice — a meaningless contrast, so focus areas stay
  // empty until there's genuinely more than one area to compare.
  const focusAreas = areaScores.length > 1 ? [...areaScores].reverse().slice(0, 3) : [];

  return {
    completions: summaries,
    completedCount: summaries.length,
    totalScenarios: investigationScenarios.length,
    averageScore: summaries.length > 0 ? average(summaries.map((s) => s.score)) : null,
    strongestAreas: areaScores.slice(0, 3),
    focusAreas,
  };
}
