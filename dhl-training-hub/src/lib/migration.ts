import { CvAchievement, DailyLogEntry, InvestigationCompletionRecord, InvestigationProgress, QuizAttempt, TeamId } from "@/lib/types";
import { bulkUpsertLearningProgress } from "@/lib/repositories/learningProgressRepository";
import { bulkUpsertQuizAttempts } from "@/lib/repositories/quizAttemptsRepository";
import { bulkUpsertInvestigationProgress, bulkUpsertInvestigationCompletions } from "@/lib/repositories/investigationRepository";
import { bulkUpsertDailyLogs } from "@/lib/repositories/dailyLogRepository";
import { bulkUpsertCvAchievements } from "@/lib/repositories/cvAchievementsRepository";
import { bulkUpsertTeamChecklists } from "@/lib/repositories/teamChecklistRepository";
import { markMigrated } from "@/lib/repositories/profileRepository";

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
 * Deliberately does NOT delete or clear localStorage afterward — local state
 * keeps working as an optimistic cache/fallback (see the per-domain hooks in
 * lib/*.ts). Data loss is worse than duplication.
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
    const raw = safeParse(window.localStorage.getItem("learning-topic-progress"), isBooleanRecord);
    if (!raw || Object.keys(raw).length === 0) return false;
    await bulkUpsertLearningProgress(userId, raw);
    return true;
  });

  await migrateDomain("quiz attempts", async () => {
    const raw = safeParse(window.localStorage.getItem("quiz-attempts"), isRecord);
    if (!raw || Object.keys(raw).length === 0) return false;
    await bulkUpsertQuizAttempts(userId, raw as Record<string, QuizAttempt[]>);
    return true;
  });

  await migrateDomain("investigation progress", async () => {
    const raw = safeParse(window.localStorage.getItem("investigation-progress"), isRecord);
    if (!raw || Object.keys(raw).length === 0) return false;
    await bulkUpsertInvestigationProgress(userId, raw as Record<string, InvestigationProgress>);
    return true;
  });

  await migrateDomain("investigation completions", async () => {
    const raw = safeParse(window.localStorage.getItem("investigation-completions"), isArray);
    if (!raw || raw.length === 0) return false;
    await bulkUpsertInvestigationCompletions(userId, raw as InvestigationCompletionRecord[]);
    return true;
  });

  await migrateDomain("daily log entries", async () => {
    const raw = safeParse(window.localStorage.getItem("daily-log-entries"), isArray);
    if (!raw || raw.length === 0) return false;
    await bulkUpsertDailyLogs(userId, raw as DailyLogEntry[]);
    return true;
  });

  await migrateDomain("CV achievements", async () => {
    const raw = safeParse(window.localStorage.getItem("cv-achievements"), isArray);
    if (!raw || raw.length === 0) return false;
    await bulkUpsertCvAchievements(userId, raw as CvAchievement[]);
    return true;
  });

  await migrateDomain("team checklists", async () => {
    const byTeam: Partial<Record<TeamId, Record<string, boolean>>> = {};
    let any = false;
    for (const teamId of ["infrastructure", "applications", "support-network"] as TeamId[]) {
      const raw = safeParse(window.localStorage.getItem(`checklist-${teamId}`), isBooleanRecord);
      if (raw && Object.keys(raw).length > 0) {
        byTeam[teamId] = raw;
        any = true;
      }
    }
    if (!any) return false;
    await bulkUpsertTeamChecklists(userId, byTeam);
    return true;
  });

  // Mark migrated even on partial failure — retrying automatically on every
  // future sign-in isn't in scope (see PRODUCT-ROADMAP.md Phase 5 known
  // limitations); the upserts above are safe to re-run manually if needed.
  await markMigrated(userId).catch(() => undefined);

  return { hadLocalData, succeededDomains, failedDomains };
}
