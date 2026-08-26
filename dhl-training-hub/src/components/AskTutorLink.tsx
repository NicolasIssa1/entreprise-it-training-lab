import Link from "next/link";
import { TutorLinkParams, tutorHref } from "@/lib/ai/tutorLinks";

/**
 * The single reusable "Ask Tutor" entry point used across Learn, Quiz,
 * Investigation, Dashboard, and Progress pages (Phase 6 Part K/L/M) — never
 * duplicate a full chat interface on those pages, just link into /tutor with
 * the right query params so TutorChat.tsx picks up trusted mode/context.
 */
export function AskTutorLink({
  params,
  children,
  variant = "link",
}: {
  params: TutorLinkParams;
  children: React.ReactNode;
  variant?: "link" | "button";
}) {
  const className =
    variant === "button"
      ? "inline-flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950"
      : "text-sm font-medium text-blue-600 hover:underline dark:text-blue-400";

  return (
    <Link href={tutorHref(params)} className={className}>
      {children}
    </Link>
  );
}
