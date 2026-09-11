import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { ReadinessProfile, SkillGapEntry } from "@/lib/types";

function SkillRow({ entry }: { entry: SkillGapEntry }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-800">
      <span className="font-medium text-slate-800 dark:text-slate-200">{entry.progress.skill.name}</span>
      <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span>{entry.progress.level}</span>
        <Badge variant={entry.classification === "strength" ? "success" : entry.classification === "gap" ? "warning" : "neutral"}>
          {entry.progress.overall}
        </Badge>
      </span>
    </li>
  );
}

/**
 * Readiness Score + Skill-Gap Engine (Phase 11), packaged into one card. The
 * headline number is the exact same calculateOverallTrainingProgress mean
 * /progress and /analytics already show — never a second, independently
 * computed figure. Strength/Developing/Gap groupings are just a
 * classification of the same per-skill numbers /progress already lists.
 */
export function ReadinessScoreCard({ profile }: { profile: ReadinessProfile }) {
  if (!profile.hasSufficientData) {
    return (
      <Card>
        <SectionHeading title="Readiness Score" subtitle="A transparent readiness indicator, derived from your real training activity" />
        <EmptyState
          title="Not enough activity yet"
          description="Complete a few Learn topics, take a quiz, or finish an investigation to generate your first readiness snapshot."
          action={
            <Link href="/learn" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Start learning →
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionHeading title="Readiness Score" subtitle="Derived from your real activity — not a certification or job-readiness claim" />
        <Link href="/progress" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View full skill breakdown →
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 border-blue-100 dark:border-blue-950">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{profile.overall}%</span>
          <span className="text-[0.65rem] uppercase tracking-wide text-slate-400">Overall</span>
        </div>
        <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">{profile.recentMomentum.description}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Strengths ({profile.strengths.length})
          </p>
          {profile.strengths.length > 0 ? (
            <ul className="space-y-1.5">
              {profile.strengths.map((e) => (
                <SkillRow key={e.progress.skill.id} entry={e} />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">None yet.</p>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Developing ({profile.developing.length})
          </p>
          {profile.developing.length > 0 ? (
            <ul className="space-y-1.5">
              {profile.developing.map((e) => (
                <SkillRow key={e.progress.skill.id} entry={e} />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">None yet.</p>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">Gaps ({profile.gaps.length})</p>
          {profile.gaps.length > 0 ? (
            <ul className="space-y-1.5">
              {profile.gaps.map((e) => (
                <SkillRow key={e.progress.skill.id} entry={e} />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">None — nice work.</p>
          )}
        </div>
      </div>

      <Disclaimer>
        These scores are educational progress indicators derived from your own recorded activity — not a validated
        professional assessment, certification, or job-readiness claim.
      </Disclaimer>
    </Card>
  );
}
