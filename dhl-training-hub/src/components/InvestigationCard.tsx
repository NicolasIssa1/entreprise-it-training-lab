import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { InvestigationScenario } from "@/lib/types";

export function InvestigationCard({ scenario, completed }: { scenario: InvestigationScenario; completed?: boolean }) {
  return (
    <Link
      href={`/tickets/investigate/${scenario.id}`}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <Card className="h-full" interactive>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="neutral">{scenario.difficulty}</Badge>
          {completed && <Badge variant="success">Completed</Badge>}
        </div>
        <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{scenario.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{scenario.description}</p>
        <p className="mt-2 text-xs text-slate-400">{scenario.estimatedMinutes} min investigation</p>
        <span className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
          {completed ? "Investigate again →" : "Start investigation →"}
        </span>
      </Card>
    </Link>
  );
}
