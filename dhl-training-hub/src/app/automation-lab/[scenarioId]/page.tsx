import { notFound } from "next/navigation";
import { automationLabScenarios, getAutomationLabScenarioById } from "@/lib/data/automationLab";
import { AutomationWorkflowBuilder } from "@/components/AutomationWorkflowBuilder";

export function generateStaticParams() {
  return automationLabScenarios.map((scenario) => ({ scenarioId: scenario.id }));
}

export default async function AutomationLabScenarioPage(props: PageProps<"/automation-lab/[scenarioId]">) {
  const { scenarioId } = await props.params;
  const scenario = getAutomationLabScenarioById(scenarioId);

  if (!scenario) {
    notFound();
  }

  return <AutomationWorkflowBuilder scenario={scenario} />;
}
