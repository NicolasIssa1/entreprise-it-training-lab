"use client";

import { useState } from "react";
import { TutorConversation } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export interface TutorHistoryMenuProps {
  conversations: TutorConversation[];
  activeConversationId?: string;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

/**
 * A small conversation-history dropdown (Phase 14 section 10) — deliberately
 * not a full ChatGPT-style history browser: just a scrollable list of
 * titles/dates to switch to, a delete icon per item, and one "Clear all"
 * action. Only rendered when signed in (see TutorChat.tsx —
 * conversationHistoryAvailable gates this) since Local Demo Mode keeps the
 * single-running-conversation Phase 6 behavior. RLS is what actually
 * prevents any cross-user visibility here; this menu only ever receives
 * what lib/tutorConversation.ts's hook already fetched for the signed-in
 * caller.
 */
export function TutorHistoryMenu({ conversations, activeConversationId, onSwitch, onDelete, onClearAll }: TutorHistoryMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-xs font-medium text-slate-500 hover:underline dark:text-slate-400"
      >
        History {conversations.length > 0 && `(${conversations.length})`}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900">
          {conversations.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-slate-400">No saved conversations yet.</p>
          ) : (
            <ul className="max-h-64 space-y-0.5 overflow-y-auto">
              {conversations.map((c) => (
                <li key={c.id} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSwitch(c.id);
                      setOpen(false);
                    }}
                    className={`flex-1 truncate rounded-lg px-2 py-1.5 text-left text-xs transition-colors duration-200 ${
                      c.id === activeConversationId
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="block truncate font-medium">{c.title || "Untitled conversation"}</span>
                    <span className="block text-[0.65rem] text-slate-400">{formatDate(c.updatedAt)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(c.id)}
                    aria-label={`Delete conversation: ${c.title || "Untitled conversation"}`}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          {conversations.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onClearAll();
                setOpen(false);
              }}
              className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Clear all history
            </button>
          )}
        </div>
      )}
    </div>
  );
}
