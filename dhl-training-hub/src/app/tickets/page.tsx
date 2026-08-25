"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { tickets } from "@/lib/data/tickets";
import { teams } from "@/lib/data/teams";
import { Ticket, TeamId, UrgencyLevel } from "@/lib/types";

const TEAM_OPTIONS: { id: TeamId; label: string }[] = teams.map((t) => ({ id: t.id, label: t.name }));
const URGENCY_OPTIONS: UrgencyLevel[] = ["Critical", "High", "Medium", "Low"];

function teamLabel(id: TeamId) {
  return teams.find((t) => t.id === id)?.name ?? id;
}

export default function TicketSimulatorPage() {
  const [selectedId, setSelectedId] = useState<string>(tickets[0].id);
  const selected = tickets.find((t) => t.id === selectedId) as Ticket;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Ticket Simulator"
        subtitle="Fake, generic training tickets — not real DHL data or terminology"
      />
      <Disclaimer>
        All tickets below are fictional training scenarios. Urgency levels
        (Critical/High/Medium/Low) and team categories are generic training
        categories only — not confirmed DHL terminology or policy.
      </Disclaimer>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedId(ticket.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
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
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{ticket.id}</span>
        <Badge variant="neutral">{ticket.department}</Badge>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{ticket.title}</h3>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{ticket.problem}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="font-medium">Impact: </span>
        {ticket.impact}
      </p>

      <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
            Which team should handle this?
          </label>
          <div className="flex flex-wrap gap-2">
            {TEAM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTeam(opt.id)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  team === opt.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
            How urgent is this?{" "}
            <span className="font-normal text-slate-400">(training category, not confirmed DHL terminology)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {URGENCY_OPTIONS.map((u) => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  urgency === u
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
            What would you check first?
          </label>
          <textarea
            value={firstCheck}
            onChange={(e) => setFirstCheck(e.target.value)}
            rows={3}
            placeholder="Write your own first troubleshooting step..."
            className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            disabled={!team || !urgency}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
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

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <Badge variant={correct ? "success" : "warning"}>
          {correct
            ? `Matches the suggested team: ${teamLabel(ticket.recommendedTeam)}`
            : `Suggested team: ${teamLabel(ticket.recommendedTeam)} (you picked ${teamLabel(chosenTeam)})`}
        </Badge>
        {ticket.hasMultipleCauses && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            This ticket intentionally has more than one plausible team/cause — being
            &ldquo;wrong&rdquo; here is normal and part of the training value.
          </p>
        )}
      </div>

      <GuidanceSection title="Reasoning" text={ticket.reasoning} />
      <GuidanceList title="Suggested troubleshooting steps" items={ticket.suggestedTroubleshooting} />
      <GuidanceSection title="Escalation" text={ticket.escalationNote} />
      <GuidanceList title="Likely root cause(s)" items={ticket.likelyRootCauses} />
      <GuidanceSection title="Example resolution" text={ticket.exampleResolution} />
      <GuidanceSection title="What should be documented" text={ticket.documentationNotes} />
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
