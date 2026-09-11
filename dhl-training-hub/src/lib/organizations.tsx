"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLocalStorageState } from "@/lib/storage";
import { scopedKey } from "@/lib/storageScope";
import { fetchMyMemberships } from "@/lib/repositories/organizationRepository";
import { Organization, OrganizationMembership, OrganizationRole } from "@/lib/types";

export interface OrganizationMembershipEntry {
  membership: OrganizationMembership;
  organization: Organization;
}

interface OrganizationContextValue {
  memberships: OrganizationMembershipEntry[];
  loading: boolean;
  /** null = "Personal / Demo" — no organization selected. This is a pure
   * client-side DISPLAY preference (which organization's data to show),
   * never an authorization decision — every query is still independently
   * authorized by Postgres RLS regardless of what's selected here. See
   * root CLAUDE.md's Phase 13 section 6. */
  activeOrganizationId: string | null;
  activeOrganization: Organization | null;
  /** The caller's own role in the active organization, from their own
   * membership row — a display convenience, not an authorization check
   * (real authorization always happens server-side per query). */
  activeRole: OrganizationRole | null;
  setActiveOrganizationId: (id: string | null) => void;
  refresh: () => void;
}

const OrganizationContext = createContext<OrganizationContextValue | undefined>(undefined);

const isStringOrNull = (v: unknown): v is string | null => v === null || typeof v === "string";

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user, isConfigured } = useAuth();
  const [memberships, setMemberships] = useState<OrganizationMembershipEntry[]>([]);
  // Starts true (rather than being set synchronously inside the effect below,
  // which react-hooks/set-state-in-effect forbids) so the very first render
  // already reflects "fetch in flight" — it only flips false once resolved.
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  const { state: activeOrganizationId, setState: setActiveOrganizationId } = useLocalStorageState<string | null>(
    scopedKey("active-organization-id", user?.id),
    null,
    isStringOrNull,
  );

  useEffect(() => {
    let cancelled = false;
    const task = isConfigured && user ? fetchMyMemberships() : Promise.resolve([]);
    task
      .then((result) => {
        if (!cancelled) setMemberships(result);
      })
      .catch(() => {
        if (!cancelled) setMemberships([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isConfigured, user, refreshTick]);

  const activeOrganization = useMemo(
    () => memberships.find((m) => m.organization.id === activeOrganizationId)?.organization ?? null,
    [memberships, activeOrganizationId],
  );
  const activeRole = useMemo(
    () => memberships.find((m) => m.organization.id === activeOrganizationId)?.membership.role ?? null,
    [memberships, activeOrganizationId],
  );

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  // If the previously-selected organization is no longer one the user
  // belongs to (removed, or switched accounts), fall back to Personal/Demo
  // rather than silently pointing at an org the user can no longer access.
  useEffect(() => {
    if (loading) return;
    if (activeOrganizationId && !memberships.some((m) => m.organization.id === activeOrganizationId)) {
      setActiveOrganizationId(null);
    }
  }, [loading, memberships, activeOrganizationId, setActiveOrganizationId]);

  return (
    <OrganizationContext.Provider value={{ memberships, loading, activeOrganizationId, activeOrganization, activeRole, setActiveOrganizationId, refresh }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganizations must be used within OrganizationProvider");
  return ctx;
}
