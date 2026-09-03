"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { PrintSummaryButton } from "@/components/PrintSummaryButton";
import { ActivityTimelineList } from "@/components/analytics/ActivityTimelineList";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { computeTrainingSummary } from "@/lib/analytics";
import { internshipState } from "@/lib/data/internshipState";

/**
 * A concise, printable training summary (Phase 8 Part H/I) — suitable for
 * showing a mentor, an internship discussion, or portfolio evidence. Reuses
 * computeTrainingSummary(), the same derivation /manager-preview builds
 * from, so the numbers here always match. See globals.css for print rules
 * and layout.tsx for the nav/footer print:hidden wrapper.
 */
export default function AnalyticsSummaryPage() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();

  const summary = computeTrainingSummary(completed, allAttempts, investigationCompletions);
  const { overview, strongestSkills, focusSkills, recentActivity } = summary;

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <Link href="/analytics" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Analytics
        </Link>
        <PrintSummaryButton />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 print:text-black">Personal Training Summary</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 print:text-black">
          {internshipState.organization} · {internshipState.role} · Generated {new Date(summary.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <Disclaimer>
        Personal training summary — not a professional certification or validated competency assessment. This view
        contains structured training progress only. Daily Log entries, CV Achievement descriptions, and AI Tutor
        conversations are excluded.
      </Disclaimer>

      <Card className="print:border-slate-300 print:shadow-none">
        <SectionHeading title="Training Overview" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryStat label="Topics" value={`${overview.topicsCompleted} / ${overview.topicsTotal}`} />
          <SummaryStat label="Quizzes completed" value={`${overview.quizzesAttempted}`} />
          <SummaryStat label="Investigations completed" value={`${overview.investigationsCompleted}`} />
          <SummaryStat label="Overall progress" value={`${overview.overallProgress}%`} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="print:border-slate-300 print:shadow-none">
          <SectionHeading title="Strongest areas" />
          {strongestSkills.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 print:text-black">Not enough activity yet to identify a strongest area.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
              {strongestSkills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="print:border-slate-300 print:shadow-none">
          <SectionHeading title="Focus areas" />
          {focusSkills.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 print:text-black">Not enough activity yet to identify a focus area.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 print:text-black">
              {focusSkills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="print:border-slate-300 print:shadow-none">
        <SectionHeading title="Recent activity" />
        <ActivityTimelineList events={recentActivity} />
      </Card>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 print:text-black">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 print:text-black">{value}</p>
    </div>
  );
}
