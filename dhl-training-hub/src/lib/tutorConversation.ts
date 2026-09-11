"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  fetchLatestTutorConversation,
  createTutorConversation,
  appendTutorMessage,
  fetchTutorConversationList,
  fetchTutorConversationById,
  renameTutorConversation,
  deleteTutorConversation,
  deleteAllTutorConversations,
} from "@/lib/repositories/tutorRepository";
import { scopedKey } from "@/lib/storageScope";
import { TutorConversation, TutorMessage } from "@/lib/types";

const DOMAIN_KEY = "tutor-conversation";
/** Rolling cap on what's kept in view/storage — the API request itself only
 * ever sends the last ~12 turns regardless (see /api/tutor/route.ts), this is
 * a separate cap so the stored conversation doesn't grow unbounded across a
 * long-lived local session. */
const MAX_STORED_MESSAGES = 60;
const AUTO_TITLE_LENGTH = 60;

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

function autoTitleFrom(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > AUTO_TITLE_LENGTH ? `${trimmed.slice(0, AUTO_TITLE_LENGTH)}…` : trimmed;
}

/**
 * One lightweight running Tutor conversation per learner (Phase 6 Part Q),
 * plus a Phase 14 conversation-history menu (list/switch/delete/clear) for
 * signed-in users. Built on the same useLocalStorageState core as every
 * other domain hook.
 *
 * Phase 5-style dual mode: signed out / Local Demo Mode is pure localStorage
 * with exactly the Phase 6 single-conversation behavior ("start new
 * conversation" discards the old one locally) — history browsing is
 * deliberately cloud-mode only, since Local Demo Mode has never persisted
 * more than one thread and a localStorage-only multi-conversation store
 * would be a much bigger structural change for a mode that isn't meant to
 * be a permanent record anyway (root CLAUDE.md: Local Demo Mode is "your
 * browser only, no accounts"). Signed in fetches the user's latest
 * conversation on mount (cloud becomes authoritative) and writes through on
 * every new message, same optimistic-local-first / SyncErrorNotice pattern
 * as every other Phase 5 hook.
 *
 * Account isolation (see storageScope.ts): the local cache key is scoped per
 * signed-in user, so a brand-new account never sees — and never re-uploads to
 * its own cloud rows — another account's conversation history from the same
 * browser. History list/switch/delete all go through repository calls that
 * are further scoped by RLS (auth.uid() = user_id) regardless of what the
 * client asks for — never visible to another learner, organization-safe by
 * construction since there is no cross-user read path for this table at all
 * (see supabase/migrations/0006_multi_tenant.sql's header comment on which
 * tables gained organization-visibility and which — like this one —
 * deliberately did not).
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
  const [conversationList, setConversationList] = useState<TutorConversation[]>([]);
  const [historyRefreshTick, setHistoryRefreshTick] = useState(0);

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

  useEffect(() => {
    let cancelled = false;
    const task = cloudMode && user ? fetchTutorConversationList(user.id) : Promise.resolve([]);
    task
      .then((list) => {
        if (!cancelled) setConversationList(list);
      })
      .catch(() => {
        if (!cancelled) setConversationList([]);
      });
    return () => {
      cancelled = true;
    };
  }, [cloudMode, user, historyRefreshTick]);

  function refreshHistory() {
    setHistoryRefreshTick((t) => t + 1);
  }

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
    const isFirstMessage = state.messages.length === 0 && message.role === "user";
    setState((prev) => ({ conversation, messages: [...prev.messages, message].slice(-MAX_STORED_MESSAGES) }));
    if (cloudMode && user) {
      appendTutorMessage(user.id, conversation.id, message).catch(() => setSyncError(true));
      if (isFirstMessage) {
        renameTutorConversation(user.id, conversation.id, autoTitleFrom(message.content)).catch(() => undefined);
      }
      refreshHistory();
    }
  }

  function startNewConversation() {
    setState(EMPTY_STATE);
  }

  /** Loads a past conversation from the history menu as the active thread —
   * cloud-mode only (see header comment). */
  async function switchConversation(conversationId: string) {
    if (!cloudMode || !user) return;
    const cloud = await fetchTutorConversationById(user.id, conversationId);
    if (cloud) setState({ conversation: cloud.conversation, messages: cloud.messages.slice(-MAX_STORED_MESSAGES) });
  }

  async function deleteConversation(conversationId: string) {
    if (!cloudMode || !user) return;
    await deleteTutorConversation(user.id, conversationId);
    if (state.conversation?.id === conversationId) setState(EMPTY_STATE);
    refreshHistory();
  }

  async function clearAllConversations() {
    if (!cloudMode || !user) return;
    await deleteAllTutorConversations(user.id);
    setState(EMPTY_STATE);
    refreshHistory();
  }

  return {
    conversation: state.conversation,
    messages: state.messages,
    ensureConversation,
    addMessage,
    startNewConversation,
    loaded,
    syncError,
    conversationHistoryAvailable: cloudMode,
    conversationList,
    switchConversation,
    deleteConversation,
    clearAllConversations,
  };
}
