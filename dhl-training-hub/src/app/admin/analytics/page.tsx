"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { isLearnerActive } from "@/lib/adminKpis";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { classifySkillGap } from "@/lib/readiness";
import { skillDefinitions } from "@/lib/data/skills";
import { bestAttempt } from "@/lib/quizAttempts";
import { automationLabScenarios } from "@/lib/data/automationLab";

const READINESS_BANDS: { label: string; min: number; max: number }[] = [
  { label: "0-24 (Getting Started)", min: 0, max: 24 },
  { label: "25-49 (Building Foundation)", min: 25, max: 49 },
  { label: "50-74 (Practicing)", min: 50, max: 74 },
  { label: "75-100 (Strong Foundation)", min: 75, max: 100 },
];

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>{label}</span>
        <span>
          {count} ({pct}%)
        </span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { learners } = useAdminRoster();
  const { cohorts } = useAdminCohorts();

  const perLearner = useMemo(
    () =>
      learners.map((learner) => {
        const skillProgresses = calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions);
        const readiness = calculateOverallTrainingProgress(skillProgresses);
        const quizScores = Object.values(learner.quizAttemptsMap)
          .map((attempts) => bestAttempt(attempts)?.percentage)
          .filter((p): p is number => p !== undefined);
        const projectIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));
        const projectScores = learner.automationLabCompletions.filter((c) => projectIds.has(c.scenarioId)).map((c) => c.score);
        return { learner, skillProgresses, readiness, quizScores, projectScores };
      }),
    [learners],
  );

  const readinessDistribution = READINESS_BANDS.map((band) => ({
    ...band,
    count: perLearner.filter((r) => r.readiness >= band.min && r.readiness <= band.max).length,
  }));

  const competencyGaps = skillDefinitions.map((skill) => {
    const entries = perLearner.map((r) => r.skillProgresses.find((s) => s.skill.id === skill.id)!);
    const avg = entries.length === 0 ? 0 : Math.round(entries.reduce((s, e) => s + e.overall, 0) / entries.length);
    const gapCount = entries.filter((e) => classifySkillGap(e) === "gap").length;
    return { skill, avg, gapCount };
  });

  const allQuizScores = perLearner.flatMap((r) => r.quizScores);
  const avgQuizScore = allQuizScores.length === 0 ? null : Math.round(allQuizScores.reduce((s, v) => s + v, 0) / allQuizScores.length);
  const allProjectScores = perLearner.flatMap((r) => r.projectScores);
  const avgProjectScore = allProjectScores.length === 0 ? null : Math.round(allProjectScores.reduce((s, v) => s + v, 0) / allProjectScores.length);

  const activeCount = perLearner.filter((r) => isLearnerActive(r.learner)).length;

  const cohortComparison = cohorts.map((cohort) => {
    const members = perLearner.filter((r) => cohort.memberLearnerIds.includes(r.learner.id));
    const avg = members.length === 0 ? 0 : Math.round(members.reduce((s, m) => s + m.readiness, 0) / members.length);
    return { cohort, memberCount: members.length, avgReadiness: avg };
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Enterprise Admin" title="Analytics" description="Aggregate views across the current roster — every figure is a real average or count, never a predictive score." accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <Disclaimer>Educational progress indicators only — not a validated professional assessment or predictive analytics of any kind.</Disclaimer>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <SectionHeading title="Readiness distribution" />
          <div className="space-y-3">
            {readinessDistribution.map((band) => (
              <Bar key={band.label} label={band.label} count={band.count} total={learners.length} />
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Engagement" />
          <div className="space-y-3">
            <Bar label="Active in the last 14 days" count={activeCount} total={learners.length} />
            <Bar label="Not recently active" count={learners.length - activeCount} total={learners.length} />
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Average quiz score: {avgQuizScore === null ? "No attempts yet" : `${avgQuizScore}%`} · Average Enterprise Project score:{" "}
            {avgProjectScore === null ? "No completions yet" : `${avgProjectScore}%`}
          </p>
        </Card>
      </div>

      <Card>
        <SectionHeading title="Competency gaps by skill area" subtitle="Average score and count of learners at Getting Started level or below" />
        <div className="space-y-3">
          {competencyGaps.map(({ skill, avg, gapCount }) => (
            <div key={skill.id}>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{skill.name}</span>
                <span>
                  avg {avg}% · {gapCount} learner{gapCount === 1 ? "" : "s"} below foundation
                </span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-violet-600 transition-all duration-500 dark:bg-violet-400" style={{ width: `${avg}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title="Cohort comparison" />
        {cohortComparison.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No cohorts yet.</p>
        ) : (
          <div className="space-y-3">
            {cohortComparison.map(({ cohort, memberCount, avgReadiness }) => (
              <Bar key={cohort.id} label={`${cohort.name} (${memberCount} members)`} count={avgReadiness} total={100} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
