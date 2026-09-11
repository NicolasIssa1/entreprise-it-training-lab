import { getSupabaseClient } from "@/lib/supabase/client";
import { CertificateRecord } from "@/lib/types";

export async function fetchCertificates(userId: string): Promise<CertificateRecord[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("certificates").select("*").eq("user_id", userId);
  if (error || !data) throw error ?? new Error("Failed to load certificates");
  return data.map((row) => ({
    programId: row.program_id,
    certificateRef: row.certificate_ref,
    issuedAt: row.issued_at,
    skillsSummary: (row.skills_summary as string[]) ?? [],
  }));
}

/** Insert-only — a certificate's issuedAt/certificateRef must stay fixed once
 * earned (see the Phase 11 migration's comment), so this never updates an
 * existing row; ignoreDuplicates protects against a race re-issuing one. */
export async function insertCertificate(userId: string, certificate: CertificateRecord): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("certificates").upsert(
    {
      user_id: userId,
      program_id: certificate.programId,
      certificate_ref: certificate.certificateRef,
      issued_at: certificate.issuedAt,
      skills_summary: certificate.skillsSummary,
    },
    { onConflict: "user_id,program_id", ignoreDuplicates: true },
  );
  if (error) throw error;
}

/** Used only by bulk re-push of local-only certificate records after a cloud merge. */
export async function bulkUpsertCertificates(userId: string, certificates: CertificateRecord[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || certificates.length === 0) return;
  const rows = certificates.map((c) => ({
    user_id: userId,
    program_id: c.programId,
    certificate_ref: c.certificateRef,
    issued_at: c.issuedAt,
    skills_summary: c.skillsSummary,
  }));
  const { error } = await supabase.from("certificates").upsert(rows, { onConflict: "user_id,program_id", ignoreDuplicates: true });
  if (error) throw error;
}
