import { CvAchievement, DailyLogEntry, InvestigationCompletionRecord, InvestigationProgress, QuizAttempt, TeamId } from "@/lib/types";
import { bulkUpsertLearningProgress } from "@/lib/repositories/learningProgressRepository";
import { bulkUpsertQuizAttempts } from "@/lib/repositories/quizAttemptsRepository";
import { bulkUpsertInvestigationProgress, bulkUpsertInvestigationCompletions } from "@/lib/repositories/investigationRepository";
import { bulkUpsertDailyLogs } from "@/lib/repositories/dailyLogRepository";
import { bulkUpsertCvAchievements } from "@/lib/repositories/cvAchievementsRepository";
import { bulkUpsertTeamChecklists } from "@/lib/repositories/teamChecklistRepository";
import { markMigrated } from "@/lib/repositories/profileRepository";
import { scopedKey } from "@/lib/storageScope";

/** Every domain this migration reads is in the shared "demo" namespace (see
 * storageScope.ts) — signed-out Local Demo Mode data, never another signed-in
 * account's per-user key. `demoKey` is just `scopedKey(domain, null)` spelled
 * out for readability at each call site below. */
function demoKey(domain: string): string {
  return scopedKey(domain, null);
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isBooleanRecord = (v: unknown): v is Record<string, boolean> =>
  isRecord(v) && Object.values(v).every((x) => typeof x === "boolean");
const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

function safeParse<T>(raw: string | null, isValid: (v: unknown) => v is T): T | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export interface MigrationResult {
  /** False when there was nothing local to migrate at all — the caller should
   * skip showing any "synced" message in that case. */
  hadLocalData: boolean;
  succeededDomains: string[];
  failedDomains: string[];
}

/**
 * One-time upload of every legacy localStorage domain to the newly
 * authenticated user's cloud rows. Idempotent (every repository call below
 * upserts on the same natural key the app already uses as a record id), safe
 * against malformed local data (each domain is independently try/caught so
 * one bad domain can't block the rest), and marks the profile as migrated
 * afterward regardless of partial failures — see root CLAUDE.md's Phase 5
 * migration section for the full rationale.
 *
 * Reads only from the shared "demo" namespace (`scopedKey(domain, null)` —
 * see storageScope.ts), never a raw/legacy global key and never another
 * account's per-user key. **Account-isolation fix**: on a successful migrate,
 * this now clears that domain's demo key afterward. The original Phase 5
 * design deliberately never cleared localStorage post-migration ("data loss
 * is worse than duplication") — but that policy is exactly what let a SECOND
 * account created on the same browser silently re-migrate the FIRST account's
 * leftover local data into itself (each new account has its own unmigrated
 * `local_migration_version`, so each one independently re-read the same
 * stale shared bucket). Once a domain's data has been safely copied to
 * Account A's cloud rows, it stops being "generic transferable state" that a
 * later Account B could also claim — clearing it here is what actually
 * prevents that. A domain that *fails* to migrate is deliberately left in the
 * demo bucket rather than cleared, so a failed upload doesn't also mean lost
 * data — retrying automatically on every future sign-in still isn't in scope
 * (see PRODUCT-ROADMAP.md Phase 5 known limitations), but nothing is thrown
 * away either.
 */
export async function migrateLocalDataToCloud(userId: string): Promise<MigrationResult> {
  const succeededDomains: string[] = [];
  const failedDomains: string[] = [];
  let hadLocalData = false;

  async function migrateDomain(name: string, run: () => Promise<boolean>): Promise<void> {
    try {
      const hadData = await run();
      if (hadData) {
        hadLocalData = true;
        succeededDomains.push(name);
      }
    } catch (err) {
      hadLocalData = true;
      failedDomains.push(name);
      if (process.env.NODE_ENV !== "production") {
        console.error(`Phase 5 migration: failed to migrate "${name}"`, err);
      }
    }
  }

  await migrateDomain("learning progress", async () => {
    const key = demoKey("learning-topic-progress");
    const raw = safeParse(window.localStorage.getItem(key), isBooleanRecord);
    if (!raw || Object.keys(raw).length === 0) return false;
    await bulkUpsertLearningProgress(userId, raw);
    window.localStorage.removeItem(key);
    return true;
  });

  await migrateDomain("quiz attempts", async () => {
    const key = demoKey("quiz-attempts");
    const raw = safeParse(window.localStorage.getItem(key), isRecord);
    if (!raw || Object.keys(raw).length === 0) return false;
    await bulkUpsertQuizAttempts(userId, raw as Record<string, QuizAttempt[]>);
    window.localStorage.removeItem(key);
    return true;
  });

  await migrateDomain("investigation progress", async () => {
    const key = demoKey("investigation-progress");
    const raw = safeParse(window.localStorage.getItem(key), isRecord);
    if (!raw || Object.keys(raw).length === 0) return false;
    await bulkUpsertInvestigationProgress(userId, raw as Record<string, InvestigationProgress>);
    window.localStorage.removeItem(key);
    return true;
  });

  await migrateDomain("investigation completions", async () => {
    const key = demoKey("investigation-completions");
    const raw = safeParse(window.localStorage.getItem(key), isArray);
    if (!raw || raw.length === 0) return false;
    await bulkUpsertInvestigationCompletions(userId, raw as InvestigationCompletionRecord[]);
    window.localStorage.removeItem(key);
    return true;
  });

  await migrateDomain("daily log entries", async () => {
    const key = demoKey("daily-log-entries");
    const raw = safeParse(window.localStorage.getItem(key), isArray);
    if (!raw || raw.length === 0) return false;
    await bulkUpsertDailyLogs(userId, raw as DailyLogEntry[]);
    window.localStorage.removeItem(key);
    return true;
  });

  await migrateDomain("CV achievements", async () => {
    const key = demoKey("cv-achievements");
    const raw = safeParse(window.localStorage.getItem(key), isArray);
    if (!raw || raw.length === 0) return false;
    await bulkUpsertCvAchievements(userId, raw as CvAchievement[]);
    window.localStorage.removeItem(key);
    return true;
  });

  await migrateDomain("team checklists", async () => {
    const byTeam: Partial<Record<TeamId, Record<string, boolean>>> = {};
    const keysWithData: string[] = [];
    for (const teamId of ["infrastructure", "applications", "support-network"] as TeamId[]) {
      const key = demoKey(`checklist-${teamId}`);
      const raw = safeParse(window.localStorage.getItem(key), isBooleanRecord);
      if (raw && Object.keys(raw).length > 0) {
        byTeam[teamId] = raw;
        keysWithData.push(key);
      }
    }
    if (keysWithData.length === 0) return false;
    await bulkUpsertTeamChecklists(userId, byTeam);
    for (const key of keysWithData) window.localStorage.removeItem(key);
    return true;
  });

  // Mark migrated even on partial failure — retrying automatically on every
  // future sign-in isn't in scope (see PRODUCT-ROADMAP.md Phase 5 known
  // limitations); the upserts above are safe to re-run manually if needed.
  await markMigrated(userId).catch(() => undefined);

  return { hadLocalData, succeededDomains, failedDomains };
}
