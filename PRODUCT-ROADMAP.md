# Product Roadmap

This is a directional roadmap, not a delivery commitment or a timeline. Phases are
built one at a time; later phases are described only briefly and are subject to
change based on what's learned from earlier ones. Naming: private use keeps the
working title **DHL IT Training Hub**; anything shown publicly, shared externally, or
proposed to a company uses **Enterprise IT Training Lab**. See `CLAUDE.md` for
confidentiality rules that apply across every phase.

---

## Phase 1 — Foundation ✅ (current)

**Objective:** A clean, consistent, honest, reasonably polished foundation — proof
that the product concept works — without overbuilding.

**Major features:** Dashboard, Team Explorer, Ticket Simulator (fixed scenarios),
Daily Log, CV Achievement Tracker. Shared internship state, product/brand config
separated from personal organization context, privacy notices, accessibility and
resilience basics.

**Major risks:** Wording that unintentionally implies confirmed DHL facts;
inconsistent state between pages; scope creep into Phase 2+ features.

**Must be validated before proceeding:** Foundation is actually used daily during the
internship (not just built and abandoned); the generic-knowledge vs. observed-facts
split holds up in practice; `npm run lint` / `npm run build` stay clean.

---

## Phase 2 — Learning Engine

**Objective:** Turn the static Explain-Like-I'm-10 style content into a proper,
navigable learning library independent of the Ticket Simulator.

**Major features:** Topic library (DNS, DHCP, VPN, server, cloud, VM, API, database,
firewall, router, switch, authentication, authorization, ticket, SLA, incident,
escalation, backup, monitoring, logging, load balancer), each using the 10-part
structure from `CLAUDE.md`.

**Major risks:** Content becoming generic filler with no real learning value;
duplicating what's already in the Team Explorer instead of complementing it.

**Must be validated before proceeding:** The library is actually referenced during
real work conversations, not just browsed once.

---

## Phase 3 — Advanced Ticket / IT Simulations

**Objective:** Move beyond fixed-answer tickets toward branching, multi-step
troubleshooting that mirrors how real investigations unfold.

**Major features:** Branching decision trees, tickets that change based on earlier
choices, richer ambiguity, "escalate vs. keep investigating" decision points.

**Major risks:** Overengineering a simulation the intern doesn't have time to use;
authoring cost per scenario growing much faster than the value it adds.

**Must be validated before proceeding:** Phase 1's fixed-scenario simulator is
genuinely being outgrown, not just theoretically limited.

---

## Phase 4 — Quiz + Skills System

**Objective:** Structured self-testing and a motivational (not scientific) skill
progress view.

**Major features:** Daily quizzes scoped to material already studied, correct/incorrect
tracking, weak/strong topic detection, a skill tree with explicitly non-scientific
progress percentages.

**Major risks:** Quiz questions outrunning actual studied material; skill percentages
being misread as objective competency measures.

**Must be validated before proceeding:** Enough Phase 1/2 content exists to quiz on
without inventing facts to fill gaps.

---

## Phase 5 — Backend / Supabase

**Objective:** Move from `localStorage` to a real persistent backend so data survives
device changes and isn't lost to browser storage limits/clearing.

**Major features:** Supabase (or equivalent) database, data migration path from
existing `localStorage` entries, basic single-user auth.

**Major risks:** Introducing a backend before there's a real need; auth complexity
creeping in ahead of schedule; data-loss risk during migration from local storage.

**Must be validated before proceeding:** `localStorage` has actually become a
limitation in practice (device switching, storage limits) — not just "backends are
more proper."

---

## Phase 6 — AI Tutor

**Objective:** An AI-assisted layer for Q&A, summarization, and personalized
explanations grounded in the app's own generic content.

**Major features:** Claude API integration, grounded answers (no invented DHL facts),
daily-log summarization assistance.

**Major risks:** Hallucinated "facts" presented as if confirmed; API cost; conflating
AI-generated content with the user's own honest observations (especially in the CV
tracker — the honesty principle in `CLAUDE.md` must survive this phase unchanged).

**Must be validated before proceeding:** A real backend (Phase 5) exists to safely
store API keys and mediate requests; clear guardrails are designed before any AI
content reaches the CV tracker.

---

## Phase 7 — Business / Logistics Learning

**Objective:** Add the "How DHL Works" business-context view (external/customer flow
and internal/employee flow) that Phase 1 only stubbed out as a placeholder.

**Major features:** Generic freight-forwarding/logistics learning content, using only
public or generic industry information — never DHL-internal specifics.

**Major risks:** Drifting into DHL-specific claims not actually confirmed; scope
creep beyond IT into general logistics business content.

**Must be validated before proceeding:** IT-focused phases are solid first, since
business context is a smaller, secondary need compared to IT skill-building.

---

## Phase 8 — Analytics / Manager View

**Objective:** A read-only view suitable for showing a manager or mentor a summary of
learning progress (not raw personal journal entries).

**Major features:** Aggregate progress views, exportable summaries, clear separation
between what's shareable and what stays private.

**Major risks:** Accidentally exposing raw, unfiltered personal notes; privacy
boundary mistakes between "my journal" and "what I'd show someone else."

**Must be validated before proceeding:** Real interest from a manager/mentor in
seeing this, not a speculative feature.

---

## Phase 9 — Enterprise Pilot Readiness

**Objective:** Prepare the product to be proposed as a real pilot to DHL or another
company — as a tool, not yet as certified production software.

**Major features:** Multi-user support design (still not full multi-tenancy),
organization/role/team configuration made real (building on the Phase 1
`internshipState`/`product` separation), a pitch-ready demo environment with zero
real data.

**Major risks:** Presenting a prototype as more production-ready than it is;
proposing before `ENTERPRISE-READINESS.md` requirements have a credible plan.

**Must be validated before proceeding:** Genuine interest from a sponsor/stakeholder;
legal/IP clarity on using "DHL" in any pitch context; `ENTERPRISE-READINESS.md`
items have at least a plan, even if not implemented.

---

## Phase 10 — Production / Commercial Readiness

**Objective:** Actual enterprise-grade deployment — the furthest phase, only pursued
if Phase 9 validates real demand.

**Major features:** Everything in `ENTERPRISE-READINESS.md` — auth/SSO, RBAC,
encrypted storage, audit logging, monitoring, support model, legal/licensing review,
company branding approval, formal security review.

**Major risks:** Underestimating the gap between "polished prototype" and "production
enterprise software"; security or compliance gaps discovered late.

**Must be validated before proceeding:** A committed customer/sponsor, a security
review, and legal sign-off — this phase should not start speculatively.
