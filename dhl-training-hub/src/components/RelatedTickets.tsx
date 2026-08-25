import Link from "next/link";
import { getTicketsForTopic } from "@/lib/data/tickets";

/** Derives related tickets from the tickets' own topicIds tags (single source of
 * truth — see lib/data/tickets.ts) rather than storing the relationship twice. */
export function RelatedTickets({ topicId }: { topicId: string }) {
  const relatedTickets = getTicketsForTopic(topicId);
  if (relatedTickets.length === 0) return null;

  return (
    <ul className="space-y-2">
      {relatedTickets.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/tickets?ticket=${ticket.id}`}
            className="text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:text-blue-400"
          >
            {ticket.id} — {ticket.title} →
          </Link>
        </li>
      ))}
    </ul>
  );
}
