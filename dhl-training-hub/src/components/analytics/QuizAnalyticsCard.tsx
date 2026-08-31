import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { TrendSparkline } from "@/components/analytics/TrendSparkline";
import { QuizAnalyticsEntry } from "@/lib/types";

const TREND_LABEL: Record<QuizAnalyticsEntry["trendDirection"], string> = {
  improving: "Improving",
  declining: "Declining",
  steady: "Steady",
  "insufficient-data": "Not enough attempts yet",
};

const TREND_VARIANT: Record<QuizAnalyticsEntry["trendDirection"], "success" | "warning" | "neutral"> = {
  improving: "success",
  declining: "warning",
  steady: "neutral",
  "insufficient-data": "neutral",
};

export function QuizAnalyticsCard({ entry }: { entry: QuizAnalyticsEntry }) {
  const { quiz, attemptCount, latestPercentage, bestPercentage, trend, trendDirection } = entry;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{quiz.title}</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{quiz.category}</p>
        </div>
        {attemptCount > 0 && <Badge variant={TREND_VARIANT[trendDirection]}>{TREND_LABEL[trendDirection]}</Badge>}
      </div>

      {attemptCount === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Not attempted yet.</p>
      ) : (
        <>
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{latestPercentage}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Best</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{bestPercentage}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attempts</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{attemptCount}</p>
            </div>
          </div>

          {trend.length >= 2 && (
            <div className="mt-3">
              <TrendSparkline
                points={trend.map((t) => ({ label: `#${t.attemptNumber}`, value: t.percentage }))}
                ariaLabel={`${quiz.title} score trend across ${trend.length} attempts`}
              />
            </div>
          )}
        </>
      )}

      <Link href={`/quizzes/${quiz.id}`} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
        {attemptCount > 0 ? "Retake this assessment →" : "Take this assessment →"}
      </Link>
    </Card>
  );
}
