/** Macro-level grouping label (e.g. "Overview Knowledge", "Practice") used to break
 * a long page into visually distinct zones — a heavier divider than SectionHeading,
 * without introducing tab navigation. */
export function PageGroupHeading({ label }: { label: string }) {
  return (
    <div className="border-t-2 border-slate-200 pt-2 dark:border-slate-800">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
}
