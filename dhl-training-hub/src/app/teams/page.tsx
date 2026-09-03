import Link from "next/link";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRightIcon } from "@/components/icons";
import { categoryColor } from "@/lib/colors";
import { teams } from "@/lib/data/teams";

const TEAM_CATEGORY = {
  infrastructure: "Infrastructure",
  applications: "Applications",
  "support-network": "Networking",
} as const;

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Teams"
        title="How enterprise IT is organized."
        description="Generic enterprise IT concepts, organized by the three IT/BPU teams. No confidential DHL information — see CLAUDE.md."
        accent="from-blue-500/15 via-cyan-500/10 to-transparent"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {teams.map((team) => {
          const color = categoryColor(TEAM_CATEGORY[team.id]);
          return (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <Card className="h-full overflow-hidden" interactive>
                <div className={`-mx-5 -mt-5 mb-4 h-1.5 bg-gradient-to-r ${color.gradient}`} aria-hidden="true" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{team.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{team.tagline}</p>
                <p className={`mt-4 flex items-center gap-1 text-sm font-medium ${color.text}`}>
                  View team details
                  <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
