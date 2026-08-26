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
