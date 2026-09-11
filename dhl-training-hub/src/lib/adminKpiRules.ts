/**
 * Pure KPI aggregation (Phase 12) — zero `@/`-aliased imports, same
 * testability pattern as adminAssignmentStatusRules.ts. lib/adminKpis.ts
 * computes one LearnerKpiInput per roster member from real (or
 * honestly-derived demo) evidence via the app's existing engines
 * (calculateAllSkillProgress, computeAssignmentProgress, attention flags);
 * this file only does the arithmetic of turning those into dashboard
 * numbers, so the arithmetic itself is unit-tested in isolation. Every KPI
 * here is a real aggregate of real per-learner numbers — never a fabricated
 * headline figure.
 */
export interface LearnerKpiInput {
  hasProgramme: boolean;
  programmeComplete: boolean;
  overallReadiness: number;
  isActive: boolean;
  enterpriseProjectsCompleted: number;
  hasAttentionFlag: boolean;
}

export interface AdminDashboardKpis {
  totalLearners: number;
  activeLearners: number;
  /** Percentage among learners who actually have an assigned programme —
   * learners with none are excluded from the denominator rather than
   * silently counted as 0%, which would understate completion for no
   * reason. */
  programmeCompletionPercent: number;
  averageReadiness: number;
  projectsCompleted: number;
  learnersRequiringAttention: number;
  overdueAssignments: number;
}

export function aggregateKpis(inputs: LearnerKpiInput[], overdueAssignmentsCount: number): AdminDashboardKpis {
  const totalLearners = inputs.length;
  const activeLearners = inputs.filter((i) => i.isActive).length;

  const withProgramme = inputs.filter((i) => i.hasProgramme);
  const programmeCompletionPercent =
    withProgramme.length === 0 ? 0 : Math.round((withProgramme.filter((i) => i.programmeComplete).length / withProgramme.length) * 100);

  const averageReadiness = totalLearners === 0 ? 0 : Math.round(inputs.reduce((sum, i) => sum + i.overallReadiness, 0) / totalLearners);
  const projectsCompleted = inputs.reduce((sum, i) => sum + i.enterpriseProjectsCompleted, 0);
  const learnersRequiringAttention = inputs.filter((i) => i.hasAttentionFlag).length;

  return {
    totalLearners,
    activeLearners,
    programmeCompletionPercent,
    averageReadiness,
    projectsCompleted,
    learnersRequiringAttention,
    overdueAssignments: overdueAssignmentsCount,
  };
}
