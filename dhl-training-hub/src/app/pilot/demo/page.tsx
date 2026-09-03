import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";

const TOUR_STEPS = [
  { step: 1, title: "View the curriculum", description: "Browse the 80-topic Learn library across six categories.", href: "/learn" },
  { step: 2, title: "Try a sample lesson", description: "Open a full lesson — simple explanation through practice scenario.", href: "/learn/dns" },
  { step: 3, title: "Try a quiz", description: "Take a scenario-based knowledge assessment.", href: "/quizzes" },
  {
    step: 4,
    title: "Try an investigation",
    description: "Work through a branching, evidence-driven Advanced Investigation.",
    href: "/tickets",
  },
  { step: 5, title: "View learner analytics", description: "See the reporting layer over training activity.", href: "/analytics" },
  { step: 6, title: "View manager preview", description: "A read-only preview of what a manager/trainer might see.", href: "/manager-preview" },
  { step: 7, title: "Explore the AI Tutor", description: "A curriculum-grounded tutor for Q&A and coaching.", href: "/tutor" },
];

/**
 * Pilot Demo Mode (Phase 9 Part B) — a guided product tour via real links into
 * the existing app, not a separate application and not fake private users.
 * Whoever follows this tour sees exactly the same app a real learner uses.
 */
export default function PilotDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Guided Product Tour</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          A quick, ordered walkthrough of the product for a manager, trainer, or internship lead — every step links
          into the real, working application.
        </p>
      </div>

      <Disclaimer>
        This is not a separate demo environment or fake accounts — every link below opens the same application a
        learner actually uses, with your own local (or signed-in) data.
      </Disclaimer>

      <div className="space-y-3">
        {TOUR_STEPS.map((s) => (
          <Link key={s.step} href={s.href} className="block">
            <Card interactive>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {s.step}
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{s.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{s.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <SectionHeading title="After the tour" />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Take a look at the{" "}
          <Link href="/pilot/report" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            sample pilot report
          </Link>{" "}
          and the{" "}
          <Link href="/pilot/readiness" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            pilot readiness checklist
          </Link>{" "}
          for an honest picture of what a real pilot would need.
        </p>
      </Card>
    </div>
  );
}
