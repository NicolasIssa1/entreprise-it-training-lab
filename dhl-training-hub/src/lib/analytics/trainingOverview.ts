import { InvestigationCompletionRecord, SkillProgress, TrainingOverview } from "@/lib/types";
import { learningTopics, learningPaths, getPathProgress } from "@/lib/data/learning";
import { quizzes } from "@/lib/data/quizzes";
import { investigationScenarios } from "@/lib/data/investigations";
import { QuizAttemptsMap } from "@/lib/quizAttempts";
import { calculateOverallTrainingProgress } from "@/lib/skillProgress";

/**
 * Top-of-page analytics rollup (Phase 8 Part A). Every number here is derived
 * from the same three evidence sources skillProgress.ts already reads — no
 * second stored total. Pure function: pass in whatever the page's hooks
 * already loaded (completedTopics/quizAttemptsMap/investigationCompletions),
 * plus the already-computed SkillProgress list so the overall percentage
 * matches /progress exactly rather than being recalculated a second way.
 */
export function computeTrainingOverview(
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
  skillProgresses: SkillProgress[],
): TrainingOverview {
  const topicsCompleted = Object.values(completedTopics).filter(Boolean).length;
  const quizzesAttempted = Object.values(quizAttemptsMap).filter((attempts) => attempts.length > 0).length;

  let pathsInProgress = 0;
  let pathsCompleted = 0;
  for (const path of learningPaths) {
    const { completedCount, total } = getPathProgress(path, completedTopics);
    if (completedCount >= total) pathsCompleted += 1;
    else if (completedCount > 0) pathsInProgress += 1;
  }

  return {
    topicsCompleted,
    topicsTotal: learningTopics.length,
    quizzesAttempted,
    quizzesTotal: quizzes.length,
    investigationsCompleted: investigationCompletions.length,
    investigationsTotal: investigationScenarios.length,
    pathsInProgress,
    pathsCompleted,
    pathsTotal: learningPaths.length,
    overallProgress: calculateOverallTrainingProgress(skillProgresses),
  };
}
