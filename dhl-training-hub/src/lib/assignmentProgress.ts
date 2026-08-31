import { AssignmentProgress, AssignmentRequirementProgress, InvestigationCompletionRecord, TrainingAssignment } from "@/lib/types";
import { getPathById, getPathProgress, getNextIncompleteTopicId, getTopicById } from "@/lib/data/learning";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";
import { QuizAttemptsMap } from "@/lib/quizAttempts";

function requirementProgress(completed: number, total: number): AssignmentRequirementProgress {
  return { completed, total, percentage: total === 0 ? 100 : Math.round((completed / total) * 100) };
}

/**
 * Assignment "completion" is only completion against the required list — never
 * a new competency score (see root CLAUDE.md Phase 9 Part E). Everything here
 * is derived at render time from the same evidence sources skillProgress.ts and
 * the analytics layer already read:
 *  - a required path counts as done once every one of its topics is completed
 *    (same definition getPathProgress already uses elsewhere)
 *  - a required quiz counts as done once it has at least one recorded attempt
 *    (mirrors the "quizzesAttempted" evidence used throughout the app —
 *    assignment completion tracks engagement against the required list, not a
 *    pass/fail score)
 *  - a required investigation counts as done once it has a completion record
 */
export function computeAssignmentProgress(
  assignment: TrainingAssignment,
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): AssignmentProgress {
  const pathsCompleted = assignment.requiredPathIds.filter((id) => {
    const path = getPathById(id);
    if (!path) return false;
    const { completedCount, total } = getPathProgress(path, completedTopics);
    return total > 0 && completedCount === total;
  }).length;

  const quizzesCompleted = assignment.requiredQuizIds.filter((id) => (quizAttemptsMap[id]?.length ?? 0) > 0).length;

  const completedScenarioIds = new Set(investigationCompletions.map((c) => c.scenarioId));
  const investigationsCompleted = assignment.requiredScenarioIds.filter((id) => completedScenarioIds.has(id)).length;

  const paths = requirementProgress(pathsCompleted, assignment.requiredPathIds.length);
  const quizzesProgress = requirementProgress(quizzesCompleted, assignment.requiredQuizIds.length);
  const investigations = requirementProgress(investigationsCompleted, assignment.requiredScenarioIds.length);

  const categoryPercentages = [
    assignment.requiredPathIds.length > 0 ? paths.percentage : null,
    assignment.requiredQuizIds.length > 0 ? quizzesProgress.percentage : null,
    assignment.requiredScenarioIds.length > 0 ? investigations.percentage : null,
  ].filter((p): p is number => p !== null);
  const overallCompletion =
    categoryPercentages.length === 0 ? 0 : Math.round(categoryPercentages.reduce((sum, p) => sum + p, 0) / categoryPercentages.length);

  const nextRequiredAction = findNextRequiredAction(assignment, completedTopics, quizAttemptsMap, completedScenarioIds);

  return { assignment, paths, quizzes: quizzesProgress, investigations, overallCompletion, nextRequiredAction };
}

function findNextRequiredAction(
  assignment: TrainingAssignment,
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  completedScenarioIds: Set<string>,
): AssignmentProgress["nextRequiredAction"] {
  for (const pathId of assignment.requiredPathIds) {
    const path = getPathById(pathId);
    if (!path) continue;
    const nextTopicId = getNextIncompleteTopicId(path.topicIds, completedTopics);
    if (nextTopicId) {
      const topic = getTopicById(nextTopicId);
      if (topic) {
        return {
          id: `assignment-${assignment.id}-path-${pathId}`,
          priority: 100,
          title: `Continue ${path.title}`,
          description: `Required for "${assignment.title}" — next topic: ${topic.title}.`,
          href: `/learn/${topic.id}`,
        };
      }
    }
  }

  for (const quizId of assignment.requiredQuizIds) {
    if ((quizAttemptsMap[quizId]?.length ?? 0) > 0) continue;
    const quiz = getQuizById(quizId);
    if (!quiz) continue;
    return {
      id: `assignment-${assignment.id}-quiz-${quizId}`,
      priority: 100,
      title: `Take the ${quiz.title}`,
      description: `Required assessment for "${assignment.title}".`,
      href: `/quizzes/${quiz.id}`,
    };
  }

  for (const scenarioId of assignment.requiredScenarioIds) {
    if (completedScenarioIds.has(scenarioId)) continue;
    const scenario = getScenarioById(scenarioId);
    if (!scenario) continue;
    return {
      id: `assignment-${assignment.id}-scenario-${scenarioId}`,
      priority: 100,
      title: `Practice: ${scenario.title}`,
      description: `Required investigation for "${assignment.title}".`,
      href: `/tickets/investigate/${scenario.id}`,
    };
  }

  return null;
}
