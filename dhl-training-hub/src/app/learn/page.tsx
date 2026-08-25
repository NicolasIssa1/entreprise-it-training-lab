"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { LearningTopicCard } from "@/components/LearningTopicCard";
import { learningTopics, LEARNING_CATEGORIES, searchTopics } from "@/lib/data/learning";
import { useLearningProgress } from "@/lib/learningProgress";
import { teams } from "@/lib/data/teams";
import { inputClass, toggleButtonClass } from "@/lib/ui";
import { LearningCategory, TeamId } from "@/lib/types";

const ALL_CATEGORIES = "All categories";
const ALL_TEAMS = "All teams";

export default function LearnPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<LearningCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES);
  const [team, setTeam] = useState<TeamId | typeof ALL_TEAMS>(ALL_TEAMS);
  const { completed, completedCount } = useLearningProgress();

  const filtered = useMemo(() => {
    let list = searchTopics(query);
    if (category !== ALL_CATEGORIES) list = list.filter((t) => t.category === category);
    if (team !== ALL_TEAMS) list = list.filter((t) => t.primaryTeam === team || t.relatedTeams.includes(team));
    return list;
  }, [query, category, team]);

  const total = learningTopics.length;
  const progressPercent = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Enterprise IT Learning</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Learn the concepts behind Infrastructure, Applications, Support &amp; Network, and enterprise IT service
          management.
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between text-sm">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {completedCount} / {total} topics completed
          </p>
          <p className="text-slate-500 dark:text-slate-400">{progressPercent}%</p>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </Card>

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
            {LEARNING_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={toggleButtonClass(category === c)}
              >
                {c}
              </button>
            ))}
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((topic) => (
          <LearningTopicCard key={topic.id} topic={topic} completed={!!completed[topic.id]} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
            No topics match your search or filters. Try a different term or clear the filters above.
          </p>
        )}
      </div>
    </div>
  );
}
