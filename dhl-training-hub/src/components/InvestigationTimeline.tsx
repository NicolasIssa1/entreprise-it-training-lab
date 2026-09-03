import { EmptyState } from "@/components/EmptyState";
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

const KIND_DOT: Record<TimelineEntry["kind"], string> = {
  start: "bg-slate-400",
  action: "bg-blue-500",
  question: "bg-cyan-500",
  hypothesis: "bg-violet-500",
  impact: "bg-amber-500",
  verify: "bg-emerald-500",
  document: "bg-indigo-500",
};

/** Renders the learner's persisted investigation history — every diagnostic
 * question asked, action taken, and hypothesis change, in order, as a real
 * connected timeline (a line + colored dot per kind) rather than a plain list. */
export function InvestigationTimeline({ history }: { history: TimelineEntry[] }) {
  if (history.length === 0) {
    return <EmptyState title="Nothing recorded yet" description="Your actions, questions, and hypothesis changes will appear here as you investigate." />;
  }

  return (
    <ol className="relative space-y-4">
      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
      {history.map((entry, i) => (
        <li key={entry.id} className="relative pl-6 text-sm">
          <span className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${KIND_DOT[entry.kind]}`} aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {i + 1}. {KIND_LABEL[entry.kind]}
          </span>
          <p className="mt-0.5 font-medium text-slate-900 dark:text-slate-100">{entry.label}</p>
          {entry.detail && <p className="mt-0.5 text-slate-600 dark:text-slate-400">{entry.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
