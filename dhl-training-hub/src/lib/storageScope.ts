/**
 * Every localStorage-backed domain must be scoped by *identity*, never shared
 * globally — otherwise one browser signing in as two different Supabase
 * accounts leaks Account A's data into Account B. This was a real,
 * privacy-critical bug: every domain hook used one fixed key (e.g.
 * "learning-topic-progress") regardless of who was signed in, so a second
 * account created on the same browser would see, and even have re-uploaded
 * to its own cloud rows, the first account's data. See CLAUDE.md's Phase 5
 * section for the fix this file is part of.
 *
 * Signed out / Local Demo Mode uses one shared "demo" namespace (unchanged in
 * spirit from every phase before real accounts existed — Local Demo Mode has
 * always been implicitly single-user). Signed in uses a namespace private to
 * that user's immutable Supabase auth id. Never the email address — it's
 * mutable and is personal information that has no reason to live in a
 * storage key name.
 */
export function scopedKey(domain: string, userId: string | null | undefined): string {
  return userId ? `user:${userId}:${domain}` : `demo:${domain}`;
}

/**
 * Every base domain key that existed before per-identity namespacing shipped.
 * Used exactly once, at module load (see the boot-time adoption in
 * lib/storage.ts), to fold each pre-existing shared key into the new "demo"
 * namespace — so an existing Local Demo Mode user doesn't lose data when this
 * fix ships, and so nothing ever reads the old shared keys again afterward
 * (which is what made the cross-account leak possible in the first place).
 *
 * Keep this in sync with every domain hook's base key name. Team checklist is
 * one key per team, not one key for the whole domain — listed individually
 * rather than templated, since there are only three and a fixed list is
 * easier to audit than reconstructing it from `TeamId`.
 */
export const LEGACY_DOMAIN_KEYS = [
  "learning-topic-progress",
  "quiz-attempts",
  "investigation-progress",
  "investigation-completions",
  "daily-log-entries",
  "cv-achievements",
  "checklist-infrastructure",
  "checklist-applications",
  "checklist-support-network",
  "tutor-conversation",
  "selected-assignment-id",
  "onboarding-preferences",
] as const;
