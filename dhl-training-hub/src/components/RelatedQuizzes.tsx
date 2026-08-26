import Link from "next/link";
import { getQuizzesForTopic } from "@/lib/data/quizzes";

/** Derives related quizzes from each quiz's own relatedTopicIds (single source
 * of truth — see lib/data/quizzes), the same reverse-derivation pattern as
 * RelatedTickets/RelatedInvestigations. */
export function RelatedQuizzes({ topicId }: { topicId: string }) {
  const relatedQuizzes = getQuizzesForTopic(topicId);
  if (relatedQuizzes.length === 0) return null;

  return (
    <ul className="space-y-2">
      {relatedQuizzes.map((quiz) => (
        <li key={quiz.id}>
          <Link
            href={`/quizzes/${quiz.id}`}
            className="text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:text-blue-400"
          >
            {quiz.title} &rarr;
          </Link>
        </li>
      ))}
    </ul>
  );
}
