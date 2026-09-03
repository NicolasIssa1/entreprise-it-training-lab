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

## Phase 5 scope — Supabase backend, authentication, data migration (structurally built)

Phase 5 adds real persistence and accounts on top of Phases 1-4, without
moving any static curriculum into a database. **Static training content
(Learn topics, learning paths, quizzes, tickets, investigation scenarios, team
definitions) stays application code/config — Supabase stores USER-GENERATED
data only.** Never move curriculum into Supabase without being asked; that
would turn this into a CMS project, which is explicitly out of scope.

### Local Demo Mode is first-class, not an afterthought

With no `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` set, the
whole app runs exactly as it did at the end of Phase 4 — pure `localStorage`,
zero network calls, zero crashes, no dead-end UI. `isSupabaseConfigured`
(`dhl-training-hub/src/lib/supabase/client.ts`) is the single switch every
other file branches on. Never require Supabase configuration for the app to
run or build — that would break the repo's "clone and `npm run dev`" story
that's existed since Phase 1.

### Auth architecture

Client-only — deliberately **no** `@supabase/ssr`, no middleware, no server
Supabase client. Every page in this app is (and has always been) a client
component that hydrates its own state after mount; there is no
server-rendered personalized content that would need session-refreshing
middleware. `AuthProvider` (`lib/auth/AuthProvider.tsx`) wraps the whole app
in `layout.tsx`, exposes `useAuth()` (`user`, `session`, `loading`,
`isConfigured`, `signUp`/`signIn`/`signOut`, `migrationMessage`), and is where
the one-time migration (below) gets triggered after sign-in. Email+password
only — no SSO, no magic links, no org accounts, no admin roles (see
`PRODUCT-ROADMAP.md` "explicitly not built yet" for the full exclusion list).
Auth errors are translated to plain language (`friendlyAuthError()`) — never
show a raw Supabase/Postgres error to the learner.

**Route protection is intentionally NOT hard-gated.** Personal pages
(`/progress`, `/daily-log`, `/cv-tracker`, Advanced Investigations, Learn
completion) all work signed-out too — signed-out means "your data lives only
in this browser," not "page unavailable." This preserves the "no regression
from Phases 1-4" requirement and keeps Local Demo Mode genuinely first-class.
**Row Level Security is the real security boundary, not client-side route
guarding** — see `supabase/migrations/0001_init.sql`.

### Repository layer — the only code that talks to Supabase directly

`dhl-training-hub/src/lib/repositories/` (one file per domain: profile,
learning progress, quiz attempts, investigation progress/completions, daily
logs, CV achievements, team checklist). Each repository exposes typed
`fetch*`/`upsert*`/`delete*`/`bulkUpsert*` functions built on the Supabase
client from `lib/supabase/client.ts`. **UI components never query Supabase
directly** — they call a domain hook, which calls a repository.

### Domain hooks stay dual-mode with an unchanged external API

Every Phase 1-4 hook (`useLearningProgress`, `useQuizAttempts`,
`useInvestigationProgress`/`useInvestigationCompletions`, plus the newly
extracted `useTeamChecklist`, `useDailyLogEntries`, `useCvAchievements`) keeps
exactly the shape components already consumed — Phase 5 only changed each
hook's *internals*, so almost no consuming component needed to change beyond
a couple of call-site renames (`addEntry`/`removeEntry` instead of raw
`setEntries`, etc.). Internally, each hook still always calls
`useLocalStorageState`/`useLocalStorageList` first (this is what makes Local
Demo Mode, optimistic UI, and the migration source all work from one place),
then layers cloud behavior on top only when `isConfigured && !!user`:

1. **On mount, when cloud mode**: fetch from Supabase and overwrite local
   state with it — cloud is authoritative once signed in.
2. **On every write**: update local state optimistically first (so the UI
   never blocks on a network round-trip), then fire the matching repository
   call in the background. A failure sets a `syncError` flag the hook returns
   (surfaced via the `SyncErrorNotice` component in the relevant page/section)
   — it **never** reverts or clears what the learner just did.

Don't reintroduce a second, inconsistent pattern for a future storage domain —
follow this exact shape (`lib/learningProgress.ts` is the reference
implementation; every other domain hook mirrors it).

### Legacy `localStorage` migration

`dhl-training-hub/src/lib/migration.ts`, `migrateLocalDataToCloud(userId)`,
triggered once from `AuthProvider` right after a user's first sign-in. Reads
the 7 legacy keys directly (not through the hooks, so it works even before
any hook has mounted): `learning-topic-progress`, `quiz-attempts`,
`investigation-progress`, `investigation-completions`, `daily-log-entries`,
`cv-achievements`, and the three `checklist-<teamId>` keys. Each domain is
migrated independently inside its own try/catch — one malformed/corrupt
domain can never block the rest. **Idempotent** because every upsert targets
the same natural key the app already uses as a record id (topic id, quiz id +
attempt id, scenario id, or the client-generated entry id) — running it twice
just re-upserts the same rows. **Migration status lives on
`profiles.local_migration_version`**, checked explicitly before running —
never inferred from "does the cloud table have rows," since a legitimately
empty new account must not look unmigrated forever. `localStorage` is never
cleared afterward — it keeps serving as the optimistic cache described above;
data loss is worse than duplication. The learner sees exactly one dismissible
banner line (`MigrationBanner`) — "synced" or "mostly synced, some records
couldn't be imported" — never technical detail.

### Database schema, indexes, RLS

`supabase/migrations/0001_init.sql` — 8 tables (`profiles` +
`learning_progress`, `quiz_attempts`, `investigation_progress`,
`investigation_completions`, `daily_logs`, `cv_achievements`,
`team_checklist_progress`), each with the natural unique constraint the app
already relies on (`user_id + topic_id`, `user_id + scenario_id`, etc.) plus
an index on `user_id`. `investigation_completions` intentionally stays
one-row-per-`(user, scenario)`, matching Phase 4's "latest completion only"
behavior — not a history table. `quiz_attempts` keeps the Phase 4
10-attempts-per-quiz cap via a client-side delete-after-insert
(`trimOldAttempts()` in the repository) rather than a DB trigger — simplest
place to keep it, and matches how the cap already worked locally. **RLS is
enabled on every table, no exceptions**, with `auth.uid() = user_id` (or
`= id` on `profiles`) policies for select/insert/update/delete. Never weaken
these to make development easier, and never let the service-role key anywhere
near browser code.

### Types

`dhl-training-hub/src/lib/supabase/database.types.ts` is **hand-written**, not
CLI-generated (no real remote project exists in this dev environment yet).
Must satisfy `@supabase/supabase-js`'s `GenericSchema` shape exactly — each
table needs `Row`/`Insert`/`Update`/`Relationships: []`, and the schema needs
`Tables`/`Views`/`Functions` (see the file's own header comment for the
regeneration command once a real project exists). Keep this file in sync with
the SQL migration by hand until then — they're edited together, in the same
commit, whenever the schema changes.

### Account isolation fix (post-Phase 10 — critical, read before touching persistence)

A real bug, found after Phase 10: creating a second account on the same
browser inherited the first account's learning progress, quiz attempts,
investigation state, Daily Log, CV Tracker, and (via its own separate
merge-on-mount logic) Tutor conversation — a privacy-critical failure of
per-user isolation, not a repeat of the `a8e9566` merge-not-replace bug (that
fix is still correct and untouched). **Root cause**: every domain hook's
`localStorage` key was a single fixed global string (e.g.
`"learning-topic-progress"`) shared by every identity that ever used that
browser — signed out, Account A, or Account B all read/wrote the exact same
key. Combined with `migrateLocalDataToCloud` never clearing what it migrated,
a second brand-new account (its own unmigrated `local_migration_version`)
would independently re-read and re-upload the first account's leftover local
data into its own cloud rows.

**Fix** (`dhl-training-hub/src/lib/storageScope.ts`): every domain key is now
identity-scoped via `scopedKey(domain, userId)` — `demo:<domain>` when signed
out (Local Demo Mode; unchanged in spirit from every phase before accounts
existed), `user:<userId>:<domain>` when signed in. Never keyed by email —
always the immutable Supabase auth id. All 9 domain hooks (`learningProgress`,
`teamChecklist`, `quizAttempts`, `investigationProgress` (both exports),
`dailyLog`, `cvAchievements`, `tutorConversation`, `assignmentSelection`,
`onboarding`) derive their key this way — the last two are local-only (no
Supabase table) but still scoped, so a second account never inherits the
first account's selected Training Assignment or onboarding answers either.
`lib/storage.ts`'s `useLocalStorageState` now also resets its in-memory state
to `initial` **synchronously during render** (React's documented
"adjusting state when a prop changes" pattern, via `useState` — never a
`useRef` read during render, which React's compiler-safety lint rule
forbids) the instant its `key` changes, so switching accounts can never paint
a previous account's cached value for even one frame; a proper "loading"
gap is preferred over ever showing the wrong account's data.

A one-time, module-load-time (not effect-time, to avoid a hydration race)
step in `storage.ts` adopts every pre-fix raw global key into the `demo:`
namespace once, so an existing Local Demo Mode user doesn't lose data, then
deletes the raw key so nothing can read it again. `lib/migration.ts` now
reads only from the `demo:<domain>` namespace (never a raw legacy key) and,
critically, **clears each domain's demo key after that domain migrates
successfully** — the original design deliberately never cleared
`localStorage` post-migration ("data loss is worse than duplication"), but
that policy is exactly what let a second account re-claim the first
account's leftover data; once copied to Account A's cloud rows, it must stop
being generic, unclaimed, transferable state. A domain that fails to migrate
is left in the demo bucket rather than cleared, so a failed upload isn't also
a lost one. `useDailyLogEntries` also stopped seeding a brand-new
**authenticated** account with the example `seedDailyLogEntries` (personal
illustrative content meant only for first-time Local Demo Mode) — a
newly-created real account now starts with zero Daily Log entries, matching
every other domain. `AuthProvider.signOut()` also clears `migrationMessage`
(an account-specific banner) so it can't linger into a different account's
next session.

**Do not regress this**: any future domain hook backed by `localStorage` must
derive its key via `scopedKey()`, never a fixed string — see
`storageScope.ts`'s header comment and `storageScope.test.ts`'s regression
tests. Never key by email. Never assume `localStorage` is safe to read/write
without going through an identity-scoped key, even for a "local-only, never
synced to cloud" preference like Training Assignment selection — that was
exactly as leaky as the cloud-synced domains until this fix.

### Explicitly NOT built in Phase 5 (do not add without being asked)

- Password reset (`/forgot-password`) — deliberately deferred; straightforward
  to add later (Supabase's `resetPasswordForEmail` + a `PASSWORD_RECOVERY`
  auth-state handler), just not done yet
- Any server-side Supabase client, `@supabase/ssr`, or Next.js middleware
- Real-time subscriptions, CRDTs, or any multi-device conflict resolution —
  cloud is simply authoritative post-auth, per `PRODUCT-ROADMAP.md`
- A second stored "skill/readiness score" — Phase 4's calculations still read
  the three evidence sources directly, now optionally cloud-backed
- Moving static curriculum into Supabase
- Anything from the Phase 5 "do not add yet" list in `PRODUCT-ROADMAP.md`
  (AI tutor, RAG, vector DB, admin portal, SSO, multi-tenancy, payments, etc.)

---

## Phase 6 scope — AI Tutor (structurally built)

Phase 6 adds an optional AI Tutor grounded in this app's own curriculum —
**not** a general-purpose chatbot. It answers questions, simplifies topics,
coaches (rather than reveals answers) during active quizzes/investigations,
and explains quiz mistakes, investigation feedback, and this app's own
deterministic progress recommendations. Full architecture, grounding
strategy, privacy trust boundary, rate limits, and setup steps live in
`dhl-training-hub/docs/AI-TUTOR.md` — read that before touching anything
under `src/lib/ai/`, `src/app/api/tutor/`, `src/app/tutor/`, or
`src/lib/tutorConversation.ts`.

**Provider**: Anthropic only (`@anthropic-ai/sdk`), called exclusively from
`src/app/api/tutor/route.ts` (server-only) via `lib/ai/provider.ts` →
`lib/ai/anthropic.ts`. `ANTHROPIC_API_KEY` is server-side only — never
`NEXT_PUBLIC_`-prefixed, never referenced from a `"use client"` file. Default
model `claude-sonnet-5` (overridable via `ANTHROPIC_MODEL`), chosen
deliberately for modest cost/fast conversational tutoring, not the most
expensive model available — never hardcode a different model string
elsewhere.

**Grounding**: deterministic, application-side curriculum retrieval only
(`lib/ai/tutorContext.ts`) — keyword/id matching against
`lib/data/learning/`, never the full 56-topic library sent on every request,
and no embeddings/vector DB/external RAG (see "Explicitly NOT built" below).
A response's `relatedTopicIds` are always the server's own grounded topic
ids, never a model-generated id/URL.

**Modes** (`TutorMode` in `lib/types.ts`): `tutor`, `topic-tutor`,
`quiz-coach`, `quiz-review`, `investigation-coach`, `investigation-review`,
`progress-coach` — always set by trusted application links
(`lib/ai/tutorLinks.ts`'s `tutorHref()`), never inferred from free user text.
Coach modes (`quiz-coach`, `investigation-coach`) must never reveal the
correct answer / hidden root cause / best action / outcome — enforced by the
system prompt (`lib/ai/tutorPrompt.ts`) and, for investigations, by the
outcome text simply never being sent to the model until
`investigation-review`.

**Privacy boundary** (see confidentiality rules at the top of this file,
which apply to every AI request exactly as they apply everywhere else): the
Tutor automatically receives grounded curriculum text and a minimal progress
summary (completed topic/quiz/investigation ids, skill levels — never free
text). It **never** automatically receives Daily Log entries, CV Achievement
text, the learner's name/email, or any real company information. Quiz-review
context is resolved server-side from static quiz data (the client can only
supply which option ids it claims were selected, not arbitrary explanation
text) — see `docs/AI-TUTOR.md`'s "trust boundary" note for the one place
(investigation coach/review context) where client-supplied fields are capped
and validated but not independently re-verified against a server-side
record, a documented and low-stakes trade-off for a personal prototype.

**Conversation persistence**: one lightweight running conversation per
learner (`lib/tutorConversation.ts`, same dual-mode `useLocalStorageState`
pattern as every Phase 5 hook), backed by two new Supabase tables
(`supabase/migrations/0002_tutor.sql`: `tutor_conversations`,
`tutor_messages`, RLS enabled, mirroring every other table's
`auth.uid() = user_id` policy shape). Only ever stores visible
user/assistant messages — never system prompts, API keys, or hidden model
reasoning.

### Explicitly NOT built in Phase 6 (do not add without being asked)

- Embeddings, a vector database, or any external RAG pipeline — grounding
  stays deterministic keyword/id retrieval
- Document uploads, company documents, or any DHL-internal document ingestion
- AI-generated quiz questions or AI-generated curriculum — the Tutor explains
  existing content, it doesn't author new lessons/questions
- A second, independently-stored skill/readiness score — `progress-coach`
  mode only explains the existing Phase 4 recommendation engine's output
- Streaming responses — a "Thinking…" state followed by the full reply is
  the deliberate Phase 6 trade-off (see `docs/AI-TUTOR.md`)
- A multi-conversation history browser — one running thread per learner
- Server-side Supabase client / JWT verification in `/api/tutor` — Phase 6
  deliberately preserves Phase 5's client-only Supabase architecture rather
  than adding it (see the "trust boundary" note above)
- Voice, image analysis, or any offensive/exploit/credential-theft content —
  security topics the Tutor can discuss stay strictly defensive, matching
  the Security Fundamentals category's own scope

---

## Phase 7 scope — Business & Logistics Learning (built and frozen)

Phase 7 adds a business/logistics lens on top of the IT curriculum already
built in Phases 2-6 — it does not introduce a general business curriculum,
and every topic connects back to a concrete IT concept, system, or
troubleshooting habit already taught elsewhere in the app.

**Learn**: a 6th category, **Business & Logistics** (24 topics, `lib/data/
learning/businessLogistics.ts`, bringing the library to **80 topics**),
covering three areas: enterprise business foundations (business process,
operational workflow, customer journey, internal-vs-customer-facing systems,
business-critical applications, operational dependency, business continuity,
digital transformation, automation, operational KPIs); generic
freight-forwarding/logistics foundations (logistics, supply chain, freight
forwarding, the shipment lifecycle, transport modes, shipping parties,
customs clearance, warehouse operations, shipment visibility/tracking,
last-mile delivery, shipping documentation, exception management); and
explicit IT-to-business translation (`technology-in-logistics`, mapping core
IT concepts onto the business function each supports; and
`technical-business-translation`, the technical-symptom → affected system →
affected process → operational-impact chain). All content follows the same
10-part structure and confidentiality rules as every other category — generic
industry knowledge or fictional example workflows only, never a confirmed
description of any one company's actual process, systems, org structure, or
SLAs (real workflows vary by organization, shipment type, country, and
transport mode — every topic says so explicitly). A 7th Learning Path,
**Business & Logistics Foundations** (`lib/data/learning/paths.ts`), was
added. **Business & Logistics was added to `CROSS_TEAM_CATEGORIES`**
(`lib/data/learning/index.ts`), alongside IT Service Management and Security
Fundamentals, so it appears in every Team page's "Recommended Learning" —
business/logistics context is equally relevant regardless of which team a
system sits in, the same reasoning already applied to Security. A small
number of reciprocal `relatedTopicIds` links were added from existing IT
topics (Priority & Business Impact, Escalation, System Integration,
Monitoring, High Availability) back to the new category — the same
reciprocal-linking precedent Phase 2C set when it added Security Fundamentals.

**Quizzes**: a Business & Logistics Foundation Assessment (13 scenario-based
questions) and its Learning Path checkpoint (8 questions) in `lib/data/
quizzes/businessLogistics.ts` and `pathCheckpoints.ts` — same architecture,
same content-quality rule (applied judgment, never bare definitions) as every
other quiz. Bringing the library to **14 quizzes / 120 questions total**.

**Advanced Investigations**: two new **business-impact-framed** scenarios in
`lib/data/investigations/` — `shipmentVisibilityOutage.ts` (a simple technical
fault — an expired integration API key — but the learner must reason about
business impact: an organization-wide customer-visibility problem despite a
small internal cause) and `customsDocumentationDelay.ts` (a single "stuck
shipment" turns out to be a systemic booking-form bug affecting several
shipments — practicing revising an initial business-impact assessment as
evidence evolves, and resolving the immediate case without skipping the
escalation needed to protect everyone else affected). Both follow the exact
same `InvestigationScenario` graph/scoring architecture as the original 8
Phase 3 scenarios — no new fields, no new scoring logic. Bringing the total to
**10 investigations**.

**Skills**: Business & Logistics Understanding was added as a 7th skill
(`business-logistics` in `SKILL_IDS`, `lib/data/skills.ts`), mapped onto the
new Learn category and quiz category exactly like every other non-cross-cutting
skill — same 30/30/40 derived-evidence model, no new scoring logic.

**Company context**: a deliberately small, gated scaffold —
`lib/data/companyContext.ts` exports exactly one `CompanyContext` instance
(the current internship's organization name plus a couple of generic public
facts, see `CompanyContext` in `lib/types.ts`) via `getCompanyContext()`,
which returns `null` unless `PRODUCT_DISPLAY_MODE === "private"`
(`lib/product.ts`) — so a future public/shared build never surfaces personal
internship context. Rendered only via `components/CompanyContextCard.tsx` on
the Dashboard. This is explicitly **not** a company-management feature —
there is exactly one instance of the type in the app. `publicFacts` must stay
limited to genuinely, generically public knowledge (per the confidentiality
rules at the top of this file); `observations` is deliberately always empty —
actual personal observations continue to render live from Daily Log entries
via `TeamObservations.tsx`, never duplicated here.

**AI Tutor / search**: no code changes were needed — `lib/ai/tutorContext.ts`
grounds deterministically against `learningTopics` (already inclusive of the
new category), and `searchTopics()` / the `/learn` category filter both read
`LEARNING_CATEGORIES` generically. Grounding against the new content was
verified with a live Anthropic API call during this phase.

### Explicitly NOT built in Phase 7 (do not add without being asked)

- A dedicated "How DHL Works" page/route — the original Phase 7 idea in
  `PRODUCT-ROADMAP.md`'s pre-Phase-7 text; superseded by folding this context
  into the existing Learn/Team/Dashboard surfaces instead, per the confidentiality
  rules (a standalone company page invites exactly the kind of DHL-specific
  claims this file prohibits)
- Any DHL-specific fact, system, SLA, org structure, or process not explicitly
  told to Claude by Nicolas — `CompanyContext.publicFacts` stays limited to
  genuinely public, generic knowledge
- A company-management feature, multiple organizations, or any UI to edit
  `CompanyContext` — it is a single, hand-edited data file, not a feature
- Any new scoring, storage, or validation pattern — Phase 7 content reuses
  every Phase 2-4 architecture exactly (topics/paths/quizzes/investigations/
  skills), so nothing here should ever need a second content-validation shape

---

## Phase 8 scope — Analytics / Manager View (structurally built)

Phase 8 adds a **reporting layer** over training activity that already
exists in Phases 2-4 — never a second stored score, and never a
job-readiness/certification/professional-competence claim (same rule as
Phase 4's `/progress`). Full architecture, source-data mapping, and privacy
writeup live in `dhl-training-hub/docs/ANALYTICS.md` — read that before
touching anything under `src/lib/analytics/`, `src/app/analytics/`, or
`src/app/manager-preview/`.

**`/progress` vs `/analytics`** are deliberately distinct, not duplicates:
`/progress` = "what should I learn next?" (skill breakdown + deterministic
recommendations, unchanged from Phase 4); `/analytics` = "what have I done,
and how has it developed?" (overview, per-quiz score trends, per-investigation
history grouped by area, learning path progress, a structured activity
timeline, weekly activity counts, and a shareable summary). Both pages call
the *same* `calculateAllSkillProgress()` / `getRecommendations()` functions
Phase 4 already built — Phase 8 never recomputes a skill score or
recommendation a second way.

**Derivation layer** (`src/lib/analytics/`) — every function is pure and
reads only the three existing evidence sources (`learning-topic-progress`,
`quiz-attempts`, `investigation-completions`) plus static curriculum data.
`pureCalculations.ts` deliberately has zero `@/`-aliased imports so its trend
direction, ISO-week bucketing, and averaging logic can be unit-tested
directly with Node's built-in test runner (mirrors the Phase 1-7 regression
fix's `mergeCloudState.ts` pattern) — the other analytics files build on top
of it rather than duplicating that math. Types live in `lib/types.ts`'s
"Analytics (Phase 8)" section, per the existing one-file-per-project
type-location convention.

**Activity Timeline is built only from genuinely timestamped records** — quiz
attempts and investigation completions. Learn topic completions are
deliberately excluded from the timeline (not from the Training Overview's
aggregate counts) because the current data model has no per-topic completion
timestamp exposed to the client — see `docs/ANALYTICS.md` for the full
reasoning and the low-risk (but not attempted) path to add one later. No
timestamp is ever invented.

**Three new routes**, all client components following the existing
"every page hydrates its own state after mount" architecture: `/analytics`
(the full page), `/analytics/summary` (a concise, printable summary —
`window.print()` + print CSS, no server-side PDF generation), and
`/manager-preview` (a **read-only preview of the signed-in learner's own
data** — explicitly not a real multi-user manager account, never queries
another user's `user_id`, never weakens RLS). `/analytics/summary` and
`/manager-preview` both build from one shared `computeTrainingSummary()`
bundle so their numbers always agree.

**Privacy exclusions are enforced by construction**: no Phase 8 file ever
imports `useDailyLogEntries`, `useCvAchievements`, or `useTutorConversation`
— there is no free-text content available to leak, not just a runtime filter
hiding it. Every Phase 8 page carries a visible disclaimer stating this
boundary explicitly, per the confidentiality rules at the top of this file.

**Zero Supabase schema changes** — every analytics function reads through
the existing Phase 5 hooks; no new table, column, or RLS policy.

**Tutor integration**: reuses the existing `progress-coach` mode
(`AskTutorLink params={{ mode: "progress-coach" }}`, same as `/progress`) —
no new Tutor mode was added, since Phase 6's `progress-coach` prompt
("explain the learner's PROGRESS SUMMARY... you are explaining and
encouraging, not generating new recommendations") already covers explaining
analytics content.

### Explicitly NOT built in Phase 8 (do not add without being asked)

- Real multi-user manager accounts, organization accounts, cohorts, trainer
  invitations, or an admin dashboard
- SSO, manager access to other users' data, or any RLS change
- Public share links, email reports, or manager access tokens
- An analytics database table, materialized scores, or any second stored
  readiness/analytics truth
- A heavy charting library — `TrendSparkline` stays a small inline-SVG
  component

---

## Phase 9 scope — Enterprise Pilot Readiness (structurally built)

Phase 9 makes the app presentable as a credible pilot pitch — never a claim
that it *is* production-ready. It does not add multi-tenancy, real manager
accounts, SSO, or an admin console; see "Explicitly NOT built" below.

**Pilot pages**: `/pilot` (value proposition, problem/solution, intended
users, potential company use, pilot use-case templates, and a "company
customization preview" section clearly labeled "Enterprise features
roadmap — not currently implemented"), `/pilot/demo` (a guided product tour
of real links into the actual app — never fake accounts or a separate demo
environment), `/pilot/readiness` (an honest, self-assessed checklist —
Supabase/AI Tutor configuration checked live via `useAuth()` and `GET
/api/tutor` rather than hardcoded), and `/pilot/report` (an
assignment-centric structured summary, distinct from `/analytics/summary` —
disclaimer: "Pilot training summary — not a certification or employee
performance evaluation"). None of these claim DHL endorsement, official DHL
training, real DHL system access, validation, or certification — same rule
as every other page.

**Training Assignments** (`src/lib/data/assignments.ts`): 4 static,
config-driven `TrainingAssignment` templates (Enterprise IT Intern
Foundation, Infrastructure & Network Foundation, Applications Support
Foundation, Business & Logistics Technology Foundation), each just a named
bundle of `requiredPathIds` / `requiredQuizIds` / `requiredScenarioIds` (plus
optional `recommendedTopicIds`) — generic templates, never company-specific
programs. Content-validated at module load, same pattern as Learn/
Investigations/Quizzes/Skills. `src/lib/assignmentProgress.ts`
(`computeAssignmentProgress()`) derives completion **against the required
list only** — a path counts done once every topic is completed, a quiz once
it has any recorded attempt, an investigation once it has a completion
record — and is explicitly **not** a new competency score (`AssignmentProgress`
is a distinct type from `SkillProgress`, never blended with the 30/30/40
weighting). A learner activates at most one assignment for themselves via
`useSelectedAssignment()` (`src/lib/assignmentSelection.ts`) — a single
`selected-assignment-id` `localStorage` key, deliberately **not** a new
Supabase table (Phase 9's own "prefer the simplest safe option, don't
redesign the whole backend" guidance). `/assignments` lists all templates
with live progress; a compact `CurrentAssignmentCard` sits on the Dashboard;
`/manager-preview` and `/pilot/report` both gained a "Current Training
Assignment" section reusing the same derivation.

**Onboarding** (`/onboarding`, `src/lib/onboarding.ts`): a 3-question wizard
(goal, focus area, experience level — `ONBOARDING_GOALS` /
`ONBOARDING_FOCUS_AREAS` / `ONBOARDING_EXPERIENCE_LEVELS` in `lib/types.ts`)
stored via `useOnboardingPreferences()` (localStorage only, same pattern as
assignment selection). `recommendAssignmentId()` is a **deterministic**
focus-area → assignment-id lookup table — no AI, no complex
personalization. Never collects employer, salary, age, or other private
profile data.

**Recommendation engine integration** (Part R): `lib/recommendations.ts`
gained one **additive, optional** field on `RecommendationInput`
(`assignmentProgress?: AssignmentProgress | null`) and one new generator,
`assignmentRequirementRecommendations()`, that surfaces an active
assignment's own precomputed `nextRequiredAction` at priority 95 (just above
the weak-quiz-area signal) — every existing caller that doesn't pass this
field behaves exactly as before. This is the only change to the engine; nothing
was rewritten.

**AI Tutor integration** (Part S): `TutorProgressSummary` gained two optional
fields, `currentAssignmentTitle` and `onboardingFocusArea`
(`lib/ai/types.ts`), populated client-side by
`useTutorProgressSummary.ts` and rendered into the system prompt's PROGRESS
SUMMARY block (`lib/ai/tutorPrompt.ts`). `/api/tutor/route.ts`'s
`sanitizeProgressSummary` validates both against real static data (an actual
`TrainingAssignment.title`, an actual `ONBOARDING_FOCUS_AREAS` label) — same
"never trust arbitrary client text" rule as every other Tutor context field.
The Tutor still never infers real employer systems and stays governed by the
same base system prompt rules.

**Privacy & Data Safety** (`/privacy`): a plain-English, product-level page
(data stored, data deliberately not collected, the AI Tutor boundary,
Analytics/Manager Preview exclusions) — not a fabricated legal policy, and
linked from the footer of every page.

**Company context boundary** (Part K): `lib/data/companyContext.ts`'s
`disclaimer` text now leads with "Personal internship context — not official
company training material" — the existing gated, single-instance
`CompanyContext` architecture from Phase 7 is otherwise unchanged.

**Pilot Proposal** (`dhl-training-hub/docs/PILOT-PROPOSAL.md`): a reusable,
product-level description of a suggested small pilot (5-15 users, 2-4 weeks,
one Training Assignment per participant) and success signals to observe —
explicitly no quantified ROI claim and no pricing/commercial terms.

### Explicitly NOT built in Phase 9 (do not add without being asked)

- Real organization accounts, multi-user manager accounts, cohorts, an admin
  portal, or trainer invitations
- SSO (Microsoft Entra, SAML, SCIM), public sharing, or email invitations
- Payments, subscriptions, or any pricing/commercial terms in-product
- Production deployment, custom company domains, or real DHL integrations
- Company document uploads or vector RAG
- A new Supabase table for Training Assignments or onboarding preferences —
  both stay `localStorage`-only by deliberate design (see above)
- A second, independently-computed competency/readiness score for
  assignments — `AssignmentProgress` is completion-against-required-list
  only, always derived from the same three evidence sources every other
  derived-progress feature reads

---

## Phase 10 scope — Final QA, Polish, Deployment & Portfolio Readiness (complete)

Phase 10 is the **final planned build phase**. It is a finalization pass over
Phases 1-9 — QA, polish, consistency, documentation, demo readiness, and
deployment readiness — not a new feature phase. It supersedes
`PRODUCT-ROADMAP.md`'s original "Phase 10 — Production/Commercial Readiness"
description (full enterprise production readiness — SSO, RBAC, encrypted
storage, audit logging, a formal security review); that speculative future
scope still lives in `ENTERPRISE-READINESS.md`, unimplemented, only pursued if
a real pilot ever validates demand — it is explicitly **not** numbered as a
phase, so that this project's phase sequence ends cleanly at Phase 10 rather
than implying an open-ended Phase 11+.

**Verified baseline before any change**: `npm run build`, `npm run lint`, and
`npm test` (14/14) were all already clean, and `npm audit` reported 0
vulnerabilities — Phase 10 is polish on a structurally sound base, not a
rescue.

**QA audit findings and fixes**: a handful of pages (`/tickets`, `/teams`,
`/daily-log`, `/cv-tracker`) were missing a page-level `<h1>` — `SectionHeading`
(`src/components/SectionHeading.tsx`) gained an optional `level` prop
(`"h1" | "h2"`, defaulting to `"h2"`) rather than introducing a second heading
component, and those four pages now pass `level="h1"` on their top heading.
The Dashboard's `DashboardProgressSummary` and `AnalyticsDashboardCard` were
found to render the same three counts (topics/assessments/investigations)
side by side — `AnalyticsDashboardCard` was removed and its one link folded
into `DashboardProgressSummary`'s header as a second "View analytics →" link,
since it had no other caller. No other QA issues (broken links, terminology
drift, hype language, stray DHL branding, hydration/console issues) were
found — see the Phase 10 completion report for the full audit trail.

**Navigation** (`src/components/Nav.tsx`): the flat 12-link list was grouped
into four sections (Learn: Dashboard/Learn/Teams/Ticket Simulator/Assessments;
Progress: Progress/Analytics/Assignments; Tools: AI Tutor/Daily Log/CV
Tracker; Pilot) with a divider between groups on wide screens, and a proper
hamburger-toggled mobile panel (grouped, with section labels) replaces the old
`flex-wrap`-only mobile behavior, which could push page content down several
rows on narrow screens. The Nav's "Tutor" label was corrected to "AI Tutor"
to match every other reference to the feature in the app; "Assessments" was
confirmed (not changed) as the app's consistent user-facing term for the quiz
feature — `/quizzes` is only ever a URL slug, never shown as a label.
Manager Preview, Privacy, and Onboarding remain deliberately reachable only
via footer/in-page links, not top nav, to keep the nav from growing further.

**Security, privacy, and persistence**: a full read-only audit (secrets in
git history and tracked files, `.gitignore`, the `ANTHROPIC_API_KEY`
server/client boundary, Supabase RLS on all 10 tables, the Phase 8/9 privacy
exclusions, `CompanyContext` scope, and a scan of ticket/investigation/daily
journal content for anything real) found **no issues** — verdict: safe to
publish publicly. A separate audit of all 7 persistence domains, the
`mergeCloudState.ts` merge-not-replace logic from the Phase 1-7 regression
fix (`a8e9566`), analytics correctness (no NaN/double-counting/fabricated
timestamps), assignment/onboarding derivation, and the AI Tutor's grounding
cap/coach-mode structural non-disclosure/rate limiting/error handling also
found **no issues** — every domain matches its documented Phase 5-9
architecture exactly. Neither audit required a code change; see the Phase 10
completion report for the manual browser regression steps still owed (this
project has no browser-automation suite, so live persistence-under-real-
network-timing can only be confirmed by Nicolas manually, in both Local Demo
Mode and, if configured, Cloud Mode).

**New documentation** (`dhl-training-hub/docs/`): `DEMO-SCRIPT.md` (a ~5-minute
general walkthrough plus a separate, differently-framed internship-manager
demo script — "I built this independently to structure what I was learning,"
never "I built DHL's training system"), `PORTFOLIO-STORY.md` (interview
answers, freshly recomputed factual counts, and CV bullet / GitHub
description / LinkedIn description options — no user/ROI/production-adoption
claims), `SCREENSHOTS.md` (an exact shot list with a "remove before
publishing" column per screenshot), and `DEPLOYMENT.md` (environment
variables, Supabase redirect-URL configuration, Vercel-oriented deployment
steps, post-deploy smoke tests, and the explicit production/pilot limitations
list — no deployment was actually performed). The root `README.md` gained
explicit Problem, Architecture, AI Tutor Architecture, Data/Privacy
Architecture, and Testing sections it previously lacked as standalone
headers, plus links to all four new docs.

**Verified factual counts** (recomputed directly from source during Phase 10,
not carried over from memory — see `PORTFOLIO-STORY.md`): 80 Learn topics
across 6 categories, 7 Learning Paths, 34 Quick Practice tickets, 10 Advanced
Investigations, 14 quizzes / 120 questions, 7 skills, 4 assignment templates,
10 Supabase tables (8 from Phase 5 + 2 from Phase 6), all RLS-enabled.

### Explicitly NOT built in Phase 10 (do not add without being asked)

- Any new feature, route, or data domain — Phase 10 is polish/QA/docs only,
  never a vehicle for scope creep
- Real browser-automation/E2E testing — this environment has none; the
  manual regression steps in the Phase 10 completion report and
  `DEPLOYMENT.md`'s smoke-test list fill that gap for now
- An actual deployment to Vercel or anywhere else — `DEPLOYMENT.md` documents
  how to, but Phase 10 did not perform one
- Real screenshots — `SCREENSHOTS.md` is a shot list, not screenshots; none
  were captured (capturing requires a live browser, and risks including real
  personal content if done carelessly — left to Nicolas)
- Any dependency upgrade at all, major or patch (TypeScript 5→7, ESLint 9→10,
  `@types/node` 20→26, and even the patch-level `next`/`eslint-config-next`
  16.3.2→16.3.4 were all identified as available via `npm outdated` and
  deliberately left alone) — stability over chasing latest versions, per
  this phase's own brief; nothing here is a known bug affecting this app
- Phase 11, or any further numbered phase — Phase 10 is the last one; further
  work is either a fix to something Phase 10 found, or lives in
  `ENTERPRISE-READINESS.md` as an unplanned, unstarted future direction

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
    src/lib/data/learning/          — Learn topic content (80 topics, 6 categories) + paths.ts
    src/lib/data/learning/businessLogistics.ts — Business & Logistics category (24 topics, Phase 7)
    src/lib/learningProgress.ts     — Learn completion tracking hook
    src/lib/data/investigations/    — Advanced Investigations content (10 scenarios)
    src/lib/investigationProgress.ts — Advanced Investigations progress/storage hook
    src/lib/investigationScoring.ts  — generic, scenario-agnostic scoring engine
    src/lib/data/quizzes/           — Quiz content (14 quizzes, 120 questions)
    src/lib/quizAttempts.ts         — quiz attempt storage hook (cloud-aware, Phase 5)
    src/lib/data/skills.ts          — skill definitions + derived topic/quiz/investigation mapping (7 skills)
    src/lib/data/companyContext.ts  — single gated CompanyContext instance (Phase 7, private-mode only)
    src/lib/skillProgress.ts        — skill/readiness calculation (30/30/40 weighting)
    src/lib/recommendations.ts      — deterministic next-action recommendation engine
    src/lib/supabase/client.ts      — browser Supabase client + isSupabaseConfigured switch
    src/lib/supabase/database.types.ts — hand-written DB types (see file header to regenerate)
    src/lib/ai/                     — AI provider abstraction, grounding, system prompt (Phase 6)
    src/lib/tutorConversation.ts    — Tutor conversation storage hook (cloud-aware, Phase 6)
    src/app/api/tutor/route.ts      — server-only Anthropic-calling route handler (Phase 6)
    src/app/tutor/                  — /tutor page
    supabase/migrations/0002_tutor.sql — tutor conversation schema + RLS (Phase 6)
    docs/AI-TUTOR.md                — AI Tutor architecture, grounding, privacy, setup guide
    src/lib/auth/AuthProvider.tsx   — auth context/provider, wraps the whole app
    src/lib/repositories/           — the only code that talks to Supabase directly
    src/lib/migration.ts            — one-time legacy localStorage -> cloud migration
    src/lib/teamChecklist.ts, dailyLog.ts, cvAchievements.ts — cloud-aware domain hooks
    src/lib/mergeCloudState.ts      — merge-not-replace cloud-sync helpers (Phase 1-7 regression fix)
    supabase/migrations/0001_init.sql — schema, indexes, RLS policies
    docs/SUPABASE-SETUP.md          — step-by-step cloud setup guide
    src/lib/analytics/              — analytics derivation layer (Phase 8, pure functions)
    src/app/analytics/              — /analytics and /analytics/summary pages
    src/app/manager-preview/        — /manager-preview read-only preview page
    docs/ANALYTICS.md               — analytics architecture, source data, privacy writeup
    src/lib/data/assignments.ts     — Training Assignment templates (Phase 9, 4 static templates)
    src/lib/assignmentProgress.ts   — assignment completion derivation (required-list only, not a score)
    src/lib/assignmentSelection.ts  — useSelectedAssignment() localStorage hook (Phase 9)
    src/lib/onboarding.ts           — useOnboardingPreferences() + deterministic assignment mapping
    src/app/assignments/            — /assignments — browse/activate Training Assignments
    src/app/onboarding/             — /onboarding — 3-question wizard
    src/app/pilot/                  — /pilot, /pilot/demo, /pilot/readiness, /pilot/report
    src/app/privacy/                — /privacy — Data Safety page
    docs/PILOT-PROPOSAL.md          — reusable pilot description (Phase 9, no ROI/pricing claims)
```
