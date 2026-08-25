/**
 * The general troubleshooting mindset every lesson's specific steps are meant to
 * follow: Scope → Symptoms → Isolate → Test → Gather Evidence → Fix or Escalate →
 * Verify → Document. Shown as a compact reference, not a literal checklist each
 * topic must reproduce step-for-step — individual lessons apply this mindset to
 * their own situation rather than repeating it mechanically.
 */
const FRAMEWORK_STEPS = [
  "Scope",
  "Symptoms",
  "Isolate",
  "Test",
  "Gather Evidence",
  "Fix or Escalate",
  "Verify",
  "Document",
];

export function TroubleshootingFramework({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
      {FRAMEWORK_STEPS.map((step, i) => (
        <span key={step} className="flex items-center gap-1.5">
          <span
            className={`rounded-full bg-slate-100 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${
              compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
            }`}
          >
            {step}
          </span>
          {i < FRAMEWORK_STEPS.length - 1 && (
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
              →
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
