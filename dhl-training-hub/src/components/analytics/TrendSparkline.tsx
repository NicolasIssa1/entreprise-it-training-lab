/**
 * Lightweight, dependency-free bar chart (Phase 8 Part S) — plain inline SVG,
 * no charting library. Every chart in this app must carry a text alternative
 * (Part U), so the numeric values are always rendered as visible text
 * alongside the bars, not hidden behind the SVG or color alone.
 */
export function TrendSparkline({
  points,
  ariaLabel,
  formatValue = (v) => `${v}%`,
}: {
  points: { label: string; value: number }[];
  ariaLabel: string;
  formatValue?: (value: number) => string;
}) {
  if (points.length === 0) return null;

  const max = Math.max(100, ...points.map((p) => p.value));
  const barWidth = 100 / points.length;

  return (
    <div>
      <svg viewBox="0 0 100 40" className="h-10 w-full" role="img" aria-label={ariaLabel} preserveAspectRatio="none">
        {points.map((p, i) => {
          const height = max === 0 ? 0 : (p.value / max) * 36;
          return (
            <rect
              key={`${p.label}-${i}`}
              x={i * barWidth + barWidth * 0.15}
              y={40 - height}
              width={barWidth * 0.7}
              height={height}
              className="fill-blue-500 dark:fill-blue-400"
            />
          );
        })}
      </svg>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {points.map((p) => `${p.label}: ${formatValue(p.value)}`).join(" · ")}
      </p>
    </div>
  );
}
