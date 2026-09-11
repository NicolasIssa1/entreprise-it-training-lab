import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { FlowDiagram } from "@/components/FlowDiagram";
import { RelatedTopics } from "@/components/RelatedTopics";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { AskTutorLink } from "@/components/AskTutorLink";
import { buildAutomationReviewPrompt } from "@/lib/ai/tutorPromptTemplates";
import { skillDefinitions, getAutomationLabScenariosForSkill } from "@/lib/data/skills";
import { AutomationLabAttempt, AutomationLabScenario, PerformanceCategory } from "@/lib/types";

const CATEGORY_BADGE_VARIANT: Record<PerformanceCategory, "success" | "accent" | "warning" | "danger"> = {
  Excellent: "success",
  Strong: "accent",
  Developing: "warning",
  "Needs Review": "danger",
};

export function AutomationLabResult({
  scenario,
  attempt,
  best,
  attemptCount,
  syncError,
  onTryAgain,
}: {
  scenario: AutomationLabScenario;
  attempt: AutomationLabAttempt;
  best?: AutomationLabAttempt;
  attemptCount: number;
  syncError: boolean;
  onTryAgain: () => void;
}) {
  const { score } = attempt;
  const ringCircumference = 2 * Math.PI * 38;

  const contributingSkills = skillDefinitions.filter((s) =>
    getAutomationLabScenariosForSkill(s.id).some((automationScenario) => automationScenario.id === scenario.id),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{scenario.title} — Results</h1>
      </div>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/60 to-transparent dark:border-blue-900 dark:from-blue-950/20">
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg viewBox="0 0 88 88" className="h-24 w-24 -rotate-90">
              <circle cx="44" cy="44" r="38" fill="none" strokeWidth="8" className="stroke-slate-100 dark:stroke-slate-800" />
              <circle
                cx="44"
                cy="44"
                r="38"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringCircumference - (score.overall / 100) * ringCircumference}
                className="stroke-blue-600 transition-all duration-1000 ease-out dark:stroke-blue-400"
              />
            </svg>
            <span className="absolute text-xl font-bold text-slate-900 dark:text-slate-100">{score.overall}</span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Score: {score.overall} / 100</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={CATEGORY_BADGE_VARIANT[score.overallCategory]}>{score.overallCategory}</Badge>
            </div>
            <p className="mt-2 max-w-md text-xs text-slate-400">
              A training indicator of your workflow-design reasoning, not a scientifically validated assessment.
            </p>
          </div>
        </div>
        {best && (
          <div className="mt-4 flex flex-wrap gap-8 border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Best score</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{best.score.overall}/100</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Attempts</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{attemptCount}</p>
            </div>
          </div>
        )}
        {syncError && (
          <div className="mt-3">
            <SyncErrorNotice message="We couldn't save this build to your account right now. It's saved on this device and will sync on your next attempt." />
          </div>
        )}
      </Card>

      <Card>
        <SectionHeading title="Performance breakdown" subtitle="Explanations, not just a score" />
        <div className="space-y-3">
          {score.categories.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900 dark:text-slate-100">{c.label}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {c.score}/100 &middot; {Math.round(c.weight * 100)}% weight
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-1.5 rounded-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${c.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <SectionHeading title="Correct" />
          {score.correct.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No blocks matched yet — see Missing below.</p>
          ) : (
            <ul className="space-y-2">
              {score.correct.map((b) => (
                <li key={b.id} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{b.label}</span> — {b.feedback}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <SectionHeading title="Missing" />
          {score.missing.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">Nothing missing — you included every essential and recommended block.</p>
          ) : (
            <ul className="space-y-2">
              {score.missing.map((b) => (
                <li key={b.id} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="mt-0.5 shrink-0 text-red-500 dark:text-red-400">✗</span>
                  <span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{b.label}</span> — {b.feedback}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {score.incorrectlyIncluded.length > 0 && (
        <Card>
          <SectionHeading title="Blocks that didn't belong here" />
          <ul className="space-y-2">
            {score.incorrectlyIncluded.map((b) => (
              <li key={b.id} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 shrink-0 text-amber-500">⚠</span>
                <span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{b.label}</span> — {b.feedback}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {score.orderingNotes.length > 0 && (
        <Card>
          <SectionHeading title="Ordering feedback" />
          <ul className="space-y-1.5">
            {score.orderingNotes.map((note) => (
              <li key={note} className="text-sm text-slate-700 dark:text-slate-300">
                {note}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeading title="Model workflow" subtitle={scenario.modelWorkflowSummary} />
          <AskTutorLink params={{ mode: "automation-review", automationScenario: scenario.id, prompt: buildAutomationReviewPrompt(scenario) }} variant="button">
            Ask Tutor to explain this
          </AskTutorLink>
        </div>
        <div className="overflow-x-auto pb-1">
          <FlowDiagram steps={score.modelOrder.map((b) => b.label)} accent="blue" />
        </div>
      </Card>

      {contributingSkills.length > 0 && (
        <Card>
          <SectionHeading title="Skill Progress Impact" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            This build contributes practical evidence toward {contributingSkills.map((s) => s.name).join(" and ")} training progress.
          </p>
          <Link href="/progress" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            View Progress →
          </Link>
        </Card>
      )}

      <section>
        <SectionHeading title="Recommended Review" subtitle="Learn topics connected to this build" />
        <RelatedTopics topicIds={scenario.relatedTopicIds} />
      </section>

      {scenario.isEnterpriseProject && (
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50/60 to-transparent dark:border-violet-900 dark:from-violet-950/20">
          <SectionHeading title="Add this project to your CV Tracker" subtitle="Portfolio / simulated project description — clearly labeled, never claimed as real deployment" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            &ldquo;{scenario.cvDescription}&rdquo;
          </p>
          {scenario.skillsDemonstrated && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Skills demonstrated: {scenario.skillsDemonstrated.join(", ")}
            </p>
          )}
          <Link
            href={`/cv-tracker?prefillProject=${scenario.id}&attemptScore=${score.overall}`}
            className="mt-3 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          >
            Add to CV Tracker →
          </Link>
        </Card>
      )}

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button
          onClick={onTryAgain}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Try again
        </button>
        <Link
          href={scenario.isEnterpriseProject ? "/projects" : "/automation-lab"}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          {scenario.isEnterpriseProject ? "Back to Enterprise Projects" : "Back to Automation Lab"}
        </Link>
      </div>
    </div>
  );
}
