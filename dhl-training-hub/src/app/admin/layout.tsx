"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { DemoDataBanner } from "@/components/admin/DemoDataBanner";
import { OrganizationSwitcher } from "@/components/admin/OrganizationSwitcher";
import { useRole } from "@/lib/roles";
import { hasAdminAreaAccess, ROLE_LABELS } from "@/lib/roleRules";
import { organizationRoleAtLeast } from "@/lib/organizationRoleRules";
import { useOrganizations } from "@/lib/organizations";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/learners", label: "Learners" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/programmes", label: "Programmes" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/reports", label: "Reports" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/**
 * Central UX gate for the whole /admin/* route area. This is a CLIENT-SIDE
 * convenience only, not a real security boundary (root CLAUDE.md's Phase 13
 * section 16: "never rely on client-side role checks for real
 * authorization"). It matters less than it used to, though — as of Phase
 * 13, the actual protected data this area can show (another organization
 * member's real training evidence) is independently authorized by Postgres
 * RLS on every single query (see supabase/migrations/0006_multi_tenant.sql),
 * regardless of what this gate decides. What renders here if this gate were
 * somehow bypassed is, at worst, an empty/denied result from Supabase for
 * real org data, or the fictional demo roster for demo data — never another
 * real user's data. Access is granted by EITHER the demo/dev-only platform
 * role (lib/roleRules.ts, for trying the fictional demo experience) OR
 * genuine manager+ membership in any real organization (lib/organizations.tsx)
 * — the two are deliberately kept distinct, per section 16's "distinguish
 * demo display role vs actual authenticated organization membership role."
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const { role, isDevOverride } = useRole();
  const { memberships, loading: orgsLoading } = useOrganizations();
  const pathname = usePathname();

  const hasRealOrgAccess = memberships.some((m) => organizationRoleAtLeast(m.membership.role, "manager"));
  const hasAccess = hasAdminAreaAccess(role) || hasRealOrgAccess;

  if (!orgsLoading && !hasAccess) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-16">
        <Card>
          <SectionHeading title="Manager or Admin access required" subtitle={`Your platform role is "${ROLE_LABELS[role]}", and you are not a manager/admin/owner of any organization.`} />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The Enterprise Admin area is for training managers and administrators. Create an organization to get
            started, or ask an existing admin/owner to invite you.
          </p>
          <Link href="/organizations/new" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
            Create an organization →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrganizationSwitcher />
      <DemoDataBanner />
      {isDevOverride && (
        <Disclaimer>Using a local development role override (NEXT_PUBLIC_DEV_ROLE_OVERRIDE) — see .env.example.</Disclaimer>
      )}
      <nav className="flex flex-wrap gap-1 border-b border-slate-200 pb-2 dark:border-slate-800" aria-label="Enterprise Admin">
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
              isActive(pathname, item.href)
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
