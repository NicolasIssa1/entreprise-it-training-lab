"use client";

/**
 * Print/export (Phase 8 Part I) — deliberately just the browser's own
 * print-to-PDF flow via print CSS (see globals.css's @media print rules),
 * not server-side PDF generation. This button and everything with the
 * `print:hidden` class (nav, other buttons) are excluded from the printed
 * output automatically.
 */
export function PrintSummaryButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    >
      Print Summary
    </button>
  );
}
