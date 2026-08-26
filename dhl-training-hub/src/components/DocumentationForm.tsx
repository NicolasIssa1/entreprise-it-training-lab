"use client";

import { useState } from "react";
import { DOCUMENTATION_FIELDS, DocumentationFieldId } from "@/lib/types";
import { textareaClass } from "@/lib/ui";

/**
 * Resolution-documentation training form shown before a scenario finishes.
 * Deliberately not blocked on completeness — an incomplete write-up is still
 * submittable and simply scores lower on Documentation, which is the lesson.
 */
export function DocumentationForm({
  initial,
  onSubmit,
}: {
  initial: Partial<Record<DocumentationFieldId, string>>;
  onSubmit: (documentation: Record<DocumentationFieldId, string>) => void;
}) {
  const [values, setValues] = useState<Partial<Record<DocumentationFieldId, string>>>(initial);

  return (
    <div className="space-y-4">
      {DOCUMENTATION_FIELDS.map((field) => (
        <div key={field.id}>
          <label htmlFor={`doc-${field.id}`} className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100">
            {field.label}
          </label>
          <textarea
            id={`doc-${field.id}`}
            rows={2}
            value={values[field.id] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
            placeholder={field.placeholder}
            className={textareaClass}
          />
        </div>
      ))}
      <button
        onClick={() =>
          onSubmit(
            Object.fromEntries(DOCUMENTATION_FIELDS.map((f) => [f.id, values[f.id] ?? ""])) as Record<
              DocumentationFieldId,
              string
            >,
          )
        }
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        Submit resolution notes
      </button>
    </div>
  );
}
