import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { InvestigationAnalytics } from "@/lib/types";

const CATEGORY_VARIANT: Record<string, "success" | "accent" | "warning" | "danger"> = {
  Excellent: "success",
  Strong: "accent",
  Developing: "warning",
  "Needs Review": "danger",
};

export function InvestigationAnalyticsSummary({ analytics }: { analytics: InvestigationAnalytics }) {
  const { completions, completedCount, totalScenarios, averageScore, strongestAreas, focusAreas } = analytics;

  if (completedCount === 0) {
    return (
      <EmptyState
        title="No Advanced Investigations completed yet"
        description="Complete one to see your training performance summarized here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {completedCount}/{totalScenarios}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Average training score</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{averageScore}%</p>
          </div>
        </div>

        {(strongestAreas.length > 0 || focusAreas.length > 0) && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {strongestAreas.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Strongest areas</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {strongestAreas.map((a) => (
                    <li key={a.category}>
                      {a.category} — {a.averageScore}% avg ({a.completedCount} completed)
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {focusAreas.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Focus areas</p>
                <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {focusAreas.map((a) => (
                    <li key={a.category}>
                      {a.category} — {a.averageScore}% avg ({a.completedCount} completed)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      <section className="space-y-3">
        <SectionHeading title="Completed investigations" />
        <div className="grid gap-3 sm:grid-cols-2">
          {completions.map((c) => (
            <Card key={`${c.scenario.id}-${c.completedAt}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.scenario.title}</p>
                <Badge variant={CATEGORY_VARIANT[c.resultCategory] ?? "neutral"}>{c.resultCategory}</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {c.score}% training score · {new Date(c.completedAt).toLocaleDateString()}
                {c.primaryCategory ? ` · ${c.primaryCategory}` : ""}
              </p>
              <Link
                href={`/tickets/investigate/${c.scenario.id}`}
                className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View investigation →
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
