import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCurrentInternshipDate,
  getInternshipDayNumber,
  getInternshipProgress,
  isInternshipWorkingDay,
  getTimeOfDayGreeting,
  formatLongDate,
} from "./internshipCalendar.ts";
import type { TrainingCalendarConfig } from "./internshipCalendar.ts";

// Matches the actual configured instance in lib/data/internshipState.ts —
// duplicated here (not imported) so this test file exercises the generic
// engine against known values, independent of whatever the real config is
// edited to later.
const config: TrainingCalendarConfig = { startDate: "2026-08-24", timezone: "Asia/Dubai" };

test("getInternshipDayNumber: the exact worked examples from the spec", () => {
  assert.equal(getInternshipDayNumber("2026-08-24", config), 1); // Monday
  assert.equal(getInternshipDayNumber("2026-08-25", config), 2);
  assert.equal(getInternshipDayNumber("2026-08-28", config), 5); // Friday
  assert.equal(getInternshipDayNumber("2026-08-29", config), 5); // Saturday — carries from Friday
  assert.equal(getInternshipDayNumber("2026-08-30", config), 5); // Sunday — still carries
  assert.equal(getInternshipDayNumber("2026-08-31", config), 6); // Monday
  assert.equal(getInternshipDayNumber("2026-09-04", config), 10); // Friday
  assert.equal(getInternshipDayNumber("2026-09-07", config), 11); // Monday
  assert.equal(getInternshipDayNumber("2026-09-18", config), 20); // Friday, 4 full working weeks
});

test("getInternshipDayNumber: a date before startDate is Day 0, never negative", () => {
  assert.equal(getInternshipDayNumber("2026-08-01", config), 0);
});

test("isInternshipWorkingDay: weekends are never working days, weekdays always are (default Mon-Fri)", () => {
  assert.equal(isInternshipWorkingDay("2026-08-24", config), true); // Mon
  assert.equal(isInternshipWorkingDay("2026-08-28", config), true); // Fri
  assert.equal(isInternshipWorkingDay("2026-08-29", config), false); // Sat
  assert.equal(isInternshipWorkingDay("2026-08-30", config), false); // Sun
  assert.equal(isInternshipWorkingDay("2026-08-31", config), true); // Mon
});

test("isInternshipWorkingDay: excludedDates (future holiday support) removes an otherwise-working day", () => {
  const withHoliday: TrainingCalendarConfig = { ...config, excludedDates: ["2026-08-25"] };
  assert.equal(isInternshipWorkingDay("2026-08-25", withHoliday), false);
  // A day number computed across a holiday should not count it, and should not
  // renumber days that already happened before it either.
  assert.equal(getInternshipDayNumber("2026-08-24", withHoliday), 1);
  assert.equal(getInternshipDayNumber("2026-08-26", withHoliday), 2); // 24th + 26th only
});

test("getCurrentInternshipDate: resolves in the configured timezone, not UTC or the runtime's own zone", () => {
  // 21:30 UTC on 6 Sep is already 01:30 on 7 Sep in Asia/Dubai (UTC+4) — a
  // naive `new Date().toISOString().slice(0, 10)` would wrongly say the 6th.
  const lateUtc = new Date("2026-09-06T21:30:00Z");
  assert.equal(getCurrentInternshipDate(config, lateUtc), "2026-09-07");

  // 19:30 UTC on 6 Sep is 23:30 on 6 Sep in Dubai — still the 6th.
  const stillSameDay = new Date("2026-09-06T19:30:00Z");
  assert.equal(getCurrentInternshipDate(config, stillSameDay), "2026-09-06");
});

test("getInternshipProgress: bundles today/dayNumber/isWorkingDay, and only includes totalWorkingDays when endDate is set", () => {
  const monday = new Date("2026-09-07T08:00:00Z"); // midday Dubai
  const withoutEnd = getInternshipProgress(config, monday);
  assert.equal(withoutEnd.today, "2026-09-07");
  assert.equal(withoutEnd.dayNumber, 11);
  assert.equal(withoutEnd.isWorkingDay, true);
  assert.equal(withoutEnd.totalWorkingDays, undefined);

  const withEnd = getInternshipProgress({ ...config, endDate: "2026-09-18" }, monday);
  assert.equal(withEnd.totalWorkingDays, 20);

  const saturday = new Date("2026-08-29T08:00:00Z");
  const weekendProgress = getInternshipProgress(config, saturday);
  assert.equal(weekendProgress.dayNumber, 5);
  assert.equal(weekendProgress.isWorkingDay, false);
});

test("getTimeOfDayGreeting: morning/afternoon/evening boundaries in Asia/Dubai", () => {
  assert.equal(getTimeOfDayGreeting("Asia/Dubai", new Date("2026-09-07T04:00:00Z")), "morning"); // 08:00 Dubai
  assert.equal(getTimeOfDayGreeting("Asia/Dubai", new Date("2026-09-07T09:00:00Z")), "afternoon"); // 13:00 Dubai
  assert.equal(getTimeOfDayGreeting("Asia/Dubai", new Date("2026-09-07T15:00:00Z")), "evening"); // 19:00 Dubai
});

test("formatLongDate: matches the requested display format", () => {
  // Verified against the real calendar (Python's stdlib `datetime`), not
  // assumed — 7 September 2026 is actually a Monday, consistent with the
  // spec's own day-count table (4 Sep = Day 10/Friday, so the very next
  // working day, 7 Sep, is Day 11/Monday). The spec's illustrative "Sunday, 7
  // September 2026" hero example text was simply inconsistent with its own
  // table; this asserts the factually correct value instead of that example.
  assert.equal(formatLongDate("2026-09-07"), "Monday, 7 September 2026");
  assert.equal(formatLongDate("2026-08-24"), "Monday, 24 August 2026");
});
