"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { TeamBadge } from "@/components/TeamBadge";
import { AutomationLabResult } from "@/components/AutomationLabResult";
import { AskTutorLink } from "@/components/AskTutorLink";
import { BoltIcon, BoxIcon, BranchIcon, RepeatIcon, ArrowRightIcon } from "@/components/icons";
import { buildAutomationCoachPrompt } from "@/lib/ai/tutorPromptTemplates";
import { useAutomationLabAttempts } from "@/lib/automationLabProgress";
import { scoreAutomationLab } from "@/lib/automationLabScoring";
import { AutomationBlock, AutomationBlockCategory, AutomationLabAttempt, AutomationLabScenario } from "@/lib/types";

const CATEGORY_META: Record<AutomationBlockCategory, { label: string; icon: React.ReactNode; badge: "accent" | "success" | "warning" | "neutral" }> = {
  trigger: { label: "Triggers", icon: <BoltIcon size={15} />, badge: "warning" },
  condition: { label: "Conditions", icon: <BranchIcon size={15} />, badge: "accent" },
  action: { label: "Actions", icon: <BoxIcon size={15} />, badge: "success" },
  logic: { label: "Logic", icon: <RepeatIcon size={15} />, badge: "neutral" },
};

const CATEGORY_ORDER: AutomationBlockCategory[] = ["trigger", "condition", "action", "logic"];

function makeAttemptId(scenarioId: string) {
  return `${scenarioId}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function AutomationWorkflowBuilder({ scenario }: { scenario: AutomationLabScenario }) {
  const { attempts, best, recordAttempt, syncError } = useAutomationLabAttempts(scenario.id);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reviewAttempt, setReviewAttempt] = useState<AutomationLabAttempt | null>(null);

  const blockById = (id: string) => scenario.blocks.find((b) => b.id === id);
  const availableBlocks = scenario.blocks.filter((b) => !selectedIds.includes(b.id));
  const hasTrigger = selectedIds.some((id) => blockById(id)?.category === "trigger");
  const hasAction = selectedIds.some((id) => blockById(id)?.category === "action");
  const canSubmit = hasTrigger && hasAction;

  function addBlock(block: AutomationBlock) {
    setSelectedIds((prev) => [...prev, block.id]);
  }

  function removeBlock(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setSelectedIds((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function submit() {
    const score = scoreAutomationLab(scenario, selectedIds);
    const attempt: AutomationLabAttempt = {
      attemptId: makeAttemptId(scenario.id),
      scenarioId: scenario.id,
      completedAt: new Date().toISOString(),
      submittedBlockIds: selectedIds,
      score,
    };
    recordAttempt(attempt);
    setReviewAttempt(attempt);
  }

  function tryAgain() {
    setReviewAttempt(null);
    setSelectedIds([]);
  }

  if (reviewAttempt) {
    return (
      <AutomationLabResult
        scenario={scenario}
        attempt={reviewAttempt}
        best={best}
        attemptCount={attempts.length}
        syncError={syncError}
        onTryAgain={tryAgain}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{scenario.difficulty}</Badge>
          <span className="text-xs text-slate-400">{scenario.estimatedMinutes} min build</span>
          {scenario.isEnterpriseProject && <Badge variant="accent">Enterprise Project</Badge>}
          {scenario.likelyTeams.map((t) => (
            <TeamBadge key={t} teamId={t} />
          ))}
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{scenario.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{scenario.description}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {scenario.toolsInvolved.map((tool) => (
            <Badge key={tool} variant="neutral">
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      <PrivacyNotice context="Fictional training scenario. Do not copy real company workflows, credentials, customer information, internal URLs, or restricted company information into this simulator." />

      <Card>
        <SectionHeading title="The ask" />
        <p className="text-sm text-slate-700 dark:text-slate-300">{scenario.scenarioBrief}</p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Card>
            <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
              <SectionHeading title="Block palette" subtitle="Add blocks to build your workflow — order matters" />
              <AskTutorLink params={{ mode: "automation-coach", automationScenario: scenario.id, prompt: buildAutomationCoachPrompt(scenario) }} variant="button">
                Ask Tutor (Coach)
              </AskTutorLink>
            </div>
            <div className="space-y-4">
              {CATEGORY_ORDER.map((category) => {
                const blocks = availableBlocks.filter((b) => b.category === category);
                if (blocks.length === 0) return null;
                const meta = CATEGORY_META[category];
                return (
                  <div key={category}>
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {meta.icon}
                      {meta.label}
                    </div>
                    <div className="space-y-1.5">
                      {blocks.map((block) => (
                        <button
                          key={block.id}
                          onClick={() => addBlock(block)}
                          className="group flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-slate-800 dark:hover:border-blue-800/70 dark:hover:bg-blue-950/20"
                        >
                          <span>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{block.label}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{block.description}</p>
                          </span>
                          <span className="mt-0.5 shrink-0 text-xs font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-blue-400">
                            Add
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {availableBlocks.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400">All blocks have been added to your workflow.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionHeading title="Your workflow" subtitle={canSubmit ? "Ready to submit" : "Add at least one trigger and one action"} />
            {selectedIds.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Add blocks from the palette to start building.
              </p>
            ) : (
              <div className="space-y-1.5">
                {selectedIds.map((id, i) => {
                  const block = blockById(id);
                  if (!block) return null;
                  const meta = CATEGORY_META[block.category];
                  return (
                    <div key={`${id}-${i}`}>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[0.65rem] font-bold text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                          {i + 1}
                        </span>
                        <Badge variant={meta.badge}>{meta.label.slice(0, -1)}</Badge>
                        <span className="min-w-0 flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">{block.label}</span>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => moveBlock(i, -1)}
                            disabled={i === 0}
                            aria-label="Move up"
                            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveBlock(i, 1)}
                            disabled={i === selectedIds.length - 1}
                            aria-label="Move down"
                            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => removeBlock(id)}
                            aria-label="Remove"
                            className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      {i < selectedIds.length - 1 && (
                        <div className="flex justify-center py-0.5 text-slate-300 dark:text-slate-700" aria-hidden="true">
                          <ArrowRightIcon size={14} className="rotate-90" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <button
              onClick={submit}
              disabled={!canSubmit}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit workflow for grading
            </button>
          </Card>

          {best && (
            <Card>
              <div className="flex items-center justify-between text-sm">
                <p className="text-slate-500 dark:text-slate-400">Your best score</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{best.score.overall}/100</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">{attempts.length} attempt{attempts.length === 1 ? "" : "s"} so far</p>
            </Card>
          )}

          {syncError && <SyncErrorNotice message="We couldn't sync this build to your account right now. Your progress is still saved on this device." />}
        </div>
      </div>
    </div>
  );
}
