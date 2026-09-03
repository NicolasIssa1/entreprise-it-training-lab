import { ReactNode } from "react";

/**
 * Shared page-header treatment — a bordered surface with a soft ambient
 * gradient wash behind the title, used at the top of major pages (Dashboard,
 * Learn, Investigations, Analytics, BPO, Pilot). Keeps every major page
 * feeling like it belongs to one product instead of each page inventing its
 * own hero.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  accent = "from-blue-500/15 via-indigo-500/10 to-transparent",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  /** A Tailwind gradient stop sequence (`from-... via-... to-...`) for the ambient wash. */
  accent?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent}`}
        aria-hidden="true"
      />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{title}</h1>
          {description && <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
