"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { inputClass } from "@/lib/ui";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminProgrammes } from "@/lib/adminProgrammes";
import { useAdminAssignments } from "@/lib/adminAssignments";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { computeAdminDashboardKpis } from "@/lib/adminKpis";
import { computeLearnerAttentionFlags } from "@/lib/adminRiskSignals";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { AttentionIndicator, LearnerIdentityBadge } from "@/components/admin/AdminBadges";

type SortKey = "name" | "readiness" | "activity";

function daysAgoLabel(iso: string | null): string {
  if (!iso) return "No activity yet";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function AdminLearnersPage() {
  const { learners } = useAdminRoster();
  const { programmes } = useAdminProgrammes();
  const { assignments } = useAdminAssignments();
  const { cohorts } = useAdminCohorts();

  const [query, setQuery] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDesc, setSortDesc] = useState(false);

  const rows = useMemo(() => {
    return learners.map((learner) => {
      const skillProgresses = calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions);
      const readiness = calculateOverallTrainingProgress(skillProgresses);
      const programme = learner.programmeId ? programmes.find((p) => p.id === learner.programmeId) : undefined;
      const flags = computeLearnerAttentionFlags(learner, skillProgresses, assignments, cohorts);
      return { learner, readiness, programme, flags };
    });
  }, [learners, programmes, assignments, cohorts]);

  const filtered = rows
    .filter((r) => r.learner.name.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => cohortFilter === "all" || r.learner.cohortIds.includes(cohortFilter))
    .filter((r) => !attentionOnly || r.flags.length > 0);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.learner.name.localeCompare(b.learner.name);
    if (sortKey === "readiness") cmp = a.readiness - b.readiness;
    if (sortKey === "activity") cmp = (a.learner.lastActivityAt ?? "").localeCompare(b.learner.lastActivityAt ?? "");
    return sortDesc ? -cmp : cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(key !== "name");
    }
  }

  const kpis = useMemo(() => computeAdminDashboardKpis(learners, programmes, assignments, cohorts), [learners, programmes, assignments, cohorts]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Enterprise Admin" title="Learners" description={`${kpis.totalLearners} total, ${kpis.activeLearners} active in the last 14 days.`} accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search learners..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputClass} max-w-xs`}
            aria-label="Search learners"
          />
          <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className={`${inputClass} w-auto`} aria-label="Filter by cohort">
            <option value="all">All cohorts</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={attentionOnly} onChange={(e) => setAttentionOnly(e.target.checked)} />
            Needs attention only
          </label>
        </div>
      </Card>

      {sorted.length === 0 ? (
        <EmptyState title="No learners match" description="Try clearing your search or filters." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("name")}>
                  Learner {sortKey === "name" && (sortDesc ? "↓" : "↑")}
                </th>
                <th className="px-4 py-3">Programme</th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("readiness")}>
                  Readiness {sortKey === "readiness" && (sortDesc ? "↓" : "↑")}
                </th>
                <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort("activity")}>
                  Last activity {sortKey === "activity" && (sortDesc ? "↓" : "↑")}
                </th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ learner, readiness, programme, flags }) => (
                <tr key={learner.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/learners/${learner.id}`} className="flex items-center gap-2 font-medium text-slate-900 hover:underline dark:text-slate-100">
                      <LearnerIdentityBadge isYou={learner.isYou} />
                      {learner.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{programme?.title ?? "Not assigned"}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{readiness}%</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{daysAgoLabel(learner.lastActivityAt)}</td>
                  <td className="px-4 py-3">
                    <AttentionIndicator flags={flags} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
