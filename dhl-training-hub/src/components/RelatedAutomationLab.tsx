import Link from "next/link";
import { getAutomationLabScenariosForTopic } from "@/lib/data/automationLab";

/** Derives related Automation Lab scenarios (practice builds and Enterprise
 * Projects alike) from each scenario's own relatedTopicIds (single source of
 * truth), the same reverse-derivation pattern RelatedInvestigations uses. */
export function RelatedAutomationLab({ topicId }: { topicId: string }) {
  const scenarios = getAutomationLabScenariosForTopic(topicId);
  if (scenarios.length === 0) return null;

  return (
    <ul className="space-y-2">
      {scenarios.map((scenario) => (
        <li key={scenario.id}>
          <Link
            href={`/automation-lab/${scenario.id}`}
            className="text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:text-blue-400"
          >
            {scenario.isEnterpriseProject ? "Enterprise Project" : "Build"}: {scenario.title} &rarr;
          </Link>
        </li>
      ))}
    </ul>
  );
}
