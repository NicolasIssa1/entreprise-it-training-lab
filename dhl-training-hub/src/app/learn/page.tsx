"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { LearningTopicCard } from "@/components/LearningTopicCard";
import { TroubleshootingFramework } from "@/components/TroubleshootingFramework";
import { categoryColor } from "@/lib/colors";
import {
  learningTopics,
  learningPaths,
  LEARNING_CATEGORIES,
  searchTopics,
  getTopicById,
  getPathProgress,
  getNextIncompleteTopicId,
} from "@/lib/data/learning";
import { useLearningProgress } from "@/lib/learningProgress";
import { teams } from "@/lib/data/teams";
import { getQuizzesForPath } from "@/lib/data/quizzes";
import { getScenariosForPath } from "@/lib/data/investigations";
import { useQuizAttempts, bestAttempt } from "@/lib/quizAttempts";
import { inputClass, toggleButtonClass } from "@/lib/ui";
import { LearningCategory, LearningLevel, TeamId } from "@/lib/types";

const ALL_CATEGORIES = "All categories";
const ALL_TEAMS = "All teams";
const ALL_LEVELS = "All levels";
const LEVELS: LearningLevel[] = ["Foundation", "Intermediate"];

/**
 * Deterministic "what's next" — no AI, just: nothing completed yet -> start the
 * Enterprise IT Foundations path from the top; otherwise -> first incomplete topic
 * in that same foundational path; otherwise -> first incomplete topic in any other
 * path, in path order; otherwise -> everything's done (returns null).
 */
function getSuggestedNext(completed: Record<string, boolean>) {
  const [foundationsPath, ...otherPaths] = learningPaths;
  const inFoundations = getNextIncompleteTopicId(foundationsPath.topicIds, completed);
  if (inFoundations) return { topicId: inFoundations, pathTitle: foundationsPath.title };
  for (const path of otherPaths) {
    const next = getNextIncompleteTopicId(path.topicIds, completed);
    if (next) return { topicId: next, pathTitle: path.title };
  }
  return null;
}

export default function LearnPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LearningCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [team, setTeam] = useState<TeamId | typeof ALL_TEAMS>(ALL_TEAMS);
  const [level, setLevel] = useState<LearningLevel | typeof ALL_LEVELS>(ALL_LEVELS);
  const { completed, completedCount } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();

  const filtered = useMemo(() => {
    let list = searchTopics(query);
    if (category !== ALL_CATEGORIES) list = list.filter((t) => t.category === category);
    if (team !== ALL_TEAMS) list = list.filter((t) => t.primaryTeam === team || t.relatedTeams.includes(team));
    if (level !== ALL_LEVELS) list = list.filter((t) => t.level === level);
    return list;
  }, [query, category, team, level]);

  const total = learningTopics.length;
  const progressPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  // Deterministic "what's next" — no AI, just: nothing completed yet -> start the
  // Enterprise IT Foundations path from the top; otherwise -> first incomplete
  // topic in that same foundational path; otherwise -> first incomplete topic in
  // any other path, in path order; otherwise -> everything's done.
  const suggested = getSuggestedNext(completed);
  const suggestedTopic = suggested ? getTopicById(suggested.topicId) : undefined;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Learn"
        title="Build the enterprise IT knowledge universities rarely teach."
        description={`${learningTopics.length} lessons across ${LEARNING_CATEGORIES.length} categories — Infrastructure, Networking, Applications, Security, ITSM, Business & Logistics, and BPO & Process Automation — each following the same explain-simply-then-technically structure.`}
      />

      <Card>
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {completedCount} / {total} topics completed
          </p>
          <p className="text-slate-500 dark:text-slate-400">{progressPercent}%</p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </Card>

      {suggestedTopic && (
        <section className="space-y-3">
          <SectionHeading
            title={completedCount === 0 ? "Suggested start" : "Continue learning"}
            subtitle={`Next up in ${suggested!.pathTitle}`}
          />
          <Link href={`/learn/${suggestedTopic.id}`} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
            <Card interactive>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Badge variant="neutral">{suggestedTopic.category}</Badge>
                  <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{suggestedTopic.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{suggestedTopic.shortDescription}</p>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {completedCount === 0 ? "Start learning →" : "Continue →"}
                </span>
              </div>
            </Card>
          </Link>
        </section>
      )}

      <section className="space-y-3">
        <SectionHeading title="Learning Paths" subtitle="Curated topic orderings — progress is derived from your topic completion" />
        <div className="grid gap-4 sm:grid-cols-2">
          {learningPaths.map((path) => {
            const { completedCount: pathCompleted, total: pathTotal } = getPathProgress(path, completed);
            const pathPercent = pathTotal === 0 ? 0 : Math.round((pathCompleted / pathTotal) * 100);
            const checkpointQuiz = getQuizzesForPath(path.id)[0];
            const checkpointBest = checkpointQuiz ? bestAttempt(allAttempts[checkpointQuiz.id] ?? []) : undefined;
            const pathInvestigations = getScenariosForPath(path.id);
            return (
              <Card key={path.id}>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{path.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{path.purpose}</p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {pathCompleted} / {pathTotal} topics completed &middot; {pathPercent}%
                </p>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-1.5 rounded-full bg-blue-600 transition-all" style={{ width: `${pathPercent}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {path.topicIds.map((id) => {
                    const t = getTopicById(id);
                    if (!t) return null;
                    const done = !!completed[id];
                    return (
                      <Link
                        key={id}
                        href={`/learn/${id}`}
                        className={`rounded-lg border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                          done
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                      >
                        {done ? "✓ " : ""}
                        {t.title}
                      </Link>
                    );
                  })}
                </div>

                {(checkpointQuiz || pathInvestigations.length > 0) && (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {checkpointQuiz && (
                      <Link
                        href={`/quizzes/${checkpointQuiz.id}`}
                        className="block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {checkpointBest ? `Checkpoint assessment — best ${checkpointBest.percentage}% →` : "Take checkpoint assessment →"}
                      </Link>
                    )}
                    {pathInvestigations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {pathInvestigations.map((s) => (
                          <Link
                            key={s.id}
                            href={`/tickets/investigate/${s.id}`}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                          >
                            Practice: {s.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <Card>
        <SectionHeading
          title="The troubleshooting mindset"
          subtitle="Every lesson's specific troubleshooting steps are an application of this general approach"
        />
        <TroubleshootingFramework />
      </Card>

      <section className="space-y-4">
        <SectionHeading title="Browse All Topics" />

        <div className="space-y-3">
          <div>
            <label htmlFor="learn-search" className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Search topics
            </label>
            <input
              id="learn-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. DNS, network, database..."
              className={inputClass}
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory(ALL_CATEGORIES)}
                aria-pressed={category === ALL_CATEGORIES}
                className={toggleButtonClass(category === ALL_CATEGORIES)}
              >
                {ALL_CATEGORIES}
              </button>
              {LEARNING_CATEGORIES.map((c) => {
                const isActive = category === c;
                const color = categoryColor(c);
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    aria-pressed={isActive}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                      isActive ? `border-transparent text-white shadow-sm bg-gradient-to-b ${color.gradient}` : `border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800`
                    }`}
                  >
                    <span className={isActive ? "" : `mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${color.dot} align-middle`} />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Team</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTeam(ALL_TEAMS)}
                aria-pressed={team === ALL_TEAMS}
                className={toggleButtonClass(team === ALL_TEAMS)}
              >
                {ALL_TEAMS}
              </button>
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTeam(t.id)}
                  aria-pressed={team === t.id}
                  className={toggleButtonClass(team === t.id)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">Level</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLevel(ALL_LEVELS)}
                aria-pressed={level === ALL_LEVELS}
                className={toggleButtonClass(level === ALL_LEVELS)}
              >
                {ALL_LEVELS}
              </button>
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  aria-pressed={level === lvl}
                  className={toggleButtonClass(level === lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic) => (
            <LearningTopicCard key={topic.id} topic={topic} completed={!!completed[topic.id]} />
          ))}
          {filtered.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState
                title="No topics match your search or filters"
                description="Try a different term, or clear the filters above."
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
