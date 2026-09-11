import { getSupabaseClient } from "@/lib/supabase/client";
import { ProductTier, PRODUCT_TIERS, UserRole, USER_ROLES } from "@/lib/types";

export interface Profile {
  id: string;
  displayName: string | null;
  localMigrationVersion: number;
  createdAt: string;
  /** Entitlement tier (Phase 11). Defaults to "free" — see
   * supabase/migrations/0004_premium.sql's protect_tier_column trigger: this
   * column is deliberately NOT writable by ordinary client update calls (no
   * payment integration exists yet), so nothing in this repository ever
   * attempts to set it. */
  tier: ProductTier;
  /** Enterprise Admin role (Phase 12). Defaults to "learner" — protected by
   * the same kind of DB trigger as tier (see
   * supabase/migrations/0005_admin_roles.sql). This gates client-side UI
   * only; see lib/roleRules.ts's header comment for why that's an
   * acceptable, honestly-documented limitation for what Phase 12 actually
   * does. */
  role: UserRole;
}

function toTier(value: string | null): ProductTier {
  return (PRODUCT_TIERS as readonly string[]).includes(value ?? "") ? (value as ProductTier) : "free";
}

function toRole(value: string | null): UserRole {
  return (USER_ROLES as readonly string[]).includes(value ?? "") ? (value as UserRole) : "learner";
}

/** Current migration schema version — bump only if the migration logic itself
 * changes shape in a way that requires re-running for already-migrated users. */
export const CURRENT_MIGRATION_VERSION = 1;

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    localMigrationVersion: data.local_migration_version,
    createdAt: data.created_at,
    tier: toTier(data.tier),
    role: toRole(data.role),
  };
}

/** Defensive fallback for the rare case the on_auth_user_created trigger
 * hasn't created a profile row yet by the time the client needs one. */
export async function ensureProfile(userId: string): Promise<Profile | null> {
  const existing = await getProfile(userId);
  if (existing) return existing;

  const supabase = getSupabaseClient();
  if (!supabase) return null;
  await supabase.from("profiles").insert({ id: userId }).select().maybeSingle();
  return getProfile(userId);
}

export async function markMigrated(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from("profiles")
    .update({ local_migration_version: CURRENT_MIGRATION_VERSION })
    .eq("id", userId);
  if (error) throw error;
}

export async function updateDisplayName(userId: string, displayName: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", userId);
  if (error) throw error;
}
