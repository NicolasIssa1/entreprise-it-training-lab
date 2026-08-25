import Link from "next/link";
import { getTopicsByIds } from "@/lib/data/learning";

export function RelatedTopics({ topicIds }: { topicIds: string[] }) {
  const topics = getTopicsByIds(topicIds);
  if (topics.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t) => (
        <Link
          key={t.id}
          href={`/learn/${t.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {t.title}
        </Link>
      ))}
    </div>
  );
}
