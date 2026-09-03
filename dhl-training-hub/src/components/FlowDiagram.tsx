import { ArrowRightIcon } from "@/components/icons";

/**
 * A small, dependency-free flow visualization — steps connected by arrows,
 * horizontal on wide screens and a vertical stack on narrow ones. Built for
 * the BPO lifecycle (Problem → As-Is → ... → Monitoring) but generic enough
 * to reuse anywhere a short ordered process needs a visual, not a diagram
 * library. Purely presentational — the step list is passed in, never
 * invented here.
 */
export function FlowDiagram({ steps, accent = "violet" }: { steps: string[]; accent?: "violet" | "blue" }) {
  const chipClass =
    accent === "violet"
      ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300"
      : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300";
  const arrowClass = accent === "violet" ? "text-violet-400 dark:text-violet-600" : "text-blue-400 dark:text-blue-600";

  return (
    <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center sm:flex-row">
          <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium shadow-sm ${chipClass}`}>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-[0.65rem] font-bold dark:bg-black/20">
              {i + 1}
            </span>
            {step}
          </div>
          {i < steps.length - 1 && (
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center sm:h-auto sm:w-auto sm:px-1.5 ${arrowClass}`} aria-hidden="true">
              <ArrowRightIcon size={16} className="rotate-90 sm:rotate-0" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
