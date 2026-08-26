import Link from "next/link";
import { TutorMessage } from "@/lib/types";
import { getTopicsByIds } from "@/lib/data/learning";

export function TutorMessageBubble({ message }: { message: TutorMessage }) {
  const isUser = message.role === "user";
  const relatedTopics = message.relatedTopicIds.length > 0 ? getTopicsByIds(message.relatedTopicIds) : [];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

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
  );
}
