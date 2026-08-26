import Anthropic from "@anthropic-ai/sdk";
import { AiGenerateInput, AiProvider } from "@/lib/ai/types";

/**
 * Server-only. This module reads process.env.ANTHROPIC_API_KEY directly and
 * is imported only from /api/tutor/route.ts (a Next.js Route Handler, which
 * always runs server-side — see node_modules/next/dist/docs, Route Handlers).
 * Never import this file from a "use client" component. See root CLAUDE.md
 * and Phase 6 Part B/Security: the key must never reach the browser bundle.
 */

// Sonnet 5: a deliberate choice for a conversational tutor — modest cost and
// fast turnaround for explanations/coaching, not the top-tier model used for
// heavy agentic coding work. See docs/AI-TUTOR.md "Model configuration".
const DEFAULT_MODEL = "claude-sonnet-5";
const MAX_OUTPUT_TOKENS = 1024;

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

function toAnthropicSystem(system: AiGenerateInput["system"]): Anthropic.TextBlockParam[] {
  return system.map((block) => ({
    type: "text",
    text: block.text,
    ...(block.cache ? { cache_control: { type: "ephemeral" as const } } : {}),
  }));
}

export const anthropicProvider: AiProvider = {
  isConfigured(): boolean {
    return Boolean(process.env.ANTHROPIC_API_KEY);
  },

  async generateReply(input: AiGenerateInput): Promise<string> {
    const anthropic = getClient();
    if (!anthropic) throw new Error("ANTHROPIC_API_KEY is not configured");

    const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

    const response = await anthropic.messages.create({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: toAnthropicSystem(input.system),
      output_config: { effort: "medium" },
      messages: input.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === "refusal") {
      return "I'm not able to help with that request within this training application's scope.";
    }

    const textBlock = response.content.find((block): block is Anthropic.TextBlock => block.type === "text");
    return textBlock?.text?.trim() ?? "";
  },
};
