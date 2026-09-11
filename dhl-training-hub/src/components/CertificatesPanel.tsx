import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { ArrowRightIcon } from "@/components/icons";
import { CertificateProgramDefinition, CertificateRecord } from "@/lib/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

/** Certificates (Phase 11) — one per Learning Path, issued once path
 * completion + a passing related-quiz score is first observed (see
 * lib/data/certificatePrograms.ts). Each links to a print-friendly detail
 * page for sharing/printing, mirroring the existing /analytics/summary
 * print pattern rather than adding a PDF dependency. */
export function CertificatesPanel({ programs, certificates }: { programs: CertificateProgramDefinition[]; certificates: CertificateRecord[] }) {
  const earned = certificates
    .map((c) => ({ record: c, program: programs.find((p) => p.id === c.programId) }))
    .filter((x): x is { record: CertificateRecord; program: CertificateProgramDefinition } => !!x.program);

  return (
    <Card>
      <SectionHeading title="Certificates" subtitle={`${earned.length} of ${programs.length} Learning Paths certified`} />
      {earned.length === 0 ? (
        <EmptyState
          title="No certificates earned yet"
          description="Complete every topic in a Learning Path and pass a related assessment to earn your first certificate."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {earned.map(({ record, program }) => (
            <Link
              key={record.programId}
              href={`/passport/certificate/${record.programId}`}
              className="block rounded-xl border border-slate-200 p-3.5 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
            >
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{program.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Issued {formatDate(record.issuedAt)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {program.skillNames.slice(0, 3).map((name) => (
                  <Badge key={name} variant="neutral">
                    {name}
                  </Badge>
                ))}
              </div>
              <span className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                View certificate <ArrowRightIcon size={12} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
