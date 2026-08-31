import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { getCompanyContext } from "@/lib/data/companyContext";

/**
 * Renders nothing in a future public/shared build (PRODUCT_DISPLAY_MODE =
 * "public") — see getCompanyContext(). Deliberately small: a name, a
 * disclaimer, and a couple of generic public facts, kept separate from the
 * generic, company-agnostic Business & Logistics curriculum this links to.
 */
export function CompanyContextCard() {
  const context = getCompanyContext();
  if (!context) return null;

  return (
    <Card>
      <SectionHeading title="Internship Organization Context" subtitle="Private/local view only — see disclaimer below" />
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{context.name}</p>
      <ul className="mt-2 space-y-1">
        {context.publicFacts.map((fact) => (
          <li key={fact} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
            {fact}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        <Link href="/learn" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Explore Business &amp; Logistics learning →
        </Link>
      </p>
      <div className="mt-3">
        <Disclaimer>{context.disclaimer}</Disclaimer>
      </div>
    </Card>
  );
}
