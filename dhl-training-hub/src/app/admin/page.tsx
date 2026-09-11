"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { MetricCard } from "@/components/MetricCard";
import { EmptyState } from "@/components/EmptyState";
import { UsersIcon, TargetIcon, ChartIcon, FlaskFlowIcon, ClockIcon, ShieldIcon } from "@/components/icons";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminProgrammes } from "@/lib/adminProgrammes";
import { useAdminAssignments } from "@/lib/adminAssignments";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { computeAdminDashboardKpis } from "@/lib/adminKpis";
import { computeLearnerAttentionFlags } from "@/lib/adminRiskSignals";
import { calculateAllSkillProgress } from "@/lib/skillProgress";
import { AttentionIndicator, LearnerIdentityBadge } from "@/components/admin/AdminBadges";

export default function AdminDashboardPage() {
  const { learners, loaded } = useAdminRoster();
  const { programmes } = useAdminProgrammes();
  const { assignments } = useAdminAssignments();
  const { cohorts } = useAdminCohorts();

  const kpis = useMemo(() => computeAdminDashboardKpis(learners, programmes, assignments, cohorts), [learners, programmes, assignments, cohorts]);

  const flaggedLearners = useMemo(() => {
    return learners
      .map((learner) => {
        const skillProgresses = calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions);
        const flags = computeLearnerAttentionFlags(learner, skillProgresses, assignments, cohorts);
        return { learner, flags };
      })
      .filter((x) => x.flags.length > 0)
      .sort((a, b) => b.flags.length - a.flags.length)
      .slice(0, 6);
  }, [learners, assignments, cohorts]);

  if (!loaded) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Enterprise Admin"
        title="Programme Overview"
        description="Who is learning, what they've been assigned, and where attention is needed — computed from real training activity, never fabricated."
        accent="from-slate-500/10 via-blue-500/10 to-transparent"
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total learners" value={kpis.totalLearners} icon={<UsersIcon size={16} />} accentClass="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300" />
        <MetricCard label="Active (14 days)" value={kpis.activeLearners} icon={<ClockIcon size={16} />} accentClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" />
        <MetricCard label="Programme completion" value={`${kpis.programmeCompletionPercent}%`} icon={<TargetIcon size={16} />} accentClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300" />
        <MetricCard label="Average readiness" value={`${kpis.averageReadiness}%`} icon={<ChartIcon size={16} />} accentClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300" />
        <MetricCard label="Enterprise Projects completed" value={kpis.projectsCompleted} icon={<FlaskFlowIcon size={16} />} accentClass="bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300" />
        <MetricCard label="Overdue assignments" value={kpis.overdueAssignments} icon={<ClockIcon size={16} />} accentClass="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300" />
        <MetricCard label="Learners requiring attention" value={kpis.learnersRequiringAttention} icon={<ShieldIcon size={16} />} accentClass="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionHeading title="Learners requiring attention" subtitle="Deterministic, explainable flags — never an opaque score" />
          <Link href="/admin/learners" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            View all learners →
          </Link>
        </div>
        {flaggedLearners.length === 0 ? (
          <EmptyState title="No flags right now" description="No learner currently matches an attention rule." />
        ) : (
          <div className="space-y-2">
            {flaggedLearners.map(({ learner, flags }) => (
              <Link
                key={learner.id}
                href={`/admin/learners/${learner.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3 text-sm transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
              >
                <span className="flex items-center gap-2">
                  <LearnerIdentityBadge isYou={learner.isYou} />
                  <span className="font-medium text-slate-900 dark:text-slate-100">{learner.name}</span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{flags.map((f) => f.reason).join(" ")}</span>
                  <AttentionIndicator flags={flags} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/cohorts" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card interactive>
            <p className="font-medium text-slate-900 dark:text-slate-100">Manage cohorts →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Group learners and compare performance</p>
          </Card>
        </Link>
        <Link href="/admin/assignments" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card interactive>
            <p className="font-medium text-slate-900 dark:text-slate-100">Issue an assignment →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Assign a path, quiz, or project with a due date</p>
          </Card>
        </Link>
        <Link href="/admin/reports" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card interactive>
            <p className="font-medium text-slate-900 dark:text-slate-100">View a report →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A polished, printable cohort/programme report</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
