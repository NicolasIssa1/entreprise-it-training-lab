# Portfolio Story (Phase 10, counts updated post-Phase-10)

Interview-ready, CV-ready, LinkedIn-ready material for **Enterprise IT
Training Lab**. Every factual count below was recomputed directly from the
codebase during Phase 10, then again after the post-Phase-10 BPO & Process
Automation learning expansion (see `docs/BPO-LEARNING.md`) — not carried
over from memory. Nothing here claims real users, ROI, or production
adoption; see `CLAUDE.md`'s CV Achievement honesty rule, which this document
follows too.

---

## Verified counts (recomputed after the BPO & Process Automation expansion)

- **103** Learn topics across **7** categories (IT Service Management,
  Infrastructure, Networking, Applications, Security Fundamentals, Business &
  Logistics, BPO & Process Automation)
- **8** curated Learning Paths
- **34** Quick Practice tickets + **13** Advanced Investigation scenarios (47
  troubleshooting exercises total)
- **16** quizzes / **143** scenario-based questions
- **8** derived skills, each combining Learning (30%) + Knowledge (30%) +
  Practical (40%) evidence
- **5** Training Assignment templates
- **8 + 2 = 10** Supabase tables (Phase 5's 8 + Phase 6's 2 Tutor tables),
  every one with Row Level Security enabled
- **20/20** unit tests passing, `npm run build`/`npm run lint` clean, `npm
  audit`: 0 vulnerabilities (all reconfirmed after the BPO expansion)

---

## What did you build?

A full-stack internship training platform I use during my own DHL Dubai IT
internship — a Dashboard, a 103-topic enterprise IT and business-process
learning library, a two-tier ticket/troubleshooting simulator (fixed-scenario tickets plus
branching multi-step investigations), scenario-based knowledge assessments, a
derived skill/analytics layer, a learning journal, a CV achievement tracker,
and an optional AI tutor grounded in the app's own curriculum. It runs with
zero setup in a pure browser-storage mode, and optionally supports real
accounts and cross-device sync via Supabase.

## Why did you build it?

I wanted to get more out of the internship than passive observation. Rather
than just taking notes, I built a system that forced me to structure what I
was learning — connect it back to my Computer Science with AI degree, turn
vague exposure into concrete, testable understanding, and track my own
progress honestly instead of assuming I'd absorbed something because someone
explained it to me once.

## Architecture

- **Next.js (App Router) + React + TypeScript + Tailwind CSS**, deployed as a
  set of client components that each hydrate their own state after mount —
  deliberately no server-rendered personalized content, so there's no need for
  session-refreshing middleware.
- **Static curriculum as application code, not a CMS.** All 103 topics, 16
  quizzes, 13 investigation scenarios, and 34 tickets are typed TypeScript
  data, validated at build time by lightweight custom validators (duplicate
  IDs, dangling references, unreachable graph nodes) that fail the build
  loudly rather than shipping a broken cross-link.
- **Local-first, optionally cloud-backed persistence.** Every piece of
  user-generated data (learning progress, quiz attempts, investigation state,
  daily log, CV achievements, tutor conversations) lives in `localStorage`
  first. With a Supabase project configured, the same data also syncs to
  Postgres behind real authentication and Row Level Security — but the app
  never *requires* that; unset the environment variables and it runs exactly
  as it did before Supabase existed.
- **A thin repository layer** is the only code that talks to Supabase
  directly; domain hooks (`useLearningProgress`, `useQuizAttempts`, etc.) are
  the only thing components call, and their external API never changed when
  cloud sync was added underneath them.
- **A server-only AI Tutor route** calls the Anthropic API from a Next.js
  Route Handler — the API key never reaches client code, verified against the
  actual production build output.
- **Every derived score is computed once.** Skill percentages, analytics, and
  assignment progress all read the same three evidence sources (completed
  topics, quiz attempts, investigation completions) through one shared
  calculation path — there's no second, independently-stored "readiness"
  number that could drift out of sync with the first.

## Most difficult engineering challenge

A persistence race condition, found and fixed between phases (commit
`a8e9566`, "Fix Phase 1-7 persistence regressions"). Every domain hook was
built to fetch cloud data on mount and treat it as authoritative once a user
signed in — but that meant a straightforward bug: if a learner made a local
change and then a cloud fetch resolved afterward (or a component remounted),
the fetch would **overwrite** local state with a stale cloud snapshot,
silently discarding whatever had just been saved. It wasn't visible in casual
testing because the timing window is narrow — it surfaces under real network
latency, not instant local mocks.

The fix was a **merge-not-replace** strategy (`lib/mergeCloudState.ts`):
instead of `setState(cloudData)`, every hook now merges local and cloud state
key-by-key, letting cloud win only where both sides actually have the same
record, and always preserving a local-only record that cloud hasn't seen yet.
I wrote this as a small, dependency-free module specifically so it could be
unit-tested directly with Node's built-in test runner without pulling in the
rest of the app — the regression test that reproduces the original bug
(`mergeRecordPreferCloud keeps a local-only key instead of dropping it`) is
still in the suite today. The broader lesson: "cloud is authoritative" is a
correct policy for *conflicts*, but the wrong policy for *timing* — a fetch
resolving late should never look identical to a real conflict.

## Security/privacy decisions

- **Row Level Security is the real access boundary**, not client-side route
  guarding — every one of the 10 Supabase tables enforces `auth.uid() =
  user_id` at the database level, so even a compromised or buggy frontend
  can't read another user's rows.
- **The Anthropic API key is server-only**, read in exactly one module,
  imported only by a Route Handler — confirmed absent from every client JS
  bundle by inspecting the actual production build output, not just by
  convention.
- **Confidentiality was a design constraint from day one**, not a policy
  applied after the fact: no real DHL data, employee/customer names, ticket
  numbers, internal URLs, or credentials are ever entered, stored, or
  generated anywhere in the app — enforced structurally in places it matters
  most (e.g. the Analytics/Manager Preview/Pilot Report pages simply never
  import the Daily Log or CV Achievement hooks, so there's no free-text
  content available to leak even by accident).
- **Every AI/analytics/manager-facing surface is explicitly labeled as an
  educational indicator, never a validated competency or certification claim**
  — a product-honesty decision as much as a technical one.

## AI Tutor architecture

A grounded assistant, not a general chatbot: retrieval is deterministic
keyword/ID matching against the existing Learn library (no embeddings, no
vector database), capped at 6 topics per request. Seven trusted "modes"
(general tutor, topic tutor, quiz coach, quiz review, investigation coach,
investigation review, progress coach) are always set by which link the
learner clicked — never inferred from free text — because a coach mode has a
hard rule it cannot violate: it must never reveal a quiz's correct answer or
an investigation's hidden outcome. That's enforced structurally, not just by
prompting — in coach mode, the outcome/answer text is simply never included
in what gets sent to the model in the first place, so there's nothing to leak
even if the system prompt were bypassed.

## What would you build next?

Real interactive/browser-based QA automation (this Phase 10 pass verified
persistence logic by reading the merge code and unit-testing it directly,
plus route-level smoke tests — genuine multi-tab, sign-out/sign-in browser
regression testing is still a manual step for me to run); a real Supabase
project and Anthropic key connected end-to-end outside local development; and,
if a real pilot ever validated demand, the actual production-readiness list
in `ENTERPRISE-READINESS.md` (SSO, RBAC, audit logging, a real multi-user
manager view) — deliberately not built speculatively.

## What did you personally learn?

That "it works when I tested it" and "it works under real timing conditions"
are different claims — the persistence bug only existed under conditions my
own manual testing didn't naturally hit. And that scope discipline is a skill
in itself: this project could have sprawled into a dozen half-finished
directions, and the thing that kept it shippable phase-by-phase was writing
down, in `CLAUDE.md`, exactly what each phase was *not* allowed to become
before starting it.

---

## CV bullet options

Pick the version matching the job you're applying for. All three describe the
same project — verified counts only, no user/ROI claims.

**Software engineering version:**
> Built a full-stack Next.js/TypeScript training platform (103 lessons, 34
> fixed-scenario + 13 branching troubleshooting simulations, 16 scenario-based
> assessments) with a local-first persistence layer that optionally syncs to
> Supabase Postgres under Row Level Security; diagnosed and fixed a
> cloud-sync race condition with a unit-tested merge-not-replace strategy.

**AI-focused version:**
> Designed and built a curriculum-grounded AI tutor (Anthropic Claude API)
> for an internal training platform — deterministic keyword-based retrieval
> instead of embeddings/RAG, seven context-aware modes with structural
> guardrails preventing answer leakage during active assessments, and a
> server-only integration verified to never expose API credentials to the
> client.

**Enterprise IT / business version:**
> Independently built an enterprise IT training simulator during a DHL
> internship — 103 structured lessons and 47 realistic troubleshooting
> scenarios spanning Infrastructure, Applications, Networking, Security,
> Business/Logistics, and BPO & Process Automation — to translate day-to-day
> exposure into a structured, self-assessed skill progression across 8
> competency areas.

---

## GitHub description

> A full-stack IT training simulator (Next.js/TypeScript/Supabase/Anthropic)
> with 103 lessons, branching troubleshooting investigations, scenario
> quizzes, derived skill analytics, and an optional curriculum-grounded AI
> tutor.

## Short README intro (one paragraph)

> Enterprise IT Training Lab is a personal, full-stack training platform for
> learning how enterprise IT actually works — a 103-topic learning library, a
> two-tier ticket/troubleshooting simulator (fixed scenarios plus branching
> multi-step investigations), scenario-based knowledge assessments, derived
> skill analytics, and an optional AI tutor grounded in the app's own
> curriculum. It runs with zero setup in a local-only mode, and optionally
> supports real accounts and cross-device sync via Supabase.

## LinkedIn project description (2-3 sentences)

> I built Enterprise IT Training Lab, a full-stack training platform (Next.js,
> TypeScript, Supabase, Anthropic's API), to structure what I was learning
> during my IT internship — 103 lessons, branching troubleshooting scenarios,
> scenario-based assessments, and a grounded AI tutor, all with derived,
> honestly-labeled skill analytics instead of gamified scoring. It's a
> personal project, not an official product of any company, and every
> scenario in it is fictional and generic by design.
