"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { AskTutorLink } from "@/components/AskTutorLink";
import { BeakerIcon, BookIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useInternshipProgress } from "@/lib/useInternshipProgress";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { trainingCalendar } from "@/lib/data/internshipState";
import { getTimeOfDayGreeting, formatLongDate } from "@/lib/internshipCalendar";
import { buttonClass } from "@/lib/ui";

const GREETING_TEXT: Record<"morning" | "afternoon" | "evening", string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
};

/**
 * Dynamic Dashboard hero — replaces the old hard-coded "DAY 2 · INFRASTRUCTURE"
 * header. Everything time/identity-dependent here is computed client-side via
 * useInternshipProgress (see that file's doc comment for why: the Dashboard
 * route is statically prerendered, so anything date-based computed directly
 * in a Server Component would freeze at build time — the exact class of bug
 * this whole component exists to fix). Before the client effect resolves,
 * this renders a deliberately generic, non-time-specific shell — identical on
 * server and client — so there is nothing to hydration-mismatch on.
 *
 * Never claims a specific team here (see internshipState.ts's comment) —
 * only a day number and date, both genuinely derived from the configured
 * training calendar.
 */
export function DashboardHero() {
  const { user, isConfigured } = useAuth();
  const { progress, loaded } = useInternshipProgress(trainingCalendar);
  const { selectedAssignment } = useSelectedAssignment();

  const firstName =
    isConfigured && user
      ? ((user.user_metadata?.display_name as string | undefined) || "").trim().split(/\s+/)[0] || undefined
      : undefined;

  const eyebrow = loaded && progress ? `Today · Day ${progress.dayNumber}` : "Today";
  const greetingWord = loaded && progress ? GREETING_TEXT[getTimeOfDayGreeting(trainingCalendar.timezone)] : "Welcome";
  const title = firstName ? `${greetingWord}, ${firstName}.` : `${greetingWord}.`;

  return (
    <PageHeader
      eyebrow={eyebrow}
      title={title}
      description={
        <span className="block space-y-1">
          <span className="block">What do you want to work on today?</span>
          {loaded && progress && (
            <span className="block text-sm text-slate-400 dark:text-slate-500">
              {formatLongDate(progress.today)} &middot; Enterprise IT Training
            </span>
          )}
        </span>
      }
      actions={
        <>
          <Link href="/learn" className={buttonClass("primary")}>
            <BookIcon size={15} />
            Continue Learning
          </Link>
          {selectedAssignment ? (
            <Link href="/assignments" className={buttonClass("secondary")}>
              Continue: {selectedAssignment.title}
            </Link>
          ) : (
            <Link href="/projects" className={buttonClass("secondary")}>
              Explore Enterprise Projects
            </Link>
          )}
          <Link href="/tickets" className={buttonClass("secondary")}>
            <BeakerIcon size={15} />
            Practice in a Lab
          </Link>
          <AskTutorLink params={{}} variant="button">
            Ask AI Tutor
          </AskTutorLink>
        </>
      }
    />
  );
}
