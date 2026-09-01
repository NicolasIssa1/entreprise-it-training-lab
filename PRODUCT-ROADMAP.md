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

## Phase 3 — Advanced Ticket / IT Simulations ✅ (complete)

**Objective:** Move beyond fixed-answer tickets toward branching, multi-step
troubleshooting that mirrors how real investigations unfold.

**Delivered:** The Ticket Simulator (`/tickets`) now offers two tiers. **Quick
Practice** is the original 34 fixed-scenario tickets, unchanged. **Advanced
Investigations** adds 8 branching scenarios (`/tickets/investigate/[scenarioId]`)
covering DNS/name resolution, application performance (deliberately
multi-layered, no single obvious cause), VPN connectivity, authentication vs.
authorization, system integration failure, a shared storage outage, a deployment
regression, and a defensive-only endpoint security incident. Each scenario is a
typed `InvestigationScenario` (`dhl-training-hub/src/lib/data/investigations/`) —
a graph of `InvestigationNode`s connected by `InvestigationAction`s, each tagged
with a training-stage (scope/evidence/diagnose/resolve/escalate/verify) and a
quality (strong/reasonable/weak/unnecessary — several genuinely reasonable
choices exist per decision point, not one correct answer). Evidence evolves as
the learner acts; weak/unnecessary choices self-loop back with explanatory
feedback rather than dead-ending the scenario. The learner assesses generic
business impact up front, can ask optional diagnostic questions, holds and
revises a hypothesis at any time, and every action is logged to a persisted
Investigation Timeline. Every scenario ends in "resolved" or "escalated" — both
are legitimate successful outcomes — followed by a mandatory verification step
and a short resolution-documentation form (compared afterward against a model
example). A generic, scenario-agnostic scoring engine
(`lib/investigationScoring.ts`) turns the tagged actions into six weighted
categories (Information Gathering, Isolation/Diagnosis, Action Quality,
Escalation, Verification, Documentation) and an overall Excellent/Strong/
Developing/Needs Review rating, explicitly labeled a training indicator rather
than a validated assessment. Progress persists per scenario
(`investigation-progress` in `localStorage`, via `useInvestigationProgress`) with
a "Restart Scenario" option (confirmed before clearing), plus a lightweight
completion history (`investigation-completions`) Phase 4 can build on.
Cross-linked both ways with Learn ("Advanced Practice" on relevant topic pages)
and Team Explorer ("Advanced Practice" on relevant team pages), reusing the same
tag-on-the-scenario / derive-the-reverse-link pattern as tickets. A build-time
validator (mirroring the Learn library's) checks for duplicate scenario ids, a
valid start node, valid action destinations, valid topic references, and
unreachable nodes.

**Major risks (as anticipated):** Authoring cost per scenario — managed by
keeping each scenario to a single well-scoped graph (roughly 8-13 nodes) with a
shared narrative shape (evidence-gathering → decision hub → post-decision →
verify → outcome) rather than open-ended branching complexity.

**Must be validated before proceeding:** The Advanced Investigations tier is
actually used during the internship, not just built once as a proof of concept.

---

## Phase 4 — Quiz + Skills System ✅ (complete)

**Objective:** Structured self-testing and an explainable, non-scientific skill
progress view — "I can see what I understand, what I can apply, and what I
should learn next," never "I am job ready."

**Delivered:** A **Quiz** layer (`/quizzes`, `/quizzes/[quizId]`) of 12 quizzes
— 6 Foundation Assessments (one per major skill area: IT Service Management,
Infrastructure, Networking, Applications, Security Fundamentals, Enterprise
Troubleshooting) plus 6 Learning Path checkpoints — **99 scenario-based
questions** total (`dhl-training-hub/src/lib/data/quizzes/`), testing applied
judgment ("users can reach a service by IP but not hostname — what do you
investigate first?") rather than definitions. Supports single-choice and
multi-select questions, one-question-at-a-time navigation with Back/Next and a
question-jump strip, no correctness leaked before submission, and a detailed
post-submission answer review (learner's answer, correct answer, an
explanation, and — for common wrong answers — a targeted misconception
explanation) linked back to the relevant Learn topics. Attempts persist per
quiz (`quiz-attempts`, capped at the last 10 attempts each) with best/latest
score tracking and unlimited retakes.

A **Skill Progress model** (`dhl-training-hub/src/lib/data/skills.ts` +
`skillProgress.ts`) tracks 6 skills (IT Service Management, Infrastructure,
Networking, Applications, Security, Troubleshooting), each **entirely derived**
at render time from three existing activity sources — completed Learn topics
(30%), best quiz results (30%), and completed Advanced Investigation scores
(40%, weighted highest so lesson-checkbox-clicking alone caps a skill at 30%) —
never a second, independently-stored readiness score. 5 of the 6 skills map
directly onto a Learn category (so there is only ever one place — the
category — that could drift out of sync); Troubleshooting is cross-cutting, so
its learning evidence comes from a small curated set of process-focused topics
and its practical evidence is every Advanced Investigation (all 8 exercise the
same scope/evidence/diagnose/escalate/verify framework). Grounded level labels
only (Not Started / Getting Started / Building Foundation / Practicing / Strong
Foundation at 0 / 1-24 / 25-49 / 50-74 / 75-100) — never "Expert"/"Certified"/
"Job Ready." A new **`/progress`** page shows Overall Training Progress, a
per-skill breakdown (learning/knowledge/practical evidence and level), a
visible-but-not-obnoxious non-scientific-indicator disclaimer, and a
deterministic **Recommendation engine** (`lib/recommendations.ts`, no AI) that
inspects weak quiz topics (from which specific questions were actually missed),
never-attempted quizzes, never-completed or low-scoring investigations, and
path progress (including unmet prerequisites) to surface 3-5 prioritized,
directly-linked next actions.

Cross-linked throughout: Learn topic pages gained a "Knowledge Check" section
(reverse-derived from each quiz's own `relatedTopicIds`); Learning Path cards
on `/learn` show their checkpoint assessment (with best score once attempted)
and related Advanced Investigations (derived from topic overlap, no
hand-maintained path→scenario list); Advanced Investigation results show a
"Skill Progress Impact" note (which skills the completed scenario counts toward)
linking to `/progress`, without claiming a numeric skill gain; the Dashboard
gained a compact progress summary block (overall indicator, counts, one
top-priority recommendation) linking out to the full `/progress` page, rather
than duplicating it.

**Major risks (as anticipated):** Skill percentages being misread as objective
competency measures — mitigated with an explicit, visible disclaimer on
`/progress` and by keeping every score's calculation inspectable ("How this is
calculated"). Quiz questions outrunning studied material — avoided by writing
every question from curriculum already in the app, never inventing new facts.

**Must be validated before proceeding:** The recommendation engine and skill
breakdown are actually useful during the internship, not just structurally
correct.

---

## Phase 5 — Supabase Backend + Authentication + Data Migration ✅ (structurally complete)

**Objective:** Move from a browser-only local prototype to real persistent
architecture — per-user cloud storage with authentication — while keeping
static curriculum (topics, paths, quizzes, tickets, investigation scenarios,
team definitions) as application code, not a CMS.

**Delivered:** A Supabase-backed cloud layer that sits *alongside* every
Phase 1-4 `localStorage` key, never replacing it. Email+password
**authentication** (`/login`, `/signup`, no SSO/magic-links/org accounts) via
`AuthProvider` (`lib/auth/AuthProvider.tsx`), with friendly error messages,
loading/disabled states, and a Nav that shows Sign In/Create Account (signed
out), an account indicator + Sign Out (signed in), or an amber **Local Demo
Mode** badge when no Supabase project is configured. **8 tables**
(`profiles`, `learning_progress`, `quiz_attempts`, `investigation_progress`,
`investigation_completions`, `daily_logs`, `cv_achievements`,
`team_checklist_progress`) defined in `supabase/migrations/0001_init.sql`,
every one with **Row Level Security** enabled and `auth.uid() = user_id` (or
`= id` for `profiles`) policies for select/insert/update/delete — no table is
reachable by any other user's rows, and the browser only ever holds the
public anon key.

**Local Demo Mode is first-class, not a fallback bolted on**: with no
`NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` configured, the app
behaves exactly as it did at the end of Phase 4 — pure `localStorage`, zero
network calls, zero crashes. Every domain hook (`useLearningProgress`,
`useQuizAttempts`, `useInvestigationProgress`, `useTeamChecklist`,
`useDailyLogEntries`, `useCvAchievements`) keeps its Phase 1-4 external API
unchanged and internally branches on `isConfigured && !!user`: signed out or
unconfigured → pure local (identical to before); signed in → fetches cloud
data on mount (cloud becomes authoritative), and every write updates local
state optimistically *and* writes through to Supabase in the background,
surfacing a friendly (never raw-Postgres) `SyncErrorNotice` on failure without
ever clearing what the learner just did. A thin **repository layer**
(`lib/repositories/`) is the only code that talks to Supabase directly — no
component queries the database itself.

**Legacy `localStorage` migration** (`lib/migration.ts`) runs once per user,
right after their first sign-in: reads all 7 legacy keys (`learning-topic-progress`,
`quiz-attempts`, `investigation-progress`, `investigation-completions`,
`daily-log-entries`, `cv-achievements`, the three `checklist-<teamId>` keys)
directly, safely (malformed JSON never crashes it), and bulk-upserts whatever
it finds into the matching tables — idempotent because every upsert targets
the same natural key the app already uses as a record id (topic/quiz/scenario
id, or the client-generated entry id). A `local_migration_version` column on
`profiles` — checked explicitly, never inferred from "does the cloud table
have rows" — prevents re-running for an already-migrated user while still
correctly recognizing a legitimately empty account. `localStorage` is never
cleared after migration; it keeps working as the optimistic cache described
above. The learner sees a one-line, dismissible banner ("Your existing local
progress has been synced to your account" / "...but some legacy records could
not be imported") — never a stack trace.

**No duplicate derived state**: skill/readiness calculations (Phase 4) are
untouched — they still compute purely from the same three evidence sources,
now optionally cloud-backed rather than local-only. No "skill score" or
"readiness score" is ever written to Supabase.

**Major risks (as anticipated):** None of the actual remote-Supabase behavior
(sign-up, sign-in, RLS enforcement, migration against a live table) has been
tested against a real project in this environment — see
`docs/SUPABASE-SETUP.md` for the exact verification steps Nicolas needs to run
himself after connecting a real project. Hand-written `database.types.ts`
(no real project to run `supabase gen types` against yet) could drift from
the SQL if either is edited without the other — both are kept in the same
commit and cross-referenced in comments to reduce that risk.

**Must be validated before proceeding:** A real Supabase project is connected
and the full checklist in `docs/SUPABASE-SETUP.md` / the Phase 5 report passes
— sign-up, sign-in, cross-device investigation resume, migration banner, and
RLS isolation between two accounts.

---

## Phase 6 — AI Tutor ✅ (structurally complete)

**Objective:** An AI-assisted layer for Q&A, personalized explanations, and
coaching, grounded in the app's own curriculum — never a generic unrestricted
chatbot, never a source of invented DHL-specific facts.

**Delivered:** A server-mediated **AI Tutor** (`/tutor`) backed by the
Anthropic API (`claude-sonnet-5` by default, configurable via
`ANTHROPIC_MODEL`), called only from a Next.js Route Handler
(`src/app/api/tutor/route.ts`) — `ANTHROPIC_API_KEY` never reaches the
browser (verified against the production build output). A thin provider
abstraction (`lib/ai/provider.ts` / `anthropic.ts`) means a future second
provider wouldn't require rewriting the Tutor UI. **Grounding is
deterministic** (`lib/ai/tutorContext.ts`): keyword/id matching against the
existing 56-topic Learn library, capped at 6 topics per request — no
embeddings, no vector database, no external RAG. A centrally managed system
prompt (`lib/ai/tutorPrompt.ts`) enforces curriculum-vs-general-knowledge
labeling, forbids inventing DHL-specific facts or absolute team-ownership
claims, and implements **7 trusted modes** (`tutor`, `topic-tutor`,
`quiz-coach`, `quiz-review`, `investigation-coach`, `investigation-review`,
`progress-coach`) always set by the application link that opened the Tutor,
never inferred from free text. Coach modes never reveal a quiz's correct
answer or an investigation's hidden root cause/outcome — enforced by
instruction and, for investigations, by the outcome text simply not being
sent to the model until review mode. Quiz-review context is resolved
server-side from static quiz data, so a client can only supply which options
it selected, never arbitrary "explanation" text.

**Privacy**: the Tutor automatically receives only grounded curriculum text
and a minimal progress summary (completed ids, skill levels — never free
text); it never automatically receives Daily Log entries, CV Achievement
text, or the learner's name/email — see `docs/AI-TUTOR.md`'s privacy/trust
boundary section for the full data-flow writeup, including the one
documented exception (investigation coach/review status fields are capped
and validated but not re-verified against a server-side record).

**Integrated throughout**, all via a single reusable `AskTutorLink`
component so no page duplicates a chat interface: Learn topic pages ("Ask
Tutor about X"), an active quiz question ("Ask Tutor for a hint"), the
post-submission answer review ("Explain with AI" per question), an active
Advanced Investigation ("Ask Tutor (Coach)"), a completed investigation's
results ("Ask Tutor to explain this"), `/progress`'s recommendations
("Ask Tutor to explain my recommendations"), and a Dashboard card. **Local
Demo Mode is preserved**: without `ANTHROPIC_API_KEY`, `/tutor` shows "not
configured" and every other page works exactly as before.

**Conversation persistence**: one lightweight running conversation per
learner (`lib/tutorConversation.ts`), the same dual-mode
local-first/cloud-authoritative-when-signed-in pattern as every Phase 5
hook, backed by two new RLS-protected Supabase tables
(`supabase/migrations/0002_tutor.sql`). Only visible messages are ever
stored — never system prompts, API keys, or hidden model reasoning.

**Major risks (as anticipated, and how they were addressed):**
Hallucinated "facts" presented as confirmed — mitigated by the grounding
strategy and system prompt's explicit curriculum-vs-general-knowledge
labeling rule, though this remains a prompting-level control, not a
guarantee (documented plainly in `docs/AI-TUTOR.md`, not oversold). API cost
— mitigated by a modest-cost default model, capped output tokens, capped
conversation history, prompt caching on the stable system-prompt block, and
a best-effort in-memory rate limit (documented as not production
infrastructure). CV tracker honesty — unaffected, since Phase 6
deliberately does not touch the CV Achievement flow at all.

**Not live-tested against a real Anthropic API key** in this development
environment (none was available) — the request/response plumbing,
validation, error paths, and "not configured" UI were verified without a
live key. See `docs/AI-TUTOR.md`'s manual browser test list for what Nicolas
should verify once a real key is configured.

**Must be validated before proceeding:** A real Anthropic API key is
configured and the manual browser test list in `docs/AI-TUTOR.md` passes —
grounded answers, coach-mode non-disclosure, quiz/investigation review
explanations, and cloud conversation persistence.

---

## Phase 7 — Business / Logistics Learning ✅ (complete)

**Objective:** Add generic business/logistics context on top of the IT-focused
curriculum — connecting the technical concepts already taught to the business
processes and operational impact they actually support — using only public or
generic industry information, never DHL-internal specifics.

**Delivered:** A 6th Learn category, **Business & Logistics** (24 topics,
bringing the library to **80 topics** across 6 categories), covering three
areas: enterprise business foundations (business process, operational
workflow, customer journey, internal-vs-customer-facing systems,
business-critical applications, operational dependency, business continuity,
digital transformation, automation, operational KPIs), generic
freight-forwarding/logistics foundations (logistics, supply chain, freight
forwarding, the shipment lifecycle, transport modes, shipping parties,
customs clearance, warehouse operations, shipment visibility/tracking,
last-mile delivery, shipping documentation, exception management), and
explicit IT-to-business translation (technology-in-logistics, mapping core IT
concepts — network, database, API, auth, monitoring, high availability,
backup/DR — onto the concrete business function each one supports; and
technical-business-translation, practicing the technical-symptom → affected
system → affected process → operational-impact chain). A 7th Learning Path,
**Business & Logistics Foundations**, plus a Foundation Assessment quiz (13
scenario-based questions) and a path checkpoint quiz (8 questions) were added
following the exact same architecture as every earlier Learn/Quiz category —
no new patterns introduced. A handful of reciprocal `relatedTopicIds` links
were added from existing IT topics (Priority & Business Impact, Escalation, System
Integration, Monitoring, High Availability) back to the new category, mirroring
the reciprocal-linking precedent set in Phase 2C.

Two new **business-impact-framed Advanced Investigations** were added
(`lib/data/investigations/`): a customer-facing shipment-tracking outage where
the technical fault (an expired integration API key) is simple but the
learner must reason about business impact (an organization-wide customer
visibility problem despite a small internal cause), and a customs
documentation delay where a single "stuck shipment" turns out to be a
systemic booking-form bug affecting several shipments — practicing revising
an initial impact assessment as evidence evolves, and resolving an immediate
case without skipping the escalation needed to protect everyone else
affected. Both follow the same evidence-graph/scoring architecture as the
original 8 Phase 3 scenarios (bringing the total to **10**), and are counted
identically by the skill/readiness engine.

Business & Logistics was added as a **7th skill** (`business-logistics` in
`SKILL_IDS`) using the exact same 30/30/40 derived-evidence model as every
other skill — no new scoring logic. It was also added to the "cross-team"
recommended-learning categories (alongside IT Service Management and Security
Fundamentals) on every Team page, since business/logistics context is equally
relevant regardless of which team a system sits in.

A small, clearly-labeled, gated `CompanyContext` scaffold
(`lib/data/companyContext.ts`, one instance, one `getCompanyContext()`
accessor) separates the current internship's organization name and a couple
of generic public facts from the company-agnostic curriculum — rendered only
in Local/Private mode (`PRODUCT_DISPLAY_MODE === "private"`, see
`lib/product.ts`) via a small Dashboard card, and never present in a future
public build. Actual personal observations are never duplicated into it —
they continue to render live from Daily Log entries, unchanged from Phase 1.

No new architecture was introduced: the AI Tutor's deterministic grounding
(`lib/ai/tutorContext.ts`), `/learn`'s search and category filter, and the
`/quizzes` foundation/checkpoint split all picked up the new content
automatically, since none of them hardcode a category or quiz list — this was
verified with a live Anthropic API call during this phase (a first for the
project; Phases 5/6 had only been verified structurally), which correctly
grounded a freight-forwarder-vs-carrier question against the new
`freight-forwarding`/`shipping-parties`/`transport-modes` topics.

**Major risks (as anticipated, and how they were addressed):** Drifting into
DHL-specific claims not actually confirmed — every topic, quiz question, and
investigation scenario is generic/fictional by construction, consistent with
the rest of the curriculum, and the new `CompanyContext` scaffold keeps the
one piece of real personal context (an organization name already recorded in
`internshipState.ts`) clearly separated and privately gated rather than
blended into the generic content. Scope creep beyond IT into general business
content — held to a business/logistics *lens on the same IT concepts already
taught*, not a general business curriculum; every topic connects back to a
concrete IT concept, system, or troubleshooting habit.

**Must be validated before proceeding:** The Business & Logistics path and
new investigations are actually used during the internship, not just built
once as a proof of concept.

---

## Phase 8 — Analytics / Manager View ✅ (structurally complete)

**Objective:** A read-only view suitable for showing a manager or mentor a summary of
learning progress (not raw personal journal entries).

**Delivered:** A **reporting layer** (`src/lib/analytics/`) over training
activity already built in Phases 2-4 — every function pure and derived from
the same three evidence sources `skillProgress.ts`/`recommendations.ts`
already read, never a second stored score. Three new routes: **`/analytics`**
(Training Overview counts, per-skill cards reusing the existing `SkillCard`
plus a recommended next action, per-quiz score trends with a small inline-SVG
sparkline, investigation results grouped into strongest/focus areas by Learn
category, learning path progress with checkpoint results, a structured
activity timeline, and weekly activity counts), **`/analytics/summary`** (a
concise, printable summary — strongest/focus areas, recent activity,
`window.print()` + print CSS, no server-side PDF generation), and
**`/manager-preview`** (a read-only preview of the signed-in learner's own
data — explicitly labeled as not a real multi-user manager account, never
queries another user's data, never touches RLS). The summary and manager
preview both build from one shared `computeTrainingSummary()` bundle so their
numbers always agree. `/progress` ("what should I learn next?") and
`/analytics` ("what have I done?") stay deliberately distinct — both call the
same Phase 4 `calculateAllSkillProgress()`/`getRecommendations()` rather than
each computing a second version.

The Activity Timeline is built only from genuinely timestamped records (quiz
attempts, investigation completions) — Learn topic completions are
deliberately excluded from it (not from aggregate counts) because the current
data model has no per-topic completion timestamp exposed to the client, and
Phase 8 doesn't invent one (see `docs/ANALYTICS.md`). Privacy exclusions
(Daily Log, CV Achievement, Tutor conversation content) are enforced by
construction — no Phase 8 file imports those hooks at all, not just a runtime
filter — with a visible disclaimer on every page stating the boundary. Zero
Supabase schema changes. The AI Tutor integration reuses the existing
`progress-coach` mode rather than adding a new one. A small, dependency-free
`pureCalculations.ts` module (trend direction, ISO-week bucketing, averaging)
mirrors the Phase 1-7 regression fix's `mergeCloudState.ts` pattern — zero
`@/`-aliased imports, so it's genuinely unit-tested with Node's built-in test
runner.

**Major risks (as anticipated, and how they were addressed):** Accidentally
exposing raw, unfiltered personal notes — avoided structurally, not by a
runtime filter (see above). Privacy boundary mistakes between "my journal"
and "what I'd show someone else" — every analytics/summary/preview page
carries a visible, explicit disclaimer naming exactly what's excluded, per
Part L's "make the boundary visible" requirement, not just true in code.

**Must be validated before proceeding:** Real interest from a manager/mentor in
seeing this, not a speculative feature; and — since this phase's own live
browser testing wasn't possible in the development environment — the manual
interactive checks in the Phase 8 completion report should be run once, the
same way Phase 5/6's live-testing checklists were deferred to Nicolas.

---

## Phase 9 — Enterprise Pilot Readiness ✅ (structurally complete)

**Objective:** Prepare the product to be proposed as a real pilot to DHL or another
company — as a tool, not yet as certified production software.

**Delivered:** A **pilot-facing layer** (`/pilot`, `/pilot/demo`,
`/pilot/readiness`, `/pilot/report`) explaining the product's value
proposition, intended users, and potential company use — never claiming DHL
endorsement, official DHL training, real DHL system access, or certification.
A lightweight **Training Assignment** model (`src/lib/data/assignments.ts`,
4 static templates: Enterprise IT Intern Foundation, Infrastructure &
Network Foundation, Applications Support Foundation, Business & Logistics
Technology Foundation) bundles required learning paths, assessments, and
investigations; a learner activates one for themselves (`/assignments`,
stored locally via `useSelectedAssignment` — deliberately not a new Supabase
table) and sees derived completion against the required list only
(`src/lib/assignmentProgress.ts`) — never a new competency score, distinct
from `SkillProgress`. A minimal **onboarding flow** (`/onboarding`: goal,
focus area, experience level — no employer/salary/age collected) suggests a
starting assignment via a deterministic, no-AI mapping
(`src/lib/onboarding.ts`). The existing deterministic recommendation engine
(`lib/recommendations.ts`) gained one additive, optional signal — an active
assignment's next required activity is surfaced first — without any rewrite;
the AI Tutor's progress summary optionally includes the active assignment
title and onboarding focus area (validated server-side against real static
data, same trust-boundary pattern as every other Tutor context field).
`/manager-preview` and the new `/pilot/report` both gained a "Current
Training Assignment" section reusing the same `computeAssignmentProgress()`
derivation. A **Privacy & Data Safety page** (`/privacy`) plainly explains
what's stored, what's deliberately never collected, and the AI Tutor's data
boundary — a product-level explanation, not a fabricated legal policy. A
reusable **Pilot Proposal** document (`dhl-training-hub/docs/PILOT-PROPOSAL.md`)
describes a suggested small pilot (5-15 users, 2-4 weeks) and success signals
to observe — explicitly no quantified ROI claims and no pricing.

**Major risks (as anticipated, and how they were addressed):** Presenting a
prototype as more production-ready than it is — mitigated by keeping
`/pilot/readiness` honest and self-assessed (it checks Supabase/AI Tutor
configuration live rather than asserting readiness, and explicitly lists
enterprise gaps: no SSO, no multi-tenancy, no admin console, no trainer
assignment-management tooling). Scope creep into full multi-tenancy or a
company-management feature — avoided; there is exactly one "current
assignment" preference per learner, no organization accounts, and
`CompanyContext` remains the single, hand-edited Phase 7 scaffold.

**Must be validated before proceeding:** Genuine interest from a sponsor/stakeholder;
legal/IP clarity on using "DHL" in any pitch context; `ENTERPRISE-READINESS.md`
items have at least a plan, even if not implemented; the pilot pages and
Training Assignment flow are actually walked through with a real
manager/trainer, not just built once as a proof of concept.

---

## Phase 10 — Final QA, Polish, Deployment & Portfolio Readiness ✅ (complete — final phase)

**Objective:** Take Phases 1-9 and make the product stable, polished,
consistent, presentation-ready, portfolio-ready, GitHub-ready, and deployment-
ready — a finalization pass, never a new feature phase. **Phase 10 is the
last planned phase of this project.**

**Delivered:** A full QA audit across every route (navigation, accessibility,
design consistency, terminology, dashboard hierarchy) found and fixed a small
set of concrete issues — four pages missing a page-level `<h1>`
(`SectionHeading` gained an optional `level` prop rather than a second
component), and two Dashboard cards rendering the same three counts
side by side (merged into one). Navigation (`src/components/Nav.tsx`) was
regrouped from a flat 12-link list into four labeled sections with a proper
mobile hamburger panel, replacing wrap-only mobile behavior. A full read-only
security/privacy audit (secrets in git history and tracked files,
`.gitignore`, the Anthropic key server/client boundary, RLS on all 10
Supabase tables, the Phase 8/9 privacy exclusions, and a scan of
ticket/investigation/journal content) and a separate persistence/analytics/
assignment/Tutor correctness audit (verifying the Phase 1-7 merge-not-replace
fix, `a8e9566`, is still followed everywhere, and that no analytics value can
produce NaN, double-count, or fabricate a timestamp) both passed cleanly —
**no code defects were found in either audit**, only the UI/nav issues above.
Four new docs were added
(`dhl-training-hub/docs/DEMO-SCRIPT.md`, `PORTFOLIO-STORY.md`,
`SCREENSHOTS.md`, `DEPLOYMENT.md`) covering a real demo script (with a
separately-framed internship-manager version), interview/CV/portfolio
material built from factual counts recomputed during this phase, an exact
screenshot shot list, and deployment steps/environment variables/post-deploy
smoke tests for a future Vercel deployment (no deployment was actually
performed). `README.md` gained explicit Problem, Architecture, AI Tutor
Architecture, Data/Privacy Architecture, and Testing sections. `npm run
build`, `npm run lint`, and `npm test` (14/14) were all already clean before
Phase 10 started and remained clean after every change; `npm audit` reported
0 vulnerabilities throughout. Available dependency upgrades (including a safe
patch-level Next.js bump) were identified via `npm outdated` and deliberately
left alone, per this phase's stability-over-latest-versions brief.

**Major risks (as anticipated, and how they were addressed):** Turning a
finalization phase into unplanned feature work — avoided; every change in
this phase is traceable to a specific audit finding, not a new idea. Treating
"builds and lints cleanly" as sufficient QA — avoided by running actual route
smoke tests against a production server build, reading the persistence/merge
code directly rather than trusting it, and being explicit about which checks
(live multi-device Cloud Mode sync, a real Anthropic API call, actual browser
rendering) still require Nicolas's manual verification, since no browser-
automation tooling exists in this environment.

**Must be validated before considering the project "done":** Nicolas runs the
manual browser regression list from the Phase 10 completion report (in both
Local Demo Mode and, if a Supabase project is configured, Cloud Mode
including sign-out/sign-in on a second device) — code-level correctness was
verified this phase, but live browser behavior under real network timing
was not.

**What comes after Phase 10:** Nothing numbered. `ENTERPRISE-READINESS.md`
still holds the full list of what real enterprise-grade production readiness
would require (SSO, RBAC, encrypted storage, audit logging, a formal security
review, and everything else in that document) — unimplemented, and only
worth pursuing if a real pilot ever validates demand. It is deliberately not
called "Phase 11": this project's phase sequence ends at Phase 10.
