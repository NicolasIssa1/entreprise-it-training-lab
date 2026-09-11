"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { PrintSummaryButton } from "@/components/PrintSummaryButton";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useCertificates } from "@/lib/certificates";
import { CertificateProgramDefinition } from "@/lib/types";
import { displayProductName } from "@/lib/product";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Print-friendly certificate detail (Phase 11) — the browser's own
 * print-to-PDF flow via print CSS, same trade-off /analytics/summary already
 * makes rather than adding a PDF-generation dependency. Only renders a
 * certificate the learner has actually earned (see
 * lib/data/certificatePrograms.ts's deterministic eligibility) — never a
 * fabricated or pre-filled one.
 */
export function CertificateView({ program }: { program: CertificateProgramDefinition }) {
  const { user } = useAuth();
  const { completed: completedTopics } = useLearningProgress();
  const { allAttempts: quizAttemptsMap } = useQuizAttempts();
  const ctx = useMemo(() => ({ completedTopics, quizAttemptsMap }), [completedTopics, quizAttemptsMap]);
  const { certificates } = useCertificates(ctx);

  const record = certificates.find((c) => c.programId === program.id);
  const learnerName = (user?.user_metadata?.display_name as string | undefined) || "Learner";

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/passport" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Skills Passport
        </Link>
        {record && <PrintSummaryButton />}
      </div>

      {!record ? (
        <Card>
          <EmptyState
            title="Not earned yet"
            description={`Complete every topic in the ${program.title} Learning Path, plus a passing score on a related assessment, to earn this certificate.`}
            action={
              <Link href="/learn" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                Continue learning →
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <Disclaimer>
            An educational training certificate reflecting completed activity within {displayProductName} — not an
            accredited qualification, professional certification, or employer-issued document.
          </Disclaimer>

          <Card className="border-2 border-slate-300 p-10 text-center print:border-slate-400 print:shadow-none">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 print:text-slate-500">Certificate of Completion</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 print:text-black">{learnerName}</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 print:text-black">has completed the training program</p>
            <p className="mt-2 text-xl font-semibold text-blue-700 dark:text-blue-400 print:text-black">{program.title}</p>

            {program.skillNames.length > 0 && (
              <p className="mx-auto mt-4 max-w-md text-sm text-slate-600 dark:text-slate-400 print:text-black">
                Demonstrated skill areas: {program.skillNames.join(", ")}
              </p>
            )}

            <div className="mx-auto mt-8 flex max-w-sm items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 print:border-slate-300 print:text-black">
              <span>Issued {formatDate(record.issuedAt)}</span>
              <span>{record.certificateRef}</span>
            </div>
          </Card>

          <Disclaimer>
            This certificate is issued by {displayProductName}, a personal training tool — it does not represent
            accreditation, employer endorsement, or a validated professional qualification.
          </Disclaimer>
        </>
      )}
    </div>
  );
}
