# DHL IT Training Hub

*(Public/GitHub/commercial name if ever shared: **Enterprise IT Training Lab**)*

Built by Nicolas Issa (MEng Computer Science with Artificial Intelligence, University
of Leeds) during an internship in DHL Dubai's IT/BPU department.

> **This is NOT an official DHL application.** It has no affiliation with DHL, copies
> no DHL branding, internal systems, or confidential documentation, and contains no
> real DHL data. All tickets, scenarios, and examples are fake and generic, built for
> personal training purposes only. This is an early product foundation, not
> enterprise-production-ready software — see `ENTERPRISE-READINESS.md`.
>
> As of Phase 5, the app optionally supports real accounts and cloud sync via
> Supabase — but works with **zero setup** in Local Demo Mode (pure browser
> storage, no account, no network calls) if you don't connect one. See
> `dhl-training-hub/docs/SUPABASE-SETUP.md` to enable accounts.
>
> As of Phase 6, the app optionally includes an AI Tutor grounded in this
> app's own curriculum — also **zero setup required**: without an Anthropic
> API key, `/tutor` just shows "not configured" and every other page is
> unaffected. See `dhl-training-hub/docs/AI-TUTOR.md`.

## The problem

Internships are easy to passively observe and hard to actively learn from —
concepts get explained once, terminology comes up faster than it can be
absorbed, and there's rarely a structured way to test whether something
actually stuck. This project exists to close that gap for one intern (me):
turn day-to-day exposure to enterprise IT into structured lessons, realistic
troubleshooting practice, and honest, self-assessed progress tracking —
without ever needing (or storing) any real confidential company information
to do it.

## What this product is

A personal enterprise IT learning and internship training platform: an **Internship
Dashboard + Enterprise IT Training Simulator + Learning Journal + CV Achievement
Tracker**, covering three generic enterprise IT team types:

- **Infrastructure** — servers, cloud, VMs, storage, identity, backups, monitoring, DR
- **Applications** — business apps, APIs, databases, integrations, deployments, auth
- **Support & Network** — tickets, escalation, SLA, Wi-Fi, LAN/WAN, VPN, DNS, DHCP

## Current features

1. **Dashboard** — current day/team (from one shared internship state), goals,
   questions, practice exercise, quick notes, reflection
2. **Learn** — an 80-topic enterprise IT (and business context) learning library
   across six categories (IT Service Management, Infrastructure, Networking,
   Applications, Security Fundamentals — foundational enterprise security
   awareness for IT staff, not a cybersecurity specialist course — and Business
   & Logistics — generic business/freight-forwarding context connecting IT
   concepts to the business processes they support), each lesson following a
   consistent structure (learning outcomes, what is it, ELI10, technical
   explanation, business purpose, common problems, troubleshooting approach,
   team connection, university connection, practice scenario, question to ask
   at work, related topics/tickets — plus optional recommended prerequisites
   and "don't confuse this with" callouts where genuinely useful). Includes 7
   curated Learning Paths, search (title/description/category/keyword),
   category/team/level filtering, a deterministic "continue learning"
   suggestion, and persisted completion tracking
3. **Team Explorer** — Infrastructure / Applications / Support & Network pages, each
   split into general enterprise IT knowledge vs. personally observed facts, plus
   recommended learning, common training tickets (split into likely-owner vs.
   cross-team scenarios), questions to ask, and open learning prompts
4. **Ticket Simulator** — two tiers. **Quick Practice**: 34 fake IT tickets to
   triage, prioritize, and troubleshoot. **Advanced Investigations**: 10
   branching, multi-step scenarios where evidence evolves as you investigate —
   assess business impact, ask diagnostic questions, hold and revise a
   hypothesis, gather evolving evidence, resolve or escalate, verify, and
   document, with a persisted investigation timeline and training-only
   performance feedback. Both tiers are cross-linked with the Team Explorer and
   the Learn library
5. **Knowledge Assessments** — 14 scenario-based quizzes (7 Foundation
   Assessments, one per skill area, plus 7 Learning Path checkpoints; 120
   questions total) testing applied judgment, not definitions, with detailed
   answer review, best/latest score tracking, and unlimited retakes
6. **Training Progress** — a `/progress` page showing an explainable, derived
   (never separately stored) training indicator across 7 skills, combining
   completed lessons, assessment results, and Advanced Investigation
   performance, plus a deterministic (no AI) recommendation engine — an
   educational progress indicator, explicitly not a validated measure of
   professional competence
7. **Daily Log** — structured journal + "questions to ask" reference per team
8. **CV Achievement Tracker** — honest, non-exaggerated CV bullet building with an
   involvement scale (Observed → Implemented) and wording-vs-level validation
9. **AI Tutor** (`/tutor`, optional) — a grounded enterprise IT tutor, not a
   general-purpose chatbot: deterministically retrieves relevant Learn topics
   for each question, distinguishes curriculum-supported facts from general
   knowledge, never invents DHL-specific facts, coaches (rather than reveals
   answers) during active quizzes/investigations, and can explain quiz
   mistakes, investigation feedback, and this app's own progress
   recommendations. Works with **zero setup** — without an Anthropic API key,
   the page just says so and every other feature is unaffected. See
   `dhl-training-hub/docs/AI-TUTOR.md`.
10. **Training Analytics** (`/analytics`) — a reporting layer over activity
    that already exists elsewhere in the app (never a second stored score):
    an overview of topics/paths/quizzes/investigations completed, per-skill
    cards with a recommended next action, per-quiz score trends, investigation
    results grouped into strongest/focus areas, learning path progress, and a
    structured activity timeline built only from genuinely timestamped
    records. `/analytics/summary` is a concise, printable summary;
    `/manager-preview` is a read-only preview of your own data labeled
    exactly as that — not a real multi-user manager feature. Both explicitly
    exclude Daily Log, CV Achievement, and Tutor conversation content. See
    `dhl-training-hub/docs/ANALYTICS.md`.

11. **Training Assignments** (`/assignments`) — 4 static, config-driven
    templates (Enterprise IT Intern Foundation, Infrastructure & Network
    Foundation, Applications Support Foundation, Business & Logistics
    Technology Foundation), each bundling required learning paths, assessments,
    and investigations. A learner can activate one for themselves and see
    completion against its required list — never a new competency score, and
    not organization-wide manager functionality. An `/onboarding` flow (goal,
    focus area, experience level — no employer/salary/age collected) suggests
    a starting template via a deterministic, no-AI mapping.
12. **Pilot pages** (`/pilot`) — a product-oriented landing page explaining the
    problem/solution/intended users/potential company use, a guided product
    tour (`/pilot/demo`), a Pilot Report (`/pilot/report`, an
    assignment-centric structured summary), and an honest Pilot Readiness
    checklist (`/pilot/readiness`). Never claims DHL endorsement, official DHL
    training, or certification — see `CLAUDE.md`'s Phase 9 section.
13. **Privacy & Data Safety** (`/privacy`) — a plain-English explanation of
    what's stored, what's deliberately never collected, and exactly what
    automatically reaches the AI Tutor.

See `CLAUDE.md` for full project rules (confidentiality, methodology, scope),
`internship-plan.md` for the current learning state, and `PRODUCT-ROADMAP.md` /
`ENTERPRISE-READINESS.md` for what comes next.

## Pilot concept

This product is being developed with an eventual **pilot proposal** in mind —
see `/pilot` in the running app and
[`dhl-training-hub/docs/PILOT-PROPOSAL.md`](dhl-training-hub/docs/PILOT-PROPOSAL.md)
for a reusable pilot description (suggested cohort size, duration, and success
signals — deliberately no ROI claims or pricing). `/pilot/readiness` is an
honest, self-assessed checklist of what's ready and what isn't before any real
pilot could start.

## Screenshots

_Not yet added._ See
[`dhl-training-hub/docs/SCREENSHOTS.md`](dhl-training-hub/docs/SCREENSHOTS.md)
for the exact shot list (route, what should be visible, what to remove first)
— a walkthrough covering Dashboard → Learn → Advanced Investigation → Quiz
results → Progress/Analytics → AI Tutor → Manager Preview → Pilot would go
here once captured.

## Architecture

Next.js App Router, entirely client-rendered: every page is a client
component that hydrates its own state after mount, so there's no
server-rendered personalized content and no session-refreshing middleware to
maintain. Storage is **local-first, optionally cloud-backed**: every piece of
user-generated data (learning progress, quiz attempts, investigation state,
daily log, CV achievements, tutor conversations) lives in the browser's
`localStorage` first, and — only once a Supabase project is configured and
the learner signs in — also syncs to Postgres behind real authentication and
Row Level Security. A thin repository layer
(`dhl-training-hub/src/lib/repositories/`) is the only code that talks to
Supabase directly; every page calls a domain hook instead. Cloud sync
**merges** with local state rather than replacing it outright
(`dhl-training-hub/src/lib/mergeCloudState.ts`) — an earlier version of this
app had a race condition where a cloud fetch could silently overwrite a
just-saved local change, fixed in commit `a8e9566` and covered by unit tests
ever since. See `CLAUDE.md`'s Phase 5 section for the full write-up, and
[`dhl-training-hub/docs/PORTFOLIO-STORY.md`](dhl-training-hub/docs/PORTFOLIO-STORY.md)
for the fuller story of that bug and fix.

Static curriculum (Learn topics, quizzes, tickets, investigation scenarios,
team/skill/assignment definitions) is application code, not a CMS — every
content set is validated at build time by a small custom validator that fails
the build on a duplicate ID, a dangling reference, or an unreachable
investigation graph node.

## AI Tutor architecture

An optional, curriculum-grounded assistant — not a general-purpose chatbot.
Retrieval is deterministic keyword/ID matching against the Learn library (no
embeddings, no vector database), capped at 6 topics per request, called only
from a server-only Next.js Route Handler so the Anthropic API key never
reaches the browser. Seven trusted "modes" (general tutor, topic tutor, quiz
coach, quiz review, investigation coach, investigation review, progress
coach) are always set by which link the learner clicked, never inferred from
free text — this matters because coach modes have a hard rule: the correct
quiz answer or an investigation's hidden outcome is structurally excluded
from what's sent to the model in coach mode, not just withheld by
instruction. Full architecture, grounding strategy, privacy trust boundary,
and rate limiting: [`dhl-training-hub/docs/AI-TUTOR.md`](dhl-training-hub/docs/AI-TUTOR.md).

## Data / privacy architecture

See `CLAUDE.md`'s confidentiality rules for the policy; in short:

- No real DHL data, employee/customer names, ticket numbers, internal
  URLs/IPs, or credentials are ever entered, stored, or generated anywhere —
  all tickets, scenarios, and quiz questions are fictional and generic by
  construction.
- The Analytics, Manager Preview, and Pilot Report pages never import the
  Daily Log or CV Achievement hooks at all — the privacy boundary is enforced
  structurally (there's no free-text content available to leak), not by a
  runtime filter. See
  [`dhl-training-hub/docs/ANALYTICS.md`](dhl-training-hub/docs/ANALYTICS.md).
- The AI Tutor never automatically receives Daily Log entries, CV Achievement
  text, or the learner's name/email — see `docs/AI-TUTOR.md`'s trust boundary
  section for exactly what it does receive.
- Every Supabase table has Row Level Security enabled, scoped to
  `auth.uid() = user_id` — the database enforces per-user isolation, not just
  the frontend.
- A plain-English explanation of all of the above lives at `/privacy` in the
  running app.

## Testing

`npm test` runs a small, genuinely dependency-free unit test suite (Node's
built-in test runner) covering the two areas most worth protecting against
silent regression: `dhl-training-hub/src/lib/mergeCloudState.ts` (the
merge-not-replace persistence fix — including a regression test that
reproduces the original overwrite bug) and
`dhl-training-hub/src/lib/analytics/pureCalculations.ts` (trend direction,
ISO-week bucketing, averaging). `npm run lint` and `npm run build` are
expected to stay clean — build-time content validators
(`validateLearningContent`, `validateInvestigations`, `validateQuizzes`,
`validateSkills`) also run automatically on every build and throw on any
broken cross-reference. There is no browser-automation test suite yet — see
each phase's completion notes and
[`dhl-training-hub/docs/DEPLOYMENT.md`](dhl-training-hub/docs/DEPLOYMENT.md)'s
post-deploy smoke test list for the manual regression steps that fill that
gap today.

## Known limitations

- **Local-first prototype.** Cloud sync (Supabase) and the AI Tutor
  (Anthropic) are both optional and unverified against real, live credentials
  in this development environment — see `docs/SUPABASE-SETUP.md` and
  `docs/AI-TUTOR.md` for the manual verification steps once real credentials
  are added.
- **No multi-user manager functionality yet.** Manager Preview and the Pilot
  Report both show only the signed-in learner's own data — there is no
  cross-user aggregation, cohort view, or admin console. See
  `ENTERPRISE-READINESS.md`.
- **Training Assignments and onboarding preferences are stored locally only**
  (not a new Supabase table) — a deliberate Phase 9 scope decision to avoid a
  backend redesign for a lightweight personal preference.
- **Not production-ready.** No SSO, no RBAC, no formal security review, no
  production hosting/monitoring/support model — see `ENTERPRISE-READINESS.md`
  and `/pilot/readiness` for the full, honest list.

## What it is NOT

- Not an official DHL product, and not endorsed by or affiliated with DHL
- Not connected to any real DHL system
- Contains no real ticket data, no real employee/customer data, no internal company
  data of any kind
- No production integrations, no SSO/enterprise auth, no admin/manager portal
- Not enterprise-production-ready — this is a polished early foundation, not a
  finished commercial product

## Current technology

- Next.js (App Router) + React + TypeScript + Tailwind CSS
- Data: static curriculum (topics, paths, quizzes, tickets, investigation
  scenarios, team definitions) lives in application code/config — never a CMS
- Persistence: browser `localStorage` always; optionally Supabase (Postgres +
  Auth) for real accounts and cross-device sync — see **Cloud setup** below.
  With no Supabase project configured, the app runs entirely locally with zero
  setup ("Local Demo Mode")

## Roadmap status

All 10 planned phases are complete: Phase 2 (the Learning Engine), Phase 3
(the Advanced Investigations branching simulator), Phase 4 (Quizzes +
Skill/Readiness Tracking), Phase 5 (Supabase backend + auth + data
migration), Phase 6 (AI Tutor), Phase 7 (Business & Logistics learning),
Phase 8 (Training Analytics / Manager Preview), Phase 9 (Enterprise Pilot
Readiness — pilot pages, Training Assignments, onboarding, and a Privacy/Data
Safety page), and Phase 10 (final QA, polish, deployment readiness, and demo/
portfolio preparation — this document, `docs/DEMO-SCRIPT.md`,
`docs/PORTFOLIO-STORY.md`, `docs/SCREENSHOTS.md`, and `docs/DEPLOYMENT.md`
are its main outputs). **Phase 10 is the last planned phase** — see
`PRODUCT-ROADMAP.md` for the full phase-by-phase breakdown. Real enterprise
production readiness (SSO, RBAC, encrypted storage, audit logging, a formal
security review) remains an unimplemented, unplanned future direction
documented in `ENTERPRISE-READINESS.md`, only worth pursuing if a real pilot
ever validates demand.

## Repository layout

```
CLAUDE.md               project rules & permanent context
internship-plan.md      current internship stage & learning plan
PRODUCT-ROADMAP.md      phase-by-phase product roadmap (Phase 1–10)
ENTERPRISE-READINESS.md what would need to exist before a real corporate deployment
teams/                  reference docs behind the Teams pages
daily/                  daily journal markdown entries
learning/ practice-tickets/ quizzes/ questions/ cv-achievements/
                         reserved for future phases
dhl-training-hub/        the Next.js application
  docs/SUPABASE-SETUP.md          step-by-step cloud setup guide
  docs/AI-TUTOR.md                AI Tutor architecture, grounding, privacy, setup
  docs/ANALYTICS.md               Analytics architecture, source data, privacy (Phase 8)
  docs/PILOT-PROPOSAL.md          reusable pilot description (Phase 9)
  docs/DEMO-SCRIPT.md             5-minute demo script + internship-manager demo (Phase 10)
  docs/PORTFOLIO-STORY.md         interview answers, CV bullets, GitHub/LinkedIn copy (Phase 10)
  docs/SCREENSHOTS.md             exact screenshot shot list for the README (Phase 10)
  docs/DEPLOYMENT.md              env vars, Supabase/Vercel setup, smoke tests (Phase 10)
  supabase/migrations/0001_init.sql  database schema + Row Level Security
  supabase/migrations/0002_tutor.sql tutor conversation schema + RLS (Phase 6)
  .env.example                    env vars needed for cloud mode / AI Tutor
```

## Running the app

```bash
cd dhl-training-hub
npm install   # first time only
npm run dev
```

Then open http://localhost:3000 — this works immediately with **zero setup**,
in Local Demo Mode (pure browser storage, no account).

## Cloud setup (optional)

To enable real accounts and cross-device sync instead of Local Demo Mode, see
[`dhl-training-hub/docs/SUPABASE-SETUP.md`](dhl-training-hub/docs/SUPABASE-SETUP.md)
for the full step-by-step guide (create a Supabase project, run the SQL
migration, configure `.env.local`). Existing local progress is migrated to
your account automatically the first time you sign in.

## AI Tutor setup (optional)

To enable the AI Tutor instead of the "not configured" message, see
[`dhl-training-hub/docs/AI-TUTOR.md`](dhl-training-hub/docs/AI-TUTOR.md) —
set `ANTHROPIC_API_KEY` in `.env.local` (a separate credential from a Claude
Code / Claude.ai subscription). Everything else in the app works identically
with or without it.
