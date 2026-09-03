const LEVEL_STYLES: Record<"h1" | "h2", string> = {
  h1: "text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
  h2: "text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100",
};

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
      <Heading className={LEVEL_STYLES[level]}>{title}</Heading>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{subtitle}</p>}
    </div>
  );
}
