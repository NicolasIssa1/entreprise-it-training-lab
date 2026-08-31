import { InvestigationCompletionRecord, LearningPathAnalyticsEntry } from "@/lib/types";
import { learningPaths, getPathProgress, getNextIncompleteTopicId, getTopicById } from "@/lib/data/learning";
import { getQuizzesForPath } from "@/lib/data/quizzes";
import { getScenariosForPath } from "@/lib/data/investigations";
import { QuizAttemptsMap } from "@/lib/quizAttempts";
import { computeQuizAnalyticsEntry } from "@/lib/analytics/quizAnalytics";

/**
 * Learning Path analytics (Phase 8 Part E) — reuses the exact same derivation
 * helpers the Learn library already exposes (getPathProgress,
 * getQuizzesForPath, getScenariosForPath) rather than a second path-progress
 * calculation. No hard locking: nextTopic is always a suggestion.
 */
export function computeLearningPathAnalytics(
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): LearningPathAnalyticsEntry[] {
  const completedScenarioIds = new Set(investigationCompletions.map((c) => c.scenarioId));

  return learningPaths.map((path) => {
    const { completedCount, total } = getPathProgress(path, completedTopics);

    const [checkpointQuiz] = getQuizzesForPath(path.id);
    const relatedScenarios = getScenariosForPath(path.id, Number.MAX_SAFE_INTEGER);

    const nextTopicId = getNextIncompleteTopicId(path.topicIds, completedTopics);

    return {
      path,
      topicsCompleted: completedCount,
      topicsTotal: total,
      progressPercentage: total === 0 ? 0 : Math.round((completedCount / total) * 100),
      checkpointQuiz: checkpointQuiz ? computeQuizAnalyticsEntry(checkpointQuiz, quizAttemptsMap) : null,
      relatedInvestigationsCompleted: relatedScenarios.filter((s) => completedScenarioIds.has(s.id)).length,
      relatedInvestigationsTotal: relatedScenarios.length,
      nextTopic: nextTopicId ? getTopicById(nextTopicId) ?? null : null,
    };
  });
}
