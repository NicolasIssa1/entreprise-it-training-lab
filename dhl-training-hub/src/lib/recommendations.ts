import { InvestigationCompletionRecord, Recommendation, SkillProgress } from "@/lib/types";
import { getTopicById, learningPaths, getNextIncompleteTopicId, getPathProgress } from "@/lib/data/learning";
import { quizzes } from "@/lib/data/quizzes";
import { getInvestigationsForSkill, getQuizzesForSkill } from "@/lib/data/skills";
import { getScenarioById } from "@/lib/data/investigations";
import { latestAttempt, QuizAttemptsMap } from "@/lib/quizAttempts";

export interface RecommendationInput {
  completedTopics: Record<string, boolean>;
  quizAttemptsMap: QuizAttemptsMap;
  investigationCompletions: InvestigationCompletionRecord[];
  skillProgresses: SkillProgress[];
}

/**
 * Deterministic, no-AI recommendation engine. Each generator below inspects one
 * signal (weak quiz areas, unattempted quizzes, uncompleted/low-scoring
 * investigations, path progress with unmet prerequisites) and produces
 * candidates with an internal priority; the top few, deduplicated by link, are
 * returned. See root CLAUDE.md — recommendations are educational nudges, not a
 * scored ranking shown to the learner.
 */
export function getRecommendations(input: RecommendationInput, limit = 5): Recommendation[] {
  const candidates: Recommendation[] = [
    ...weakQuizTopicRecommendations(input),
    ...lowScoringInvestigationRecommendations(input),
    ...neverCompletedInvestigationRecommendations(input),
    ...neverAttemptedQuizRecommendations(input),
    ...pathContinuationRecommendations(input),
  ];

  const seenHref = new Set<string>();
  const deduped = candidates.filter((c) => {
    if (seenHref.has(c.href)) return false;
    seenHref.add(c.href);
    return true;
  });
  deduped.sort((a, b) => b.priority - a.priority);

  if (deduped.length === 0) {
    return [
      {
        id: "fallback-start",
        priority: 0,
        title: "Start the Enterprise IT Foundations path",
        description: "A good first step to build the core vocabulary used across every team.",
        href: "/learn",
      },
    ];
  }

  return deduped.slice(0, limit);
}

/** A recent quiz attempt under 70% points at specific weak topics, derived from
 * which questions were actually missed — not just "you did poorly." */
function weakQuizTopicRecommendations({ quizAttemptsMap, completedTopics }: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];
  for (const quiz of quizzes) {
    const latest = latestAttempt(quizAttemptsMap[quiz.id] ?? []);
    if (!latest || latest.percentage >= 70) continue;

    const missCounts = new Map<string, number>();
    for (const answer of latest.answers) {
      if (answer.correct) continue;
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      for (const topicId of question?.relatedTopicIds ?? []) {
        missCounts.set(topicId, (missCounts.get(topicId) ?? 0) + 1);
      }
    }
    const ranked = [...missCounts.entries()].sort((a, b) => b[1] - a[1]);
    const target = ranked.find(([topicId]) => !completedTopics[topicId]) ?? ranked[0];
    const topic = target ? getTopicById(target[0]) : undefined;
    if (!topic) continue;

    out.push({
      id: `weak-quiz-${quiz.id}`,
      priority: 90,
      title: `Review ${topic.title}`,
      description: `Your last attempt on "${quiz.title}" (${latest.percentage}%) missed questions related to this topic.`,
      href: `/learn/${topic.id}`,
    });
  }
  return out;
}

/** A completed investigation scoring under 60 (Developing/Needs Review) is a
 * concrete, direct signal to try again — practical performance is the
 * highest-weighted evidence source. */
function lowScoringInvestigationRecommendations({ investigationCompletions }: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];
  for (const record of investigationCompletions) {
    if (record.score >= 60) continue;
    const scenario = getScenarioById(record.scenarioId);
    if (!scenario) continue;
    out.push({
      id: `retry-${record.scenarioId}`,
      priority: 85,
      title: `Retry: ${scenario.title}`,
      description: `Your last attempt scored ${record.score}% (${record.resultCategory}). Another pass can strengthen your evidence-gathering and escalation reasoning.`,
      href: `/tickets/investigate/${scenario.id}`,
    });
  }
  return out;
}

/** A skill with real learning or quiz progress but zero completed
 * investigations is missing its highest-weighted evidence entirely. */
function neverCompletedInvestigationRecommendations({ skillProgresses, investigationCompletions }: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];
  const completedIds = new Set(investigationCompletions.map((c) => c.scenarioId));
  for (const sp of skillProgresses) {
    if (sp.evidence.practical.completed > 0) continue;
    if (sp.evidence.learning.percentage < 25 && sp.evidence.knowledge.percentage < 25) continue;
    const scenario = getInvestigationsForSkill(sp.skill.id).find((s) => !completedIds.has(s.id));
    if (!scenario) continue;
    out.push({
      id: `never-investigated-${sp.skill.id}`,
      priority: 80,
      title: `Practice: ${scenario.title}`,
      description: `Apply what you've learned in ${sp.skill.name} to a realistic investigation — practical performance counts most toward your training indicator.`,
      href: `/tickets/investigate/${scenario.id}`,
      skillId: sp.skill.id,
    });
  }
  return out;
}

/** A skill with meaningful lesson progress but no quiz attempts yet — a quick,
 * low-effort way to add knowledge evidence. */
function neverAttemptedQuizRecommendations({ skillProgresses }: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];
  for (const sp of skillProgresses) {
    if (sp.evidence.learning.percentage < 25) continue;
    if (sp.evidence.knowledge.attempted > 0) continue;
    const relevantQuizzes = getQuizzesForSkill(sp.skill.id);
    const quiz = relevantQuizzes.find((q) => q.id.endsWith("-foundation")) ?? relevantQuizzes[0];
    if (!quiz) continue;
    out.push({
      id: `never-attempted-${sp.skill.id}`,
      priority: 75,
      title: `Take the ${quiz.title}`,
      description: `You've made progress in ${sp.skill.name} lessons but haven't tested your knowledge yet.`,
      href: `/quizzes/${quiz.id}`,
      skillId: sp.skill.id,
    });
  }
  return out;
}

/** For a path with real but incomplete progress, recommend the next topic — or,
 * if that topic has an unmet prerequisite, the prerequisite instead. */
function pathContinuationRecommendations({ completedTopics }: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];
  for (const path of learningPaths) {
    const { completedCount, total } = getPathProgress(path, completedTopics);
    if (completedCount === 0 || completedCount >= total) continue;

    const nextId = getNextIncompleteTopicId(path.topicIds, completedTopics);
    let topic = nextId ? getTopicById(nextId) : undefined;
    if (!topic) continue;

    const unmetPrereq = (topic.prerequisiteTopicIds ?? []).find((id) => !completedTopics[id]);
    if (unmetPrereq) {
      const prereqTopic = getTopicById(unmetPrereq);
      if (prereqTopic) topic = prereqTopic;
    }

    out.push({
      id: `continue-path-${path.id}`,
      priority: unmetPrereq ? 65 : 55,
      title: unmetPrereq ? `Review ${topic.title} before continuing ${path.title}` : `Continue ${path.title}`,
      description: `${completedCount}/${total} topics complete in this path — next up: ${topic.title}.`,
      href: `/learn/${topic.id}`,
    });
  }
  return out;
}
