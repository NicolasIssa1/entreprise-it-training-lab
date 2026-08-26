"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { Disclaimer } from "@/components/Disclaimer";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { TutorMessageBubble } from "@/components/TutorMessageBubble";
import { inputClass } from "@/lib/ui";
import { useTutorConversation } from "@/lib/tutorConversation";
import { useTutorProgressSummary } from "@/lib/ai/useTutorProgressSummary";
import { getTopicById } from "@/lib/data/learning";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationProgress, useInvestigationCompletions } from "@/lib/investigationProgress";
import { TUTOR_MODES, TutorMessage, TutorMode } from "@/lib/types";
import { TutorApiRequest, TutorApiResponse } from "@/lib/ai/types";

const SUGGESTED_QUESTIONS = [
  "What's the difference between an incident and a service request?",
  "Explain DNS like I'm new to networking.",
  "Why can a VPN connect but internal resources still fail?",
  "What's the difference between authentication and authorization?",
  "How do I troubleshoot a slow application?",
  "How do APIs connect business systems?",
  "What should I learn after Infrastructure Foundations?",
];

const MODE_LABEL: Record<TutorMode, string> = {
  tutor: "General Tutor",
  "topic-tutor": "Topic Tutor",
  "quiz-coach": "Quiz Coach",
  "quiz-review": "Quiz Review",
  "investigation-coach": "Investigation Coach",
  "investigation-review": "Investigation Review",
  "progress-coach": "Progress Coach",
};

function friendlyErrorMessage(errorCode: string | undefined): string {
  if (errorCode === "not_configured") return "AI Tutor is not configured in this environment.";
  if (errorCode === "rate_limited") return "You've sent a lot of messages in a short time — please wait a moment and try again.";
  return "The tutor couldn't respond right now. Your other training progress is unaffected.";
}

export function TutorChat() {
  const searchParams = useSearchParams();
  const progressSummary = useTutorProgressSummary();
  const { messages, ensureConversation, addMessage, startNewConversation, syncError } = useTutorConversation();

  const topicId = searchParams.get("topic") ?? undefined;
  const quizId = searchParams.get("quiz") ?? undefined;
  const questionId = searchParams.get("question") ?? undefined;
  const scenarioId = searchParams.get("scenario") ?? undefined;
  const modeParam = searchParams.get("mode") ?? undefined;

  const topic = topicId ? getTopicById(topicId) : undefined;
  const quiz = quizId ? getQuizById(quizId) : undefined;
  const scenario = scenarioId ? getScenarioById(scenarioId) : undefined;

  const { latest: latestQuizAttempt } = useQuizAttempts(quizId);
  const investigationCompletions = useInvestigationCompletions();
  const { progress: investigationProgress } = useInvestigationProgress(scenario?.id ?? "__none__", scenario?.startNodeId ?? "__none__");
  const scenarioCompleted = scenario ? investigationCompletions.some((c) => c.scenarioId === scenario.id) : false;

  const resolvedMode: TutorMode = useMemo(() => {
    if (modeParam && (TUTOR_MODES as readonly string[]).includes(modeParam)) return modeParam as TutorMode;
    if (scenario) return scenarioCompleted ? "investigation-review" : "investigation-coach";
    if (topic) return "topic-tutor";
    return "tutor";
  }, [modeParam, scenario, scenarioCompleted, topic]);

  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tutor")
      .then((res) => res.json())
      .then((data) => setAiConfigured(!!data.configured))
      .catch(() => setAiConfigured(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, sending]);

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || sending || aiConfigured === false) return;

    setInput("");
    setRequestError(null);
    setSending(true);

    const conv = await ensureConversation();
    const userMessage: TutorMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      mode: resolvedMode,
      relatedTopicIds: [],
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage, conv);

    const history = [...messages, userMessage].slice(-12).map((m) => ({ role: m.role, content: m.content }));

    const body: TutorApiRequest = {
      message: text,
      mode: resolvedMode,
      currentTopicId: topic?.id,
      currentQuizId: quiz?.id,
      currentScenarioId: scenario?.id,
      history,
      progressSummary,
    };

    if (resolvedMode === "quiz-review" && quiz && questionId && latestQuizAttempt) {
      const answer = latestQuizAttempt.answers.find((a) => a.questionId === questionId);
      if (answer) {
        body.quizReviewContext = { quizId: quiz.id, questionId, selectedOptionIds: answer.selectedOptionIds };
      }
    }

    if (resolvedMode === "investigation-coach" && scenario) {
      const node = scenario.nodes[investigationProgress.currentNodeId] ?? scenario.nodes[scenario.startNodeId];
      body.investigationCoachStatus = {
        currentNodePrompt: node.prompt,
        evidence: node.evidence ?? [],
        hypothesis: investigationProgress.hypothesisHistory[investigationProgress.hypothesisHistory.length - 1],
        businessImpact: investigationProgress.businessImpact,
        actionsTakenCount: investigationProgress.actionsTaken.length,
      };
    }

    if (resolvedMode === "investigation-review" && scenario && investigationProgress.completed && investigationProgress.score) {
      const node = scenario.nodes[investigationProgress.currentNodeId];
      body.investigationReviewContext = {
        scenarioId: scenario.id,
        outcomeSummary: node?.outcome?.summary ?? "",
        whatWentWell: investigationProgress.score.whatWentWell,
        whatCouldImprove: investigationProgress.score.whatCouldImprove,
        betterReasoningPath: investigationProgress.score.betterReasoningPath,
      };
    }

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setRequestError(friendlyErrorMessage(data.error));
        return;
      }

      const data: TutorApiResponse = await res.json();
      const assistantMessage: TutorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        mode: data.mode,
        relatedTopicIds: data.relatedTopicIds,
        createdAt: new Date().toISOString(),
      };
      addMessage(assistantMessage, conv);
    } catch {
      setRequestError(friendlyErrorMessage(undefined));
    } finally {
      setSending(false);
    }
  }

  const contextLabel = topic?.title ?? quiz?.title ?? scenario?.title ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Tutor</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Ask questions about enterprise IT concepts and this application&rsquo;s training material.
        </p>
      </div>

      <PrivacyNotice context="Also avoid internal URLs and real employee/customer names — see the context panel for exactly what the Tutor can see automatically." />

      {aiConfigured === false && (
        <Disclaimer>
          <span className="font-medium">AI Tutor is not configured in this environment.</span> An{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-900">ANTHROPIC_API_KEY</code> hasn&rsquo;t
          been set up — every other part of this application (Learn, Assessments, Investigations, Progress) works
          normally without it.
        </Disclaimer>
      )}

      {syncError && <SyncErrorNotice message="We couldn't sync this conversation to your account right now. It's still saved on this device." />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex min-h-[28rem] flex-col">
          <Card className="flex flex-1 flex-col">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Badge variant="accent">{MODE_LABEL[resolvedMode]}</Badge>
              {messages.length > 0 && (
                <button
                  onClick={startNewConversation}
                  className="text-xs font-medium text-slate-500 hover:underline dark:text-slate-400"
                >
                  Start new conversation
                </button>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1" style={{ maxHeight: "28rem" }}>
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No messages yet. Ask a question below, or try one of these:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        disabled={aiConfigured === false}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <TutorMessageBubble key={m.id} message={m} />
              ))}

              {sending && <p className="text-xs text-slate-400">Thinking…</p>}
              {requestError && (
                <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  {requestError}
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="mt-4 flex items-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={aiConfigured === false ? "AI Tutor is not configured in this environment." : "Ask a question…"}
                disabled={aiConfigured === false || sending}
                maxLength={2000}
                rows={2}
                className={`${inputClass} resize-none disabled:cursor-not-allowed disabled:opacity-60`}
              />
              <button
                type="submit"
                disabled={aiConfigured === false || sending || !input.trim()}
                className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <SectionHeading title="Current context" subtitle="What the Tutor already knows about where you are" />
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs font-medium text-slate-400">Mode</dt>
                <dd className="text-slate-800 dark:text-slate-200">{MODE_LABEL[resolvedMode]}</dd>
              </div>
              {contextLabel && (
                <div>
                  <dt className="text-xs font-medium text-slate-400">Linked to</dt>
                  <dd className="text-slate-800 dark:text-slate-200">{contextLabel}</dd>
                </div>
              )}
            </dl>
            {(resolvedMode === "investigation-coach" || resolvedMode === "quiz-coach") && (
              <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                Coach mode: the Tutor will guide with questions here rather than give away the answer.
              </p>
            )}
          </Card>

          {topic && (
            <Card>
              <SectionHeading title="Related lesson" />
              <Link href={`/learn/${topic.id}`} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                {topic.title} →
              </Link>
            </Card>
          )}

          <Card>
            <SectionHeading title="What the Tutor can see" />
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>• This application&rsquo;s own Learn topics relevant to your question</li>
              <li>• Which lessons/assessments/investigations you&rsquo;ve completed, and your skill levels</li>
              <li>• The current lesson, quiz question, or investigation you linked in from</li>
              <li className="font-medium text-slate-600 dark:text-slate-300">Never your Daily Log or CV Tracker entries, name, or email</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
