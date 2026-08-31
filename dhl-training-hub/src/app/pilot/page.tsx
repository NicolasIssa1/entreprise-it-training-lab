import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { Badge } from "@/components/Badge";
import { displayProductName } from "@/lib/product";

const INTENDED_USERS = ["Interns", "Graduates", "Junior IT employees", "Career switchers", "Technical trainees"];

const POTENTIAL_USES = [
  "Standardize baseline onboarding across new hires",
  "Reduce the repetitive-explanation burden on senior staff",
  "Provide safe, fictional practice before touching real systems",
  "Review structured, evidence-based progress rather than anecdotes",
];

const CUSTOMIZATION_PREVIEW = [
  "Approved terminology matching the organization's own vocabulary",
  "Real team structure instead of the generic Infrastructure / Applications / Support & Network split",
  "Company-specific learning paths and assignment templates",
  "Approved fictional scenarios reviewed by the organization",
  "Organization-specific escalation guidance",
  "Company branding",
  "SSO / company identity provider integration",
  "Manager dashboards across a real team",
];

/**
 * Pilot / product landing page (Phase 9 Part A/J). Explains the product as a
 * pitch-ready concept for an IT manager, HR person, trainer, or internship
 * lead — never claims DHL endorsement, official DHL training, access to real
 * DHL systems, validation by DHL, or certification. See root CLAUDE.md.
 */
export default function PilotPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge variant="accent">Enterprise Pilot Concept</Badge>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{displayProductName}</h1>
        <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">
          A structured training tool for enterprise IT interns and junior staff — realistic fictional scenarios,
          knowledge checks, guided investigations, and progress reporting, built to demonstrate how a company could
          use it to train new IT hires.
        </p>
      </div>

      <Disclaimer>
        Not an official product of, or endorsed by, any specific company. Not certified, not validated by any
        employer, and not connected to any real company system. This page describes a pilot concept — see{" "}
        <Link href="/pilot/readiness" className="font-medium underline">
          Pilot Readiness
        </Link>{" "}
        for an honest list of what is and isn&rsquo;t built yet.
      </Disclaimer>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/pilot/demo" className="block">
          <Card className="h-full transition hover:border-blue-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">Take the guided tour →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A walkthrough of every major feature</p>
          </Card>
        </Link>
        <Link href="/pilot/report" className="block">
          <Card className="h-full transition hover:border-blue-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">View a sample pilot report →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">What a trainer/manager would see</p>
          </Card>
        </Link>
        <Link href="/pilot/readiness" className="block">
          <Card className="h-full transition hover:border-blue-400">
            <p className="font-medium text-slate-900 dark:text-slate-100">Check pilot readiness →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Honest checklist of what&rsquo;s ready</p>
          </Card>
        </Link>
      </div>

      <Card>
        <SectionHeading title="The problem" />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Students and junior IT staff often learn technical concepts at university but arrive without a clear picture
          of how enterprise IT actually operates day to day — how tickets get triaged, how teams collaborate, how an
          outage gets investigated and escalated, and how a technical fault connects to real business impact. That gap
          usually gets closed slowly, through repeated informal explanation from senior staff.
        </p>
      </Card>

      <Card>
        <SectionHeading title="The solution" />
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• A structured, 80-topic enterprise IT curriculum</li>
          <li>• Realistic fictional IT incidents to triage and troubleshoot</li>
          <li>• Scenario-based knowledge assessments</li>
          <li>• Branching, evidence-driven practical investigations</li>
          <li>• Deterministic progress analytics — no black-box scoring</li>
          <li>• An optional AI Tutor grounded in this app&rsquo;s own curriculum</li>
          <li>• Generic business/logistics context connecting IT to the business</li>
          <li>• A manager-style progress summary and pilot report</li>
        </ul>
      </Card>

      <Card>
        <SectionHeading title="Who this is for" />
        <div className="flex flex-wrap gap-2">
          {INTENDED_USERS.map((u) => (
            <Badge key={u} variant="neutral">
              {u}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title="Potential company use" subtitle="What a future private version could support — not a claim of proven results" />
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {POTENTIAL_USES.map((u) => (
            <li key={u} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
              {u}
            </li>
          ))}
        </ul>
        <Disclaimer>
          <span className="font-medium">No ROI claim.</span> This describes potential use cases, not measured results
          — no pilot has been run yet.
        </Disclaimer>
      </Card>

      <Card>
        <SectionHeading title="Pilot use case templates" subtitle="Generic templates, not company-specific programs — see /assignments" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">IT Intern Onboarding</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Enterprise IT Foundations, ITSM, Infrastructure/Networking basics, and selected investigations.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Application Support Graduate</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Applications, APIs, integration, logs, deployment, and troubleshooting.
            </p>
          </div>
          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Infrastructure / Support Intern</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Networking, infrastructure, VPN, DNS, and ticket reasoning.</p>
          </div>
          <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Logistics Technology Intern</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Enterprise IT, business/logistics foundations, system integration, and business impact.
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm">
          <Link href="/assignments" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Browse and activate a Training Assignment →
          </Link>
        </p>
      </Card>

      <Card>
        <SectionHeading title="Company customization preview" subtitle="Enterprise features roadmap — not currently implemented" />
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-slate-700 dark:text-slate-300">
          {CUSTOMIZATION_PREVIEW.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              {c}
            </li>
          ))}
        </ul>
        <Disclaimer>This section is explanatory only — none of these customization systems are built yet.</Disclaimer>
      </Card>
    </div>
  );
}
