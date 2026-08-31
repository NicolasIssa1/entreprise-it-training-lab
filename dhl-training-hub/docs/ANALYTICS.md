# Analytics / Manager View (Phase 8)

Architecture, source data, privacy exclusions, and known limitations for the
`/analytics`, `/analytics/summary`, and `/manager-preview` pages. Read
`CLAUDE.md`'s Phase 8 section first for the product-level scope; this file is
the implementation-level companion.

## What this is, and isn't

Phase 8 is a **reporting layer** over training activity that already exists
in Phases 2-4. It answers "what have I done, and how is it developing?" —
never "am I job-ready," "certified," or "a validated professional
competency assessment." Every page carries that disclaimer explicitly.

`/progress` (Phase 4) and `/analytics` (Phase 8) intentionally answer
different questions and are not duplicates:

- **`/progress`** = _what should I learn next?_ (skill breakdown +
  deterministic recommendations)
- **`/analytics`** = _what have I done, and how has it developed over time?_
  (overview, per-quiz trends, per-investigation history, learning path
  progress, an activity timeline, and a shareable summary)

They share calculations (see below) rather than each computing their own
version of "topics completed" or "skill level."

## Derived-state architecture

**There is no analytics database table and no second stored score.**
Everything under `src/lib/analytics/` is a pure function that reads the same
three evidence sources `skillProgress.ts` and `recommendations.ts` already
read:

- `learning-topic-progress` (via `useLearningProgress`)
- `quiz-attempts` (via `useQuizAttempts`)
- `investigation-completions` (via `useInvestigationCompletions`)

plus static curriculum data (`learningTopics`, `learningPaths`, `quizzes`,
`investigationScenarios`). Skill scores are **not recomputed** — every
analytics page calls the existing `calculateAllSkillProgress()` from
`skillProgress.ts` and the existing `getRecommendations()` from
`recommendations.ts` directly. Recomputing those a second way would violate
the same "no second, independently-stored readiness score" rule the rest of
the app already follows — that rule applies to a second *derivation path*
just as much as to a second stored value.

### Files

```
src/lib/analytics/
  pureCalculations.ts       zero-dependency math kernels (trend direction,
                             ISO-week bucketing, averaging) — deliberately
                             has no "@/" imports so it's genuinely unit-
                             testable with Node's built-in test runner
  trainingOverview.ts        computeTrainingOverview() — topic/path/quiz/
                             investigation counts + overall %
  skillAnalytics.ts          computeSkillAnalytics() — wraps
                             calculateAllSkillProgress() with an activity
                             summary sentence + one recommended action
  quizAnalytics.ts            computeQuizAnalytics() — per-quiz latest/best/
                             attempt-count/trend
  investigationAnalytics.ts  computeInvestigationAnalytics() — per-completion
                             summary + strongest/focus areas by Learn category
  learningPathAnalytics.ts   computeLearningPathAnalytics() — progress,
                             checkpoint quiz result, related investigations
  activityTimeline.ts        computeActivityTimeline() +
                             computeWeeklyActivityCounts()
  trainingSummary.ts         computeTrainingSummary() — the one bundle both
                             /analytics/summary and /manager-preview build
                             from, so their numbers always match
  index.ts                   barrel export
```

Types live in `src/lib/types.ts`'s "Analytics (Phase 8)" section, alongside
every other phase's types, per the project's existing convention —
`TrainingOverview`, `QuizAnalyticsEntry`, `InvestigationAnalytics`,
`LearningPathAnalyticsEntry`, `TrainingActivityEvent`, `WeeklyActivityCount`,
`SkillAnalyticsEntry`, `TrainingSummary`.

## Activity Timeline — what's included, and why topic completions aren't

The Activity Timeline (`computeActivityTimeline()`) is built **only** from
genuinely timestamped records:

- Quiz attempts (`QuizAttempt.completedAt`)
- Investigation completions (`InvestigationCompletionRecord.completedAt`)

**Learn topic completions are deliberately excluded from the timeline.** The
current data model stores topic completion as a plain boolean
(`Record<topicId, boolean>`) both locally and via
`fetchLearningProgress()`'s return shape — even though the Supabase
`learning_progress` table already has a `completed_at` column (written by
`upsertTopicCompletion`, just never read back). Per the Phase 8 brief's own
instruction — "if historical timestamps are unavailable for some existing
activity, do not invent them" — a dated "Completed X lesson" event is not
fabricated. Topic completions still count fully toward the Training
Overview's aggregate counts (`topicsCompleted / topicsTotal`), just not as a
dated timeline event.

**If this is worth fixing later:** the lowest-risk path is additive, not a
schema change — `fetchLearningProgress()` could start returning
`completed_at` alongside the boolean (the column already exists), and
`useLearningProgress` could store a parallel, purely-additive
`{ completed: boolean; completedAt: string | null }` shape (or a second,
separate localStorage key) without touching the existing boolean contract
every other page already reads. This was deliberately **not** attempted in
Phase 8 — it would touch a widely-read piece of Phase 1-7 state for a
"nice to have" timeline entry, which is exactly the kind of wide-reaching
change Phase 8's brief says to stop and reconsider before making. Only
future, newly-completed topics would get a real date under that plan anyway
— existing completions still wouldn't have one.

## Progress over time

`computeWeeklyActivityCounts()` buckets the same timestamped timeline events
by ISO week (Monday start, UTC). An empty timeline returns an empty array —
the UI shows an honest "no dated activity yet" message rather than a
zero-flat-line chart.

## Charts

No charting library. `TrendSparkline` (`src/components/analytics/`) is a
small inline-SVG bar chart used for both quiz score trends and weekly
activity counts. Every chart renders its underlying values as visible text
immediately below the bars (not hidden, not color-only) — see
Accessibility below.

## Privacy exclusions (Part V)

None of the analytics/manager-preview/summary pages ever read:

- Daily Log entries (`useDailyLogEntries` is never imported by any Phase 8 file)
- CV Achievement descriptions (`useCvAchievements` is never imported either)
- Tutor conversation history (`useTutorConversation` is never imported)
- Real company/internal content of any kind

This is enforced by construction, not a runtime filter — the Phase 8 files
simply never import those hooks, so there is no free-text content to
accidentally leak. `/manager-preview` and `/analytics/summary` both show an
explicit, visible disclaimer stating this boundary in the page itself,
matching Part L's requirement that the boundary be visible, not just true.

## Manager Preview — what it actually is

`/manager-preview` is a **read-only preview of the signed-in learner's own
data** — "what might a trainer/manager see if the learner chose to share
their progress?" It is explicitly **not**:

- a real multi-user manager account or role
- a way to view another user's data (there is no query anywhere in Phase 8
  code that reads any `user_id` other than the current session's own)
- a change to Row Level Security (RLS policies are untouched — see
  `supabase/migrations/0001_init.sql`)

The page reuses `computeTrainingSummary()` — the exact same bundle
`/analytics/summary` uses — so a learner previewing "what a manager would
see" always sees numbers consistent with their own summary.

## Print / export

`/analytics/summary` and `/manager-preview` both include a `PrintSummaryButton`
(`window.print()` — no server-side PDF generation). `src/app/layout.tsx` wraps
`Nav`/`MigrationBanner`/the footer in `print:hidden` (a built-in Tailwind
variant, no custom CSS needed) so printing any page already excludes site
chrome; the summary/preview pages additionally hide their own back-link and
print button via the same `print:hidden` class.

## Accessibility (Part U)

- Every chart (`TrendSparkline`) renders an `aria-label` on the SVG plus a
  plain-text list of every value directly below it — the same information is
  never color-only or chart-only.
- Skill/quiz/investigation cards use semantic headings (`SectionHeading`,
  `<dl>`/`<dt>`/`<dd>` where the content is genuinely a description list) and
  the same focus-visible link/button styles used everywhere else in the app.
- Result categories (Excellent/Strong/Developing/Needs Review) are always
  shown as text via `Badge`, never conveyed by color alone.

## Supabase

**Zero schema changes.** Every analytics function reads through the existing
Phase 5 hooks (`useLearningProgress`, `useQuizAttempts`,
`useInvestigationCompletions`) — no new table, no new column, no new RLS
policy. See the Activity Timeline section above for the one place a future
schema *read* (not a write, not a new table) could add value.

## Known limitations

- Investigation completions don't record whether the learner resolved or
  escalated — only the training-quality category
  (`InvestigationCompletionRecord.resultCategory`). That distinction isn't
  shown in Investigation Analytics, per the Phase 8 brief's own "where
  already represented" qualifier — it isn't represented in the current data
  model, so it isn't shown rather than guessed.
- Quiz/investigation trends are last-attempt-order, not calendar-precise —
  fine for the small (≤10 kept per quiz) history this app deals in.
- No live-browser interactive testing was performed for Phase 8 (see the
  regression-audit section of the Phase 8 completion report) — verified via
  full production build, the existing content validators, route reachability,
  and empty/no-data-state rendering checks instead.
