import Link from "next/link";
import { Card } from "@/components/Card";
import { LearningPathAnalyticsEntry } from "@/lib/types";

export function LearningPathAnalyticsCard({ entry }: { entry: LearningPathAnalyticsEntry }) {
  const { path, topicsCompleted, topicsTotal, progressPercentage, checkpointQuiz, relatedInvestigationsCompleted, relatedInvestigationsTotal, nextTopic } = entry;

  return (
    <Card>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{path.title}</p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${progressPercentage}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {topicsCompleted}/{topicsTotal} topics ({progressPercentage}%)
      </p>

      <dl className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex justify-between gap-2">
          <dt>Checkpoint quiz</dt>
          <dd className="font-medium text-slate-900 dark:text-slate-100">
            {checkpointQuiz && checkpointQuiz.bestPercentage !== null ? `${checkpointQuiz.bestPercentage}% best` : "Not attempted"}
          </dd>
        </div>
        {relatedInvestigationsTotal > 0 && (
          <div className="flex justify-between gap-2">
            <dt>Related investigations</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">
              {relatedInvestigationsCompleted}/{relatedInvestigationsTotal} completed
            </dd>
          </div>
        )}
      </dl>

      {nextTopic ? (
        <Link href={`/learn/${nextTopic.id}`} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          Continue: {nextTopic.title} →
        </Link>
      ) : (
        <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">Path complete</p>
      )}
    </Card>
  );
}
