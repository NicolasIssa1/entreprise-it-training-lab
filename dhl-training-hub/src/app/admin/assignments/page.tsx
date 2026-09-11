"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { EmptyState } from "@/components/EmptyState";
import { AssignmentStatusBadge } from "@/components/admin/AdminBadges";
import { inputClass, textareaClass, buttonClass, toggleButtonClass } from "@/lib/ui";
import { useAdminAssignments, statusForAssignment, learnersForAssignment } from "@/lib/adminAssignments";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { learningPaths } from "@/lib/data/learning";
import { quizzes } from "@/lib/data/quizzes";
import { investigationScenarios } from "@/lib/data/investigations";
import { automationLabScenarios } from "@/lib/data/automationLab";
import { AdminAssignmentRequirementType, AdminAssignmentTargetType } from "@/lib/types";

const REQUIREMENT_OPTIONS: { type: AdminAssignmentRequirementType; label: string; items: { id: string; title: string }[] }[] = [
  { type: "path", label: "Learning Path", items: learningPaths.map((p) => ({ id: p.id, title: p.title })) },
  { type: "quiz", label: "Quiz", items: quizzes.map((q) => ({ id: q.id, title: q.title })) },
  { type: "investigation", label: "Advanced Investigation", items: investigationScenarios.map((s) => ({ id: s.id, title: s.title })) },
  { type: "automation-scenario", label: "Automation Lab / Enterprise Project", items: automationLabScenarios.map((s) => ({ id: s.id, title: s.title })) },
];

export default function AdminAssignmentsPage() {
  const { assignments, createAssignment, deleteAssignment } = useAdminAssignments();
  const { learners } = useAdminRoster();
  const { cohorts } = useAdminCohorts();

  const [targetType, setTargetType] = useState<AdminAssignmentTargetType>("learner");
  const [targetId, setTargetId] = useState("");
  const [requirementType, setRequirementType] = useState<AdminAssignmentRequirementType>("path");
  const [requirementId, setRequirementId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const requirementOptions = REQUIREMENT_OPTIONS.find((r) => r.type === requirementType)!.items;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const req = requirementOptions.find((r) => r.id === requirementId);
    if (!targetId || !req) return;
    createAssignment({
      targetType,
      targetId,
      requirementType,
      requirementId: req.id,
      requirementTitle: req.title,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      instructions: instructions.trim(),
    });
    setTargetId("");
    setRequirementId("");
    setDueDate("");
    setInstructions("");
  }

  const rows = useMemo(
    () =>
      assignments.map((a) => {
        const cohort = cohorts.find((c) => c.id === a.targetId);
        const targets = learnersForAssignment(a, learners, cohort?.memberLearnerIds ?? []);
        const statuses = targets.map((l) => statusForAssignment(a, l));
        return { assignment: a, targetLabel: a.targetType === "cohort" ? cohort?.name ?? "Unknown cohort" : targets[0]?.name ?? "Unknown learner", statuses };
      }),
    [assignments, cohorts, learners],
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Enterprise Admin" title="Assignments" description="Issue and track work assigned to a learner or cohort." accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <Card>
        <SectionHeading title="Issue a new assignment" />
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="flex gap-2">
            <button type="button" onClick={() => { setTargetType("learner"); setTargetId(""); }} className={toggleButtonClass(targetType === "learner")}>
              Individual learner
            </button>
            <button type="button" onClick={() => { setTargetType("cohort"); setTargetId(""); }} className={toggleButtonClass(targetType === "cohort")}>
              Cohort
            </button>
          </div>

          <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className={inputClass} required>
            <option value="">{targetType === "learner" ? "Select a learner..." : "Select a cohort..."}</option>
            {(targetType === "learner" ? learners : cohorts).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            value={requirementType}
            onChange={(e) => {
              setRequirementType(e.target.value as AdminAssignmentRequirementType);
              setRequirementId("");
            }}
            className={inputClass}
          >
            {REQUIREMENT_OPTIONS.map((r) => (
              <option key={r.type} value={r.type}>
                {r.label}
              </option>
            ))}
          </select>

          <select value={requirementId} onChange={(e) => setRequirementId(e.target.value)} className={inputClass} required>
            <option value="">Select...</option>
            {requirementOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>

          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} aria-label="Due date (optional)" />
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions (optional)" rows={2} className={textareaClass} />

          <button type="submit" className={buttonClass("primary")}>
            Issue assignment
          </button>
        </form>
      </Card>

      <Card>
        <SectionHeading title="Issued assignments" />
        {rows.length === 0 ? (
          <EmptyState title="No assignments issued yet" />
        ) : (
          <ul className="space-y-2 text-sm">
            {rows.map(({ assignment, targetLabel, statuses }) => (
              <li key={assignment.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{assignment.requirementTitle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {assignment.targetType === "cohort" ? "Cohort" : "Learner"}: {targetLabel}
                      {assignment.dueDate && ` · Due ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {assignment.targetType === "learner" ? (
                      statuses[0] && <AssignmentStatusBadge status={statuses[0]} />
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {statuses.filter((s) => s === "completed").length}/{statuses.length} completed
                        {statuses.some((s) => s === "overdue") && ` · ${statuses.filter((s) => s === "overdue").length} overdue`}
                      </span>
                    )}
                    <button type="button" onClick={() => deleteAssignment(assignment.id)} className="text-xs font-medium text-red-600 hover:underline dark:text-red-400">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
