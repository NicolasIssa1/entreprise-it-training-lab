import { TutorMode } from "@/lib/types";

/** Same cap TutorChat.tsx's composer enforces (`maxLength={2000}`) — applied
 * again here so a link can never construct a URL promising more than the
 * composer will actually hold. */
export const TUTOR_PROMPT_MAX_LENGTH = 2000;

export interface TutorLinkParams {
  mode?: TutorMode;
  topic?: string;
  quiz?: string;
  question?: string;
  scenario?: string;
  /**
   * A suggested question to pre-fill into the Tutor's composer — plain text
   * only, never sent automatically (see TutorChat.tsx: it only ever lands in
   * `input` state, the same state the textarea already binds to; nothing
   * reads this param except to seed that state once on mount). Build one
   * with the `build*TutorPrompt()` helpers in tutorPromptTemplates.ts rather
   * than hand-writing a string at the call site, so every "Ask Tutor about
   * X" entry point stays consistent.
   */
  prompt?: string;
}

/** Single place that builds a /tutor URL with query params — used by every
 * "Ask Tutor" entry point (Learn, Quiz, Investigation, Dashboard, Progress,
 * Assignments, BPO) so the param names never drift out of sync with what
 * TutorChat.tsx reads. */
export function tutorHref(params: TutorLinkParams): string {
  const search = new URLSearchParams();
  if (params.mode) search.set("mode", params.mode);
  if (params.topic) search.set("topic", params.topic);
  if (params.quiz) search.set("quiz", params.quiz);
  if (params.question) search.set("question", params.question);
  if (params.scenario) search.set("scenario", params.scenario);
  if (params.prompt) search.set("prompt", params.prompt.slice(0, TUTOR_PROMPT_MAX_LENGTH));
  const qs = search.toString();
  return qs ? `/tutor?${qs}` : "/tutor";
}
