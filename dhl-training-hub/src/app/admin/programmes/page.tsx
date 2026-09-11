"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { inputClass, textareaClass, buttonClass } from "@/lib/ui";
import { useAdminProgrammes } from "@/lib/adminProgrammes";
import { learningPaths } from "@/lib/data/learning";
import { automationLabScenarios } from "@/lib/data/automationLab";

export default function AdminProgrammesPage() {
  const { programmes, customProgrammes, createProgramme, deleteProgramme } = useAdminProgrammes();
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [estimatedScope, setEstimatedScope] = useState("");
  const [pathIds, setPathIds] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);

  const enterpriseProjects = automationLabScenarios.filter((s) => s.isEnterpriseProject);

  function togglePath(id: string) {
    setPathIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }
  function toggleProject(id: string) {
    setProjectIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || (pathIds.length === 0 && projectIds.length === 0)) return;
    createProgramme({
      title: title.trim(),
      audience: audience.trim() || "Not specified",
      purpose: purpose.trim() || "A custom programme defined for this organization.",
      estimatedScope: estimatedScope.trim() || "Not specified",
      requiredPathIds: pathIds,
      requiredQuizIds: [],
      requiredScenarioIds: projectIds,
    });
    setTitle("");
    setPurpose("");
    setAudience("");
    setEstimatedScope("");
    setPathIds([]);
    setProjectIds([]);
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Enterprise Admin" title="Programmes" description="Structured bundles of learning paths and projects a learner or cohort can be assigned." accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <div className="grid gap-4 sm:grid-cols-2">
        {programmes.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-2">
              <SectionHeading title={p.title} subtitle={p.audience} />
              <div className="flex items-center gap-1">
                {!customProgrammes.some((c) => c.id === p.id) ? <Badge variant="neutral">Built-in</Badge> : <Badge variant="accent">Custom</Badge>}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{p.purpose}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {p.requiredPathIds.length} path{p.requiredPathIds.length === 1 ? "" : "s"} · {p.requiredQuizIds.length} quiz{p.requiredQuizIds.length === 1 ? "" : "zes"} ·{" "}
              {p.requiredScenarioIds.length} project/investigation requirement{p.requiredScenarioIds.length === 1 ? "" : "s"} · {p.estimatedScope}
            </p>
            {customProgrammes.some((c) => c.id === p.id) && (
              <button type="button" onClick={() => deleteProgramme(p.id)} className="mt-2 text-xs font-medium text-red-600 hover:underline dark:text-red-400">
                Delete
              </button>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <SectionHeading title="Define a custom programme" subtitle="Compose existing learning paths and Enterprise Projects — no free-form authoring" />
        <form onSubmit={handleCreate} className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Programme title" className={inputClass} required />
          <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Intended audience (e.g. Second-year IT interns)" className={inputClass} />
          <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Description / purpose" rows={2} className={textareaClass} />
          <input value={estimatedScope} onChange={(e) => setEstimatedScope(e.target.value)} placeholder="Target completion period (e.g. 6 weeks)" className={inputClass} />

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Included Learning Paths</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {learningPaths.map((path) => (
                <label key={path.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={pathIds.includes(path.id)} onChange={() => togglePath(path.id)} />
                  {path.title}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Included Enterprise Projects</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {enterpriseProjects.map((project) => (
                <label key={project.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <input type="checkbox" checked={projectIds.includes(project.id)} onChange={() => toggleProject(project.id)} />
                  {project.title}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className={buttonClass("primary")}>
            Create programme
          </button>
        </form>
      </Card>

      {programmes.length === 0 && <EmptyState title="No programmes yet" />}
    </div>
  );
}
