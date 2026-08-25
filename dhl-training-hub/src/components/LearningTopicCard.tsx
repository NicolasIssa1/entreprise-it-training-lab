import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { TeamBadge } from "@/components/TeamBadge";
import { LearningTopic } from "@/lib/types";

export function LearningTopicCard({ topic, completed }: { topic: LearningTopic; completed: boolean }) {
  return (
    <Link href={`/learn/${topic.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-xl">
      <Card className="h-full transition hover:border-blue-400">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="neutral">{topic.category}</Badge>
          <Badge variant={completed ? "success" : "neutral"}>{completed ? "Completed" : "Not completed"}</Badge>
        </div>
        <h2 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{topic.shortDescription}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <TeamBadge teamId={topic.primaryTeam} variant="primary" />
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {completed ? "Review →" : "Start learning →"}
          </span>
        </div>
      </Card>
    </Link>
  );
}
