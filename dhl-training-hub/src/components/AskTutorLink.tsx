import Link from "next/link";
import { TutorLinkParams, tutorHref } from "@/lib/ai/tutorLinks";
import { SparkleIcon } from "@/components/icons";

/**
 * The single reusable "Ask Tutor" entry point used across Learn, Quiz,
 * Investigation, Dashboard, Progress, Assignments, and BPO pages — never
 * duplicate a full chat interface on those pages, just link into /tutor with
 * the right query params (mode/topic/quiz/scenario/question, plus an
 * optional pre-filled `prompt` — see tutorLinks.ts and
 * tutorPromptTemplates.ts) so TutorChat.tsx picks up trusted mode/context
 * and seeds its composer, without ever sending anything itself.
 *
 * Carries the app's one consistent "AI accent" (violet/cyan, distinct from
 * the blue used for everything else) and a small sparkle mark, so every
 * Tutor entry point reads as the same feature no matter which page it's on.
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
      ? "group inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-gradient-to-r from-violet-50 to-cyan-50/70 px-3 py-1.5 text-sm font-medium text-violet-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md hover:shadow-violet-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 dark:border-violet-900 dark:from-violet-950/40 dark:to-cyan-950/20 dark:text-violet-300"
      : "group inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline dark:text-violet-400";

  return (
    <Link href={tutorHref(params)} className={className}>
      <SparkleIcon size={13} className="shrink-0 transition-transform duration-200 group-hover:rotate-12" />
      {children}
    </Link>
  );
}
