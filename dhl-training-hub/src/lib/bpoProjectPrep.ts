"use client";

import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { BpoProjectPrepNotes } from "@/lib/types";

const DOMAIN_KEY = "bpo-project-prep";

const isNotes = (value: unknown): value is BpoProjectPrepNotes =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * PRIVATE, personal, local-only worksheet (see /bpo/project-prep and root
 * CLAUDE.md's confidentiality rules). Deliberately never synced to Supabase —
 * unlike every other Phase 5 domain hook, there is no repository call here at
 * all, by design: this worksheet exists specifically so Nicolas can jot notes
 * before discussing a real work automation, and the safest place for that is
 * the browser it was typed in, nowhere else. Still identity-scoped via
 * scopedKey() (the account-isolation fix, see storageScope.ts) so a second
 * account on the same browser never inherits the first account's notes, even
 * though nothing here ever leaves localStorage.
 */
export function useBpoProjectPrep() {
  const { user } = useAuth();
  const { state, setState, loaded } = useLocalStorageState<BpoProjectPrepNotes>(
    scopedKey(DOMAIN_KEY, user?.id),
    {},
    isNotes,
  );

  function setField(fieldId: keyof BpoProjectPrepNotes, value: string) {
    setState({ ...state, [fieldId]: value });
  }

  function clearAll() {
    setState({});
  }

  return { notes: state, setField, clearAll, loaded };
}
