# Pilot Proposal (Phase 9)

A reusable, product-level description of what a small real-world pilot of
**Enterprise IT Training Lab** could look like. This is a template for a
conversation with a sponsor, not a commitment, a signed agreement, or a claim
that a pilot has already happened. See `CLAUDE.md` and `ENTERPRISE-READINESS.md`
for the confidentiality rules and the honest gap list this proposal assumes.

## Suggested small pilot

**Users:** 5–15 interns or junior IT staff.

**Duration:** 2–4 weeks.

**Content:** One Training Assignment template (see `/assignments`) per
participant, selected to match their team/focus area — e.g. Enterprise IT
Intern Foundation for general onboarding, or a team-specific template
(Infrastructure & Network, Applications Support, or Business & Logistics
Technology). Each assignment bundles a small set of Learning Paths, Foundation
Assessments, and Advanced Investigations — not the full 80-topic library at
once.

**What participants would do:**

1. Complete the onboarding flow (`/onboarding`) to get a suggested assignment.
2. Work through the assignment's required learning paths, assessments, and
   investigations at their own pace.
3. Optionally use the AI Tutor for Q&A and coaching.
4. Review their own progress via `/progress` and `/analytics`.

**What a trainer/sponsor would review:**

- Each participant's Pilot Report (`/pilot/report`) or Manager Preview
  (`/manager-preview`) — read-only summaries of their own training evidence.
- Aggregate completion rates across the cohort (manually compared — this
  prototype has no cross-user aggregation view yet, see
  `ENTERPRISE-READINESS.md`).

## Success signals

These are things worth *observing* during a pilot — not promises, and not a
scored evaluation of any participant:

- **Completion rate** — did participants actually finish their assigned paths,
  assessments, and investigations?
- **Learner feedback** — was the content clear, realistic, and genuinely
  useful, gathered informally (a short survey or conversation, not built into
  the product)?
- **Manager/trainer feedback** — did reviewing a Pilot Report save time
  compared to informal check-ins?
- **Reduced repetitive onboarding questions** — did senior staff notice fewer
  basic "what does X mean" questions from participants who went through the
  curriculum?
- **Usefulness of practical scenarios** — did the Advanced Investigations feel
  like a reasonable approximation of real troubleshooting, based on
  participant/mentor feedback?

## What this proposal deliberately does not claim

- **No quantified ROI.** No pilot has run yet, so there is no measured time
  saved, cost reduced, or productivity gained to cite.
- **No pricing or commercial terms.** Pricing/commercial discussion is
  explicitly out of scope for this document and this product phase — see
  `PRODUCT-ROADMAP.md`'s Phase 10.
- **No certification or performance evaluation.** Every report this product
  generates is an educational progress indicator, never a validated
  professional competency assessment or an employee performance evaluation —
  see the disclaimers on `/progress`, `/analytics`, and `/pilot/report`.

## Before a real pilot could start

See `/pilot/readiness` (in-app) and `ENTERPRISE-READINESS.md` for the full,
honest list — at minimum: a real Supabase project and Anthropic API key
provisioned for the cohort, explicit sponsor sign-off on using any company
name/branding, and a plan (even informal) for how participant feedback would
be collected and reviewed.
