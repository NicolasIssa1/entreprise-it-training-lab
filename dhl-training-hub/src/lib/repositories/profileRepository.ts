import { getSupabaseClient } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  displayName: string | null;
  localMigrationVersion: number;
  createdAt: string;
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
