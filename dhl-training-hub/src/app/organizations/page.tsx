"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { buttonClass } from "@/lib/ui";
import { useOrganizations } from "@/lib/organizations";
import { OrganizationRole } from "@/lib/types";

const ORG_ROLE_LABELS: Record<OrganizationRole, string> = { owner: "Owner", admin: "Admin", manager: "Manager", learner: "Learner" };

export default function OrganizationsPage() {
  const { memberships, activeOrganizationId, setActiveOrganizationId, loading } = useOrganizations();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organizations"
        title="Your Organizations"
        description="Companies, universities, or training providers you belong to. You can also use every learning feature without one — see Personal / Demo mode."
        accent="from-slate-500/10 via-blue-500/10 to-transparent"
        actions={
          <Link href="/organizations/new" className={buttonClass("primary")}>
            Create organization
          </Link>
        }
      />

      {!loading && memberships.length === 0 ? (
        <EmptyState title="You don't belong to any organization yet" description="Create one, or ask an admin/owner to invite you via a join link." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {memberships.map(({ membership, organization }) => (
            <Card key={organization.id} className={organization.id === activeOrganizationId ? "border-blue-300 dark:border-blue-800" : ""}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{organization.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">/{organization.slug} · {organization.orgType.replace("_", " ")}</p>
                </div>
                <Badge variant="accent">{ORG_ROLE_LABELS[membership.role]}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                {organization.id === activeOrganizationId ? (
                  <Badge variant="success">Currently viewing</Badge>
                ) : (
                  <button type="button" onClick={() => setActiveOrganizationId(organization.id)} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Switch to this organization →
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
