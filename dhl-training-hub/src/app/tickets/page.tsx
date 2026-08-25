"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { tickets, getTicketById } from "@/lib/data/tickets";
import { teams, getTeamLabel } from "@/lib/data/teams";
import { textareaClass, toggleButtonClass } from "@/lib/ui";
import { Ticket, TeamId, UrgencyLevel } from "@/lib/types";

const URGENCY_OPTIONS: UrgencyLevel[] = ["Critical", "High", "Medium", "Low"];

export default function TicketSimulatorPage() {
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Ticket Simulator"
        subtitle="Fake, generic training tickets — not real DHL data or terminology"
      />
      <PrivacyNotice context="All tickets below are fictional training scenarios, not real DHL incidents." />

      <Suspense fallback={null}>
        <TicketSimulatorContent />
      </Suspense>
    </div>
  );
}

function TicketSimulatorContent() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("ticket");
  const initialId = (requestedId && getTicketById(requestedId)) ? requestedId : tickets[0].id;

  const [selectedId, setSelectedId] = useState<string>(initialId);
  const selected = tickets.find((t) => t.id === selectedId) as Ticket;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => setSelectedId(ticket.id)}
            aria-pressed={ticket.id === selectedId}
            className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              ticket.id === selectedId
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{ticket.id}</span>
              <Badge
                variant={
                  ticket.status === "Resolved"
                    ? "success"
                    : ticket.status === "Escalated"
                      ? "danger"
                      : ticket.status === "In Progress"
                        ? "warning"
                        : "accent"
                }
              >
                {ticket.status}
              </Badge>
            </div>
            <p className="mt-1 font-medium text-slate-900 dark:text-slate-100">{ticket.title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{ticket.department}</p>
          </button>
        ))}
      </div>

      <TicketWorkbench key={selected.id} ticket={selected} />
    </div>
  );
}

function TicketWorkbench({ ticket }: { ticket: Ticket }) {
  const [team, setTeam] = useState<TeamId | "">("");
  const [urgency, setUrgency] = useState<UrgencyLevel | "">("");
  const [firstCheck, setFirstCheck] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <Card>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{ticket.id}</span>
        <Badge variant="neutral">{ticket.department}</Badge>
      </div>
      <p className="mb-3 text-xs italic text-slate-400">Training scenario — fictional data.</p>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{ticket.title}</h3>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{ticket.problem}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium">Impact: </span>
        {ticket.impact}
      </p>

      <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

      <div className="space-y-4">
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
            Which team should handle this?
          </legend>
          <div className="flex flex-wrap gap-2">
            {teams.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTeam(opt.id)}
                aria-pressed={team === opt.id}
                className={toggleButtonClass(team === opt.id)}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
            How urgent is this?{" "}
            <span className="font-normal text-slate-400">(training category, not confirmed DHL terminology)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {URGENCY_OPTIONS.map((u) => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                aria-pressed={urgency === u}
                className={toggleButtonClass(urgency === u)}
              >
                {u}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="first-check" className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
            What would you check first?
          </label>
          <textarea
            id="first-check"
            value={firstCheck}
            onChange={(e) => setFirstCheck(e.target.value)}
            rows={3}
            placeholder="Write your own first troubleshooting step..."
            className={textareaClass}
          />
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={!team || !urgency}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            Reveal guidance
          </button>
        ) : (
          <TicketGuidance ticket={ticket} chosenTeam={team as TeamId} />
        )}
      </div>
    </Card>
  );
}

function TicketGuidance({ ticket, chosenTeam }: { ticket: Ticket; chosenTeam: TeamId }) {
  const correct = chosenTeam === ticket.recommendedTeam;
  const otherPlausibleTeams = ticket.plausibleTeams.filter((t) => t !== ticket.recommendedTeam);

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <Badge variant={correct ? "success" : "warning"}>
          {correct
            ? `Matches the suggested team: ${getTeamLabel(ticket.recommendedTeam)}`
            : `Suggested team: ${getTeamLabel(ticket.recommendedTeam)} (you picked ${getTeamLabel(chosenTeam)})`}
        </Badge>
        {ticket.hasMultipleCauses && otherPlausibleTeams.length > 0 && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            This ticket intentionally has more than one plausible team involved —{" "}
            <strong>{getTeamLabel(ticket.recommendedTeam)}</strong> would typically
            investigate first, but{" "}
            {otherPlausibleTeams.map((t, i) => (
              <span key={t}>
                {i > 0 && " and "}
                <strong>{getTeamLabel(t)}</strong>
              </span>
            ))}{" "}
            could also genuinely be involved depending on what&rsquo;s found. Being
            &ldquo;wrong&rdquo; here is normal and part of the training value — real
            troubleshooting is rarely one-team/one-answer.
          </p>
        )}
      </div>

      <GuidanceSection title="Reasoning" text={ticket.reasoning} />
      <GuidanceList title="Suggested troubleshooting steps" items={ticket.suggestedTroubleshooting} />
      <GuidanceSection title="Escalation" text={ticket.escalationNote} />
      <GuidanceList title="Likely root cause(s)" items={ticket.likelyRootCauses} />
      <GuidanceSection title="Example resolution" text={ticket.exampleResolution} />
      <GuidanceSection title="What should be documented" text={ticket.documentationNotes} />

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-3 dark:border-slate-800">
        {[ticket.recommendedTeam, ...otherPlausibleTeams].map((t) => (
          <Link
            key={t}
            href={`/teams/${t}`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Learn more about {getTeamLabel(t)} →
          </Link>
        ))}
      </div>
    </div>
  );
}

function GuidanceSection({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{text}</p>
    </div>
  );
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{title}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
