/**
 * Generic, reusable training-calendar math — deliberately has zero knowledge of
 * DHL, Nicolas, or any specific organization (see root CLAUDE.md: the long-term
 * product is generic Enterprise IT career readiness, not DHL-specific). The one
 * concrete instance of TrainingCalendarConfig for the current personal
 * internship lives in lib/data/internshipState.ts; a future onboarding/pilot
 * flow could construct a different config with a different startDate/timezone
 * without this file changing at all.
 *
 * Every function here is pure and takes an explicit `now`/date input — nothing
 * reads the system clock implicitly except the default parameter on
 * getCurrentInternshipDate/getInternshipProgress, which exists only so call
 * sites don't have to pass `new Date()` themselves. This is what makes the
 * whole module trivially unit-testable (see internshipCalendar.test.ts) and
 * safe to call from either a server or a client without surprises.
 *
 * Root cause this replaces: internshipState.ts used to hard-code
 * currentDate/currentDayNumber as plain string/number literals that had to be
 * remembered and hand-edited every single day — the actual "Day 2" bug. Day
 * number is now always derived live from a single startDate, so there is
 * nothing left to forget to update.
 */

export interface TrainingCalendarConfig {
  /** ISO calendar date "YYYY-MM-DD" — Day 1 of the program. */
  startDate: string;
  /** ISO calendar date "YYYY-MM-DD", optional. Only when this is set can a
   * total working-day count be computed with confidence — see
   * getInternshipProgress's totalWorkingDays. */
  endDate?: string;
  /** IANA timezone name (e.g. "Asia/Dubai") the calendar is evaluated in.
   * Never rely on server UTC or the visitor's own browser timezone instead —
   * either could silently shift which calendar day "today" resolves to
   * relative to the configured program. */
  timezone: string;
  /** 0 = Sunday .. 6 = Saturday. Defaults to Monday-Friday when omitted. */
  workingDays?: number[];
  /** ISO calendar dates ("YYYY-MM-DD") explicitly excluded from the working-day
   * count — public holidays, planned absences, etc. Deliberately unused by the
   * current single configured instance, but present in the shape now so a
   * future config can add them without this file's API changing. */
  excludedDates?: string[];
}

export interface InternshipProgress {
  /** Today's calendar date in the configured timezone, "YYYY-MM-DD". */
  today: string;
  /** The current/most-recent working-day number — see getInternshipDayNumber. */
  dayNumber: number;
  /** Whether `today` itself is a working day (false on a weekend/holiday —
   * dayNumber above still reflects the most recent working day in that case,
   * it just doesn't advance until the next real working day). */
  isWorkingDay: boolean;
  /** Only set when config.endDate is provided — never guessed or estimated. */
  totalWorkingDays?: number;
}

const DEFAULT_WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday-Friday

/** "YYYY-MM-DD" as it currently is in `timeZone`, regardless of the runtime's
 * own timezone — the en-CA locale happens to format dates exactly this way,
 * which avoids assembling the string by hand. */
function isoDateInTimeZone(instant: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(instant);
}

/** Anchors a "YYYY-MM-DD" calendar date at UTC noon — never local midnight —
 * so environment timezone/DST can never shift which calendar day this Date
 * represents when used for day-of-week or date-arithmetic below. */
function toUtcNoon(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00Z`);
}

function isoDateOfUtcNoon(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** "Today" in the configured timezone — the one place a default `now =
 * new Date()` is allowed, so every other function here can stay pure and
 * explicit about its date input. */
export function getCurrentInternshipDate(config: Pick<TrainingCalendarConfig, "timezone">, now: Date = new Date()): string {
  return isoDateInTimeZone(now, config.timezone);
}

/** Whether `isoDate` is a configured working day — checks both the weekly
 * pattern (workingDays, default Mon-Fri) and excludedDates. */
export function isInternshipWorkingDay(isoDate: string, config: TrainingCalendarConfig): boolean {
  const workingDays = config.workingDays ?? DEFAULT_WORKING_DAYS;
  const dayOfWeek = toUtcNoon(isoDate).getUTCDay();
  if (!workingDays.includes(dayOfWeek)) return false;
  if (config.excludedDates?.includes(isoDate)) return false;
  return true;
}

/** Working days between two ISO dates, inclusive of both endpoints. A simple
 * day-by-day walk rather than a closed-form formula — the ranges involved
 * (a training program, realistically weeks to months) make this trivially
 * cheap, and it's what lets excludedDates be honored for free without a
 * second calculation path. */
function countWorkingDaysInclusive(startIso: string, endIso: string, config: TrainingCalendarConfig): number {
  const start = toUtcNoon(startIso);
  const end = toUtcNoon(endIso);
  if (end < start) return 0;
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    if (isInternshipWorkingDay(isoDateOfUtcNoon(cursor), config)) count++;
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return count;
}

/**
 * The program's "day number" as of `isoDate`: the count of working days from
 * config.startDate through the most recent working day at or before
 * `isoDate`. A weekend/holiday date simply doesn't add to the count itself,
 * so it naturally resolves to the same number as the working day before it
 * (e.g. both Saturday and Sunday after "Day 5" are still "Day 5") — this is
 * what the Daily Log's "Non-working day" indicator is for; this function
 * always returns a real, meaningful number, never null, for any date on or
 * after startDate. Returns 0 for a date before startDate.
 */
export function getInternshipDayNumber(isoDate: string, config: TrainingCalendarConfig): number {
  if (isoDate < config.startDate) return 0;
  return countWorkingDaysInclusive(config.startDate, isoDate, config);
}

/** Bundles the three values above for "today," plus a total working-day count
 * when (and only when) config.endDate makes that confidently computable. */
export function getInternshipProgress(config: TrainingCalendarConfig, now: Date = new Date()): InternshipProgress {
  const today = getCurrentInternshipDate(config, now);
  return {
    today,
    dayNumber: getInternshipDayNumber(today, config),
    isWorkingDay: isInternshipWorkingDay(today, config),
    totalWorkingDays: config.endDate ? countWorkingDaysInclusive(config.startDate, config.endDate, config) : undefined,
  };
}

export type TimeOfDayGreeting = "morning" | "afternoon" | "evening";

/** A simple, timezone-aware time-of-day greeting — same "explicit timezone,
 * never server/browser default" rule as the rest of this module. */
export function getTimeOfDayGreeting(timezone: string, now: Date = new Date()): TimeOfDayGreeting {
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", hour12: false }).format(now));
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/** "Sunday, 7 September 2026" — day-before-month, matching how the Dashboard
 * hero and Daily Log want dates displayed. Takes an already-resolved
 * "YYYY-MM-DD" (e.g. from getCurrentInternshipDate) and formats it via a UTC
 * instant, not the target timezone — this is pretty-printing an abstract
 * calendar date, not re-deriving one from an instant, so formatting through
 * "UTC" keeps it exact for any timezone offset (toUtcNoon + a timezone
 * conversion could otherwise roll the displayed date over for a timezone far
 * enough from UTC — e.g. UTC+14 at noon UTC is already the next local day). */
export function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    toUtcNoon(isoDate),
  );
}
