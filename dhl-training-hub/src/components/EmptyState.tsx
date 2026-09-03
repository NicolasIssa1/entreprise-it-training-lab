import { ReactNode } from "react";

/**
 * Shared "nothing here yet" state — dashed border, centered, restrained.
 * Used wherever a list/section can legitimately be empty (no quiz attempts,
 * no investigations completed, no daily log entries, no CV achievements) so
 * an empty page reads as "not started yet," not as a blank/broken section.
 */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
      {description && <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
