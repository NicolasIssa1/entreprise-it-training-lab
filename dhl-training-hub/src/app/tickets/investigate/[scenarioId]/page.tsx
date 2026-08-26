import { notFound } from "next/navigation";
import { investigationScenarios, getScenarioById } from "@/lib/data/investigations";
import { InvestigationWorkbench } from "@/components/InvestigationWorkbench";

export function generateStaticParams() {
  return investigationScenarios.map((scenario) => ({ scenarioId: scenario.id }));
}

export default async function InvestigateScenarioPage(props: PageProps<"/tickets/investigate/[scenarioId]">) {
  const { scenarioId } = await props.params;
  const scenario = getScenarioById(scenarioId);

  if (!scenario) {
    notFound();
  }

  return <InvestigationWorkbench scenario={scenario} />;
}
