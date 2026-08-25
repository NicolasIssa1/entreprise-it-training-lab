import { TeamId } from "@/lib/types";

/**
 * Single source of truth for "where the internship currently is." Every page that
 * needs the current date/day/team (Dashboard, Daily Log, CV Tracker, Team pages)
 * must derive its defaults from here — never hardcode these values in more than one
 * place. Update this file as the internship progresses; nothing else needs to change.
 *
 * This is personal internship context (which organization, which role), kept
 * separate from reusable product branding (see ../product.ts) so the underlying
 * product architecture could later support a different organization/role/team
 * without any reusable component needing to change.
 */
export const internshipState = {
  currentDate: "2026-08-25",
  currentDayNumber: 2,
  currentTeam: "infrastructure" as TeamId,
  organization: "DHL Dubai",
  department: "IT/BPU",
  role: "IT Intern",
};
