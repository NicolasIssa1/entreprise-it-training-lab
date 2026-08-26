import { INVESTIGATION_HYPOTHESES, InvestigationHypothesis } from "@/lib/types";
import { toggleButtonClass } from "@/lib/ui";

/** Always-available hypothesis picker — the learner can change their mind at any
 * point as new evidence appears; nothing here is locked or scored harshly. */
export function HypothesisSelector({
  current,
  onSelect,
}: {
  current: InvestigationHypothesis | undefined;
  onSelect: (hypothesis: InvestigationHypothesis) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        Current hypothesis <span className="font-normal">(change it any time as evidence comes in)</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {INVESTIGATION_HYPOTHESES.map((h) => (
          <button
            key={h.id}
            onClick={() => onSelect(h.id)}
            aria-pressed={current === h.id}
            className={toggleButtonClass(current === h.id)}
          >
            {h.label}
          </button>
        ))}
      </div>
    </div>
  );
}
