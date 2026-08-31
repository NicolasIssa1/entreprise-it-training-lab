import { Quiz, QuizAnalyticsEntry, SkillId } from "@/lib/types";
import { quizzes } from "@/lib/data/quizzes";
import { QuizAttemptsMap, bestAttempt, latestAttempt, quizResultGuidance } from "@/lib/quizAttempts";
import { SKILL_QUIZ_CATEGORY } from "@/lib/data/skills";
import { trendDirectionForPercentages } from "@/lib/analytics/pureCalculations";

/** Reverse-derived from SKILL_QUIZ_CATEGORY (the single source of truth in
 * lib/data/skills.ts) — never a second hand-maintained quiz-category-to-skill
 * map. A quiz category can map to more than one skill only for
 * Troubleshooting, which has its own dedicated category, so this is usually a
 * single-entry list. */
function skillIdsForQuizCategory(category: Quiz["category"]): SkillId[] {
  return (Object.keys(SKILL_QUIZ_CATEGORY) as SkillId[]).filter((id) => SKILL_QUIZ_CATEGORY[id] === category);
}

export function computeQuizAnalyticsEntry(quiz: Quiz, attemptsMap: QuizAttemptsMap): QuizAnalyticsEntry {
  const attempts = attemptsMap[quiz.id] ?? [];
  const best = bestAttempt(attempts);
  const latest = latestAttempt(attempts);

  const trend = attempts.map((a, index) => ({
    attemptNumber: index + 1,
    percentage: a.percentage,
    completedAt: a.completedAt,
  }));

  return {
    quiz,
    attemptCount: attempts.length,
    latestPercentage: latest?.percentage ?? null,
    bestPercentage: best?.percentage ?? null,
    latestCompletedAt: latest?.completedAt ?? null,
    trend,
    trendDirection: trendDirectionForPercentages(trend.map((t) => t.percentage)),
    resultGuidance: latest ? quizResultGuidance(latest.percentage).label : null,
    relatedSkillIds: skillIdsForQuizCategory(quiz.category),
  };
}

/** All quizzes, attempted or not — callers filter/sort as their section needs
 * (e.g. "attempted only" for the trend view, "all" for a full assessment list). */
export function computeQuizAnalytics(attemptsMap: QuizAttemptsMap): QuizAnalyticsEntry[] {
  return quizzes.map((quiz) => computeQuizAnalyticsEntry(quiz, attemptsMap));
}
