/**
 * The product's visual identity — an abstract mark combining connected
 * network nodes (enterprise IT / networking) with a layered base (structured
 * learning). Pure inline SVG, no external asset or icon library, no DHL or
 * third-party branding. Used in the Nav, auth pages, and anywhere the
 * product needs a mark rather than plain text.
 */
export function ProductMark({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="product-mark-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      {/* layered base */}
      <path
        d="M4 17.5 12 21l8-3.5"
        stroke="url(#product-mark-gradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M4 13.5 12 17l8-3.5"
        stroke="url(#product-mark-gradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* network nodes */}
      <path d="M12 3 5 6.5 12 10l7-3.5-7-3.5Z" fill="url(#product-mark-gradient)" />
      <circle cx="12" cy="6.5" r="1.15" fill="white" />
      <circle cx="5" cy="6.5" r="1" fill="white" opacity="0.9" />
      <circle cx="19" cy="6.5" r="1" fill="white" opacity="0.9" />
    </svg>
  );
}

/** The mark inside its rounded gradient tile — the standalone "logo" unit
 * used in the Nav and auth pages. */
export function ProductMarkTile({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-900/25 ${className}`}
      style={{ width: size, height: size }}
    >
      <ProductMark size={Math.round(size * 0.6)} />
    </span>
  );
}
