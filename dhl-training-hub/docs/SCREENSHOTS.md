# Screenshots Plan (Phase 10)

Exact screenshots to capture for the GitHub README / portfolio. Capture these
yourself, in a real browser, in **Local Demo Mode with a fresh-ish but not
completely empty profile** (complete a couple of lessons/quizzes/investigations
first so pages don't look empty) — never automate this against real account
data, and never publish a screenshot before checking it against the "remove
before publishing" column below.

For every screenshot: use a private/incognito window or a throwaway local
browser profile, in light mode (the default theme most portfolio viewers will
expect), desktop width (~1440px) unless a mobile shot is specifically listed.

| # | Route | What should be visible | Remove/hide before publishing |
|---|-------|------------------------|-------------------------------|
| 1 | `/` (Dashboard) | Day header, Today's Goals/Questions/Practice, Learning Progress card with a nonzero overall %, Current Assignment card | The `internshipState.organization/role/department` line under the day header — replace with a generic placeholder value locally before shooting, or crop it out |
| 2 | `/learn/dns` (or another topic) | The full 10-part topic structure — simple explanation, ELI10, technical explanation, learning outcomes | Nothing sensitive here — generic curriculum content only |
| 3 | `/tickets` → Advanced Investigations tab, mid-scenario | Evidence panel, hypothesis selector, and at least one action taken | Nothing — fictional scenario content only |
| 4 | `/quizzes/quiz-itsm-foundation` results/review screen | Score, per-question review with an explanation and a misconception callout | Nothing — fictional quiz content only |
| 5 | `/progress` | Per-skill breakdown cards with a mix of levels (not all zero) | Nothing sensitive |
| 6 | `/analytics` | Overview counts, one quiz score trend sparkline, the activity timeline | Nothing sensitive |
| 7 | `/tutor` with a real grounded answer | A question, a grounded response, and the "related topics" links | Only capture this if `ANTHROPIC_API_KEY` is configured and the exchange is generic (e.g. "what's the difference between authentication and authorization?") — never a screenshot of a message that references anything personal |
| 8 | `/manager-preview` | The read-only summary layout and its "not a real manager account" disclaimer | Nothing sensitive — this page already excludes Daily Log/CV/Tutor content by construction |
| 9 | `/pilot` | Value proposition and problem/solution framing | Nothing — make sure no draft/placeholder Lorem ipsum text is visible |
| 10 (optional) | `/` (Dashboard) at mobile width (~375px) | Confirms the responsive nav/hamburger menu and card stacking work | Same as #1 |

## Explicitly do not screenshot

- `/daily-log` or `/cv-tracker` with real entries — these are the two pages
  most likely to contain personal reflections or wording specific to the real
  internship; if you want to show them, screenshot them **empty** (a fresh
  profile) or with clearly fake placeholder entries you type in just for the
  screenshot, never your actual journal content.
- Any page while signed in with a real email address visible in the Nav —
  either screenshot signed-out/Local Demo Mode, or use a throwaway test
  account with an obviously fake email.
- Any Supabase dashboard, environment variable value, or terminal output that
  could contain a real project URL, key, or path specific to your machine.

## After capturing

Store screenshots under a new `dhl-training-hub/docs/screenshots/` (or a repo
root `screenshots/`) folder and reference them from the README's Screenshots
section — this document doesn't create that folder itself, since no
screenshots exist yet to add.
