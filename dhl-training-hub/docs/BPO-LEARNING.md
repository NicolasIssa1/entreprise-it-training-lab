# BPO & Process Automation Learning Expansion

Post-Phase-10 addition. **Not Phase 11** — the 10-phase roadmap in
`CLAUDE.md`/`PRODUCT-ROADMAP.md` is complete and frozen; this is a focused,
additive learning-content expansion on top of it, documented here the same
way `AI-TUTOR.md` and `ANALYTICS.md` document their own feature areas.

## Why this was added

Nicolas works with the IT + BPO team during his DHL Global Forwarding
internship. A BPO colleague asked him to learn Microsoft Power Automate so
they could collaborate on a real automation/process problem that had
previously had issues. Before starting that real work, Nicolas wanted the
app to teach the underlying methodology properly: how to understand a
business process before automating it, and the Power Automate concepts
needed to build, test, and troubleshoot a real flow.

**BPO** in this app always means **Business Process Optimization** — not
Business Process Outsourcing, a different, unrelated concept that commonly
uses the same three letters. The first topic in the new category exists
specifically to make this unambiguous (`bpo-process-optimization` in
`src/lib/data/learning/bpoAutomation.ts`).

## Learning objectives

By the end of this learning path, the goal is to be able to:

- Understand and document a business process before proposing any change to it (As-Is)
- Find pain points and bottlenecks with evidence, and trace them to a root cause (5 Whys)
- Judge whether a process is actually a good automation candidate
- Gather requirements properly, including failure/exception behavior and ownership
- Design an improved process (To-Be) traceable to specific evidence
- Understand core Microsoft Power Automate concepts: triggers, actions, conditions, loops, connectors
- Recognize common Excel-automation and approval-flow failure patterns
- Troubleshoot a broken flow systematically ("don't guess, gather evidence" — this app's existing core principle, applied to automation)
- Understand why an automation needs an owner, documentation, and a change process — not just working logic

## Content added

- **Learn category**: BPO & Process Automation — 23 topics, split into BPO
  Foundations (12 topics: BPO itself, process/workflow/procedure, process
  owner & stakeholders, As-Is, To-Be, process mapping & swimlanes, pain
  points & bottlenecks, the 5 Whys, standardization & value-adding work,
  automation opportunity assessment, the BPO & Automation lifecycle, and
  requirements gathering) and Process Automation (11 topics: Power Automate
  fundamentals, triggers & actions, conditions & branching, loops/Apply to
  Each, connectors & data sources, Excel automation patterns, approvals &
  notifications, exception handling/testing/monitoring, common Power
  Automate failure patterns, troubleshooting a broken flow, and automation
  governance & ownership). Brings the Learn library to **103 topics across 7
  categories**.
- **Learning Path**: BPO & Process Automation Foundations — a curated
  15-topic subset of the 23, following the same "curated order, not every
  topic required" pattern as every other Learning Path. Brings the total to
  **8 Learning Paths**.
- **Skill**: Process Optimization & Automation — the 8th skill, using the
  exact same derived 30% Learning / 30% Knowledge / 40% Practical evidence
  model as every other skill (no new scoring logic).
- **Quiz**: BPO & Process Automation Foundation Assessment (15 scenario-based
  questions) plus its Learning Path checkpoint (8 questions) — same
  architecture, same "applied judgment, never bare definitions" content-
  quality rule as every other quiz. Brings the library to **16 quizzes / 143
  questions**.
- **Advanced Investigations**: 3 new branching scenarios — see below. Brings
  the total to **13 investigations**.
- **Assignment**: BPO & Process Automation Foundation — bundles the new
  path, quiz, and all 3 new investigations. Brings the total to **5
  assignment templates**.

## Power Automate scope

Deliberately **conceptual and practical readiness, not a certification
course**. Covered: automated/instant/scheduled cloud flows; triggers and
actions; conditions and branching (if/else); loops (Apply to Each) and the
performance cost of nesting them; connectors and connections (and why a
connection tied to one person's account is fragile); the very common
Excel-table automation pattern and its practical limitations (Table
formatting, column-name sensitivity, concurrency, blank/dirty values);
approvals and notifications, including the classic self-triggering-loop /
duplicate-notification bug and the idempotency fix for it; exception
handling and testing tools (Run History, Configure Run After, Scope, retry
policy) and the normal/edge/failure testing categories; a generic checklist
of common failure patterns; a dedicated, step-by-step "troubleshoot a broken
flow" framework; and automation governance/ownership (why a flow that worked
for a year can suddenly break months later). **Not covered, deliberately**:
Microsoft licensing depth, RPA/Power Automate Desktop, AI Builder, premium
connector pricing, or any exam-style certification content.

## Advanced Investigations added

1. **Daily Excel Reporting Automation Keeps Missing Rows** — a scheduled
   flow silently truncates results once its Excel table grows past the
   default row-return limit on the List Rows action; practicing recognizing
   a data-access problem versus a logic problem.
2. **Approval Flow Creates Duplicate Notifications** — an approval flow's
   own post-approval update re-satisfies its own "created or modified"
   trigger, causing a self-triggering loop; practicing the idempotency
   concept as the durable fix.
3. **Previously Working Flow Suddenly Fails** — a flow that ran reliably for
   over a year fails completely after its connection's owning account
   (belonging to an employee who left) is disabled; practicing tracing a
   technical failure back to a governance/ownership root cause. This
   scenario directly illustrates the "worked before, still has problems"
   pattern the real colleague situation described — using entirely fictional
   people, systems, and data.

All three follow the exact same `InvestigationScenario` graph/scoring
architecture as the original 10 scenarios (scope → evidence → diagnose →
resolve/escalate → verify → document, with several genuinely reasonable
choices at each step) — no new fields, no new scoring logic.

## Real Project Prep — privacy boundary

`/bpo/project-prep` is a **private, personal worksheet**, not a DHL-specific
feature — it exists so Nicolas has somewhere safe to organize his own
thinking before a real conversation about a real automation. It is
deliberately treated more strictly than every other domain in the app:

- **Local-only, never synced to Supabase** — unlike every Phase 5 domain
  hook, `lib/bpoProjectPrep.ts` makes no repository call at all.
- **Never sent to the AI Tutor** — not part of the Tutor's progress summary
  or grounding context, under any mode.
- **Never surfaced in Analytics, Manager Preview, or the Pilot Report** —
  none of those pages import this hook, the same structural (not just
  runtime-filtered) privacy pattern already used for Daily Log and CV
  Tracker content.
- **Still identity-scoped** via `scopedKey()` (the account-isolation fix
  from commit `7326665`), so a second account on the same browser never
  inherits the first account's notes — even though nothing here ever leaves
  the browser regardless of which account is signed in.
- The page itself carries an explicit "PRIVATE PERSONAL NOTES" warning not
  to enter credentials, customer data, shipment/customer identifiers,
  confidential process information, internal URLs, or restricted details —
  the same confidentiality rules that apply everywhere else in this app.

## Known limitations

- 23 new topics is above the "approximately 18-22" guideline originally
  suggested for this expansion — the extra 1-3 topics cover error
  handling/troubleshooting/governance content explicitly flagged as critical
  given the real colleague situation ("worked before, still has problems"),
  rather than padding.
- No new automated route/browser tests were added — this project has no
  browser-automation suite (see `CLAUDE.md`'s Phase 10 section); the new
  routes (`/bpo/project-prep`, `/bpo/power-automate-cheatsheet`) were
  verified via `next build`'s static generation and manual review only.
- `useBpoProjectPrep()` itself has no unit test — this project's test suite
  only covers pure functions (`storageScope.test.ts`,
  `mergeCloudState.test.ts`, `pureCalculations.test.ts`), not React hooks;
  its `scopedKey()` usage is covered indirectly by `storageScope.test.ts`'s
  existing regression tests.
- Power Automate content is conceptual, written from documented product
  behavior — it was not built or verified against a live Power Automate
  tenant.
