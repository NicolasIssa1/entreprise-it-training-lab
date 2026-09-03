import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageGroupHeading } from "@/components/PageGroupHeading";
import { Checklist } from "@/components/Checklist";
import { TeamObservations } from "@/components/TeamObservations";
import { InvestigationCard } from "@/components/InvestigationCard";
import { teams, getTeamById } from "@/lib/data/teams";
import { getTicketsForTeam } from "@/lib/data/tickets";
import { getQuestionsForTeam } from "@/lib/data/questions";
import { getTopicsForTeam } from "@/lib/data/learning";
import { getScenariosForTeam } from "@/lib/data/investigations";

export function generateStaticParams() {
  return teams.map((team) => ({ teamId: team.id }));
}

export default async function TeamDetailPage(props: PageProps<"/teams/[teamId]">) {
  const { teamId } = await props.params;
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const { likely: likelyTickets, crossTeam: crossTeamTickets } = getTicketsForTeam(team.id);
  const questions = getQuestionsForTeam(team.id)?.questions ?? [];
  const recommendedLearning = getTopicsForTeam(team.id);
  const advancedScenarios = getScenariosForTeam(team.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{team.name}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{team.tagline}</p>
      </div>

      <PageGroupHeading label="Overview Knowledge" />
      <section className="space-y-4">
        <SectionHeading
          title="General Enterprise IT Knowledge"
          subtitle="Generic knowledge about what a team of this type commonly does industry-wide — not a confirmed description of this specific DHL team."
        />

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
              <div key={c.area} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{c.area}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{c.connection}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Learning checklist" />
          <Checklist teamId={team.id} items={team.checklist} />
        </Card>
      </section>

      <PageGroupHeading label="Learning" />
      <section className="space-y-4">
        <SectionHeading title="Recommended Learning" subtitle="Lessons connected to this team, in the Learn library" />
        <div className="grid gap-3 sm:grid-cols-2">
          {recommendedLearning.map((topic) => (
            <Link key={topic.id} href={`/learn/${topic.id}`} className="block">
              <Card className="h-full" interactive>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{topic.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{topic.shortDescription}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <PageGroupHeading label="Practice" />
      <section className="space-y-4">
        <SectionHeading
          title="Common Training Tickets"
          subtitle="Generic fictional problems this team is the likely/recommended owner for — not real DHL incidents"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {likelyTickets.map((ticket) => (
            <Card key={ticket.id}>
              <span className="text-xs font-mono text-slate-500">{ticket.id}</span>
              <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.title}</p>
              <p className="mt-1 text-xs italic text-slate-400">
                Generic training example — not a real DHL incident.
              </p>
              <Link
                href={`/tickets?ticket=${ticket.id}`}
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Practice this scenario →
              </Link>
            </Card>
          ))}
        </div>

        {crossTeamTickets.length > 0 && (
          <>
            <SectionHeading
              title="Cross-Team Scenarios"
              subtitle="Genuinely ambiguous tickets where this team could plausibly be involved, even though another team is the primary recommendation"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {crossTeamTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <span className="text-xs font-mono text-slate-500">{ticket.id}</span>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-slate-100">{ticket.title}</p>
                  <p className="mt-1 text-xs italic text-slate-400">
                    Generic training example — not a real DHL incident.
                  </p>
                  <Link
                    href={`/tickets?ticket=${ticket.id}`}
                    className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Practice this scenario →
                  </Link>
                </Card>
              ))}
            </div>
          </>
        )}
        {advancedScenarios.length > 0 && (
          <>
            <SectionHeading
              title="Advanced Practice"
              subtitle="Multi-step branching investigations this team is commonly involved in"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {advancedScenarios.map((scenario) => (
                <InvestigationCard key={scenario.id} scenario={scenario} />
              ))}
            </div>
          </>
        )}
      </section>

      <PageGroupHeading label="Internship" />
      <section className="space-y-4">
        <SectionHeading title="Questions to Ask This Team" subtitle="Generic prompts — update with real answers once you know them" />
        <Card>
          <ul className="space-y-2">
            {questions.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                {q}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="What I Have Observed During My Internship"
          subtitle="Only information personally recorded in the Daily Log — never invented"
        />
        <Card>
          <TeamObservations teamId={team.id} />
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Things I Still Want to Learn" subtitle="Open questions, not yet answered" />
        <Card>
          <ul className="space-y-2">
            {team.thingsToLearn.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
