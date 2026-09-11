"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { PrintSummaryButton } from "@/components/PrintSummaryButton";
import { EmptyState } from "@/components/EmptyState";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { useAdminAssignments } from "@/lib/adminAssignments";
import { isLearnerActive } from "@/lib/adminKpis";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { computeLearnerAttentionFlags } from "@/lib/adminRiskSignals";
import { skillDefinitions } from "@/lib/data/skills";
import { automationLabScenarios, getAutomationLabScenarioById } from "@/lib/data/automationLab";
import { displayProductName } from "@/lib/product";

export default function AdminCohortReportPage() {
  const params = useParams<{ cohortId: string }>();
  const { learners } = useAdminRoster();
  const { cohorts } = useAdminCohorts();
  const { assignments } = useAdminAssignments();

  const cohort = params.cohortId === "all" ? null : cohorts.find((c) => c.id === params.cohortId);
  const scopedLearners = cohort ? learners.filter((l) => cohort.memberLearnerIds.includes(l.id)) : learners;

  const rows = useMemo(
    () =>
      scopedLearners.map((learner) => {
        const skillProgresses = calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions);
        const readiness = calculateOverallTrainingProgress(skillProgresses);
        const flags = computeLearnerAttentionFlags(learner, skillProgresses, assignments, cohorts);
        return { learner, skillProgresses, readiness, flags };
      }),
    [scopedLearners, assignments, cohorts],
  );

  const activeCount = rows.filter((r) => isLearnerActive(r.learner)).length;
  const avgReadiness = rows.length === 0 ? 0 : Math.round(rows.reduce((s, r) => s + r.readiness, 0) / rows.length);

  const skillAverages = skillDefinitions.map((skill) => {
    const entries = rows.map((r) => r.skillProgresses.find((s) => s.skill.id === skill.id)!);
    const avg = entries.length === 0 ? 0 : Math.round(entries.reduce((s, e) => s + e.overall, 0) / entries.length);
    return { skill, avg };
  });
  const sortedBySkill = [...skillAverages].sort((a, b) => b.avg - a.avg);
  const strengths = sortedBySkill.slice(0, 3);
  const gaps = [...sortedBySkill].reverse().slice(0, 3);

  const projectIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));
  const completedProjects = rows.flatMap((r) => r.learner.automationLabCompletions.filter((c) => projectIds.has(c.scenarioId)).map((c) => ({ learner: r.learner, scenarioId: c.scenarioId, score: c.score })));

  const needingSupport = rows.filter((r) => r.flags.length > 0);

  const title = cohort ? cohort.name : "Whole roster";

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/admin/reports" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Reports
        </Link>
        <PrintSummaryButton />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 print:text-black">{title} — Programme Report</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 print:text-black">
          {displayProductName} · Generated {new Date().toLocaleDateString()}
        </p>
      </div>

      <Disclaimer>
        Demo data notice: most learners in this report are fictional, generated for illustration — only rows/records
        labeled &ldquo;You&rdquo; reflect a real account. Educational progress indicators only — not a certification
        or validated professional assessment.
      </Disclaimer>

      {rows.length === 0 ? (
        <EmptyState title="No learners in this group" />
      ) : (
        <>
          <Card className="print:border-slate-300 print:shadow-none">
            <SectionHeading title="Overview" />
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500 print:text-black">Participants</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 print:text-black">{rows.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 print:text-black">Active (14 days)</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 print:text-black">{activeCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 print:text-black">Average readiness</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 print:text-black">{avgReadiness}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 print:text-black">Enterprise Projects completed</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 print:text-black">{completedProjects.length}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
            <Card className="print:border-slate-300 print:shadow-none">
              <SectionHeading title="Strongest areas" />
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                {strengths.map((s) => (
                  <li key={s.skill.id}>
                    {s.skill.name} — {s.avg}%
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="print:border-slate-300 print:shadow-none">
              <SectionHeading title="Focus areas" />
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                {gaps.map((s) => (
                  <li key={s.skill.id}>
                    {s.skill.name} — {s.avg}%{s.avg <= 25 ? " (below foundation)" : ""}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="print:border-slate-300 print:shadow-none">
            <SectionHeading title="Completed Enterprise Projects" />
            {completedProjects.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 print:text-black">None completed yet.</p>
            ) : (
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                {completedProjects.map((p, i) => (
                  <li key={i}>
                    {p.learner.name} — {getAutomationLabScenarioById(p.scenarioId)?.title ?? p.scenarioId} ({p.score}%)
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="print:border-slate-300 print:shadow-none">
            <SectionHeading title="Learners needing support" />
            {needingSupport.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 print:text-black">No flags at this time.</p>
            ) : (
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
                {needingSupport.map((r) => (
                  <li key={r.learner.id}>
                    {r.learner.name} — {r.flags.map((f) => f.reason).join(" ")}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
