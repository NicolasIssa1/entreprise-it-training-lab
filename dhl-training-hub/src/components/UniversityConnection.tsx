export function UniversityConnection({ area, connection }: { area: string; connection: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{area}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{connection}</p>
    </div>
  );
}
