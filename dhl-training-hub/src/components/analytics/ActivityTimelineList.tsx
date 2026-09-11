import Link from "next/link";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { TrainingActivityEvent } from "@/lib/types";

const TYPE_VARIANT: Record<TrainingActivityEvent["type"], "accent" | "success"> = {
  "quiz-attempt": "accent",
  "investigation-completion": "success",
  "automation-lab-attempt": "success",
};

const TYPE_LABEL: Record<TrainingActivityEvent["type"], string> = {
  "quiz-attempt": "Quiz",
  "investigation-completion": "Investigation",
  "automation-lab-attempt": "Automation Lab",
};

/**
 * Structured-only activity timeline (Phase 8 Part F) — every event here comes
 * from a genuinely timestamped record (quiz attempts, investigation
 * completions). Never Daily Log, CV Achievement, or Tutor conversation text.
 */
export function ActivityTimelineList({ events }: { events: TrainingActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No dated training activity yet"
        description="Completing a quiz, an Advanced Investigation, or an Automation Lab build will show up here."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-3 text-sm">
          <Badge variant={TYPE_VARIANT[event.type]}>{TYPE_LABEL[event.type]}</Badge>
          <div className="flex-1">
            <Link href={event.href} className="font-medium text-slate-900 hover:underline dark:text-slate-100">
              {event.title}
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {event.description} · {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
