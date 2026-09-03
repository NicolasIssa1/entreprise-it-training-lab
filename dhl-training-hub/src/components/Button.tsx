import { ButtonHTMLAttributes } from "react";
import { ButtonSize, ButtonVariant, buttonClass } from "@/lib/ui";

/**
 * Thin `<button>` wrapper over buttonClass() — most call sites still compose
 * buttonClass() directly (many "buttons" in this app are actually `<Link>`s
 * styled as buttons), but this is the convenient form for a real `<button>`
 * with onClick logic. `loading` disables the button and swaps in a small
 * spinner without changing its size, so a slow action doesn't jump the layout.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      disabled={disabled || loading}
      className={`${buttonClass(variant, size)} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
