import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TutorMessage } from "@/lib/types";
import { getTopicsByIds } from "@/lib/data/learning";

/**
 * Renders the Tutor's reply as actual formatted text — **bold**, lists,
 * headings, code, etc. — instead of raw Markdown syntax. react-markdown parses
 * to React elements (never raw HTML/dangerouslySetInnerHTML), so model output
 * can't inject markup; styling comes from the `.markdown-content` rules in
 * globals.css, kept intentionally compact for a chat bubble rather than a
 * full article. See root CLAUDE.md — this only ever renders the model's own
 * text, never user-supplied HTML.
 */
export function TutorMessageBubble({ message }: { message: TutorMessage }) {
  const isUser = message.role === "user";
  const relatedTopics = message.relatedTopicIds.length > 0 ? getTopicsByIds(message.relatedTopicIds) : [];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <span className="px-1 text-[0.68rem] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {isUser ? "You" : "AI Tutor"}
        </span>
        <div
          className={
            isUser
              ? "rounded-2xl rounded-tr-md bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm shadow-blue-900/20"
              : "rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          }
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}

          {!isUser && relatedTopics.length > 0 && (
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
    </div>
  );
}
