import { ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { Badge } from "@/components/Badge";
import {
  BoltIcon,
  PlayIcon,
  BranchIcon,
  RepeatIcon,
  BoxIcon,
  TagIcon,
  PlugIcon,
  LinkIcon,
  HashIcon,
  CheckCircleIcon,
  LayersIcon,
  BranchIcon as ScopeIcon,
  ClockIcon,
  RefreshIcon,
} from "@/components/icons";

interface CheatSheetEntry {
  term: string;
  icon: ReactNode;
  definition: string;
  example: string;
  commonMistake: string;
}

// Generic Microsoft Power Automate reference terms — no assumption about which
// connectors/flows any specific organization actually uses. See root CLAUDE.md.
const ENTRIES: CheatSheetEntry[] = [
  {
    term: "Trigger",
    icon: <BoltIcon size={18} />,
    definition: "The one thing that starts a flow — an event, a schedule, or a manual button press.",
    example: "\"When a new item is created in a list\" or \"Every weekday at 08:00.\"",
    commonMistake: "A trigger condition set too broadly (e.g. \"created or modified\" when only \"created\" was intended), causing the flow to run far more often than expected.",
  },
  {
    term: "Action",
    icon: <PlayIcon size={18} />,
    definition: "A single step a flow performs after the trigger — send an email, create an item, read a file, and so on.",
    example: "\"Send an email (V2)\" using the trigger's data as the email body.",
    commonMistake: "Assuming a step happens automatically that actually needed to be explicitly added as its own action.",
  },
  {
    term: "Condition",
    icon: <BranchIcon size={18} />,
    definition: "If/else branching — checks something and runs a different set of actions depending on whether it's true or false.",
    example: "IF Status equals \"Delayed\" → notify operations, ELSE → do nothing.",
    commonMistake: "Comparing text values with mismatched casing or spacing, so a case that looks true to a person evaluates as false.",
  },
  {
    term: "Apply to Each",
    icon: <RepeatIcon size={18} />,
    definition: "A loop — repeats a set of actions once for every item in a list or array.",
    example: "For each row in an Excel table, check its Status and notify the owner if it's \"Delayed.\"",
    commonMistake: "Nesting loops inside loops unnecessarily — cost multiplies with each level, making the flow slow and hard to follow.",
  },
  {
    term: "Compose",
    icon: <BoxIcon size={18} />,
    definition: "A simple action that holds a value or the result of an expression, so it can be reused later without recalculating it.",
    example: "Compose a formatted date once, then reference that Compose output in several later actions.",
    commonMistake: "Repeating the same complex expression in multiple places instead of computing it once with Compose and reusing the result.",
  },
  {
    term: "Variable",
    icon: <TagIcon size={18} />,
    definition: "A named container that can be initialized and then updated as the flow runs — useful for counters, running totals, or flags.",
    example: "Initialize a variable \"ErrorCount\" at 0, then increment it inside a loop whenever a row fails validation.",
    commonMistake: "Trying to use a variable before it's been initialized earlier in the flow, which causes an error.",
  },
  {
    term: "Connector",
    icon: <PlugIcon size={18} />,
    definition: "Power Automate's way of talking to a specific service — Outlook, Excel, SharePoint, Teams, Forms, SQL, HTTP, and more.",
    example: "The Outlook connector exposes both a trigger (\"when a new email arrives\") and actions (\"send an email\").",
    commonMistake: "Assuming every connector is available to every organization/license — availability varies and isn't something to assume.",
  },
  {
    term: "Connection",
    icon: <LinkIcon size={18} />,
    definition: "The specific authenticated link between a flow and a connector's service — usually tied to one account's credentials and permissions.",
    example: "A SharePoint connection authenticated as a specific user, used to read/write items on a specific site.",
    commonMistake: "A connection tied to one person's personal account breaks the moment that account is disabled, has its password changed, or loses access.",
  },
  {
    term: "Expression",
    icon: <HashIcon size={18} />,
    definition: "A formula-like piece of logic used to transform, combine, or extract data — dates, text, math, and lookups.",
    example: "formatDateTime(utcNow(), 'yyyy-MM-dd') to get today's date in a specific format.",
    commonMistake: "Assuming a value's data type (text vs. number vs. date) without checking — a common source of expressions that error unexpectedly.",
  },
  {
    term: "Approval",
    icon: <CheckCircleIcon size={18} />,
    definition: "A built-in action that sends a request to one or more people and waits for their Approve/Reject response before continuing.",
    example: "Start an approval for a request, then branch the flow based on whether it was approved or rejected.",
    commonMistake: "Building only the \"approved\" branch and leaving the \"rejected\" branch unbuilt or undertested.",
  },
  {
    term: "Scope",
    icon: <LayersIcon size={18} />,
    definition: "A container that groups a set of actions together, so error handling (via Configure Run After) can be applied to the whole group at once.",
    example: "Group every action that writes to an external system inside one Scope, with a second \"cleanup/notify\" Scope configured to run only if the first one fails.",
    commonMistake: "Not using a Scope at all, making it hard to apply consistent failure handling across a related set of actions.",
  },
  {
    term: "Configure Run After",
    icon: <ScopeIcon size={18} />,
    definition: "A setting on an action that controls whether it runs based on a previous action's outcome — succeeded, failed, timed out, or skipped.",
    example: "A \"notify support\" action configured to run only if a previous action \"has failed,\" so failures trigger an alert instead of going silent.",
    commonMistake: "Never configuring this at all, so a failed action just stops the flow silently with nobody notified.",
  },
  {
    term: "Run History",
    icon: <ClockIcon size={18} />,
    definition: "The record of every past run of a flow — which actions ran, their inputs and outputs, and whether each succeeded or failed.",
    example: "Opening a failed run to see exactly which action failed and what data it was working with at that moment.",
    commonMistake: "Troubleshooting by guessing or re-reading the flow's design instead of checking what Run History actually shows happened.",
  },
  {
    term: "Retry Policy",
    icon: <RefreshIcon size={18} />,
    definition: "A per-action setting controlling how many times, and how, an action automatically retries after a transient failure before giving up.",
    example: "An HTTP action configured to retry up to 4 times with increasing delay if a call to an external API times out.",
    commonMistake: "Relying on retries to mask a dependency that's actually broken, rather than a genuinely temporary/transient issue.",
  },
];

function slug(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function PowerAutomateCheatSheetPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="BPO & Process Automation"
        title="Power Automate Cheat Sheet"
        description="A concise, interactive reference for core concepts — keep this open while working through a real flow."
        accent="from-violet-500/15 via-purple-500/10 to-transparent"
      />

      <Disclaimer>
        Generic Microsoft Power Automate reference only — this makes no assumption about which connectors or flows
        any specific organization actually uses. See{" "}
        <Link href="/learn" className="font-medium underline">
          the BPO &amp; Process Automation category
        </Link>{" "}
        on the Learn page for the full lessons behind these terms, and{" "}
        <Link href="/bpo/project-prep" className="font-medium underline">
          Real Project Prep
        </Link>{" "}
        for a private worksheet to organize your thinking before a real conversation.
      </Disclaimer>

      {/* Sticky quick-navigation strip */}
      <div className="sticky top-[4.2rem] z-10 -mx-1 overflow-x-auto rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex w-max gap-1.5">
          {ENTRIES.map((entry) => (
            <a
              key={entry.term}
              href={`#${slug(entry.term)}`}
              className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors duration-200 hover:bg-violet-50 hover:text-violet-700 dark:text-slate-400 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
            >
              {entry.term}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ENTRIES.map((entry) => (
          <Card
            key={entry.term}
            id={slug(entry.term)}
            className="scroll-mt-32 hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-950/[0.08] dark:hover:border-violet-800/70"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                {entry.icon}
              </span>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{entry.term}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{entry.definition}</p>
            <div className="mt-3 space-y-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div>
                <Badge variant="accent">Mini example</Badge>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{entry.example}</p>
              </div>
              <div>
                <Badge variant="warning">Common mistake</Badge>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{entry.commonMistake}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
