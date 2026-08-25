# DHL IT Training Hub

*(Public/GitHub name if ever shared: **Enterprise IT Training Lab**)*

A personal learning application built by Nicolas Issa (MEng Computer Science with
Artificial Intelligence, University of Leeds) to get the most out of an internship in
DHL Dubai's IT/BPU department.

> **This is NOT an official DHL application.** It has no affiliation with DHL, copies
> no DHL branding, internal systems, or confidential documentation, and contains no
> real DHL data. All tickets, scenarios, and examples are fake and generic, built for
> personal training purposes only.

## What it does

Think: **Internship Dashboard + Enterprise IT Training Simulator + Learning Journal +
CV Tracker**, covering the three teams the internship rotates through:

- **Infrastructure** — servers, cloud, VMs, storage, identity, backups, monitoring, DR
- **Applications** — business apps, APIs, databases, integrations, deployments, auth
- **Support & Network** — tickets, escalation, SLA, Wi-Fi, LAN/WAN, VPN, DNS, DHCP

## Version 1 features

1. **Dashboard** — today's day/team, goals, questions, practice exercise, notes
2. **Teams** — explainer pages for Infrastructure / Applications / Support & Network
3. **Ticket Simulator** — 12–15 fake IT tickets to triage, prioritize, and troubleshoot
4. **Daily Log** — journal + "questions to ask" reference per team
5. **CV Achievement Tracker** — honest, non-exaggerated CV bullet building

See `CLAUDE.md` for full project rules (confidentiality, methodology, scope) and
`internship-plan.md` for the current learning state.

## Repository layout

```
CLAUDE.md               project rules & permanent context
internship-plan.md      current internship stage & learning plan
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

## Tech stack

Next.js (App Router) + React + TypeScript + Tailwind CSS. All data is local/mock for
now — no database, no auth, no external API calls, no deployment.
