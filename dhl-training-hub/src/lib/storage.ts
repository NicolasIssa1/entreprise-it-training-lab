"use client";

import { useEffect, useState } from "react";

/**
 * Persists an array of items to localStorage, seeded with `initial` the first
 * time the key is empty. Fully local — no backend, consistent with V1 scope.
 */
export function useLocalStorageList<T>(key: string, initial: T[]) {
  const [items, setItems] = useState<T[]>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration read: localStorage isn't available during SSR, so state
    // must start as `initial` (matching the server-rendered output) and only be
    // patched with the real value after mount, here.
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(raw) as T[]);
      } else {
        window.localStorage.setItem(key, JSON.stringify(initial));
      }
    } catch {
      // localStorage unavailable (e.g. private browsing) — fall back to in-memory only.
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // ignore write failures
    }
  }, [key, items, loaded]);

  return { items, setItems, loaded };
}
