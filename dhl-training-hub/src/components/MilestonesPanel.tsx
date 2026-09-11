import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { AwardIcon, LockIcon } from "@/components/icons";
import { MilestoneDefinition } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function MilestoneCard({ milestone, unlockedAt }: { milestone: MilestoneDefinition; unlockedAt?: string }) {
  const unlocked = !!unlockedAt;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3.5 ${
        unlocked
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30"
          : "border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          unlocked ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
        }`}
      >
        {unlocked ? <AwardIcon size={16} /> : <LockIcon size={16} />}
      </span>
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{milestone.title}</p>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{unlocked ? milestone.description : milestone.criteriaDescription}</p>
        {unlocked && <p className="mt-1 text-[0.7rem] text-emerald-700 dark:text-emerald-400">Earned {formatDate(unlockedAt!)}</p>}
      </div>
    </div>
  );
}

/** Professional Milestones (Phase 11) — grounded, resume-appropriate language,
 * no cartoon badges or XP. Every eligibility rule is deterministic and derived
 * from existing progress data (see lib/data/milestones.ts); this component
 * just renders the earned/locked state and criteria text. */
export function MilestonesPanel({ unlocked, locked }: { unlocked: { milestone: MilestoneDefinition; unlockedAt: string }[]; locked: MilestoneDefinition[] }) {
  return (
    <Card>
      <SectionHeading title="Professional Milestones" subtitle={`${unlocked.length} of ${unlocked.length + locked.length} earned`} />
      <div className="grid gap-3 sm:grid-cols-2">
        {unlocked.map(({ milestone, unlockedAt }) => (
          <MilestoneCard key={milestone.id} milestone={milestone} unlockedAt={unlockedAt} />
        ))}
        {locked.map((milestone) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
      </div>
    </Card>
  );
}
