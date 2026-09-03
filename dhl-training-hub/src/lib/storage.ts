"use client";

import { useEffect, useState } from "react";
import { scopedKey, LEGACY_DOMAIN_KEYS } from "@/lib/storageScope";

const LEGACY_ADOPTION_FLAG = "demo-namespace-migrated-v1";

/**
 * One-time adoption of every pre-namespacing localStorage key (e.g. the old
 * global "learning-topic-progress") into the new shared "demo:" namespace —
 * see storageScope.ts's header comment for why per-identity namespacing
 * exists at all (a real cross-account data leak). Runs at module load, not
 * inside a React effect, specifically so it always completes before any
 * useLocalStorageState call below can read or write anything — every domain
 * hook imports this module, so this line runs exactly once, synchronously,
 * before the first hook mounts.
 */
function adoptLegacyDemoKeysOnce() {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(LEGACY_ADOPTION_FLAG)) return;
    for (const domain of LEGACY_DOMAIN_KEYS) {
      const legacyRaw = window.localStorage.getItem(domain);
      const demoKey = scopedKey(domain, null);
      if (legacyRaw !== null && window.localStorage.getItem(demoKey) === null) {
        window.localStorage.setItem(demoKey, legacyRaw);
      }
      window.localStorage.removeItem(domain);
    }
    window.localStorage.setItem(LEGACY_ADOPTION_FLAG, "1");
  } catch {
    // Best-effort — malformed/unavailable localStorage should never crash the app.
  }
}

adoptLegacyDemoKeysOnce();

/**
 * Persists arbitrary JSON-serializable state to localStorage, seeded with `initial`
 * the first time the key is empty. Fully local — no backend, consistent with V1
 * scope. This is the one shared hydration/persist implementation — other storage
 * hooks (e.g. useLocalStorageList below) should wrap this rather than reimplement
 * the read/write/guard logic.
 *
 * `isValid` guards against corrupted or unexpected-shape saved data (e.g.
 * hand-edited storage, a future schema change) rather than trusting `JSON.parse`'s
 * result blindly. Defaults to accepting anything that parsed.
 *
 * `key` is expected to already be identity-scoped (see storageScope.ts) by the
 * caller — every domain hook derives it from the signed-in user id (or the
 * shared demo namespace when signed out). When `key` itself changes — which
 * happens whenever the signed-in user changes, including sign-out — state is
 * reset to `initial` *synchronously during render*, not in an effect: this is
 * what guarantees a previous account's in-memory value is never painted, even
 * for one frame, before the real value for the new identity has loaded.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by the type predicate syntax
  isValid: (value: unknown) => value is T = (value): value is T => true,
) {
  const [state, setState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  // Tracked in state (not a ref — accessing a ref's value during render is
  // unsafe under React's stricter compiler rules) so the reset below can run
  // synchronously during render itself, per React's own documented pattern
  // for "adjusting state when a prop changes" (react.dev).
  const [prevKey, setPrevKey] = useState(key);
  if (prevKey !== key) {
    setPrevKey(key);
    setState(initial);
    setLoaded(false);
  }

  useEffect(() => {
    // One-time-per-key hydration read: localStorage isn't available during SSR, so
    // state must start as `initial` (matching the server-rendered output) and only
    // be patched with the real value after mount, here. Always resets to a fresh
    // `nextState` (starting from `initial`) rather than conditionally patching, so
    // a key change can never leave a previous key's in-memory value behind.
    let nextState: T = initial;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) {
          nextState = parsed;
        }
        // If `parsed` fails validation, falls back to `initial` — this is what
        // protects every consumer from malformed/legacy saved data.
      } else {
        window.localStorage.setItem(key, JSON.stringify(initial));
      }
    } catch {
      // Malformed JSON or localStorage unavailable (e.g. private browsing) —
      // fall back to in-memory `initial` only.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(nextState);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write failures
    }
  }, [key, state, loaded]);

  return { state, setState, loaded };
}

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

/** Array-specific convenience wrapper over useLocalStorageState (existing API
 * preserved — same key/shape as before for daily log entries and CV achievements). */
export function useLocalStorageList<T>(key: string, initial: T[]) {
  const { state, setState, loaded } = useLocalStorageState<T[]>(key, initial, isArray as (value: unknown) => value is T[]);
  return { items: state, setItems: setState, loaded };
}
