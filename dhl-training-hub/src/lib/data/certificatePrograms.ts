import { CertificateProgramDefinition } from "@/lib/types";
import { learningPaths, getPathProgress } from "@/lib/data/learning";
import { getQuizzesForPath } from "@/lib/data/quizzes";
import { skillDefinitions, getTopicsForSkill } from "@/lib/data/skills";
import { QuizAttemptsMap, bestAttempt } from "@/lib/quizAttempts";

/**
 * Certificate programs (Phase 11) map 1:1 onto the app's existing Learning
 * Paths — no new curriculum, no company-specific programs, same "reuse
 * existing content" instruction every other Phase 11 surface follows.
 * skillNames is derived once from static content (which skill areas draw
 * learning evidence from this path's own topics), not from any user's data.
 */
export const certificatePrograms: CertificateProgramDefinition[] = learningPaths.map((path) => {
  const skillNames = skillDefinitions
    .filter((skill) => getTopicsForSkill(skill.id).some((t) => path.topicIds.includes(t.id)))
    .map((skill) => skill.name);

  return {
    id: path.id,
    title: path.title,
    pathId: path.id,
    description: `Awarded on completion of every topic in the ${path.title} Learning Path, plus a passing score on a related assessment.`,
    skillNames,
  };
});

export interface CertificateEligibilityContext {
  completedTopics: Record<string, boolean>;
  quizAttemptsMap: QuizAttemptsMap;
}

/**
 * Deterministic, derived eligibility — 100% path completion, plus (if the
 * path has any related quiz at all) a best score of 70%+ on at least one of
 * them. A path with no related quiz needs completion alone. Never a second
 * stored "is this earned" flag — only the moment eligibility is first
 * observed gets persisted (see lib/certificates.ts).
 */
export function isCertificateProgramEligible(program: CertificateProgramDefinition, ctx: CertificateEligibilityContext): boolean {
  const path = learningPaths.find((p) => p.id === program.pathId);
  if (!path) return false;

  const { completedCount, total } = getPathProgress(path, ctx.completedTopics);
  if (total === 0 || completedCount < total) return false;

  const relatedQuizzes = getQuizzesForPath(program.pathId);
  if (relatedQuizzes.length === 0) return true;
  return relatedQuizzes.some((q) => (bestAttempt(ctx.quizAttemptsMap[q.id] ?? [])?.percentage ?? 0) >= 70);
}

function validateCertificatePrograms(): void {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const program of certificatePrograms) {
    if (ids.has(program.id)) errors.push(`Duplicate certificate program id: "${program.id}"`);
    ids.add(program.id);
    if (!learningPaths.some((p) => p.id === program.pathId)) {
      errors.push(`Certificate program "${program.id}" references missing path "${program.pathId}"`);
    }
  }
  if (errors.length > 0) {
    throw new Error(`Certificate program content validation failed:\n${errors.join("\n")}`);
  }
}

validateCertificatePrograms();
