"use client";

import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { textareaClass } from "@/lib/ui";

const isString = (value: unknown): value is string => typeof value === "string";

/**
 * Simple free-text notes/reflection boxes, persisted locally so they survive a
 * refresh. Local-only by design (never synced to Supabase, same scope as
 * bpoProjectPrep.ts) — but still identity-scoped via scopedKey(), which this
 * component previously was NOT: it used to read/write two fixed
 * window.localStorage keys directly, so a second account signed in on the
 * same browser would see (and could overwrite) the first account's notes —
 * a real cross-account leak, the same class of bug storageScope.ts's account-
 * isolation fix exists to prevent, just missed for this one component. See
 * LEGACY_DOMAIN_KEYS in storageScope.ts for how any already-saved notes are
 * preserved into the new scoped key rather than silently lost.
 */
export function DashboardNotes() {
  const { user } = useAuth();
  const { state: notes, setState: setNotes } = useLocalStorageState<string>(
    scopedKey("dashboard-quick-notes", user?.id),
    "",
    isString,
  );
  const { state: reflection, setState: setReflection } = useLocalStorageState<string>(
    scopedKey("dashboard-reflection", user?.id),
    "",
    isString,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <SectionHeading title="Quick notes" subtitle="Jot anything down as it happens today" />
        <textarea
          aria-label="Quick notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="e.g. Team mentioned they use a shared ticket dashboard..."
          className={textareaClass}
        />
      </Card>
      <Card>
        <SectionHeading title="End-of-day reflection" subtitle="What went well? What's still unclear?" />
        <textarea
          aria-label="End-of-day reflection"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={6}
          placeholder="e.g. I understand the ticket lifecycle now, but still unsure how urgency is decided..."
          className={textareaClass}
        />
      </Card>
    </div>
  );
}
