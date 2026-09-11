"use client";

import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts, bestAttempt } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useAutomationLabAttempts, getAutomationLabCompletions } from "@/lib/automationLabProgress";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { useOnboardingPreferences } from "@/lib/onboarding";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { pickStrongestSkillIds, pickWeakestSkillIds } from "@/lib/ai/coachingRules";
import { automationLabScenarios, getAutomationLabScenarioById } from "@/lib/data/automationLab";
import { buildMilestoneEvaluationContext } from "@/lib/milestoneUnlocks";
import { milestoneDefinitions, getEligibleMilestoneIds } from "@/lib/data/milestones";
import { certificatePrograms, isCertificateProgramEligible } from "@/lib/data/certificatePrograms";
import { computeActivityTimeline } from "@/lib/analytics/activityTimeline";
import { trainingAssignments } from "@/lib/data/assignments";
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
  const { allAttempts: allAutomationLabAttempts } = useAutomationLabAttempts();
  const automationLabCompletions = getAutomationLabCompletions(allAutomationLabAttempts);
  const { selectedAssignment } = useSelectedAssignment();
  const { preferences } = useOnboardingPreferences();

  const skillProgresses = calculateAllSkillProgress(completed, allAttempts, investigationCompletions, automationLabCompletions);
  const assignmentProgress = selectedAssignment
    ? computeAssignmentProgress(selectedAssignment, completed, allAttempts, investigationCompletions, automationLabCompletions)
    : null;
  const recommendations = getRecommendations(
    { completedTopics: completed, quizAttemptsMap: allAttempts, investigationCompletions, skillProgresses, assignmentProgress, automationLabCompletions },
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

  // Phase 14 — compact additions. Every value here is either a number, a
  // real SkillId, or a title copied verbatim from static content the server
  // independently re-validates (see /api/tutor/route.ts) — never free text.
  const readinessOverall = calculateOverallTrainingProgress(skillProgresses);
  const strongestSkillIds = pickStrongestSkillIds(skillProgresses);
  const weakestSkillIds = pickWeakestSkillIds(skillProgresses);

  const projectIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));
  const completedProjectTitles = automationLabCompletions
    .filter((c) => projectIds.has(c.scenarioId))
    .map((c) => getAutomationLabScenarioById(c.scenarioId)?.title)
    .filter((t): t is string => !!t)
    .slice(0, 3);

  const allAssignmentProgresses = trainingAssignments.map((a) => computeAssignmentProgress(a, completed, allAttempts, investigationCompletions, automationLabCompletions));
  const activityCount = computeActivityTimeline(allAttempts, investigationCompletions, allAutomationLabAttempts).length;
  const milestoneCtx = buildMilestoneEvaluationContext({
    completedTopics: completed,
    quizAttemptsMap: allAttempts,
    investigationCompletions,
    automationLabCompletions,
    skillProgresses,
    assignmentProgresses: allAssignmentProgresses,
    totalActivityCount: activityCount,
  });
  const eligibleMilestoneIds = new Set(getEligibleMilestoneIds(milestoneCtx));
  const achievementTitles = milestoneDefinitions
    .filter((m) => eligibleMilestoneIds.has(m.id))
    .map((m) => m.title)
    .slice(0, 3);

  const certificateProgrammeTitles = certificatePrograms
    .filter((p) => isCertificateProgramEligible(p, { completedTopics: completed, quizAttemptsMap: allAttempts }))
    .map((p) => p.title)
    .slice(0, 3);

  return {
    completedTopicIds,
    quizBestPercentages,
    completedInvestigationIds,
    skillLevels,
    topRecommendationTitles,
    currentAssignmentTitle: selectedAssignment?.title,
    onboardingFocusArea: preferences.focusArea ?? undefined,
    readinessOverall,
    strongestSkillIds,
    weakestSkillIds,
    completedProjectTitles,
    achievementTitles,
    certificateProgrammeTitles,
  };
}
