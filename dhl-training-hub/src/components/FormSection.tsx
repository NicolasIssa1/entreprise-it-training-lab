import { ReactNode } from "react";

/** Groups related fields under a small subheading — used to break long forms into
 * visually scannable sections (e.g. Daily Log) without a big design change. */
export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0 dark:border-slate-800">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}
