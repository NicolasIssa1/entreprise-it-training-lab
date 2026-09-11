import { AdminAssignmentRecord, AdminCohort, AdminLearnerRecord, TrainingAssignment } from "@/lib/types";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { automationLabScenarios } from "@/lib/data/automationLab";
import { statusForAssignment, learnersForAssignment } from "@/lib/adminAssignments";
import { computeLearnerAttentionFlags } from "@/lib/adminRiskSignals";
import { aggregateKpis, AdminDashboardKpis, LearnerKpiInput } from "@/lib/adminKpiRules";

const ACTIVE_WITHIN_DAYS = 14;

function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}

/** Plain (non-component) helper so callers never need a raw `Date.now()` /
 * `new Date()` call inside a component's render body — React's purity rule
 * flags that even inside useMemo, since the factory still runs during
 * render. A default parameter evaluated inside a plain function is the
 * established pattern this whole admin layer already uses (see
 * computeAdminDashboardKpis below, adminRiskSignals.ts, adminRoster.ts). */
export function isLearnerActive(learner: AdminLearnerRecord, now: Date = new Date()): boolean {
  return learner.lastActivityAt !== null && daysSince(learner.lastActivityAt, now) <= ACTIVE_WITHIN_DAYS;
}

/**
 * Computes every Enterprise Admin dashboard KPI from the real roster (see
 * lib/adminRoster.ts) via the app's existing derivation engines — no
 * fabricated headline numbers. See lib/adminKpiRules.ts for the pure
 * aggregation arithmetic this wraps.
 */
export function computeAdminDashboardKpis(
  learners: AdminLearnerRecord[],
  programmes: TrainingAssignment[],
  assignments: AdminAssignmentRecord[],
  cohorts: AdminCohort[],
  now: Date = new Date(),
): AdminDashboardKpis {
  const projectScenarioIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));

  const inputs: LearnerKpiInput[] = learners.map((learner) => {
    const skillProgresses = calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions);
    const overallReadiness = calculateOverallTrainingProgress(skillProgresses);

    const programme = learner.programmeId ? programmes.find((p) => p.id === learner.programmeId) : undefined;
    const programmeComplete = programme
      ? computeAssignmentProgress(programme, learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions)
          .overallCompletion >= 100
      : false;

    const isActive = isLearnerActive(learner, now);
    const enterpriseProjectsCompleted = learner.automationLabCompletions.filter((c) => projectScenarioIds.has(c.scenarioId)).length;
    const hasAttentionFlag = computeLearnerAttentionFlags(learner, skillProgresses, assignments, cohorts, now).length > 0;

    return { hasProgramme: !!learner.programmeId, programmeComplete, overallReadiness, isActive, enterpriseProjectsCompleted, hasAttentionFlag };
  });

  let overdueAssignmentsCount = 0;
  for (const assignment of assignments) {
    const cohort = cohorts.find((c) => c.id === assignment.targetId);
    const targets = learnersForAssignment(assignment, learners, cohort?.memberLearnerIds ?? []);
    overdueAssignmentsCount += targets.filter((learner) => statusForAssignment(assignment, learner, now) === "overdue").length;
  }

  return aggregateKpis(inputs, overdueAssignmentsCount);
}
