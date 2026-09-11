"use client";

import { useEffect, useState } from "react";
import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { fetchCertificates, insertCertificate, bulkUpsertCertificates } from "@/lib/repositories/certificatesRepository";
import { mergeArrayByIdPreferCloud } from "@/lib/mergeCloudState";
import { CertificateRecord } from "@/lib/types";
import { certificatePrograms, isCertificateProgramEligible, CertificateEligibilityContext } from "@/lib/data/certificatePrograms";

const DOMAIN_KEY = "certificates";

/** A stable, human-shareable reference — not a security token. Includes a
 * short random suffix so a hypothetical local-data reset can never collide
 * with a previously-issued certificate's reference. */
function generateCertificateRef(programId: string): string {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CERT-${programId.slice(0, 16).toUpperCase()}-${suffix}`;
}

/**
 * Certificates are issued once (insert-only — see certificatesRepository.ts)
 * the moment a certificate program's deterministic eligibility
 * (lib/data/certificatePrograms.ts) is first observed to be satisfied.
 * issuedAt/certificateRef are then fixed forever, unlike everything else in
 * this app that's recomputed live — see the Phase 11 migration's comment for
 * why a certificate specifically needs to behave this way. Cloud-aware
 * exactly like every other Phase 5+ domain hook.
 */
export function useCertificates(ctx: CertificateEligibilityContext | null) {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { items: certificates, setItems: setCertificates } = useLocalStorageList<CertificateRecord>(scopedKey(DOMAIN_KEY, user?.id), []);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchCertificates(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setCertificates((prevLocal) => {
          const { merged, localOnly } = mergeArrayByIdPreferCloud(prevLocal, cloud, (c) => c.programId);
          if (localOnly.length > 0) bulkUpsertCertificates(user.id, localOnly).catch(() => setSyncError(true));
          return merged;
        });
      })
      .catch(() => {
        if (!cancelled) setSyncError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  useEffect(() => {
    if (!ctx) return;
    const issuedIds = new Set(certificates.map((c) => c.programId));
    const newlyEligible = certificatePrograms.filter((p) => !issuedIds.has(p.id) && isCertificateProgramEligible(p, ctx));
    if (newlyEligible.length === 0) return;

    const now = new Date().toISOString();
    const newCertificates: CertificateRecord[] = newlyEligible.map((p) => ({
      programId: p.id,
      certificateRef: generateCertificateRef(p.id),
      issuedAt: now,
      skillsSummary: p.skillNames,
    }));
    setCertificates((prev) => [...prev, ...newCertificates]);
    if (cloudMode && user) {
      for (const certificate of newCertificates) insertCertificate(user.id, certificate).catch(() => setSyncError(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, certificates, cloudMode, user?.id]);

  return { certificates, syncError };
}
