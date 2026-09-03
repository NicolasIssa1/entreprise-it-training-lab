import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { DashboardNotes } from "@/components/DashboardNotes";
import { DashboardProgressSummary } from "@/components/DashboardProgressSummary";
import { CurrentAssignmentCard } from "@/components/CurrentAssignmentCard";
import { CompanyContextCard } from "@/components/CompanyContextCard";
import { AskTutorLink } from "@/components/AskTutorLink";
import { dashboardData } from "@/lib/data/dashboard";
import { getTeamById } from "@/lib/data/teams";
import { internshipState } from "@/lib/data/internshipState";
import { buttonClass } from "@/lib/ui";

export default function DashboardPage() {
  const team = getTeamById(dashboardData.currentTeam);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 60% 100% at 100% 0%, rgba(37,99,235,0.10), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <Badge variant="accent">Day {dashboardData.dayNumber}</Badge>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Day {dashboardData.dayNumber} — {team?.name}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {internshipState.organization} &middot; {internshipState.role} &middot; {internshipState.department}
          </p>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{dashboardData.progressSummary}</p>
        </div>
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
        <Link href="/tickets" className={`mt-3 ${buttonClass("primary")}`}>
          Go to Ticket Simulator →
        </Link>
      </Card>

      <DashboardProgressSummary />

      <CurrentAssignmentCard />

      <CompanyContextCard />

      <Card>
        <SectionHeading title="Ask the AI Tutor" subtitle="Get a grounded explanation of any enterprise IT concept from this app's curriculum" />
        <AskTutorLink params={{}} variant="button">
          Open AI Tutor →
        </AskTutorLink>
      </Card>

      <DashboardNotes />

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/teams" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card className="h-full" interactive>
            <p className="font-medium text-slate-900 dark:text-slate-100">Explore Teams</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Infrastructure, Applications, Support &amp; Network
            </p>
          </Card>
        </Link>
        <Link href="/daily-log" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card className="h-full" interactive>
            <p className="font-medium text-slate-900 dark:text-slate-100">Daily Log</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Record today&rsquo;s learning and questions
            </p>
          </Card>
        </Link>
        <Link href="/cv-tracker" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card className="h-full" interactive>
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
