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
2. **Learn** — a 56-topic enterprise IT learning library across five categories
   (IT Service Management, Infrastructure, Networking, Applications, Security
   Fundamentals — foundational enterprise security awareness for IT staff, not a
   cybersecurity specialist course), each lesson following a consistent structure
   (learning outcomes, what is it, ELI10, technical explanation, business purpose,
   common problems, troubleshooting approach, team connection, university
   connection, practice scenario, question to ask at work, related topics/tickets
   — plus optional recommended prerequisites and "don't confuse this with"
   callouts where genuinely useful). Includes 6 curated Learning Paths, search
   (title/description/category/keyword), category/team/level filtering, a
   deterministic "continue learning" suggestion, and persisted completion tracking
3. **Team Explorer** — Infrastructure / Applications / Support & Network pages, each
   split into general enterprise IT knowledge vs. personally observed facts, plus
   recommended learning, common training tickets (split into likely-owner vs.
   cross-team scenarios), questions to ask, and open learning prompts
4. **Ticket Simulator** — two tiers. **Quick Practice**: 34 fake IT tickets to
   triage, prioritize, and troubleshoot. **Advanced Investigations**: 8
   branching, multi-step scenarios where evidence evolves as you investigate —
   assess business impact, ask diagnostic questions, hold and revise a
   hypothesis, gather evolving evidence, resolve or escalate, verify, and
   document, with a persisted investigation timeline and training-only
   performance feedback. Both tiers are cross-linked with the Team Explorer and
   the Learn library
5. **Knowledge Assessments** — 12 scenario-based quizzes (6 Foundation
   Assessments, one per skill area, plus 6 Learning Path checkpoints; 99
   questions total) testing applied judgment, not definitions, with detailed
   answer review, best/latest score tracking, and unlimited retakes
6. **Training Progress** — a `/progress` page showing an explainable, derived
   (never separately stored) training indicator across 6 skills, combining
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

See `CLAUDE.md` for full project rules (confidentiality, methodology, scope),
`internship-plan.md` for the current learning state, and `PRODUCT-ROADMAP.md` /
`ENTERPRISE-READINESS.md` for what comes next.

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

## Future roadmap (not built yet)

Phase 2 (the Learning Engine), Phase 3 (the Advanced Investigations branching
simulator), Phase 4 (Quizzes + Skill/Readiness Tracking), Phase 5 (Supabase
backend + auth + data migration), and Phase 6 (AI Tutor) are now complete.
Briefly, in rough order for what's next: business/logistics learning content,
a manager/mentor-facing progress view, and — much later — real enterprise
pilot/production readiness. See `PRODUCT-ROADMAP.md` for the full
phase-by-phase breakdown and `ENTERPRISE-READINESS.md` for what a real
corporate deployment would eventually require.

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
