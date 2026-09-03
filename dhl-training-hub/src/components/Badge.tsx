const VARIANT_STYLES: Record<string, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700/60",
  accent: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:ring-blue-900",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-900",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:ring-amber-900",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950/70 dark:text-red-300 dark:ring-red-900",
};

export function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANT_STYLES;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
