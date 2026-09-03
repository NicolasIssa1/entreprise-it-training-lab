import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { DashboardNotes } from "@/components/DashboardNotes";
import { DashboardProgressSummary } from "@/components/DashboardProgressSummary";
import { CurrentAssignmentCard } from "@/components/CurrentAssignmentCard";
import { CompanyContextCard } from "@/components/CompanyContextCard";
import { AskTutorLink } from "@/components/AskTutorLink";
import { BeakerIcon, SparkleIcon, LayersIcon, BookIcon, BriefcaseIcon, ArrowRightIcon } from "@/components/icons";
import { dashboardData } from "@/lib/data/dashboard";
import { getTeamById } from "@/lib/data/teams";
import { internshipState } from "@/lib/data/internshipState";
import { buttonClass } from "@/lib/ui";

const QUICK_ACCESS = [
  {
    href: "/teams",
    label: "Explore Teams",
    description: "Infrastructure, Applications, Support & Network",
    icon: <LayersIcon size={18} />,
    accent: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  },
  {
    href: "/daily-log",
    label: "Daily Log",
    description: "Record today's learning and questions",
    icon: <BookIcon size={18} />,
    accent: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    href: "/cv-tracker",
    label: "CV Tracker",
    description: "Turn today's involvement into honest CV bullets",
    icon: <BriefcaseIcon size={18} />,
    accent: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  },
];

export default function DashboardPage() {
  const team = getTeamById(dashboardData.currentTeam);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Day ${dashboardData.dayNumber} · ${team?.name}`}
        title={`Welcome back — continue building your enterprise IT skills.`}
        description={dashboardData.progressSummary}
        actions={
          <>
            <Link href="/tickets" className={buttonClass("primary")}>
              <BeakerIcon size={15} />
              Continue Learning
            </Link>
            <AskTutorLink params={{}} variant="button">
              <SparkleIcon size={15} />
              Ask AI Tutor
            </AskTutorLink>
          </>
        }
      />
      <p className="-mt-6 px-1 text-xs text-slate-400">
        {internshipState.organization} &middot; {internshipState.role} &middot; {internshipState.department}
      </p>

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

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/80 to-transparent dark:border-blue-900 dark:from-blue-950/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Badge variant="accent">Today&rsquo;s practice</Badge>
            <p className="mt-2 max-w-xl text-sm text-slate-700 dark:text-slate-300">{dashboardData.todaysPractice}</p>
          </div>
          <Link href="/tickets" className={buttonClass("primary")}>
            Go to Ticket Simulator
            <ArrowRightIcon size={15} />
          </Link>
        </div>
      </Card>

      <DashboardProgressSummary />

      <CurrentAssignmentCard />

      <CompanyContextCard />

      <DashboardNotes />

      <section className="space-y-3">
        <SectionHeading title="Quick access" />
        <div className="grid gap-4 sm:grid-cols-3">
          {QUICK_ACCESS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              <Card className="h-full" interactive>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.accent}`}>{item.icon}</span>
                <p className="mt-3 flex items-center gap-1 font-medium text-slate-900 dark:text-slate-100">
                  {item.label}
                  <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
