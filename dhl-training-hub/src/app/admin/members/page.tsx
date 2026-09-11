"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { inputClass, buttonClass } from "@/lib/ui";
import { useOrganizations } from "@/lib/organizations";
import { useOrganizationMembers } from "@/lib/organizationData";
import { useAuth } from "@/lib/auth/AuthProvider";
import { inviteToOrganization, updateOrganizationMemberRole, removeOrganizationMember, fetchPendingInvites } from "@/lib/repositories/organizationRepository";
import { OrganizationRole } from "@/lib/types";

const INVITABLE_ROLES: Exclude<OrganizationRole, "owner">[] = ["learner", "manager", "admin"];

export default function AdminMembersPage() {
  const { activeOrganizationId, activeOrganization, activeRole } = useOrganizations();
  const { user } = useAuth();
  const { members, invites, refresh } = useOrganizationMembers(activeOrganizationId);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<OrganizationRole, "owner">>("learner");
  const [error, setError] = useState<string | null>(null);
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);

  const canManage = activeRole === "owner" || activeRole === "admin";

  if (!activeOrganizationId) {
    return (
      <Card>
        <EmptyState title="Select a real organization" description="Member management is only available for a real organization — switch to one above, or create one." />
      </Card>
    );
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const inviteId = await inviteToOrganization(activeOrganizationId!, email, role);
      const updatedInvites = await fetchPendingInvites(activeOrganizationId!);
      const created = updatedInvites.find((i) => i.id === inviteId);
      setLastInviteLink(created ? `${window.location.origin}/organizations/join/${created.token}` : null);
      setEmail("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite");
    }
  }

  async function handleRoleChange(targetUserId: string, newRole: Exclude<OrganizationRole, "owner">) {
    setError(null);
    try {
      await updateOrganizationMemberRole(activeOrganizationId!, targetUserId, newRole);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change role");
    }
  }

  async function handleRemove(targetUserId: string) {
    setError(null);
    try {
      await removeOrganizationMember(activeOrganizationId!, targetUserId);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Enterprise Admin" title="Members" description={`Manage who belongs to ${activeOrganization?.name ?? "this organization"}.`} accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      {error && <Disclaimer>{error}</Disclaimer>}

      <Card>
        <SectionHeading title="Roster" />
        <ul className="space-y-2 text-sm">
          {members.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {m.displayName || "No display name set"}
                {m.userId === user?.id && <Badge variant="accent">You</Badge>}
              </span>
              <span className="flex items-center gap-2">
                {canManage && m.role !== "owner" && m.userId !== user?.id ? (
                  <select value={m.role} onChange={(e) => handleRoleChange(m.userId, e.target.value as Exclude<OrganizationRole, "owner">)} className={`${inputClass} w-auto`}>
                    {INVITABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge variant="neutral">{m.role}</Badge>
                )}
                {canManage && m.role !== "owner" && (
                  <button type="button" onClick={() => handleRemove(m.userId)} className="text-xs font-medium text-red-600 hover:underline dark:text-red-400">
                    Remove
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      {canManage && (
        <Card>
          <SectionHeading title="Invite a member" subtitle="Email delivery is not configured in this environment — invites are not sent automatically" />
          <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className={`${inputClass} max-w-xs`} required />
            <select value={role} onChange={(e) => setRole(e.target.value as Exclude<OrganizationRole, "owner">)} className={`${inputClass} w-auto`}>
              {INVITABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <button type="submit" className={buttonClass("primary")}>
              Create invite
            </button>
          </form>
          {lastInviteLink && (
            <Disclaimer>
              Invite created — <span className="font-medium">not sent</span>. Share this link manually:{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">{lastInviteLink}</code>
            </Disclaimer>
          )}

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Pending invites</p>
            {invites.length === 0 ? (
              <p className="text-xs text-slate-400">None.</p>
            ) : (
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {invites.map((i) => (
                  <li key={i.id} className="flex items-center justify-between">
                    <span>
                      {i.email} — {i.role}
                    </span>
                    <Badge variant="warning">Not sent</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
