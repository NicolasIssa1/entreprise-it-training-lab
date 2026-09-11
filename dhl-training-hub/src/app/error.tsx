"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonClass } from "@/lib/ui";

/**
 * Root error boundary — Next.js requires this to be a Client Component. Without
 * it, an unhandled render error anywhere in the app falls through to Next.js's
 * own default error screen (a raw stack trace in dev, a bare "Application
 * error" in prod) instead of a branded recovery screen. `reset()` re-renders
 * the segment that threw, without a full page reload.
 *
 * Deliberately never shows `error.message` to the user — see root CLAUDE.md's
 * "never expose raw provider/API errors" rule, which applies here too: a
 * render error could in principle carry implementation detail not meant for
 * an end user. Logged to the console for local debugging only; production
 * error tracking (Sentry or similar) is a P1 item, not wired up here.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">Something went wrong</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">This page hit an error.</h1>
      <p className="max-w-md text-slate-600 dark:text-slate-400">
        Your training progress is unaffected — it&rsquo;s saved independently of this page. Try again, or head back to
        the Dashboard.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className={buttonClass("primary")}>
          Try again
        </button>
        <Link href="/" className={buttonClass("secondary")}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
