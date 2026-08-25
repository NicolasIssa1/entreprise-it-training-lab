# DHL IT Training Hub — App

Next.js (App Router) + TypeScript + Tailwind CSS application. See the parent
`../README.md` and `../CLAUDE.md` for full project context, purpose, and rules
(this is a personal training tool — not an official DHL application, no real
DHL/confidential data anywhere).

## Run it

```bash
npm install   # first time only
npm run dev
```

Open http://localhost:3000

## Structure

```
src/app/                 pages (App Router): dashboard, teams, tickets, daily-log, cv-tracker
src/components/          reusable UI (Nav, Card, Badge, etc.)
src/lib/types.ts         shared TypeScript types
src/lib/data/            mock data (teams, tickets, dashboard, questions)
src/lib/storage.ts       localStorage helpers for Daily Log / CV Tracker entries
```

All content is mock/local — no database, no auth, no external API calls in Version 1.
