import { Badge } from "@/components/Badge";
import { AdminAttentionFlag, AdminAssignmentStatus } from "@/lib/types";

/** Distinguishes a real account row from a fictional demo one everywhere the
 * roster is shown — see DemoDataBanner.tsx's header comment. */
export function LearnerIdentityBadge({ isYou }: { isYou: boolean }) {
  return isYou ? <Badge variant="accent">You</Badge> : <Badge variant="neutral">Demo</Badge>;
}

export function AttentionIndicator({ flags }: { flags: AdminAttentionFlag[] }) {
  if (flags.length === 0) return <Badge variant="success">On track</Badge>;
  const hasHigh = flags.some((f) => f.severity === "high");
  return <Badge variant={hasHigh ? "danger" : "warning"}>{flags.length} flag{flags.length === 1 ? "" : "s"}</Badge>;
}

const STATUS_VARIANT: Record<AdminAssignmentStatus, "neutral" | "accent" | "success" | "danger"> = {
  assigned: "neutral",
  started: "accent",
  completed: "success",
  overdue: "danger",
};

const STATUS_LABEL: Record<AdminAssignmentStatus, string> = {
  assigned: "Assigned",
  started: "In progress",
  completed: "Completed",
  overdue: "Overdue",
};

export function AssignmentStatusBadge({ status }: { status: AdminAssignmentStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
