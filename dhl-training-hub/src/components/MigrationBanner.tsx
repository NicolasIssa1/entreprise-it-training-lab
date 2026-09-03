"use client";

import { useAuth } from "@/lib/auth/AuthProvider";

/** Shows the one-time "your local progress has been synced" message after the
 * Phase 5 migration runs — see lib/migration.ts. Dismissible, not persistent. */
export function MigrationBanner() {
  const { migrationMessage, dismissMigrationMessage } = useAuth();
  if (!migrationMessage) return null;

  return (
    <div className="border-b border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-sm text-emerald-900 dark:text-emerald-200">
        <p>{migrationMessage}</p>
        <button
          onClick={dismissMigrationMessage}
          aria-label="Dismiss"
          className="rounded-lg px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-900"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
