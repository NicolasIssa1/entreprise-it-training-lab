"use client";

import { useState, ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TutorMessage } from "@/lib/types";
import { getTopicsByIds } from "@/lib/data/learning";
import { ProductMark } from "@/components/ProductMark";
import { CopyIcon, CheckIcon } from "@/components/icons";

/** A fenced code block with its own small copy button — plain text copy only,
 * never executes anything. Inline `code` (no `className`) falls through to
 * the default `.markdown-content code` styling instead of this component. */
function CodeBlock({ className, children, ...props }: ComponentPropsWithoutRef<"code">) {
  const [copied, setCopied] = useState(false);
  const isBlock = /language-/.test(className ?? "");

  if (!isBlock) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const text = String(children).replace(/\n$/, "");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently no-op, copy is a convenience, not required
    }
  }

  return (
    <span className="relative block">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/90 px-2 py-1 text-[0.65rem] font-medium text-slate-300 opacity-0 transition-opacity duration-150 hover:bg-slate-700 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blue-500/40 group-hover:opacity-100"
      >
        {copied ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <code className={className} {...props}>
        {children}
      </code>
    </span>
  );
}

/**
 * Renders the Tutor's reply as actual formatted text — **bold**, lists,
 * headings, code, etc. — instead of raw Markdown syntax. react-markdown parses
 * to React elements (never raw HTML/dangerouslySetInnerHTML), so model output
 * can't inject markup; styling comes from the `.markdown-content` rules in
 * globals.css. Assistant replies render as a clean rich-text area rather than
 * a heavy chat bubble (only user turns are bubbled) — closer to a document
 * than a bubble-per-message app, which reads better for multi-paragraph
 * technical explanations. See root CLAUDE.md — this only ever renders the
 * model's own text, never user-supplied HTML.
 */
export function TutorMessageBubble({ message }: { message: TutorMessage }) {
  const isUser = message.role === "user";
  const relatedTopics = message.relatedTopicIds.length > 0 ? getTopicsByIds(message.relatedTopicIds) : [];
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 1500);
    } catch {
      // best-effort convenience only
    }
  }

  if (isUser) {
    return (
      <div className="flex animate-page-in justify-end">
        <div className="flex max-w-[85%] flex-col items-end gap-1">
          <span className="px-1 text-[0.68rem] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">You</span>
          <div className="rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-2.5 text-sm text-white shadow-sm shadow-blue-900/25">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group/msg flex animate-page-in items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-900/20">
        <ProductMark size={15} />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[0.68rem] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">AI Tutor</span>
          <button
            type="button"
            onClick={copyAnswer}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.68rem] font-medium text-slate-400 opacity-0 transition-opacity duration-150 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blue-500/40 group-hover/msg:opacity-100 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            {copiedAnswer ? <CheckIcon size={11} /> : <CopyIcon size={11} />}
            {copiedAnswer ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="group markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
            {message.content}
          </ReactMarkdown>
        </div>

        {relatedTopics.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 pt-2 dark:border-slate-800">
            {relatedTopics.map((t) => (
              <Link
                key={t.id}
                href={`/learn/${t.id}`}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {t.title} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
