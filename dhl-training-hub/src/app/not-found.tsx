import Link from "next/link";
import { buttonClass } from "@/lib/ui";

/** Branded 404 — replaces Next.js's unstyled default "This page could not be
 * found," which otherwise appears on any broken/typo'd link. Deliberately
 * minimal: no data fetching, no client state, just a way back. */
export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">404</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="max-w-md text-slate-600 dark:text-slate-400">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or the link may be out of date.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass("primary")}>
          Back to Dashboard
        </Link>
        <Link href="/learn" className={buttonClass("secondary")}>
          Browse Learn
        </Link>
      </div>
    </div>
  );
}
