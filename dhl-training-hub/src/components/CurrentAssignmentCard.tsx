"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";

/**
 * Compact Dashboard card (Phase 9 Part G) — deliberately small, not a
 * duplicate of the full /assignments breakdown: assignment name, an overall
 * progress bar, and the next required activity, with a link out to
 * /assignments for the full picture (same "compact summary + link out"
 * pattern as DashboardProgressSummary and AnalyticsDashboardCard).
 */
export function CurrentAssignmentCard() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { selectedAssignment } = useSelectedAssignment();

  if (!selectedAssignment) {
    return (
      <Card>
        <SectionHeading title="Current Assignment" subtitle="No training assignment activated yet" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Activate a Training Assignment template to get a focused, trackable list of required lessons, assessments, and
          investigations.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/assignments" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Browse assignments →
          </Link>
          <Link href="/onboarding" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Take the onboarding quiz →
          </Link>
        </div>
      </Card>
    );
  }

  const progress = computeAssignmentProgress(selectedAssignment, completed, allAttempts, investigationCompletions);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionHeading title="Current Assignment" subtitle={progress.assignment.title} />
        <Link href="/assignments" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View assignment →
        </Link>
      </div>
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-600 dark:text-slate-400">Overall completion</p>
        <p className="font-semibold text-slate-900 dark:text-slate-100">{progress.overallCompletion}%</p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${progress.overallCompletion}%` }} />
      </div>
      {progress.nextRequiredAction ? (
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Next required activity</p>
          <Link
            href={progress.nextRequiredAction.href}
            className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {progress.nextRequiredAction.title} →
          </Link>
        </div>
      ) : (
        <p className="mt-3 border-t border-slate-200 pt-3 text-sm text-emerald-700 dark:border-slate-800 dark:text-emerald-400">
          All required activities complete.
        </p>
      )}
    </Card>
  );
}
