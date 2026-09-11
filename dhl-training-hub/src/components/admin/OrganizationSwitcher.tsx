"use client";

import Link from "next/link";
import { useOrganizations } from "@/lib/organizations";
import { inputClass } from "@/lib/ui";
import { OrganizationRole } from "@/lib/types";

const ORG_ROLE_LABELS: Record<OrganizationRole, string> = { owner: "Owner", admin: "Admin", manager: "Manager", learner: "Learner" };

/**
 * Lets the user pick which organization's data the Enterprise Admin area
 * shows — a pure client-side DISPLAY preference (see
 * lib/organizations.tsx's header comment). Changing this selection never
 * grants access to anything; it only changes which already-authorized
 * queries get made. A user who isn't actually a member of an organization
 * can't select it in the first place, since this list only ever contains
 * organizations useOrganizations() fetched (which itself only returns rows
 * RLS allows).
 */
export function OrganizationSwitcher() {
  const { memberships, activeOrganizationId, setActiveOrganizationId, loading } = useOrganizations();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="organization-switcher" className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Viewing:
      </label>
      <select
        id="organization-switcher"
        className={`${inputClass} w-auto`}
        value={activeOrganizationId ?? ""}
        onChange={(e) => setActiveOrganizationId(e.target.value || null)}
        disabled={loading}
      >
        <option value="">Personal / Demo</option>
        {memberships.map(({ membership, organization }) => (
          <option key={organization.id} value={organization.id}>
            {organization.name} ({ORG_ROLE_LABELS[membership.role]})
          </option>
        ))}
      </select>
      <Link href="/organizations" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
        Manage organizations →
      </Link>
    </div>
  );
}
