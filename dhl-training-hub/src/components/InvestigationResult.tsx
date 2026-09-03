import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { TeamBadge } from "@/components/TeamBadge";
import { RelatedTopics } from "@/components/RelatedTopics";
import { AskTutorLink } from "@/components/AskTutorLink";
import { getTeamLabel } from "@/lib/data/teams";
import { skillDefinitions, getInvestigationsForSkill } from "@/lib/data/skills";
import {
  ActionQuality,
  DOCUMENTATION_FIELDS,
  INVESTIGATION_HYPOTHESES,
  InvestigationHypothesis,
  InvestigationOutcome,
  InvestigationProgress,
  InvestigationScenario,
  InvestigationScore,
  PerformanceCategory,
} from "@/lib/types";

const OUTCOME_QUALITY_VARIANT: Record<ActionQuality, "success" | "accent" | "warning" | "danger"> = {
  strong: "success",
  reasonable: "accent",
  weak: "warning",
  unnecessary: "danger",
};

function hypothesisLabel(id: InvestigationHypothesis | undefined): string {
  if (!id) return "Not set";
  return INVESTIGATION_HYPOTHESES.find((h) => h.id === id)?.label ?? id;
}

const CATEGORY_BADGE_VARIANT: Record<PerformanceCategory, "success" | "accent" | "warning" | "danger"> = {
  Excellent: "success",
  Strong: "accent",
  Developing: "warning",
  "Needs Review": "danger",
};

export function InvestigationResult({
  scenario,
  score,
  progress,
  outcome,
  onRestart,
}: {
  scenario: InvestigationScenario;
  score: InvestigationScore;
  progress: InvestigationProgress;
  outcome: InvestigationOutcome;
  onRestart: () => void;
}) {
  const initialHypothesis = progress.hypothesisHistory[0];
  const finalHypothesis = progress.hypothesisHistory[progress.hypothesisHistory.length - 1];

  const contributingSkills = skillDefinitions.filter((s) =>
    getInvestigationsForSkill(s.id).some((investigationScenario) => investigationScenario.id === scenario.id),
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={outcome.result === "resolved" ? "success" : "accent"}>
            {outcome.result === "resolved" ? "Resolved" : "Escalated"}
          </Badge>
          <Badge variant={OUTCOME_QUALITY_VARIANT[outcome.quality]}>{outcome.quality} ending</Badge>
          {outcome.escalatedTeam && <TeamBadge teamId={outcome.escalatedTeam} />}
        </div>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{outcome.summary}</p>
        {outcome.escalatedTeam && (
          <p className="mt-2 text-xs text-slate-400">
            This evidence would commonly justify involving {getTeamLabel(outcome.escalatedTeam)} — exact ownership
            varies by organization.
          </p>
        )}
      </Card>

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
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 - (score.overall / 100) * 2 * Math.PI * 38}
                className="stroke-blue-600 transition-all duration-1000 ease-out dark:stroke-blue-400"
              />
            </svg>
            <span className="absolute text-xl font-bold text-slate-900 dark:text-slate-100">{score.overall}</span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Investigation complete</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={CATEGORY_BADGE_VARIANT[score.overallCategory]}>{score.overallCategory}</Badge>
            </div>
            <p className="mt-2 max-w-md text-xs text-slate-400">
              A training indicator of your reasoning process, not a scientifically validated assessment.
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeading
          title="Performance breakdown"
          subtitle="Weighted across six areas — click count alone was never the goal"
        />
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
          <SectionHeading title="What you did well" />
          <ul className="space-y-2">
            {score.whatWentWell.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {w}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionHeading title="What could improve" />
          <ul className="space-y-2">
            {score.whatCouldImprove.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {w}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeading title="Better reasoning path" />
          <AskTutorLink params={{ mode: "investigation-review", scenario: scenario.id }} variant="button">
            Ask Tutor to explain this
          </AskTutorLink>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">{score.betterReasoningPath}</p>
      </Card>

      <Card>
        <SectionHeading
          title="Your hypothesis"
          subtitle="Changing your mind as new evidence appears is normal, not a failure"
        />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Initial: <strong>{hypothesisLabel(initialHypothesis)}</strong> &rarr; Final:{" "}
          <strong>{hypothesisLabel(finalHypothesis)}</strong>
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Model final hypothesis for this scenario: {hypothesisLabel(scenario.modelFinalHypothesis)}
        </p>
      </Card>

      <Card>
        <SectionHeading title="A good example resolution note" subtitle="For comparison — not the only acceptable wording" />
        <dl className="space-y-3 text-sm">
          {DOCUMENTATION_FIELDS.map((f) => (
            <div key={f.id}>
              <dt className="font-medium text-slate-900 dark:text-slate-100">{f.label}</dt>
              <dd className="mt-0.5 text-slate-600 dark:text-slate-400">{scenario.modelDocumentation[f.id]}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {contributingSkills.length > 0 && (
        <Card>
          <SectionHeading title="Skill Progress Impact" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            This investigation contributes practical evidence toward{" "}
            {contributingSkills.map((s) => s.name).join(" and ")} training progress.
          </p>
          <Link href="/progress" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            View Progress →
          </Link>
        </Card>
      )}

      <section>
        <SectionHeading title="Recommended Review" subtitle="Learn topics connected to this investigation" />
        <RelatedTopics topicIds={scenario.topicsToReview} />
      </section>

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button
          onClick={onRestart}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Restart scenario
        </button>
        <Link
          href="/tickets"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          Back to Advanced Investigations
        </Link>
      </div>
    </div>
  );
}
