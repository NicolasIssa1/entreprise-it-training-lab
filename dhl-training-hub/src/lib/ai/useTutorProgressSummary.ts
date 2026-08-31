"use client";

import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts, bestAttempt } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { calculateAllSkillProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { useOnboardingPreferences } from "@/lib/onboarding";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { TutorProgressSummary } from "@/lib/ai/types";

/**
 * Composes the same three evidence sources the /progress page already reads
 * (Phase 4/5: learning-topic-progress, quiz-attempts, investigation-completions)
 * into the small, safe summary the Tutor is allowed to see (Phase 6 Part N/O).
 * Never includes Daily Log or CV Achievement free text, names, or email — only
 * ids/percentages/levels, the same shape validated server-side in
 * /api/tutor/route.ts's sanitizeProgressSummary.
 */
export function useTutorProgressSummary(): TutorProgressSummary {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { selectedAssignment } = useSelectedAssignment();
  const { preferences } = useOnboardingPreferences();

  const skillProgresses = calculateAllSkillProgress(completed, allAttempts, investigationCompletions);
  const assignmentProgress = selectedAssignment
    ? computeAssignmentProgress(selectedAssignment, completed, allAttempts, investigationCompletions)
    : null;
  const recommendations = getRecommendations(
    { completedTopics: completed, quizAttemptsMap: allAttempts, investigationCompletions, skillProgresses, assignmentProgress },
    3,
  );

  const completedTopicIds = Object.entries(completed)
    .filter(([, done]) => done)
    .map(([topicId]) => topicId);

  const quizBestPercentages: Record<string, number> = {};
  for (const [quizId, attempts] of Object.entries(allAttempts)) {
    const best = bestAttempt(attempts);
    if (best) quizBestPercentages[quizId] = best.percentage;
  }

  const completedInvestigationIds = investigationCompletions.map((c) => c.scenarioId);

  const skillLevels: Record<string, string> = {};
  for (const sp of skillProgresses) skillLevels[sp.skill.id] = sp.level;

  const topRecommendationTitles = recommendations.map((r) => r.title);

  return {
    completedTopicIds,
    quizBestPercentages,
    completedInvestigationIds,
    skillLevels,
    topRecommendationTitles,
    currentAssignmentTitle: selectedAssignment?.title,
    onboardingFocusArea: preferences.focusArea ?? undefined,
  };
}
