import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { teams } from "@/lib/data/teams";

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        level="h1"
        title="Teams"
        subtitle="Generic enterprise IT concepts, organized by the three IT/BPU teams. No confidential DHL information — see CLAUDE.md."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {teams.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`} className="block">
            <Card className="h-full transition hover:border-blue-400">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{team.name}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{team.tagline}</p>
              <p className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                View team details →
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
