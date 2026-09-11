"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useAdminCohorts } from "@/lib/adminCohorts";

export default function AdminReportsPage() {
  const { cohorts } = useAdminCohorts();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Enterprise Admin"
        title="Reports"
        description="A polished, printable summary suitable for a programme, internship, or university cohort review."
        accent="from-slate-500/10 via-blue-500/10 to-transparent"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/reports/all" className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
          <Card interactive>
            <p className="font-medium text-slate-900 dark:text-slate-100">Whole roster report →</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Every learner currently in the Enterprise Admin roster</p>
          </Card>
        </Link>
        {cohorts.map((cohort) => (
          <Link key={cohort.id} href={`/admin/reports/${cohort.id}`} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
            <Card interactive>
              <p className="font-medium text-slate-900 dark:text-slate-100">{cohort.name} →</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cohort.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
