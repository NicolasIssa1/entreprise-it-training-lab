"use client";

import { useEffect, useState } from "react";

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
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by the type predicate syntax
  isValid: (value: unknown) => value is T = (value): value is T => true,
) {
  const [state, setState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration read: localStorage isn't available during SSR, so state
    // must start as `initial` (matching the server-rendered output) and only be
    // patched with the real value after mount, here.
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setState(parsed);
        }
        // If `parsed` fails validation, silently keep `initial` rather than crash —
        // this is what protects every consumer from malformed/legacy saved data.
      } else {
        window.localStorage.setItem(key, JSON.stringify(initial));
      }
    } catch {
      // Malformed JSON or localStorage unavailable (e.g. private browsing) —
      // fall back to in-memory `initial` only.
    }
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
