import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { DashboardNotes } from "@/components/DashboardNotes";
import { dashboardData } from "@/lib/data/dashboard";
import { getTeamById } from "@/lib/data/teams";
import { internshipState } from "@/lib/data/internshipState";

export default function DashboardPage() {
  const team = getTeamById(dashboardData.currentTeam);

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="accent">Day {dashboardData.dayNumber}</Badge>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Day {dashboardData.dayNumber} — {team?.name}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          {internshipState.organization} &middot; {internshipState.role} &middot; {internshipState.department}
        </p>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{dashboardData.progressSummary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <SectionHeading title="Today's goals" />
          <ul className="space-y-2">
            {dashboardData.todaysGoals.map((goal) => (
              <li key={goal} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                {goal}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <SectionHeading title="Today's questions to ask" subtitle="See Daily Log for the full list per team" />
          <ul className="space-y-2">
            {dashboardData.todaysQuestions.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {q}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <SectionHeading title="Today's practice exercise" />
        <p className="text-sm text-slate-700 dark:text-slate-300">{dashboardData.todaysPractice}</p>
        <Link
          href="/tickets"
          className="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to Ticket Simulator →
        </Link>
      </Card>

      <DashboardNotes />

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/teams" className="block">
          <Card className="h-full transition hover:border-blue-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">Explore Teams</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Infrastructure, Applications, Support &amp; Network
            </p>
          </Card>
        </Link>
        <Link href="/daily-log" className="block">
          <Card className="h-full transition hover:border-blue-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">Daily Log</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Record today&rsquo;s learning and questions
            </p>
          </Card>
        </Link>
        <Link href="/cv-tracker" className="block">
          <Card className="h-full transition hover:border-blue-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">CV Tracker</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Turn today&rsquo;s involvement into honest CV bullets
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
