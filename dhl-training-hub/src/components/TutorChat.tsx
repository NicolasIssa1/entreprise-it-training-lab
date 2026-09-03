"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { Disclaimer } from "@/components/Disclaimer";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { TutorMessageBubble } from "@/components/TutorMessageBubble";
import { ProductMark } from "@/components/ProductMark";
import { buttonClass } from "@/lib/ui";
import { useTutorConversation } from "@/lib/tutorConversation";
import { useTutorProgressSummary } from "@/lib/ai/useTutorProgressSummary";
import { getTopicById } from "@/lib/data/learning";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationProgress, useInvestigationCompletions } from "@/lib/investigationProgress";
import { TUTOR_MODES, TutorMessage, TutorMode } from "@/lib/types";
import { TutorApiRequest, TutorApiResponse } from "@/lib/ai/types";
import { TUTOR_PROMPT_MAX_LENGTH } from "@/lib/ai/tutorLinks";

const SUGGESTED_QUESTIONS = [
  "Explain DNS simply",
  "Help me debug a Power Automate flow",
  "What should I learn next?",
  "Explain freight forwarding",
  "What's the difference between authentication and authorization?",
  "How do I troubleshoot a slow application?",
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
  const router = useRouter();
  const progressSummary = useTutorProgressSummary();
  const { messages, ensureConversation, addMessage, startNewConversation, syncError } = useTutorConversation();

  const topicId = searchParams.get("topic") ?? undefined;
  const quizId = searchParams.get("quiz") ?? undefined;
  const questionId = searchParams.get("question") ?? undefined;
  const scenarioId = searchParams.get("scenario") ?? undefined;
  const modeParam = searchParams.get("mode") ?? undefined;
  // Read once, at mount, via the lazy useState initializer below — a
  // suggested question from an "Ask Tutor about X" link (see
  // tutorLinks.ts's `prompt` param). Deliberately never re-read on every
  // render: navigating here is always a full page mount (a different route),
  // so re-reading on every render risks clobbering text Nicolas is actively
  // typing if searchParams ever changes under this same mounted instance.
  const initialPromptParam = searchParams.get("prompt");

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
  // Lazy initializer — runs exactly once, on mount, which is what makes this
  // safe: it can never overwrite text Nicolas has already typed, and it
  // never fires a request on its own (it only ever sets local textarea
  // state — see PART 2 / "must never auto-send" in the task this shipped
  // under). Treated as plain text throughout: it flows into the same
  // controlled <textarea> value every other keystroke does, and later, if
  // sent, into TutorMessage.content, which TutorMessageBubble renders as a
  // literal string for user turns (never parsed as Markdown/HTML — only
  // assistant replies go through ReactMarkdown). Capped defensively even
  // though tutorHref() already caps it at build time, since a hand-typed
  // URL wouldn't have gone through that helper.
  const [input, setInput] = useState(() => (initialPromptParam ?? "").slice(0, TUTOR_PROMPT_MAX_LENGTH));
  const [sending, setSending] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/tutor")
      .then((res) => res.json())
      .then((data) => setAiConfigured(!!data.configured))
      .catch(() => setAiConfigured(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, sending]);

  // Once, on mount, if a prompt arrived via the URL: focus the composer with
  // the cursor at the end (so Nicolas can just start typing to extend it),
  // and strip the `prompt` param from the URL via history.replaceState
  // (no navigation/reload) — a refreshed page then shows the exact
  // conversation state rather than re-seeding the same suggested question
  // into an already-cleared or already-edited composer. Every other param
  // (mode/topic/quiz/question/scenario) is left in place — those still
  // describe real, still-relevant context on reload, unlike a one-time
  // suggestion. No request is made here; this only ever touches the URL and
  // local textarea focus/selection.
  useEffect(() => {
    if (!initialPromptParam) return;
    const el = textareaRef.current;
    if (el) {
      el.focus();
      const end = el.value.length;
      el.setSelectionRange(end, end);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("prompt");
    const qs = params.toString();
    router.replace(qs ? `/tutor?${qs}` : "/tutor", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <PageHeader
        eyebrow="AI Tutor"
        title="Your grounded enterprise IT tutor."
        description="Ask questions about enterprise IT concepts and this application's own training material — never a generic chatbot."
        accent="from-violet-500/20 via-indigo-500/10 to-cyan-500/10"
      />

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
        <div className="relative flex min-h-[32rem] flex-col">
          <div
            className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(139,92,246,0.10),transparent_60%),radial-gradient(ellipse_50%_45%_at_100%_100%,rgba(34,211,238,0.10),transparent_60%)] blur-2xl dark:bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(139,92,246,0.18),transparent_60%),radial-gradient(ellipse_50%_45%_at_100%_100%,rgba(34,211,238,0.16),transparent_60%)]"
            aria-hidden="true"
          />
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

            <div className="flex-1 space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "32rem" }}>
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-900/25">
                    <ProductMark size={26} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Ask me anything about enterprise IT</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Grounded in this app&rsquo;s own curriculum — try a question below.</p>
                  </div>
                  <div className="flex max-w-md flex-wrap justify-center gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        disabled={aiConfigured === false}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-left text-xs text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
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

              {sending && (
                <div className="flex justify-start" role="status" aria-label="AI Tutor is responding">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              {requestError && (
                <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
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
              className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800"
            >
              <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white p-1.5 transition-all duration-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-950">
                <textarea
                  ref={textareaRef}
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
                  maxLength={TUTOR_PROMPT_MAX_LENGTH}
                  rows={2}
                  className="w-full resize-none border-0 bg-transparent p-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={aiConfigured === false || sending || !input.trim()}
                  className={`shrink-0 ${buttonClass("primary")}`}
                >
                  Send
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[0.68rem] text-slate-400">Enter to send · Shift+Enter for a new line</p>
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
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
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
