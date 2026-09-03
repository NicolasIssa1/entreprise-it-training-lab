"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchLatestTutorConversation, createTutorConversation, appendTutorMessage } from "@/lib/repositories/tutorRepository";
import { scopedKey } from "@/lib/storageScope";
import { TutorConversation, TutorMessage } from "@/lib/types";

const DOMAIN_KEY = "tutor-conversation";
/** Rolling cap on what's kept in view/storage — the API request itself only
 * ever sends the last ~12 turns regardless (see /api/tutor/route.ts), this is
 * a separate cap so the stored conversation doesn't grow unbounded across a
 * long-lived local session. */
const MAX_STORED_MESSAGES = 60;

interface StoredConversation {
  conversation: TutorConversation | null;
  messages: TutorMessage[];
}

const EMPTY_STATE: StoredConversation = { conversation: null, messages: [] };

const isStoredConversation = (value: unknown): value is StoredConversation =>
  typeof value === "object" &&
  value !== null &&
  "conversation" in value &&
  "messages" in value &&
  Array.isArray((value as StoredConversation).messages);

/**
 * One lightweight running Tutor conversation per learner (Phase 6 Part Q) —
 * built on the same useLocalStorageState core as every other domain hook.
 * "Start new conversation" begins a fresh conversation id locally; earlier
 * cloud messages are never deleted (see docs/AI-TUTOR.md), just no longer the
 * active thread.
 *
 * Phase 5-style dual mode: signed out / Local Demo Mode is pure localStorage.
 * Signed in fetches the user's latest conversation on mount (cloud becomes
 * authoritative) and writes through on every new message, same
 * optimistic-local-first / SyncErrorNotice pattern as every other Phase 5 hook.
 *
 * Account isolation (see storageScope.ts): the local cache key is scoped per
 * signed-in user, so a brand-new account never sees — and never re-uploads to
 * its own cloud rows — another account's conversation history from the same
 * browser. A newly authenticated user simply starts with no conversation;
 * there is no cross-account "adoption" of a demo-mode conversation the way
 * the Phase 5 one-time migration adopts other domains (see lib/migration.ts).
 */
export function useTutorConversation() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state, setState, loaded } = useLocalStorageState<StoredConversation>(
    scopedKey(DOMAIN_KEY, user?.id),
    EMPTY_STATE,
    isStoredConversation,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchLatestTutorConversation(user.id)
      .then((cloud) => {
        if (cancelled || !cloud) return;
        setState((prevLocal) => {
          if (!prevLocal.conversation || prevLocal.conversation.id === cloud.conversation.id) {
            // Same thread (or no local thread yet): merge messages by id — cloud
            // wins on overlap, but a message just sent locally that cloud
            // doesn't have yet (its background insert hadn't landed) is kept
            // and re-sent rather than silently dropped from the thread.
            const cloudIds = new Set(cloud.messages.map((m) => m.id));
            const localOnly = prevLocal.messages.filter((m) => !cloudIds.has(m.id));
            if (localOnly.length > 0) {
              for (const message of localOnly) {
                appendTutorMessage(user.id, cloud.conversation.id, message).catch(() => setSyncError(true));
              }
            }
            return { conversation: cloud.conversation, messages: [...cloud.messages, ...localOnly].slice(-MAX_STORED_MESSAGES) };
          }
          // Local has a different, more recent conversation thread cloud doesn't
          // know about yet (its creation/messages hadn't synced) — keep it
          // rather than silently switching the learner to an older thread, and
          // self-heal it up to cloud.
          const localConversation = prevLocal.conversation;
          createTutorConversation(user.id, localConversation).catch(() => setSyncError(true));
          for (const message of prevLocal.messages) {
            appendTutorMessage(user.id, localConversation.id, message).catch(() => setSyncError(true));
          }
          return prevLocal;
        });
      })
      .catch(() => {
        if (!cancelled) setSyncError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  /** Lazily creates the active conversation on the first message of a thread —
   * mirrors how other hooks only write on real user action, never eagerly. */
  async function ensureConversation(): Promise<TutorConversation> {
    if (state.conversation) return state.conversation;
    const conversation: TutorConversation = {
      id: crypto.randomUUID(),
      title: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, conversation }));
    if (cloudMode && user) {
      createTutorConversation(user.id, conversation).catch(() => setSyncError(true));
    }
    return conversation;
  }

  function addMessage(message: TutorMessage, conversation: TutorConversation) {
    setState((prev) => ({ conversation, messages: [...prev.messages, message].slice(-MAX_STORED_MESSAGES) }));
    if (cloudMode && user) {
      appendTutorMessage(user.id, conversation.id, message).catch(() => setSyncError(true));
    }
  }

  function startNewConversation() {
    setState(EMPTY_STATE);
  }

  return {
    conversation: state.conversation,
    messages: state.messages,
    ensureConversation,
    addMessage,
    startNewConversation,
    loaded,
    syncError,
  };
}
