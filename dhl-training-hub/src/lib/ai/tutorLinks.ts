import { TutorMode } from "@/lib/types";

export interface TutorLinkParams {
  mode?: TutorMode;
  topic?: string;
  quiz?: string;
  question?: string;
  scenario?: string;
}

/** Single place that builds a /tutor URL with query params — used by every
 * "Ask Tutor" entry point (Learn, Quiz, Investigation, Dashboard, Progress) so
 * the param names never drift out of sync with what TutorChat.tsx reads. */
export function tutorHref(params: TutorLinkParams): string {
  const search = new URLSearchParams();
  if (params.mode) search.set("mode", params.mode);
  if (params.topic) search.set("topic", params.topic);
  if (params.quiz) search.set("quiz", params.quiz);
  if (params.question) search.set("question", params.question);
  if (params.scenario) search.set("scenario", params.scenario);
  const qs = search.toString();
  return qs ? `/tutor?${qs}` : "/tutor";
}
