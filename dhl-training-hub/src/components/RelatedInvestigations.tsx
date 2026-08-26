import Link from "next/link";
import { getScenariosForTopic } from "@/lib/data/investigations";

/** Derives related Advanced Investigations from each scenario's own
 * relatedTopicIds (single source of truth — see lib/data/investigations), the
 * same pattern RelatedTickets uses for Quick Practice tickets. */
export function RelatedInvestigations({ topicId }: { topicId: string }) {
  const scenarios = getScenariosForTopic(topicId);
  if (scenarios.length === 0) return null;

  return (
    <ul className="space-y-2">
      {scenarios.map((scenario) => (
        <li key={scenario.id}>
          <Link
            href={`/tickets/investigate/${scenario.id}`}
            className="text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:text-blue-400"
          >
            Practice: {scenario.title} &rarr;
          </Link>
        </li>
      ))}
    </ul>
  );
}
