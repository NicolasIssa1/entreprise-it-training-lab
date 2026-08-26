import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { LearningSection } from "@/components/LearningSection";
import { TeamBadge } from "@/components/TeamBadge";
import { UniversityConnection } from "@/components/UniversityConnection";
import { PracticeScenario } from "@/components/PracticeScenario";
import { CompletionButton } from "@/components/CompletionButton";
import { AskTutorLink } from "@/components/AskTutorLink";
import { RelatedTopics } from "@/components/RelatedTopics";
import { RelatedTickets } from "@/components/RelatedTickets";
import { RelatedInvestigations } from "@/components/RelatedInvestigations";
import { RelatedQuizzes } from "@/components/RelatedQuizzes";
import { TroubleshootingFramework } from "@/components/TroubleshootingFramework";
import { learningTopics, getTopicById, getTopicsByIds } from "@/lib/data/learning";
import { getTeamLabel } from "@/lib/data/teams";
import { getTicketsForTopic } from "@/lib/data/tickets";
import { getScenariosForTopic } from "@/lib/data/investigations";
import { getQuizzesForTopic } from "@/lib/data/quizzes";

export function generateStaticParams() {
  return learningTopics.map((topic) => ({ topicId: topic.id }));
}

export default async function LearningTopicPage(props: PageProps<"/learn/[topicId]">) {
  const { topicId } = await props.params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{topic.category}</Badge>
          <Badge variant="neutral">{topic.level}</Badge>
          <span className="text-xs text-slate-400">{topic.estimatedMinutes} min read</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{topic.title}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{topic.shortDescription}</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <TeamBadge teamId={topic.primaryTeam} variant="primary" />
            {topic.relatedTeams.map((t) => (
              <TeamBadge key={t} teamId={t} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <AskTutorLink params={{ mode: "topic-tutor", topic: topic.id }} variant="button">
              Ask Tutor about {topic.title}
            </AskTutorLink>
            <CompletionButton topicId={topic.id} />
          </div>
        </div>
      </Card>

      {topic.prerequisiteTopicIds && topic.prerequisiteTopicIds.length > 0 && (
        <LearningSection title="Recommended before this lesson" subtitle="Helpful context, not required — nothing here is locked">
          <RelatedTopics topicIds={topic.prerequisiteTopicIds} />
        </LearningSection>
      )}

      <LearningSection title="After this lesson, you should be able to">
        <ul className="space-y-2">
          {topic.learningOutcomes.map((o) => (
            <li key={o} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {o}
            </li>
          ))}
        </ul>
      </LearningSection>

      <LearningSection title="What is it?">
        <p className="text-sm text-slate-700 dark:text-slate-300">{topic.simpleExplanation}</p>
      </LearningSection>

      {topic.dontConfuseWith && topic.dontConfuseWith.length > 0 && (
        <div className="space-y-2">
          {getTopicsByIds(topic.dontConfuseWith.map((c) => c.topicId)).map((other) => {
            const contrast = topic.dontConfuseWith!.find((c) => c.topicId === other.id);
            if (!contrast) return null;
            return (
              <div
                key={other.id}
                className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
              >
                <span className="font-medium">
                  Don&rsquo;t confuse this with{" "}
                  <Link href={`/learn/${other.id}`} className="underline">
                    {other.title}
                  </Link>
                  :
                </span>{" "}
                {contrast.note}
              </div>
            );
          })}
        </div>
      )}

      <LearningSection title="Explain Like I'm 10" emphasized>
        <p className="text-sm text-slate-800 dark:text-slate-200">{topic.eli10}</p>
      </LearningSection>

      <LearningSection title="Technical explanation">
        <p className="text-sm text-slate-700 dark:text-slate-300">{topic.technicalExplanation}</p>
      </LearningSection>

      <LearningSection title="Why companies need it">
        <p className="text-sm text-slate-700 dark:text-slate-300">{topic.businessPurpose}</p>
      </LearningSection>

      <LearningSection title="Common problems" subtitle="Generic training examples, not real incidents">
        <ul className="space-y-2">
          {topic.commonProblems.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {p}
            </li>
          ))}
        </ul>
      </LearningSection>

      <LearningSection title="Troubleshooting approach" subtitle="A thought process, not just a checklist">
        <p className="mb-3 text-xs font-medium text-slate-400">
          General mindset this applies:
        </p>
        <TroubleshootingFramework compact />
        <ol className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          {topic.troubleshootingSteps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </LearningSection>

      <LearningSection title="Team connection">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {getTeamLabel(topic.primaryTeam)} teams commonly deal with this first, but exact ownership varies by
          organization and by the specific situation
          {topic.relatedTeams.length > 0 && (
            <>
              {" "}
              — {topic.relatedTeams.map(getTeamLabel).join(" and ")} may also become involved depending on what the
              investigation finds.
            </>
          )}
          {topic.relatedTeams.length === 0 && "."}
        </p>
      </LearningSection>

      <LearningSection title="University connection" subtitle="MEng Computer Science with Artificial Intelligence">
        <div className="grid gap-3 sm:grid-cols-2">
          {topic.universityConnections.map((c) => (
            <UniversityConnection key={c.area} area={c.area} connection={c.connection} />
          ))}
        </div>
      </LearningSection>

      <PracticeScenario {...topic.practiceScenario} />

      <LearningSection title="Question to ask at work">
        <p className="text-sm text-slate-700 dark:text-slate-300">{topic.questionToAskAtWork}</p>
      </LearningSection>

      {topic.relatedTopicIds.length > 0 && (
        <LearningSection title="Related topics">
          <RelatedTopics topicIds={topic.relatedTopicIds} />
        </LearningSection>
      )}

      {getTicketsForTopic(topic.id).length > 0 && (
        <LearningSection title="Related training tickets" subtitle="Practice these scenarios in the Ticket Simulator">
          <RelatedTickets topicId={topic.id} />
        </LearningSection>
      )}

      {getScenariosForTopic(topic.id).length > 0 && (
        <LearningSection title="Advanced Practice" subtitle="Multi-step branching investigations connected to this topic">
          <RelatedInvestigations topicId={topic.id} />
        </LearningSection>
      )}

      {getQuizzesForTopic(topic.id).length > 0 && (
        <LearningSection title="Knowledge Check" subtitle="Test your understanding of this topic">
          <RelatedQuizzes topicId={topic.id} />
        </LearningSection>
      )}

      <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link
          href={`/daily-log?research=${encodeURIComponent(topic.title)}`}
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Add &ldquo;{topic.title}&rdquo; to today&rsquo;s research →
        </Link>
      </div>
    </div>
  );
}
