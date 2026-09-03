import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { TeamBadge } from "@/components/TeamBadge";
import { ArrowRightIcon, CheckIcon, ClockIcon } from "@/components/icons";
import { categoryColor } from "@/lib/colors";
import { LearningTopic } from "@/lib/types";

export function LearningTopicCard({ topic, completed }: { topic: LearningTopic; completed: boolean }) {
  const color = categoryColor(topic.category);
  return (
    <Link href={`/learn/${topic.id}`} className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
      <Card className="h-full overflow-hidden" interactive>
        <div className={`-mx-5 -mt-5 mb-4 h-1.5 bg-gradient-to-r ${color.gradient}`} aria-hidden="true" />
        <div className="flex items-start justify-between gap-2">
          <Badge variant="neutral">{topic.category}</Badge>
          {completed && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckIcon size={12} /> Completed
            </span>
          )}
        </div>
        <h2 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{topic.shortDescription}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
          <ClockIcon size={13} />
          {topic.level} &middot; {topic.estimatedMinutes} min
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
          <TeamBadge teamId={topic.primaryTeam} variant="primary" />
          <span className={`flex items-center gap-1 text-sm font-medium ${color.text}`}>
            {completed ? "Review" : "Start learning"}
            <ArrowRightIcon size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
