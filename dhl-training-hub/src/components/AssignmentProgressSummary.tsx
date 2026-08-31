import Link from "next/link";
import { AssignmentProgress } from "@/lib/types";

function RequirementRow({ label, completed, total, percentage }: { label: string; completed: number; total: number; percentage: number }) {
  if (total === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-700 dark:text-slate-300">{label}</p>
        <p className="font-medium text-slate-900 dark:text-slate-100">
          {completed} / {total}
        </p>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-1.5 rounded-full bg-blue-600 transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

/**
 * Reusable "required activities completed" breakdown for a TrainingAssignment
 * (Phase 9 Part E/H/I) — used by /assignments, /manager-preview, and
 * /pilot/report so the numbers always come from the same
 * computeAssignmentProgress() derivation. Assignment completion is only
 * completion against the required list — never a new competency score.
 */
export function AssignmentProgressSummary({ progress }: { progress: AssignmentProgress }) {
  const { assignment, paths, quizzes, investigations, overallCompletion, nextRequiredAction } = progress;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Assignment completion</p>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{overallCompletion}%</p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${overallCompletion}%` }} />
      </div>

      <div className="space-y-3">
        <RequirementRow label="Learning paths" completed={paths.completed} total={paths.total} percentage={paths.percentage} />
        <RequirementRow label="Assessments" completed={quizzes.completed} total={quizzes.total} percentage={quizzes.percentage} />
        <RequirementRow
          label="Investigations"
          completed={investigations.completed}
          total={investigations.total}
          percentage={investigations.percentage}
        />
      </div>

      {nextRequiredAction ? (
        <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Next required activity</p>
          <Link href={nextRequiredAction.href} className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            {nextRequiredAction.title} →
          </Link>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{nextRequiredAction.description}</p>
        </div>
      ) : (
        <p className="border-t border-slate-200 pt-3 text-sm text-emerald-700 dark:border-slate-800 dark:text-emerald-400">
          All required activities for &ldquo;{assignment.title}&rdquo; are complete.
        </p>
      )}
    </div>
  );
}
