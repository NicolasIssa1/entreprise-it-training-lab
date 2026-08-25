import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Checklist } from "@/components/Checklist";
import { teams, getTeamById } from "@/lib/data/teams";

export function generateStaticParams() {
  return teams.map((team) => ({ teamId: team.id }));
}

export default async function TeamDetailPage(props: PageProps<"/teams/[teamId]">) {
  const { teamId } = await props.params;
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{team.name}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{team.tagline}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionHeading title="Simple explanation" />
          <p className="text-sm text-slate-700 dark:text-slate-300">{team.simpleExplanation}</p>
        </Card>
        <Card>
          <SectionHeading title="Technical explanation" />
          <p className="text-sm text-slate-700 dark:text-slate-300">{team.technicalExplanation}</p>
        </Card>
      </div>

      <Card>
        <SectionHeading title="Common responsibilities" />
        <ul className="grid gap-2 sm:grid-cols-2">
          {team.responsibilities.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              {r}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionHeading title="Example problems" subtitle="Generic training examples, not real incidents" />
        <ul className="space-y-2">
          {team.exampleProblems.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {p}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionHeading title="University connections" subtitle="MEng Computer Science with Artificial Intelligence" />
        <div className="grid gap-3 sm:grid-cols-2">
          {team.universityConnections.map((c) => (
            <div key={c.area} className="rounded-md bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.area}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{c.connection}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title="Learning checklist" />
        <Checklist items={team.checklist} />
      </Card>
    </div>
  );
}
