import { ReactNode } from "react";
import { Card } from "@/components/Card";

/**
 * A single stat tile — used in metric rows (Dashboard training overview,
 * Analytics). Deliberately data-agnostic: callers compute the number, this
 * only renders it consistently. `accentClass` takes a `categoryColor()`/
 * `skillColor()` `.text`/`.chip` style for a colored icon, kept optional so
 * a plain neutral metric doesn't need one.
 */
export function MetricCard({
  label,
  value,
  hint,
  icon,
  accentClass = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accentClass?: string;
}) {
  return (
    <Card className="flex items-start gap-3">
      {icon && (
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentClass}`}>{icon}</span>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </Card>
  );
}
