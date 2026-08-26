# DHL IT Training Hub

*(Public/GitHub/commercial name if ever shared: **Enterprise IT Training Lab**)*

Built by Nicolas Issa (MEng Computer Science with Artificial Intelligence, University
of Leeds) during an internship in DHL Dubai's IT/BPU department.

> **This is NOT an official DHL application.** It has no affiliation with DHL, copies
> no DHL branding, internal systems, or confidential documentation, and contains no
> real DHL data. All tickets, scenarios, and examples are fake and generic, built for
> personal training purposes only. This is an early product foundation, not
> enterprise-production-ready software — see `ENTERPRISE-READINESS.md`.

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
5. **Daily Log** — structured journal + "questions to ask" reference per team
6. **CV Achievement Tracker** — honest, non-exaggerated CV bullet building with an
   involvement scale (Observed → Implemented) and wording-vs-level validation

See `CLAUDE.md` for full project rules (confidentiality, methodology, scope),
`internship-plan.md` for the current learning state, and `PRODUCT-ROADMAP.md` /
`ENTERPRISE-READINESS.md` for what comes next.

## What it is NOT

- Not an official DHL product, and not endorsed by or affiliated with DHL
- Not connected to any real DHL system
- Contains no real ticket data, no real employee/customer data, no internal company
  data of any kind
- No production integrations, no authentication, no backend database (yet)
- Not enterprise-production-ready — this is a polished early foundation, not a
  finished commercial product

## Current technology

- Next.js (App Router) + React + TypeScript + Tailwind CSS
- Data: local mock data files + browser `localStorage` (no database, no auth, no
  external API calls, no deployment)

## Future roadmap (not built yet)

Phase 2 (the Learning Engine, including Security Fundamentals) and Phase 3 (the
Advanced Investigations branching simulator) are now complete and frozen.
Briefly, in rough order for what's next: daily quizzes, skill tracking, a
persistent backend, an AI tutor, and — much later — real enterprise
pilot/production readiness. See `PRODUCT-ROADMAP.md` for the full phase-by-phase
breakdown and `ENTERPRISE-READINESS.md` for what a real corporate deployment
would eventually require.

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
```

## Running the app

```bash
cd dhl-training-hub
npm install   # first time only
npm run dev
```

Then open http://localhost:3000
