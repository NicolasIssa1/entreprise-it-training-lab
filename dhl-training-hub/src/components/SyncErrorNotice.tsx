/** Friendly, non-technical save-failure notice — never a raw Supabase/Postgres
 * error. Current local work is never cleared when this shows (see the
 * optimistic-local-update pattern in each cloud-aware hook). */
export function SyncErrorNotice({
  message = "We couldn't save your progress right now. Your current work has not been cleared — it will try again the next time you make a change.",
}: {
  message?: string;
}) {
  return (
    <p
      role="alert"
      className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
    >
      {message}
    </p>
  );
}
