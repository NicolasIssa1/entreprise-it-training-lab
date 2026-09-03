import { notFound } from "next/navigation";
import { Badge } from "@/components/Badge";
import { QuizRunner } from "@/components/QuizRunner";
import { quizzes, getQuizById } from "@/lib/data/quizzes";

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ quizId: quiz.id }));
}

export default async function QuizPage(props: PageProps<"/quizzes/[quizId]">) {
  const { quizId } = await props.params;
  const quiz = getQuizById(quizId);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{quiz.category}</Badge>
          <Badge variant="neutral">{quiz.difficulty}</Badge>
          <span className="text-xs text-slate-400">
            {quiz.questions.length} questions &middot; {quiz.estimatedMinutes} min
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{quiz.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{quiz.description}</p>
      </div>

      <QuizRunner quiz={quiz} />
    </div>
  );
}
