import { TimelineEntry } from "@/lib/types";

const KIND_LABEL: Record<TimelineEntry["kind"], string> = {
  start: "Start",
  action: "Action",
  question: "Question",
  hypothesis: "Hypothesis",
  impact: "Impact",
  verify: "Verify",
  document: "Document",
};

/** Renders the learner's persisted investigation history — every diagnostic
 * question asked, action taken, and hypothesis change, in order. */
export function InvestigationTimeline({ history }: { history: TimelineEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Nothing recorded yet.</p>;
  }

  return (
    <ol className="space-y-3">
      {history.map((entry, i) => (
        <li key={entry.id} className="border-l-2 border-slate-200 pl-3 text-sm dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {i + 1}. {KIND_LABEL[entry.kind]}
            </span>
          </div>
          <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">{entry.label}</p>
          {entry.detail && <p className="mt-0.5 text-slate-600 dark:text-slate-400">{entry.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
