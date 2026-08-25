# Product Roadmap

This is a directional roadmap, not a delivery commitment or a timeline. Phases are
built one at a time; later phases are described only briefly and are subject to
change based on what's learned from earlier ones. Naming: private use keeps the
working title **DHL IT Training Hub**; anything shown publicly, shared externally, or
proposed to a company uses **Enterprise IT Training Lab**. See `CLAUDE.md` for
confidentiality rules that apply across every phase.

---

## Phase 1 — Foundation ✅ (frozen)

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

## Phase 2A — Learning Engine ✅ (complete)

**Objective:** Turn the static Explain-Like-I'm-10 style content into a proper,
navigable learning library independent of the Ticket Simulator.

**Delivered:** `/learn` library + one reusable `/learn/[topicId]` page for all
topics. Initial 16-topic set across four categories, each using the 10-part
structure from `CLAUDE.md`. Cross-linked both ways with Team Explorer and Ticket
Simulator. Superseded in scope by Phase 2B below.

---

## Phase 2B — Complete Learning Library ✅ (current)

**Objective:** Expand Phase 2A's 16-topic proof of concept into a comprehensive,
still-focused enterprise IT fundamentals curriculum — suitable for interns,
graduate hires, service-desk/application-support/network-support trainees, and CS
students entering enterprise IT.

**Delivered:** **50 topics** across the same four categories (IT Service
Management: ticket, incident, SLA, priority & business impact, escalation, service
request, problem management, root cause analysis, change management, knowledge
base, ticket assignment & queue management; Infrastructure: server, virtual
machine, cloud, monitoring, storage, backup & restore, high availability, disaster
recovery, load balancer, patching & updates, directory services, logging, capacity
& performance; Networking: IP address, DNS, DHCP, VPN, router, switch, firewall,
subnet, VLAN, NAT, Wi-Fi, proxy, SD-WAN; Applications: API, database, authentication
vs. authorization, HTTP & HTTPS, REST APIs, JSON, system integration, deployment &
release, application logs, application monitoring, database connectivity, caching,
application performance). Each topic now also has 2–4 explicit learning outcomes, a
Foundation/Intermediate level, an estimated read time, optional recommended
prerequisites, and — where confusion is genuinely common — a "don't confuse this
with" callout. 5 curated Learning Paths (Enterprise IT Foundations, Infrastructure
Foundations, Network Foundations, Application Support Foundations, IT Support
Foundations) with path progress always derived from topic completion. Search
extended to keywords; added a Level filter and a deterministic "continue learning"
suggestion (no AI). Ticket bank expanded 15 → 30, with topic tags reviewed and
extended across the full set. A lightweight build-time content validator catches
broken topic/path/ticket references before they ship.

**Deliberately deferred:** an optional fifth "Security Fundamentals" category (MFA,
least privilege, endpoint security, phishing awareness, encryption basics,
vulnerability concept) was scoped but not built in Phase 2B, to keep this already
large expansion focused — see Phase 2C below.

**Major risks:** Content volume outpacing actual quality/usefulness; topic
relationships (prerequisites, "don't confuse with", paths) drifting out of sync
with the content — mitigated by the build-time validator, but worth re-checking
whenever topics are added or renamed.

**Must be validated before proceeding:** The expanded library is actually used
during the internship — paths and search get real use, not just topic count.

---

## Phase 2C — Security Fundamentals ✅ (complete — Phase 2 now frozen)

**Objective:** Add the deferred Security Fundamentals learning category with a
small, focused set of defensive-basics topics junior IT employees need — not a
full cybersecurity course.

**Delivered:** 6 topics (MFA, Least Privilege, Endpoint Security, Phishing &
Social Engineering Awareness, Encryption Basics, Vulnerabilities & Security
Patching), bringing the library to **56 topics** across 5 categories. A 6th
Learning Path ("Security Fundamentals") was added, plus reciprocal links from
existing topics (Authentication vs. Authorization, HTTP & HTTPS, Patching &
Updates, Directory Services). 4 existing tickets were retagged and 4 new
fictional, defensive-only tickets were added (MFA re-enrollment, a least-privilege
access-review finding, an unhealthy endpoint-protection report, and a reported
phishing email), bringing the ticket bank to **34**. Content is explicitly
foundational security *awareness* — no exploit, bypass, or offensive-technique
content, and no invented "DHL security team"; ownership is framed as
cross-team ("may involve X, varies by organization") throughout, consistent with
how the rest of the curriculum treats team ownership.

**Major risks (as anticipated):** Scope creep into a full security curriculum —
avoided by holding to exactly 6 topics as scoped. Security topics not mapping
cleanly onto the existing primary-team model — resolved the same way IT Service
Management topics were: category-based, cross-team recommendation logic in
`getTopicsForTeam()`, rather than forcing a single "owning" team.

**Phase 2 status:** With 2A, 2B, and 2C complete, **Phase 2 (Learning Engine) is
now frozen.** Any further topic/path/ticket additions are a deliberate future
increment, not part of the current baseline.

---

## Phase 3 — Advanced Ticket / IT Simulations

**Objective:** Move beyond fixed-answer tickets toward branching, multi-step
troubleshooting that mirrors how real investigations unfold.

**Major features:** Branching decision trees, tickets that change based on earlier
choices, richer ambiguity, "escalate vs. keep investigating" decision points.

**Major risks:** Overengineering a simulation the intern doesn't have time to use;
authoring cost per scenario growing much faster than the value it adds.

**Must be validated before proceeding:** The Phase 2 fixed-scenario simulator (now
34 tickets) is genuinely being outgrown, not just theoretically limited.

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
