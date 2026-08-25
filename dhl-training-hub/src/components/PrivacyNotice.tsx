import { Disclaimer } from "@/components/Disclaimer";

/**
 * Compact, reusable confidentiality reminder for pages where the user types free
 * text (Daily Log, CV Tracker, Ticket Simulator). Kept short and non-alarming —
 * one line of standard guidance plus an optional page-specific note.
 */
export function PrivacyNotice({ context }: { context?: string }) {
  return (
    <Disclaimer>
      <span className="font-medium">Training data only.</span> Don&rsquo;t enter
      confidential company information, passwords/credentials, real customer data, or
      internal screenshots. {context}
    </Disclaimer>
  );
}
