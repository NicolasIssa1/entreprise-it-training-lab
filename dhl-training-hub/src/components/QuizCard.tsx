import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { ArrowRightIcon } from "@/components/icons";
import { categoryColor } from "@/lib/colors";
import { Quiz, QuizAttempt } from "@/lib/types";

export function QuizCard({ quiz, best, latest }: { quiz: Quiz; best?: QuizAttempt; latest?: QuizAttempt }) {
  const color = categoryColor(quiz.category);
  return (
    <Link
      href={`/quizzes/${quiz.id}`}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
    >
      <Card className="h-full overflow-hidden" interactive>
        <div className={`-mx-5 -mt-5 mb-4 h-1.5 bg-gradient-to-r ${color.gradient}`} aria-hidden="true" />
        <div className="flex items-start justify-between gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color.badge}`}>{quiz.category}</span>
          <Badge variant="neutral">{quiz.difficulty}</Badge>
        </div>
        <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{quiz.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{quiz.description}</p>
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

        <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className={`flex items-center gap-1 text-sm font-medium ${color.text}`}>
            {best ? "Retake assessment" : "Start assessment"}
            <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
