"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { inputClass, textareaClass, buttonClass } from "@/lib/ui";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { useAdminRoster } from "@/lib/adminRoster";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";

export default function AdminCohortsPage() {
  const { cohorts, createCohort } = useAdminCohorts();
  const { learners } = useAdminRoster();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function averageReadiness(memberIds: string[]): number {
    const members = learners.filter((l) => memberIds.includes(l.id));
    if (members.length === 0) return 0;
    const scores = members.map((l) => calculateOverallTrainingProgress(calculateAllSkillProgress(l.completedTopics, l.quizAttemptsMap, l.investigationCompletions, l.automationLabCompletions)));
    return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createCohort(name.trim(), description.trim());
    setName("");
    setDescription("");
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Enterprise Admin" title="Cohorts" description="Group learners for comparison and bulk assignment." accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cohorts.map((cohort) => (
          <Link key={cohort.id} href={`/admin/cohorts/${cohort.id}`} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
            <Card interactive className="h-full">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-900 dark:text-slate-100">{cohort.name}</p>
                {!cohort.isCustom && <Badge variant="neutral">Demo</Badge>}
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cohort.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{cohort.memberLearnerIds.length} member{cohort.memberLearnerIds.length === 1 ? "" : "s"}</span>
                <span>Avg. readiness {averageReadiness(cohort.memberLearnerIds)}%</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <SectionHeading title="Create a cohort" subtitle="Membership is managed from the cohort's own page once created" />
        <form onSubmit={handleCreate} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cohort name" className={inputClass} required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} className={textareaClass} />
          <button type="submit" className={buttonClass("primary")}>
            Create cohort
          </button>
        </form>
      </Card>
    </div>
  );
}
