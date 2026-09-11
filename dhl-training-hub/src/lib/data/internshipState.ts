import { TeamId } from "@/lib/types";
import { TrainingCalendarConfig } from "@/lib/internshipCalendar";

/**
 * The one configured instance of TrainingCalendarConfig for the current
 * personal internship (see lib/internshipCalendar.ts for the generic, reusable
 * engine this feeds — that file has zero knowledge of DHL or Nicolas
 * specifically, by design, so a future onboarding/pilot flow could construct a
 * different config with a different startDate/timezone without touching it).
 *
 * This is the ONLY place "today" / "day number" is derived from — update
 * startDate once, here, if the program's actual start date ever changes.
 * Nothing else should ever hand-maintain a day number again; that hand
 * maintenance (a hard-coded currentDate/currentDayNumber pair that had to be
 * remembered and edited every single day) was the actual root cause of the
 * "stuck on Day 2" bug this file used to have.
 */
export const trainingCalendar: TrainingCalendarConfig = {
  startDate: "2026-08-24",
  timezone: "Asia/Dubai",
  // workingDays defaults to Monday-Friday inside internshipCalendar.ts.
};

/**
 * Personal internship context that genuinely doesn't change day-to-day —
 * kept separate from reusable product branding (see ../product.ts) so the
 * underlying product architecture could later support a different
 * organization/role/team without any reusable component needing to change.
 *
 * `currentTeam` is deliberately a plain, hand-set field, not derived from the
 * date: which team Nicolas is actually sitting with on a given day is real
 * information that has to come from him (or from a Daily Log entry), never
 * guessed from how many working days have elapsed — a date and a team
 * rotation can easily diverge in practice.
 *
 * There is no currentDate/currentDayNumber here anymore — every page that
 * needs "today" derives it live via useInternshipProgress(trainingCalendar)
 * (client components) or the internshipCalendar.ts functions directly
 * (pages that build fixed defaults), never a value stored on this object.
 */
export const internshipState = {
  currentTeam: "infrastructure" as TeamId,
  organization: "DHL Dubai",
  department: "IT/BPU",
  role: "IT Intern",
};
