import { notFound } from "next/navigation";
import { certificatePrograms } from "@/lib/data/certificatePrograms";
import { CertificateView } from "@/components/CertificateView";

export function generateStaticParams() {
  return certificatePrograms.map((program) => ({ programId: program.id }));
}

export default async function CertificateDetailPage(props: PageProps<"/passport/certificate/[programId]">) {
  const { programId } = await props.params;
  const program = certificatePrograms.find((p) => p.id === programId);

  if (!program) {
    notFound();
  }

  return <CertificateView program={program} />;
}
