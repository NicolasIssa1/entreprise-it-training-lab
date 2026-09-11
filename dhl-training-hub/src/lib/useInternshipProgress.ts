"use client";

import { useEffect, useState } from "react";
import { getInternshipProgress, InternshipProgress, TrainingCalendarConfig } from "@/lib/internshipCalendar";

/**
 * Client-only "today, live" for the internship calendar — mirrors the exact
 * SSR-safety pattern already used by every other dynamic value in this app
 * (see lib/storage.ts's useLocalStorageState): render starts with `progress:
 * null, loaded: false` — identical on the server and on the client's first
 * render, so there is nothing to mismatch — then an effect computes the real
 * value once mounted. Consumers should treat `loaded === false` as "don't
 * claim a specific day yet" (a brief, generic loading state), never render a
 * guessed value.
 *
 * Refreshes are event-driven, not a tight poll: on mount, when the tab
 * regains visibility/focus (covers reload / login / returning to the
 * Dashboard, including "was away across midnight"), and a single 15-minute
 * interval so a tab left open and visible still rolls over to a new day
 * without needing an interaction — deliberately not a sub-minute timer.
 */
export function useInternshipProgress(config: TrainingCalendarConfig) {
  const [progress, setProgress] = useState<InternshipProgress | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function refresh() {
      setProgress(getInternshipProgress(config));
      setLoaded(true);
    }

    refresh();

    function handleVisibility() {
      if (document.visibilityState === "visible") refresh();
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refresh);
    const interval = setInterval(refresh, 15 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refresh);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.startDate, config.endDate, config.timezone]);

  return { progress, loaded };
}
