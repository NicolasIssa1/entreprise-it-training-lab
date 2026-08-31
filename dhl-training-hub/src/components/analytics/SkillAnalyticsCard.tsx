import Link from "next/link";
import { SkillCard } from "@/components/SkillCard";
import { SkillAnalyticsEntry } from "@/lib/types";

/**
 * Wraps the existing /progress SkillCard rather than re-rendering its own
 * copy of the training indicator/level/evidence — adds only the two fields
 * Phase 8 Part B needs beyond what SkillCard already shows: an activity
 * summary sentence and a recommended next action (reusing the existing
 * recommendation engine — see lib/analytics/skillAnalytics.ts).
 */
export function SkillAnalyticsCard({ entry }: { entry: SkillAnalyticsEntry }) {
  const { progress, recommendedAction, activitySummary } = entry;

  return (
    <div>
      <SkillCard progress={progress} />
      <div className="mt-2 space-y-1 px-1 text-xs text-slate-500 dark:text-slate-400">
        <p>{activitySummary}</p>
        {recommendedAction && (
          <p>
            Next:{" "}
            <Link href={recommendedAction.href} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              {recommendedAction.title}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
