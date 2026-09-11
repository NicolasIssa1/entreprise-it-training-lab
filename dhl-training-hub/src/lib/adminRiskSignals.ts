import { AdminAssignmentRecord, AdminAttentionFlag, AdminCohort, AdminLearnerRecord, SkillProgress } from "@/lib/types";
import { bestAttempt } from "@/lib/quizAttempts";
import { classifySkillGap } from "@/lib/readiness";
import { statusForAssignment, learnersForAssignment } from "@/lib/adminAssignments";
import { computeAttentionFlags } from "@/lib/adminRiskSignalRules";

function daysBetween(a: Date, b: Date): number {
  return Math.floor(Math.abs(a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));
}

/** Deterministically computes every attention flag for one learner from
 * their real (or generated-but-honestly-derived) evidence — see
 * lib/adminRiskSignalRules.ts for the actual threshold rules. */
export function computeLearnerAttentionFlags(
  learner: AdminLearnerRecord,
  skillProgresses: SkillProgress[],
  assignments: AdminAssignmentRecord[],
  cohorts: AdminCohort[],
  now: Date = new Date(),
): AdminAttentionFlag[] {
  const overdueAssignmentCount = assignments.filter((a) => {
    const cohort = cohorts.find((c) => c.id === a.targetId);
    const targets = learnersForAssignment(a, [learner], cohort?.memberLearnerIds ?? []);
    return targets.length > 0 && statusForAssignment(a, learner, now) === "overdue";
  }).length;

  const attemptedQuizPercentages = Object.values(learner.quizAttemptsMap)
    .map((attempts) => bestAttempt(attempts)?.percentage)
    .filter((p): p is number => p !== undefined);
  const averageQuizScore = attemptedQuizPercentages.length === 0 ? null : attemptedQuizPercentages.reduce((s, p) => s + p, 0) / attemptedQuizPercentages.length;

  const hasRepeatedLowScoringQuiz = Object.values(learner.quizAttemptsMap).some((attempts) => attempts.length >= 2 && attempts.every((a) => a.percentage < 50));

  const daysSinceLastActivity = learner.lastActivityAt ? daysBetween(now, new Date(learner.lastActivityAt)) : null;
  const joinedDaysAgo = daysBetween(now, new Date(learner.joinedDate));

  const gapSkillCount = skillProgresses.filter(
    (s) => classifySkillGap(s) === "gap" && (s.evidence.learning.completed > 0 || s.evidence.knowledge.attempted > 0 || s.evidence.practical.completed > 0),
  ).length;

  const results = computeAttentionFlags({
    overdueAssignmentCount,
    averageQuizScore,
    hasRepeatedLowScoringQuiz,
    daysSinceLastActivity,
    joinedDaysAgo,
    gapSkillCount,
  });

  return results.map((r) => ({ learnerId: learner.id, ...r }));
}
