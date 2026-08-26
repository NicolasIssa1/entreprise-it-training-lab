"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PageGroupHeading } from "@/components/PageGroupHeading";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { TeamBadge } from "@/components/TeamBadge";
import { HypothesisSelector } from "@/components/HypothesisSelector";
import { InvestigationTimeline } from "@/components/InvestigationTimeline";
import { DocumentationForm } from "@/components/DocumentationForm";
import { InvestigationResult } from "@/components/InvestigationResult";
import { AskTutorLink } from "@/components/AskTutorLink";
import { useInvestigationProgress } from "@/lib/investigationProgress";
import { scoreInvestigation } from "@/lib/investigationScoring";
import {
  ActionQuality,
  BUSINESS_IMPACT_SCOPES,
  BusinessImpactScope,
  DocumentationFieldId,
  InvestigationAction,
  InvestigationHypothesis,
  InvestigationScenario,
} from "@/lib/types";
import { toggleButtonClass } from "@/lib/ui";

const QUALITY_BADGE: Record<ActionQuality, { variant: "success" | "accent" | "warning" | "danger"; label: string }> = {
  strong: { variant: "success", label: "Strong move" },
  reasonable: { variant: "accent", label: "Reasonable move" },
  weak: { variant: "warning", label: "Weak move" },
  unnecessary: { variant: "danger", label: "Unnecessary move" },
};

function makeEntryId(kind: string) {
  return `${kind}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function InvestigationWorkbench({ scenario }: { scenario: InvestigationScenario }) {
  const { progress, update, restart, recordCompletion, syncError } = useInvestigationProgress(scenario.id, scenario.startNodeId);
  const [lastAction, setLastAction] = useState<InvestigationAction | null>(null);

  const node = scenario.nodes[progress.currentNodeId] ?? scenario.nodes[scenario.startNodeId];
  const isTerminal = !!node.outcome;

  function chooseImpact(impact: BusinessImpactScope) {
    update((prev) => ({
      ...prev,
      businessImpact: impact,
      history: [
        ...prev.history,
        { id: makeEntryId("impact"), timestamp: Date.now(), kind: "impact", label: `Assessed business impact: ${impact}` },
      ],
    }));
  }

  function askQuestion(questionId: string, question: string, answer: string) {
    if (progress.askedQuestionIds.includes(questionId)) return;
    update((prev) => ({
      ...prev,
      askedQuestionIds: [...prev.askedQuestionIds, questionId],
      history: [...prev.history, { id: makeEntryId("question"), timestamp: Date.now(), kind: "question", label: question, detail: answer }],
    }));
  }

  function setHypothesis(hypothesis: InvestigationHypothesis) {
    const label = hypothesis.replace(/-/g, " ");
    update((prev) => ({
      ...prev,
      hypothesisHistory: [...prev.hypothesisHistory, hypothesis],
      history: [
        ...prev.history,
        { id: makeEntryId("hypothesis"), timestamp: Date.now(), kind: "hypothesis", label: `Hypothesis updated: ${label}` },
      ],
    }));
  }

  function takeAction(action: InvestigationAction) {
    setLastAction(action);
    update((prev) => ({
      ...prev,
      currentNodeId: action.nextNodeId,
      actionsTaken: [...prev.actionsTaken, { actionId: action.id, nodeId: node.id, quality: action.quality, stage: action.stage }],
      history: [
        ...prev.history,
        {
          id: makeEntryId("action"),
          timestamp: Date.now(),
          kind: action.stage === "verify" ? "verify" : "action",
          label: action.label,
          detail: action.feedback,
        },
      ],
    }));
  }

  function submitDocumentation(documentation: Record<DocumentationFieldId, string>) {
    const withDoc = { ...progress, documentation };
    const score = scoreInvestigation(withDoc, scenario);
    update(() => ({ ...withDoc, completed: true, score, history: [...withDoc.history, { id: makeEntryId("document"), timestamp: Date.now(), kind: "document", label: "Resolution notes submitted" }] }));
    recordCompletion({
      scenarioId: scenario.id,
      completedAt: new Date().toISOString().slice(0, 10),
      score: score.overall,
      resultCategory: score.overallCategory,
    });
  }

  function handleRestart() {
    if (window.confirm("Restart this investigation? Your progress, timeline, and hypothesis history for this scenario will be cleared.")) {
      setLastAction(null);
      restart();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{scenario.difficulty}</Badge>
          <span className="text-xs text-slate-400">{scenario.estimatedMinutes} min investigation</span>
          {scenario.likelyTeams.map((t) => (
            <TeamBadge key={t} teamId={t} />
          ))}
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{scenario.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{scenario.description}</p>
      </div>

      <PrivacyNotice context="Fictional training scenario. Do not copy real company tickets, credentials, customer information, internal URLs, screenshots, or restricted company information into this simulator." />

      <Card>
        <SectionHeading title="Learning objectives" />
        <ul className="space-y-2">
          {scenario.learningObjectives.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              {o}
            </li>
          ))}
        </ul>
      </Card>

      {progress.completed && progress.score && node.outcome ? (
        <InvestigationResult
          scenario={scenario}
          score={progress.score}
          progress={progress}
          outcome={node.outcome}
          onRestart={handleRestart}
        />
      ) : !progress.businessImpact ? (
        <Card>
          <SectionHeading title="Ticket received" />
          <p className="text-sm text-slate-700 dark:text-slate-300">{scenario.initialReport}</p>
          <div className="my-4 border-t border-slate-200 dark:border-slate-800" />
          <fieldset>
            <legend className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
              Before investigating: how would you assess the business impact right now?
            </legend>
            <p className="mb-2 text-xs text-slate-400">A generic impact assessment, not a DHL priority matrix — your assessment can change as evidence comes in.</p>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_IMPACT_SCOPES.map((impact) => (
                <button key={impact} onClick={() => chooseImpact(impact)} className={toggleButtonClass(false)}>
                  {impact}
                </button>
              ))}
            </div>
          </fieldset>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <Card>
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="neutral">Business impact: {progress.businessImpact}</Badge>
              </div>
              <p className="mb-3 text-xs text-slate-400">{scenario.businessImpactNote}</p>

              {lastAction && (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <Badge variant={QUALITY_BADGE[lastAction.quality].variant}>{QUALITY_BADGE[lastAction.quality].label}</Badge>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{lastAction.feedback}</p>
                </div>
              )}

              <p className="text-sm text-slate-700 dark:text-slate-300">{node.prompt}</p>

              {node.evidence && node.evidence.length > 0 && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                    Fictional training evidence
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {node.evidence.map((e) => (
                      <li key={e} className="text-sm text-amber-900 dark:text-amber-200">
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {node.diagnosticQuestions && node.diagnosticQuestions.length > 0 && (
                <div className="mt-4">
                  <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Diagnostic questions</p>
                  <div className="space-y-2">
                    {node.diagnosticQuestions.map((q) => {
                      const asked = progress.askedQuestionIds.includes(q.id);
                      return (
                        <div key={q.id}>
                          {!asked ? (
                            <button
                              onClick={() => askQuestion(q.id, q.question, q.answer)}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              {q.question}
                            </button>
                          ) : (
                            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                              <p className="font-medium text-slate-900 dark:text-slate-100">{q.question}</p>
                              <p className="mt-0.5 text-slate-600 dark:text-slate-400">{q.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>

            {!isTerminal && (
              <Card>
                <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
                  <SectionHeading title="What do you do next?" subtitle="More than one option here may be reasonable" />
                  <AskTutorLink params={{ mode: "investigation-coach", scenario: scenario.id }} variant="button">
                    Ask Tutor (Coach)
                  </AskTutorLink>
                </div>
                <div className="space-y-2">
                  {node.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => takeAction(action)}
                      className="w-full rounded-lg border border-slate-200 p-3 text-left transition hover:border-blue-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{action.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {isTerminal && (
              <Card>
                <SectionHeading
                  title="Document the resolution"
                  subtitle="Write a short resolution note before you see your results"
                />
                <DocumentationForm initial={progress.documentation} onSubmit={submitDocumentation} />
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <HypothesisSelector current={progress.hypothesisHistory[progress.hypothesisHistory.length - 1]} onSelect={setHypothesis} />
            </Card>

            <Card>
              <PageGroupHeading label="Investigation Timeline" />
              <div className="mt-4 max-h-[32rem] overflow-y-auto pr-1">
                <InvestigationTimeline history={progress.history} />
              </div>
            </Card>

            {syncError && <SyncErrorNotice message="We couldn't sync this investigation to your account right now. Your progress is still saved on this device." />}

            <button
              onClick={handleRestart}
              className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Restart scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
