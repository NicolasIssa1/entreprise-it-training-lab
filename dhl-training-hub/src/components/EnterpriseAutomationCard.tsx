"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { getPathById, getPathProgress, getNextIncompleteTopicId } from "@/lib/data/learning";
import { getPracticeAutomationLabScenarios } from "@/lib/data/automationLab";
import { useLearningProgress } from "@/lib/learningProgress";
import { categoryColor } from "@/lib/colors";

const PATH_ID = "enterprise-automation-foundations";

/**
 * Compact Dashboard card for the Enterprise Automation track — same "compact
 * summary + link out" scope as CurrentAssignmentCard, not a duplicate of the
 * full /learn or /automation-lab pages. Reuses the existing
 * getPathProgress/getNextIncompleteTopicId helpers already used everywhere
 * else path progress is shown — no new derivation logic.
 */
export function EnterpriseAutomationCard() {
  const { completed } = useLearningProgress();
  const path = getPathById(PATH_ID);
  if (!path) return null;

  const { completedCount, total } = getPathProgress(path, completed);
  const nextTopicId = getNextIncompleteTopicId(path.topicIds, completed);
  const [firstLab] = getPracticeAutomationLabScenarios();

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionHeading title="Enterprise Automation" subtitle="SharePoint, Power Automate, Excel, Outlook, and Power BI" />
        <Link href="/learn" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View learning path →
        </Link>
      </div>
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-600 dark:text-slate-400">Progress</p>
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {completedCount} / {total} modules
        </p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-2 rounded-full transition-all ${categoryColor("Enterprise Automation").bar}`}
          style={{ width: `${total === 0 ? 0 : Math.round((completedCount / total) * 100)}%` }}
        />
      </div>
      {nextTopicId ? (
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Current</p>
          <Link href={`/learn/${nextTopicId}`} className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Continue learning →
          </Link>
          {firstLab && (
            <>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">Next</p>
              <Link href={`/automation-lab/${firstLab.id}`} className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                {firstLab.title} →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Learning path complete — ready for an Enterprise Project.</p>
          <Link href="/projects" className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Browse Enterprise Projects →
          </Link>
        </div>
      )}
    </Card>
  );
}
