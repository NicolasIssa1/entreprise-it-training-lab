"use client";

import { useLocalStorageList } from "@/lib/storage";
import { seedDailyLogEntries } from "@/lib/data/seedDailyLog";
import { DailyLogEntry, TeamId } from "@/lib/types";

/**
 * Shows personal observations for a team, sourced directly from Daily Log entries
 * (same localStorage key the Daily Log page reads/writes) — never invented content.
 * Keeps "what I actually observed" clearly separate from the generic knowledge above
 * it on the Team page.
 */
export function TeamObservations({ teamId }: { teamId: TeamId }) {
  const { items: entries } = useLocalStorageList<DailyLogEntry>(
    "daily-log-entries",
    seedDailyLogEntries,
  );

  const relevant = entries
    .filter((e) => e.team === teamId && (e.observed || e.learned))
    .sort((a, b) => b.dayNumber - a.dayNumber);

  if (relevant.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No observations recorded yet.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {relevant.map((entry) => (
        <li key={entry.id} className="text-sm text-slate-700 dark:text-slate-300">
          <span className="mr-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Day {entry.dayNumber} &middot; {entry.date}
          </span>
          {entry.observed && <p className="mt-1">{entry.observed}</p>}
        </li>
      ))}
    </ul>
  );
}
