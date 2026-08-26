import { anthropicProvider } from "@/lib/ai/anthropic";
import { AiProvider } from "@/lib/ai/types";

/**
 * Single factory function the route handler calls — Anthropic is the only
 * provider in Phase 6, but nothing outside this file needs to know that (see
 * Phase 6 Part C: a future second provider shouldn't require rewriting the
 * Tutor UI or /api/tutor).
 */
export function getAiProvider(): AiProvider {
  return anthropicProvider;
}

export function isAiConfigured(): boolean {
  return getAiProvider().isConfigured();
}
