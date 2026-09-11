import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { AutomationLabScenario } from "@/lib/types";

export function AutomationLabCard({
  scenario,
  bestScore,
  showAudience = false,
}: {
  scenario: AutomationLabScenario;
  bestScore?: number;
  showAudience?: boolean;
}) {
  return (
    <Link
      href={`/automation-lab/${scenario.id}`}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <Card className="h-full" interactive>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Badge variant="neutral">{scenario.difficulty}</Badge>
          {bestScore !== undefined && <Badge variant="success">Best: {bestScore}/100</Badge>}
        </div>
        <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{scenario.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{scenario.description}</p>
        {showAudience && scenario.projectAudience && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{scenario.projectAudience}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {scenario.toolsInvolved.map((tool) => (
            <Badge key={tool} variant="accent">
              {tool}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">{scenario.estimatedMinutes} min build</p>
        <span className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
          {bestScore !== undefined ? "Build again →" : "Start building →"}
        </span>
      </Card>
    </Link>
  );
}
