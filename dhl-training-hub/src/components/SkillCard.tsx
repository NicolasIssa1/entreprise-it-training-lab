import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SkillLevel, SkillProgress } from "@/lib/types";

const LEVEL_VARIANT: Record<SkillLevel, "neutral" | "warning" | "accent" | "success"> = {
  "Not Started": "neutral",
  "Getting Started": "warning",
  "Building Foundation": "warning",
  Practicing: "accent",
  "Strong Foundation": "success",
};

export function SkillCard({ progress }: { progress: SkillProgress }) {
  const { skill, overall, level, evidence } = progress;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{skill.name}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{overall}%</p>
        </div>
        <Badge variant={LEVEL_VARIANT[level]}>{level}</Badge>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${overall}%` }} />
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{skill.description}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-600 dark:text-slate-400">Learning</dt>
          <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
            {evidence.learning.completed}/{evidence.learning.total} topics ({evidence.learning.percentage}%)
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-600 dark:text-slate-400">Knowledge</dt>
          <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
            {evidence.knowledge.percentage}% ({evidence.knowledge.attempted}/{evidence.knowledge.total} assessments)
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-slate-600 dark:text-slate-400">Practical</dt>
          <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
            {evidence.practical.completed}/{evidence.practical.total} investigations ({evidence.practical.percentage}%)
          </dd>
        </div>
      </dl>
    </Card>
  );
}
