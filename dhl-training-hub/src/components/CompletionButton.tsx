"use client";

import { useLearningProgress } from "@/lib/learningProgress";
import { Badge } from "@/components/Badge";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";

/** Shows completion status (text, not just color) plus a toggle — keyboard-accessible
 * since it's a real <button>, persisted via the shared learning-progress storage. */
export function CompletionButton({ topicId }: { topicId: string }) {
  const { isComplete, toggleComplete, syncError } = useLearningProgress();
  const done = isComplete(topicId);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={done ? "success" : "neutral"}>{done ? "Completed" : "Not completed"}</Badge>
        <button
          onClick={() => toggleComplete(topicId)}
          aria-pressed={done}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            done ? "bg-slate-500 hover:bg-slate-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {done ? "Mark as not completed" : "Mark as complete"}
        </button>
      </div>
      {syncError && <SyncErrorNotice />}
    </div>
  );
}
