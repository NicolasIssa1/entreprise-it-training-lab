# CLAUDE.md — DHL IT Training Hub

This file is permanent project memory. Read it before making any major changes to this
project. It defines who this project is for, what it is allowed to contain, and what it
is not allowed to become.

---

## Who this is for

Nicolas Issa — MEng Computer Science with Artificial Intelligence, University of Leeds.
Currently on an internship at **DHL Dubai, IT/BPU** (Business Process & Utilities /
IT department — exact team name as introduced to Nicolas).

The three IT teams Nicolas is learning about during the internship:

1. **Infrastructure** — servers, cloud, virtual machines, operating systems, storage,
   identity, access, backups, monitoring, availability, disaster recovery.
2. **Applications** — business applications, APIs, databases, bugs, integrations,
   deployments, authentication, application monitoring, software lifecycle.
3. **Support & Network** — IT support, tickets, troubleshooting, escalation, SLA,
   Wi-Fi, LAN, WAN, VPN, DNS, DHCP, routers, switches, IP addressing, connectivity.

## Naming

- **Private working name:** DHL IT Training Hub — used everywhere locally.
- **Public / GitHub name:** Enterprise IT Training Lab — use this instead if anything
  is ever made public, shared, or pushed to a public repository.
- This is explicitly **NOT an official DHL application**, has no affiliation with DHL,
  and must never claim otherwise.

## Purpose

A personal learning tool so Nicolas gets more out of the internship than passive
observation. It combines:

- Internship dashboard
- Enterprise IT training simulator (fake tickets, generic IT concepts)
- Learning journal
- CV achievement tracker

It exists to help Nicolas understand how DHL works as a business and internally, how
enterprise IT (Infrastructure / Applications / Support & Network) supports a large
multinational company, how enterprise ticketing/SLA/escalation work in general, and to
connect what he sees at work back to his Computer Science with AI degree.

---

## CONFIDENTIALITY — the most important rule in this file

**Never** ask Nicolas to enter, and never store, generate, or infer:

- real employee names, real customer names, real DHL ticket numbers or content
- passwords, credentials, employee IDs
- internal URLs, internal IP addresses
- private screenshots, restricted/internal DHL documentation
- customer shipment information
- security-sensitive internal information or confidential infrastructure details
- DHL-specific technical facts that were not explicitly told to Claude by Nicolas

**All example data in this app — tickets, scenarios, quiz questions — is fake and
generic enterprise IT training content.** It must read as "could apply to any large
company," never as DHL-specific insider information.

When Nicolas shares notes from work, always separate:

1. Something he **personally observed** at work (explicitly stated by him).
2. **Generic enterprise IT knowledge** (industry-standard concepts, not DHL-specific).
3. Something **publicly known** (e.g. public info about freight forwarding).
4. Something that is **only an assumption** and should be flagged as such.

Never invent DHL-specific facts (org structure details, tool names, SLA numbers,
escalation paths, etc.) that Nicolas hasn't explicitly told Claude. If it's unknown,
say it's unknown — don't fill the gap.

Do not copy DHL internal systems, branding, screenshots, interfaces, confidential
documentation, or proprietary architecture. Generic logistics/tech-inspired visual
style only — no DHL red/yellow branding, no DHL logos.

### Wording discipline

Generic enterprise IT knowledge must never be phrased as if it were a confirmed
description of a specific DHL team. Avoid "Infrastructure owns X" / "DHL uses
Critical/High/Medium/Low" / "DHL's SLA is Y" — prefer "Infrastructure teams commonly
manage X" / "this simulator uses generic training urgency categories" / "the
internship introduced expected resolution timeframes; the official SLA structure has
not yet been documented." Every Team page must keep "General Enterprise IT
Knowledge" visually and structurally separate from "What I Have Observed During My
Internship" — the former is generic industry content, the latter is only what
Nicolas has actually recorded (see `dhl-training-hub/src/components/TeamObservations.tsx`,
which sources this directly from Daily Log entries rather than inventing content).

## CV Achievement honesty rule

Never exaggerate what Nicolas actually did. The CV tracker uses a strict involvement
scale: **Observed → Learned → Assisted → Participated → Performed → Built →
Implemented.** If Nicolas only observed something, it must never be written up as if
he implemented, built, or performed it. Suggested CV wording must stay proportionate
to the recorded involvement level.

---

## Learning methodology

For any new IT topic taught in depth, eventually use this 10-part structure:

1. What is it? (simple explanation)
2. Explain Like I'm 10 (analogy)
3. Technical explanation
4. Why would a large company need it? (business purpose)
5. Which team would likely work with it? (Infrastructure / Applications /
   Support & Network / Depends)
6. What can go wrong? (examples)
7. How would an IT employee troubleshoot it? (logical steps)
8. University connection (see mapping below)
9. Practice exercise (realistic scenario)
10. Question to ask at work (intelligent, useful question)

### University connection mapping

Degree: MEng Computer Science with Artificial Intelligence. Connect internship topics
to: Programming, Python, Java, C/C++, Algorithms, Software Engineering, Operating
Systems, Databases, SQL, Web Services, REST APIs, Web Development, Secure Computing,
Artificial Intelligence, Machine Learning, Data Mining, Networking, Cloud concepts,
Cybersecurity. E.g. APIs ↔ Web Services, Databases ↔ Databases/SQL, Applications ↔
Software Engineering, Networking ↔ Networking/OS, Security ↔ Secure Computing,
Automation ↔ Programming, AI ↔ AI/ML.

---

## Phase 1 scope — what exists now

Phase 1 (foundation) is complete and polished; see `PRODUCT-ROADMAP.md` for what
Phases 2+ would add and `ENTERPRISE-READINESS.md` for what a real deployment would
eventually require (neither is built — both are planning documents only). Phase 1 is
intentionally limited to five sections in the Next.js app:

1. **Dashboard** — current day/team, today's goals/questions/practice, quick notes,
   reflection, progress summary.
2. **Teams** — Infrastructure / Applications / Support & Network pages with generic
   concept explanations, responsibilities, example problems, university connections,
   learning checklist.
3. **Ticket Simulator** — 12–15 fake tickets; user picks responsible team, urgency
   (clearly labeled as training categories, not confirmed DHL terminology), and
   troubleshooting steps, then sees reasoning/resolution guidance. Not every ticket is
   obvious — some have multiple plausible causes/teams.
4. **Daily Log** — journal entries (date, day, team, observed, learned, terminology,
   tools, questions asked, answer summary, confusions, research-later, practice done,
   tomorrow's goals) + a "Questions to Ask" reference list per team.
5. **CV Achievement Tracker** — raw note → involvement level → skills → what was
   learned → suggested (non-exaggerated) CV wording → evidence notes.

Data storage in Phase 1: **mock/local data only.**
- Static content (dashboard defaults, teams, tickets, questions) lives in TypeScript
  data files under `dhl-training-hub/src/lib/data/`.
- User-entered content (Daily Log entries, CV achievements) is persisted to the
  browser's `localStorage` via `dhl-training-hub/src/lib/storage.ts` — still fully
  local, no backend.

### Shared-state architecture (do not duplicate these values)

- `dhl-training-hub/src/lib/data/internshipState.ts` — the **single source of
  truth** for the current internship day/team/date and personal organization context
  (organization, role, department). Every page that needs "today" derives from this;
  never hardcode a day number or team elsewhere.
- `dhl-training-hub/src/lib/product.ts` — centralized product/brand config
  (`namePrivate` / `namePublic` / disclaimer text). Reusable UI (Nav, layout
  metadata, footer) reads from here instead of hardcoding "DHL" — this keeps the
  product name swappable and keeps the architecture ready to support a different
  organization/role/team later without touching component code. Personal context
  (internshipState) and reusable product branding (product.ts) are deliberately kept
  in separate files — don't merge them.

---

## Phase 2 scope — Learning Engine (built and frozen)

Phase 2 shipped in three sub-phases — 2A (initial 16-topic engine), 2B (expanded to
50 topics), 2C (added the Security Fundamentals category) — and is now complete.
Adds a **Learn** section: `/learn` (library landing — suggested next topic, 6
Learning Paths, search, category/team/level filter, overall progress) and
`/learn/[topicId]` (one reusable dynamic page for all topics, via
`generateStaticParams` — never add a hardcoded page per topic). **56 topics** across
five categories (IT Service Management, Infrastructure, Networking, Applications,
Security Fundamentals), each following the same structure as the learning
methodology above (2–4 explicit learning outcomes, a Foundation/Intermediate level,
and an estimated read time), plus a practice scenario with reveal-guidance and a
question to ask at work. Optional `prerequisiteTopicIds` (recommendations, never
hard locks) and `dontConfuseWith` callouts exist only where genuinely useful — not
on every topic.

**Security Fundamentals** is foundational, defensive security awareness for IT
staff (MFA, Least Privilege, Endpoint Security, Phishing & Social Engineering
Awareness, Encryption Basics, Vulnerabilities & Security Patching) — explicitly
**not** a cybersecurity specialist course, and never described as one. It contains
no exploit, bypass, offensive-technique, or attack-construction content of any
kind — troubleshooting steps are strictly about safe investigation, reporting, and
escalation. There is no dedicated "DHL security team" invented anywhere; security
concepts are treated as genuinely crossing all three teams (see `getTopicsForTeam`
below), with ownership always framed as "may involve X" / "varies by
organization," never asserted as fact.

- Content lives in `dhl-training-hub/src/lib/data/learning/` (`itsm.ts`,
  `infrastructure.ts`, `networking.ts`, `applications.ts`, `security.ts`,
  `paths.ts`, aggregated by `index.ts`) as typed `LearningTopic[]` / `LearningPath[]`
  data — structured so it could move to Supabase/a CMS later without the UI
  changing. Pages render data; they don't hardcode lessons.
- `index.ts` runs a lightweight `validateLearningContent()` check at module load
  (so it fires on every `npm run build` and in dev) that throws on duplicate topic
  ids or any `relatedTopicIds`/`prerequisiteTopicIds`/`dontConfuseWith`/path/ticket
  reference to a topic id that doesn't exist. Keep this passing — it's the guard
  against a typo silently breaking a link.
- **Learning Paths** (`lib/data/learning/paths.ts`) are just curated, ordered
  `topicIds` lists — there is no separate path-completion storage. Path progress is
  always derived from topic completion at render time via `getPathProgress()`.
- Completion is tracked via `dhl-training-hub/src/lib/learningProgress.ts`
  (`useLearningProgress`), built on the same `useLocalStorageState` core as every
  other storage hook (Checklist, Daily Log, CV Tracker) — key
  `learning-topic-progress`, schema `Record<topicId, boolean>`. Don't create a
  second, inconsistent storage pattern for future progress-tracking features.
- **Learn ↔ Teams**: Team pages show a "Recommended Learning" section derived from
  `getTopicsForTeam()` (category-based: each team's own category + the two
  cross-cutting categories, IT Service Management and Security Fundamentals, which
  both apply broadly) — see `lib/data/learning/index.ts`.
- **Learn ↔ Ticket Simulator**: tickets carry a `topicIds: string[]` tag (only where
  a topic genuinely applies — never forced) in `lib/data/tickets.ts`. The Ticket
  Simulator's guidance panel shows "Recommended learning" derived from a ticket's
  own tags; a Learn topic page's "Related training tickets" derives the reverse
  relationship via `getTicketsForTopic()`. The tag lives only on the ticket — don't
  duplicate the relationship on `LearningTopic`. `getTicketsForTeam()` further
  splits a team's tickets into `likely` (this team is the recommended owner) vs.
  `crossTeam` (a plausible secondary participant in a genuinely ambiguous ticket) —
  never blend these back into one undifferentiated list.
- **Learn ↔ Daily Log**: each topic page has a lightweight "Add to today's research"
  link (`/daily-log?research=<topic title>`) that pre-fills the new entry's "things
  to research later" field. This intentionally stops short of any deeper Daily Log
  restructuring.
- 34 fictional training tickets in `lib/data/tickets.ts` (up from 15) — still
  fixed-scenario (read → choose team → choose urgency → write initial
  troubleshooting → reveal guidance). Do not add branching/multi-step behavior;
  that's Phase 3.

### Explicitly NOT built yet (do not add without being asked)

- Supabase / any real database
- Claude API integration
- Authentication (even simple), SSO, RBAC
- Deployment (Vercel or otherwise)
- "How DHL Works" external/internal flow pages (placeholder folders only)
- Daily quiz system, skill tree, analytics/manager view (Learn tracks simple
  completion only — no scoring, no quiz mechanics)
- Branching/multi-step ticket simulations (current simulator is fixed-scenario)
- Multi-tenancy / multi-company accounts

See `PRODUCT-ROADMAP.md` for when these are planned and `ENTERPRISE-READINESS.md` for
deployment-readiness requirements. Don't build ahead of what's been asked for.

---

## Phase 3 scope — Advanced Investigations (built and frozen)

Phase 3 adds a second tier to the Ticket Simulator, without touching the first.
**Quick Practice** is the original 34 fixed-scenario tickets from Phase 1/2,
unchanged, still living at `/tickets`. **Advanced Investigations** is 8 new
branching, multi-step scenarios at `/tickets/investigate/[scenarioId]` (one
reusable dynamic page via `generateStaticParams`, never a hardcoded page per
scenario — same rule as `/learn/[topicId]`): DNS/name resolution, application
performance (deliberately multi-layered — application, database, infrastructure,
and a recent deployment are all plausible threads, with no single obvious
cause), VPN connectivity, authentication vs. authorization, a system integration
failure, a shared storage outage, a deployment regression, and a defensive-only
endpoint security incident (no exploit, bypass, or offensive-technique content —
same rule as Security Fundamentals topics).

**Core idea: don't guess, gather evidence.** Evidence evolves as the learner
investigates rather than being handed over up front. Each scenario is a typed
`InvestigationScenario` (`dhl-training-hub/src/lib/data/investigations/`) — a
graph of `InvestigationNode`s connected by `InvestigationAction`s. Every action
carries a training-stage (`scope` / `evidence` / `diagnose` / `resolve` /
`escalate` / `verify`) and a quality (`strong` / `reasonable` / `weak` /
`unnecessary`). Several genuinely reasonable actions usually exist at once — this
is deliberate; real troubleshooting is rarely one-answer. Weak/unnecessary
choices self-loop back to the same node with explanatory feedback rather than
dead-ending the scenario, so a poor choice teaches something without being
punitive. The learner also assesses a generic business impact up front (never a
DHL priority matrix — see `BUSINESS_IMPACT_SCOPES` in `lib/types.ts`), can ask
optional diagnostic questions that reveal evidence without forcing navigation,
and holds/revises a hypothesis at any point via `INVESTIGATION_HYPOTHESES` — none
of this is scored harshly, and changing your mind with new evidence is treated as
normal, not a failure. Every action is logged to a persisted Investigation
Timeline. Every scenario resolves through: reach a decision hub → resolve or
escalate (both are legitimate successful outcomes, framed as "commonly involves
X, varies by organization" per the confidentiality rules above, never "X owns
this") → a mandatory verify step → a short resolution-documentation form
(`DOCUMENTATION_FIELDS`, a fixed 7-field structure shared by every scenario) →
training performance feedback.

**Scoring** (`dhl-training-hub/src/lib/investigationScoring.ts`) is generic and
scenario-agnostic — it reads the `stage`/`quality` tags already on the actions
the learner took, so no scenario needs its own scoring config. Six weighted
categories (Information Gathering 25%, Isolation/Diagnosis 25%, Action Quality
20%, Escalation 10%, Verification 10%, Documentation 10%) roll up into an
overall Excellent/Strong/Developing/Needs Review rating, always shown as a
"training indicator," never a validated assessment. Feedback always includes
"what went well," "what could improve," and a "better reasoning path" (the
outcome node's own `modelResolution` text) — never just a percentage.

- **Storage**: `dhl-training-hub/src/lib/investigationProgress.ts`
  (`useInvestigationProgress`), built on the same `useLocalStorageState` core as
  every other storage hook. Key `investigation-progress` holds
  `Record<scenarioId, InvestigationProgress>` (current node, full timeline,
  actions taken, questions asked, hypothesis history, business impact,
  documentation draft, completion, score). A separate `investigation-completions`
  key holds a lightweight completion history list for Phase 4 to build on later —
  don't add a second, inconsistent progress-tracking pattern.
- **Learn ↔ Advanced Investigations**: scenarios carry `relatedTopicIds` (the
  single source of truth); Learn topic pages derive an "Advanced Practice"
  section via `getScenariosForTopic()` — same reverse-derivation pattern as
  `getTicketsForTopic()`. Don't duplicate the relationship on `LearningTopic`.
- **Team ↔ Advanced Investigations**: scenarios carry `likelyTeams`; Team pages
  derive an "Advanced Practice" section via `getScenariosForTeam()`.
- Content validation lives in `lib/data/investigations/index.ts`
  (`validateInvestigations()`, mirroring the Learn library's validator): checks
  duplicate scenario ids, a valid `startNodeId`, every action's `nextNodeId`
  resolving to a real node, terminal nodes having no actions (and non-terminal
  nodes having at least one), every `relatedTopicIds`/`topicsToReview` reference
  resolving to a real Learn topic, and — via a BFS from the start node — that
  every node is actually reachable. Keep this passing.

### Explicitly NOT built in Phase 3 (do not add without being asked)

- Analytics/manager views built on `investigation-completions` (that's Phase 4)
- Any scoring change that scores by click count alone, or that treats "reasonable"
  as a disguised "wrong"
- Company-specific customization of scenarios, teams, or escalation paths — the
  engine itself must stay organization-agnostic (see Phase 9/10 in
  `PRODUCT-ROADMAP.md`)

---

## Phase 4 scope — Quizzes + Skill/Readiness Tracking (built and frozen)

Phase 4 adds a knowledge-check and progress layer on top of Learn (Phase 2) and
Advanced Investigations (Phase 3), without changing either. Everything here is
**local, private, fictional, explainable, deterministic, and useful without
AI** — and it is a **learning indicator, not a scientifically validated
professional assessment**. Never claim, imply, or word anything as "the user is
job ready," "certified," or "expert" — see Skill Level Labels below.

**Quizzes** (`/quizzes`, `/quizzes/[quizId]`, one reusable dynamic page via
`generateStaticParams` — same rule as `/learn/[topicId]` and
`/tickets/investigate/[scenarioId]`, never a hardcoded page per quiz): 12
quizzes, 99 questions total, in
`dhl-training-hub/src/lib/data/quizzes/` — 6 Foundation Assessments (one per
skill area: IT Service Management, Infrastructure, Networking, Applications,
Security Fundamentals, Enterprise Troubleshooting) plus 6 Learning Path
checkpoints (fresh questions, not copies of the foundation assessments).
Questions are scenario-based, testing applied judgment ("users can reach a
service by IP but not by hostname — what do you investigate first?"), never
bare definitions ("what does DNS stand for?") — this is a hard content-quality
rule, not just a stylistic preference. Supports `single-choice` and
`multi-select` question types. During a quiz: one question at a time, a
progress indicator, Back/Next plus a question-jump strip, and no correctness
leaked before submission. After submission: score, a learning-descriptor-only
result guidance (Strong understanding / Good foundation / Developing / Review
recommended — never "Certified"/"Expert"/"Job Ready"), and a full answer
review (learner's answer, correct answer, correct/incorrect **stated in text**
not just color, an explanation, a targeted misconception explanation for
common wrong answers where one exists, and related Learn topic links).

- **Storage**: `dhl-training-hub/src/lib/quizAttempts.ts` (`useQuizAttempts`),
  same `useLocalStorageState` core as everything else. Key `quiz-attempts`,
  schema `Record<quizId, QuizAttempt[]>`, capped at the last 10 attempts per
  quiz (older attempts are trimmed, not the whole history wiped). Retakes are
  unlimited and never erase prior attempts; best/latest are both always shown.
- **Content validation** lives in `lib/data/quizzes/index.ts`
  (`validateQuizzes()`, mirroring Learn/Investigations): duplicate quiz ids,
  duplicate question ids, every single-choice question has exactly one correct
  answer, every option id referenced in `correctOptionIds`/
  `misconceptionExplanations` actually exists, every quiz has questions, and
  every `relatedTopicIds`/`relatedPathIds` reference resolves. Keep this
  passing.

**Skill Progress** (`dhl-training-hub/src/lib/data/skills.ts` +
`skillProgress.ts`): 6 skills — IT Service Management, Infrastructure,
Networking, Applications, Security, Troubleshooting. **Every skill's evidence
is derived, never separately stored** — there is exactly one source of truth
for each: `learning-topic-progress` (Learning, 30%), `quiz-attempts`
(Knowledge, 30%, best score per relevant quiz, unattempted quizzes count as 0
so cherry-picking one easy quiz can't inflate the score), and
`investigation-completions` (Practical, 40% — **weighted highest on purpose**,
so completing lesson checkboxes alone caps a skill at 30/100). 5 of the 6
skills map straight onto a Learn category (`SKILL_LEARNING_CATEGORY` in
`skills.ts` is the *only* place this mapping lives — topics, quizzes, and
investigations for a skill are all derived from it, never hand-listed
per-skill, so there is nothing else that can drift out of sync).
Troubleshooting is cross-cutting: no Learn category is dedicated to it, so its
learning evidence comes from a small curated set of process-focused topics
(`TROUBLESHOOTING_TOPIC_IDS`) and its practical evidence is *every* Advanced
Investigation (all 8 exercise the same scope/evidence/diagnose/escalate/verify
framework regardless of technical domain). Grounded level labels only — **Not
Started / Getting Started / Building Foundation / Practicing / Strong
Foundation**, at thresholds 0 / 1-24 / 25-49 / 50-74 / 75-100 — never
"Expert"/"Professional"/"Certified".

- Content validation (`validateSkills()` in `skills.ts`) fails loudly if any
  skill maps to zero topics, zero quizzes, or zero investigations — the fixed
  30/30/40 weighting assumes every skill has a non-empty evidence pool in each
  category; don't add a 7th skill or narrow a mapping without checking this.

**`/progress`** is the dedicated readiness page: Overall Training Progress
(mean of the 6 skill scores), a per-skill breakdown card (level, percentage,
and the learning/knowledge/practical evidence numbers behind it), a visible
but non-obnoxious disclaimer ("these scores are educational progress
indicators... not validated measures of professional competence and do not
certify job readiness"), and Recommended Next Actions from the deterministic
engine below.

**Recommendations** (`dhl-training-hub/src/lib/recommendations.ts`,
`getRecommendations()`) — no AI. Inspects five signals and returns the top 3-5,
deduplicated by link: weak quiz topics (derived from *which specific questions
were actually missed* on the latest sub-70% attempt, not just "you did
poorly"), never-attempted quizzes for a skill with real lesson progress,
never-completed investigations for a skill with real learning/knowledge
progress, low-scoring (<60) completed investigations (retry), and learning
path continuation (including recommending an unmet prerequisite ahead of the
next topic itself, when one exists). Each candidate carries an internal
`priority` used only for sorting — never shown to the learner.

**Cross-linking** (all reverse-derived from data already on the quiz/skill
side — never a second hand-maintained list):
- Learn topic pages: a "Knowledge Check" section via `getQuizzesForTopic()`.
- `/learn` Learning Path cards: the path's checkpoint quiz (with best score
  once attempted) via `getQuizzesForPath()`, and related Advanced
  Investigations via `getScenariosForPath()` (topic-overlap derived, not a
  hand-maintained path→scenario list).
- Advanced Investigation results: a "Skill Progress Impact" note naming which
  skills the completed scenario counts toward, linking to `/progress` — never
  a fabricated "+10 skill points" number; the engine stays professional, not
  game-like.
- Dashboard: a compact `DashboardProgressSummary` block (overall indicator,
  topic/assessment/investigation counts, one top-priority recommendation)
  linking to `/progress` — intentionally not a duplicate of the full page.

### Explicitly NOT built in Phase 4 (do not add without being asked)

- Any AI grading, AI-generated quiz questions, or an AI tutor
- A second, independently-stored readiness/skill score — always recompute from
  `learning-topic-progress` / `quiz-attempts` / `investigation-completions`
- Coins, XP, badges, streak pressure, confetti, lives/hearts, or any other
  gamified/arcade UI — this stays professional SaaS training software
- Manager dashboards, cohort analytics, leaderboards, or any cross-user view
  (there is no concept of multiple users yet)

---

## Tech stack & conventions

- Next.js (App Router) + React + TypeScript + Tailwind CSS.
- Project lives in `dhl-training-hub/` inside this repo root.
- Prefer small, reusable components (`src/components/`) over one-off duplicated JSX.
- Shared types in `src/lib/types.ts`; mock data in `src/lib/data/`.
- Keep components and data readable — Nicolas is a CS student and wants to learn from
  the code itself. Add comments only where the *why* isn't obvious from the code.
- Avoid overengineering: no premature abstractions, no speculative config for features
  that don't exist yet (no auth scaffolding, no DB client setup, etc.).
- After any non-trivial change: run `npm run build` inside `dhl-training-hub/` and fix
  TypeScript/lint/build errors before considering the change done.

## Project architecture

```
DHL-Internship/
  CLAUDE.md                — this file
  README.md                — human-facing overview
  internship-plan.md       — living tracker of internship stage & learning plan
  PRODUCT-ROADMAP.md       — phase-by-phase product roadmap (Phase 1–10)
  ENTERPRISE-READINESS.md  — future requirements before any real deployment
  teams/                   — markdown reference docs (source content for Teams pages)
  daily/                   — markdown daily journal entries (day-01.md, day-02.md, ...)
  learning/                — reserved (the actual Learn library lives in the app —
                              see dhl-training-hub/src/lib/data/learning/ below)
  practice-tickets/        — reserved for future expansion of ticket bank
  quizzes/                 — reserved for future quiz system
  questions/               — reserved for future standalone questions bank
  cv-achievements/         — reserved for future CV export/archive content
  dhl-training-hub/        — the actual Next.js application (see its own README)
    src/lib/data/internshipState.ts — single source of truth for current day/team
    src/lib/product.ts              — product/brand config (private vs public name)
    src/lib/data/learning/          — Learn topic content (56 topics) + paths.ts
    src/lib/learningProgress.ts     — Learn completion tracking hook
    src/lib/data/investigations/    — Advanced Investigations content (8 scenarios)
    src/lib/investigationProgress.ts — Advanced Investigations progress/storage hook
    src/lib/investigationScoring.ts  — generic, scenario-agnostic scoring engine
    src/lib/data/quizzes/           — Quiz content (12 quizzes, 99 questions)
    src/lib/quizAttempts.ts         — quiz attempt storage hook
    src/lib/data/skills.ts          — skill definitions + derived topic/quiz/investigation mapping
    src/lib/skillProgress.ts        — skill/readiness calculation (30/30/40 weighting)
    src/lib/recommendations.ts      — deterministic next-action recommendation engine
```
