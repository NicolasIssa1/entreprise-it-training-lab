export function SectionHeading({
  title,
  subtitle,
  level = "h2",
}: {
  title: string;
  subtitle?: string;
  level?: "h1" | "h2";
}) {
  const Heading = level;
  return (
    <div className="mb-4">
      <Heading className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</Heading>
      {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
