/**
 * Merge helpers for every Phase 5 cloud-aware domain hook (regression fix —
 * see CLAUDE.md's Phase 5 section: "...surfacing a friendly SyncErrorNotice on
 * failure without ever clearing what the learner just did").
 *
 * Root cause this fixes: every domain hook's cloud-fetch-on-mount effect used
 * to *replace* local state outright with whatever cloud returned
 * (`setEntries(cloud)`). If a background write hadn't actually landed in
 * Supabase yet — a race between an in-flight insert/upsert and a fast page
 * refresh, a request the browser dropped mid-flight on page unload, or a
 * transient network/RLS/schema failure — the very next mount's fetch (e.g.
 * "save, then refresh the page") would silently erase the not-yet-synced
 * local change. This is exactly what made Daily Log/CV Tracker (and, less
 * visibly, every other synced domain) appear to "stop saving."
 *
 * The fix: merge instead of replace. Cloud wins for any key/id it actually
 * has an opinion on (preserving "cloud is authoritative post-auth" and still
 * letting genuine cross-device edits through) — but anything that exists
 * ONLY locally is preserved rather than dropped. Callers are expected to
 * re-push whatever comes back as "local only" to cloud in the background
 * (self-healing the sync gap), using the same bulk-upsert repository
 * functions the one-time migration already relies on.
 *
 * Known limitation (documented, not silently accepted): this is last-write-
 * wins per key/id, not a timestamp-based or CRDT merge — the project
 * explicitly does not attempt full multi-device conflict resolution (see
 * PRODUCT-ROADMAP.md's Phase 5 "explicitly not built" list). A delete whose
 * network call hadn't landed yet before a very fast refresh can still
 * reappear once from cloud — the same behavior the app already had before
 * this fix, just no longer compounded by new/edited data being wiped too.
 */

/** Record-shaped domains (learning progress, team checklist, investigation
 * progress-by-scenario): cloud overwrites any key it has data for; any key
 * present only in `local` (not yet synced) survives in `merged` and is
 * reported back in `localOnly` so the caller can re-push it. */
export function mergeRecordPreferCloud<V>(
  local: Record<string, V>,
  cloud: Record<string, V>,
): { merged: Record<string, V>; localOnly: Record<string, V> } {
  const merged: Record<string, V> = { ...local, ...cloud };
  const localOnly: Record<string, V> = {};
  for (const key of Object.keys(local)) {
    if (!(key in cloud)) localOnly[key] = local[key];
  }
  return { merged, localOnly };
}

/** Array-shaped domains keyed by a natural id (daily logs, CV achievements,
 * investigation completions): cloud's copy of a given id wins; any local item
 * whose id cloud doesn't have at all is kept (appended) and reported back in
 * `localOnly`. */
export function mergeArrayByIdPreferCloud<T>(
  local: T[],
  cloud: T[],
  getId: (item: T) => string,
): { merged: T[]; localOnly: T[] } {
  const cloudIds = new Set(cloud.map(getId));
  const localOnly = local.filter((item) => !cloudIds.has(getId(item)));
  return { merged: [...cloud, ...localOnly], localOnly };
}

/** Map-of-arrays domains (quiz attempts: Record<quizId, QuizAttempt[]>) —
 * per key, merges the two arrays by id the same way as
 * mergeArrayByIdPreferCloud, then folds in any key present only in `local`.
 * `localOnly` mirrors the input shape (Record<key, T[]>) so callers can hand
 * it straight to their existing bulk-upsert-by-map repository function. */
export function mergeMapOfArraysByIdPreferCloud<T>(
  local: Record<string, T[]>,
  cloud: Record<string, T[]>,
  getId: (item: T) => string,
): { merged: Record<string, T[]>; localOnly: Record<string, T[]> } {
  const merged: Record<string, T[]> = {};
  const localOnly: Record<string, T[]> = {};
  const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);

  for (const key of keys) {
    const { merged: mergedList, localOnly: localOnlyList } = mergeArrayByIdPreferCloud(
      local[key] ?? [],
      cloud[key] ?? [],
      getId,
    );
    merged[key] = mergedList;
    if (localOnlyList.length > 0) localOnly[key] = localOnlyList;
  }

  return { merged, localOnly };
}
