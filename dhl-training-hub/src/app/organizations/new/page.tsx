"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { inputClass, toggleButtonClass, buttonClass } from "@/lib/ui";
import { createOrganization } from "@/lib/repositories/organizationRepository";
import { useOrganizations } from "@/lib/organizations";
import { OrganizationType, ORGANIZATION_TYPES } from "@/lib/types";

const TYPE_LABELS: Record<OrganizationType, string> = { company: "Company", university: "University", training_provider: "Training Provider", other: "Other" };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50)
    .replace(/^-+|-+$/g, "");
}

export default function NewOrganizationPage() {
  const router = useRouter();
  const { refresh, setActiveOrganizationId } = useOrganizations();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [orgType, setOrgType] = useState<OrganizationType>("company");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const organizationId = await createOrganization(name.trim(), slug, orgType);
      refresh();
      setActiveOrganizationId(organizationId);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageHeader eyebrow="Organizations" title="Create Organization" description="You become the owner. No payment/billing is set up yet — this is free during this phase." accent="from-slate-500/10 via-blue-500/10 to-transparent" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Organization name</label>
            <input value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputClass} required placeholder="Acme University" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Slug</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              className={inputClass}
              required
              pattern="^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Organization type</label>
            <div className="flex flex-wrap gap-2">
              {ORGANIZATION_TYPES.map((t) => (
                <button key={t} type="button" onClick={() => setOrgType(t)} className={toggleButtonClass(orgType === t)}>
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {error && <Disclaimer>{error}</Disclaimer>}

          <button type="submit" disabled={submitting} className={buttonClass("primary")}>
            {submitting ? "Creating..." : "Create organization"}
          </button>
        </form>
      </Card>
    </div>
  );
}
