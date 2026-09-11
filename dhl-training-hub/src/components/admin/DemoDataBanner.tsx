"use client";

import { useOrganizations } from "@/lib/organizations";

/**
 * Persistent, unmissable notice shown whenever the Enterprise Admin area is
 * displaying the fictional demo roster — never shown when a real
 * organization is the active view (root CLAUDE.md's Phase 13 section 11:
 * "the persistent demo banner should remain when viewing generated
 * fictional data" but real organization data must be clearly distinct from
 * it, not co-labeled). Only rows/records labeled "You" within demo mode
 * reflect the real signed-in account.
 */
export function DemoDataBanner() {
  const { activeOrganizationId } = useOrganizations();
  if (activeOrganizationId) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
      <span className="font-medium">Demo data.</span> This Enterprise Admin area is illustrative — most learners shown
      are fictional, generated for demonstration. Only rows or records labeled <span className="font-medium">You</span>{" "}
      reflect your own real account. No real DHL employee data is used anywhere in this area. Switch to a real
      organization above to see real, RLS-protected member data instead.
    </div>
  );
}
