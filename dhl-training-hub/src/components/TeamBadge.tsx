import { Badge } from "@/components/Badge";
import { getTeamLabel } from "@/lib/data/teams";
import { TeamId } from "@/lib/types";

/** Small labeled badge for a team. `variant="primary"` is visually stronger (accent
 * color); surrounding copy/labels — not color alone — convey primary vs. related. */
export function TeamBadge({ teamId, variant = "related" }: { teamId: TeamId; variant?: "primary" | "related" }) {
  return <Badge variant={variant === "primary" ? "accent" : "neutral"}>{getTeamLabel(teamId)}</Badge>;
}
