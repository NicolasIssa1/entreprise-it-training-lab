"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { buttonClass } from "@/lib/ui";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useOrganizations } from "@/lib/organizations";
import { getInvitePreview, acceptOrganizationInvite } from "@/lib/repositories/organizationRepository";
import { InvitePreview } from "@/lib/types";

export default function JoinOrganizationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refresh, setActiveOrganizationId } = useOrganizations();

  const [preview, setPreview] = useState<InvitePreview | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    getInvitePreview(params.token)
      .then(setPreview)
      .catch(() => setPreview(null));
  }, [params.token]);

  async function handleAccept() {
    setError(null);
    setAccepting(true);
    try {
      const organizationId = await acceptOrganizationInvite(params.token);
      refresh();
      setActiveOrganizationId(organizationId);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader eyebrow="Organizations" title="Join Organization" accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <Card>
        {preview === undefined ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading invite...</p>
        ) : preview === null ? (
          <Disclaimer>This invite link is invalid.</Disclaimer>
        ) : preview.status !== "pending" ? (
          <Disclaimer>This invite has already been {preview.status}.</Disclaimer>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              You&rsquo;ve been invited to join <span className="font-medium">{preview.organizationName}</span> as a{" "}
              <span className="font-medium">{preview.role}</span>, sent to <span className="font-medium">{preview.email}</span>.
            </p>

            {authLoading ? null : !user ? (
              <Disclaimer>
                Sign in or create an account with <span className="font-medium">{preview.email}</span>, then come back to
                this page (this link) to accept.{" "}
                <Link href="/login" className="font-medium underline">
                  Sign in →
                </Link>
              </Disclaimer>
            ) : (
              <>
                {error && <Disclaimer>{error}</Disclaimer>}
                <button type="button" onClick={handleAccept} disabled={accepting} className={buttonClass("primary")}>
                  {accepting ? "Joining..." : "Accept invite"}
                </button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
