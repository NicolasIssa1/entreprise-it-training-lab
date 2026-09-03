import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Quiz, QuizAttempt } from "@/lib/types";

export function QuizCard({ quiz, best, latest }: { quiz: Quiz; best?: QuizAttempt; latest?: QuizAttempt }) {
  return (
    <Link
      href={`/quizzes/${quiz.id}`}
      className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <Card className="h-full" interactive>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="neutral">{quiz.category}</Badge>
          <Badge variant="neutral">{quiz.difficulty}</Badge>
        </div>
        <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{quiz.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{quiz.description}</p>
        <p className="mt-2 text-xs text-slate-400">
          {quiz.questions.length} questions &middot; {quiz.estimatedMinutes} min
        </p>

        {best ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Best: <strong className="text-slate-700 dark:text-slate-300">{best.percentage}%</strong>
            </span>
            {latest && (
              <span>
                Latest: <strong className="text-slate-700 dark:text-slate-300">{latest.percentage}%</strong>
              </span>
            )}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-400">Not attempted yet</p>
        )}

        <span className="mt-3 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">
          {best ? "Retake assessment →" : "Start assessment →"}
        </span>
      </Card>
    </Link>
  );
}
