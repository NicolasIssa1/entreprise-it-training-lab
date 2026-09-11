"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/Badge";
import { LearnerIdentityBadge, AttentionIndicator } from "@/components/admin/AdminBadges";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminAssignments } from "@/lib/adminAssignments";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { computeLearnerAttentionFlags } from "@/lib/adminRiskSignals";

export default function AdminCohortDetailPage() {
  const params = useParams<{ cohortId: string }>();
  const { cohorts, toggleMember } = useAdminCohorts();
  const { learners } = useAdminRoster();
  const { assignments } = useAdminAssignments();

  const cohort = cohorts.find((c) => c.id === params.cohortId);

  const memberRows = useMemo(() => {
    if (!cohort) return [];
    return learners
      .filter((l) => cohort.memberLearnerIds.includes(l.id))
      .map((learner) => {
        const skillProgresses = calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions);
        const readiness = calculateOverallTrainingProgress(skillProgresses);
        const flags = computeLearnerAttentionFlags(learner, skillProgresses, assignments, cohorts);
        return { learner, readiness, flags };
      });
  }, [cohort, learners, assignments, cohorts]);

  const averageReadiness = memberRows.length === 0 ? 0 : Math.round(memberRows.reduce((s, r) => s + r.readiness, 0) / memberRows.length);

  if (!cohort) {
    return (
      <Card>
        <EmptyState title="Cohort not found" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Enterprise Admin · Cohort"
        title={cohort.name}
        description={cohort.description}
        accent="from-slate-500/10 via-blue-500/10 to-transparent"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{memberRows.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">Average readiness</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{averageReadiness}%</p>
        </Card>
        <Card>
          <p className="text-xs text-slate-500 dark:text-slate-400">Needing attention</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{memberRows.filter((r) => r.flags.length > 0).length}</p>
        </Card>
      </div>

      <Card>
        <SectionHeading title="Members" />
        {memberRows.length === 0 ? (
          <EmptyState title="No members yet" />
        ) : (
          <ul className="space-y-2 text-sm">
            {memberRows.map(({ learner, readiness, flags }) => (
              <li key={learner.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
                <Link href={`/admin/learners/${learner.id}`} className="flex items-center gap-2 font-medium text-slate-900 hover:underline dark:text-slate-100">
                  <LearnerIdentityBadge isYou={learner.isYou} />
                  {learner.name}
                </Link>
                <span className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400">{readiness}%</span>
                  <AttentionIndicator flags={flags} />
                  {cohort.isCustom && (
                    <button
                      type="button"
                      onClick={() => toggleMember(cohort.id, learner.id)}
                      className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {cohort.isCustom && (
        <Card>
          <SectionHeading title="Add members" subtitle="Only custom cohorts support editable membership" />
          <div className="grid gap-2 sm:grid-cols-2">
            {learners
              .filter((l) => !cohort.memberLearnerIds.includes(l.id))
              .map((learner) => (
                <button
                  key={learner.id}
                  type="button"
                  onClick={() => toggleMember(cohort.id, learner.id)}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-left text-sm transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
                >
                  <span className="flex items-center gap-2">
                    <LearnerIdentityBadge isYou={learner.isYou} />
                    {learner.name}
                  </span>
                  <Badge variant="accent">Add</Badge>
                </button>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
