# Demo Script (Phase 10)

Two demo scripts for two different audiences. Both use the real running app —
there are no fake accounts, no seeded fake usage numbers, and no separate demo
environment. Read `CLAUDE.md` first if you haven't recently — every claim below
follows its confidentiality and honesty rules.

---

## 1. General ~5-minute product walkthrough

Use this for a portfolio review, a technical interview, or anyone asking "what
did you actually build?" Local Demo Mode (no sign-in) is enough for all of it.

**0. 20-second setup (say this first)**

> "This is Enterprise IT Training Lab — a training platform I built during my
> DHL internship to structure what I was learning, not an official DHL
> product. Everything in it — tickets, scenarios, quiz questions — is fake,
> generic enterprise IT content. It's a full-stack Next.js app with optional
> Supabase accounts and an AI tutor grounded in its own curriculum."

**1. Dashboard (`/`)** — 30 seconds
Point out: today's goals/questions/practice exercise (from the internship
tracker), the Learning Progress card (one derived indicator, not a second
stored score), the current Training Assignment, and the AI Tutor entry point.
Say: "Everything here is either static curriculum data or derived from three
localStorage/Supabase-backed evidence sources — there's no separate 'progress'
database."

**2. Learn (`/learn` → any topic)** — 45 seconds
Open a topic (e.g. `/learn/dns`). Show the consistent structure: simple
explanation → ELI10 → technical explanation → business purpose → team
connection → university connection → practice scenario → question to ask at
work. Mention: "103 topics across 7 categories, all following this same
10-part structure — one reusable page template, not 103 hand-built pages."

**3. Advanced Investigation (`/tickets` → Advanced Investigations tab → any
scenario)** — 60 seconds
Pick a multi-layered one (e.g. Application Performance). Show: assessing
business impact up front, asking a diagnostic question, evidence appearing as
you investigate (not handed over at the start), and a weak/reasonable/strong
action distinction. Say: "This isn't multiple-choice trivia — it's a graph of
evidence-gathering, diagnosis, resolution, and verification, scored on six
weighted categories, always framed as a training indicator, not a
certification."

**4. Quiz (`/quizzes` → any Foundation Assessment)** — 30 seconds
Show a scenario-based question (not a definition question), submit, and show
the answer review with an explanation and a misconception callout where one
exists.

**5. Analytics (`/analytics`)** — 30 seconds
Show the skill breakdown, a quiz score trend sparkline, and the activity
timeline. Say: "This reads the same three evidence sources as `/progress` —
learning completion, quiz attempts, investigation completions — there's no
second analytics database."

**6. AI Tutor (`/tutor`)** — 45 seconds
Ask a real question (e.g. "what's the difference between authentication and
authorization?"). If a key is configured, show a grounded answer with related
topic links. If not, show the "not configured" state and explain: "It's
optional by design — the whole rest of the app works with zero AI setup."
Mention the coach-mode non-disclosure rule if there's time: "In an active
investigation, the Tutor is structurally prevented from receiving the hidden
outcome — it's not just told not to reveal it."

**7. Manager Preview / Pilot (`/manager-preview`, `/pilot`)** — 45 seconds
Show `/manager-preview` as "a read-only preview of my own data — not a real
multi-user manager account." Show `/pilot` briefly: value proposition, and
`/pilot/readiness`'s honest, self-checked gap list (no SSO, no multi-tenancy,
no real backend deployment yet).

**8. Close: architecture + privacy** — 45 seconds
> "Everything's TypeScript, Next.js App Router, client components hydrating
> their own state. Storage is always local first — localStorage — with
> optional Supabase cloud sync layered on top; cloud never replaces local data
> outright, it merges, because an early version of this had a race condition
> where signing in could silently drop what you'd just saved. The AI Tutor
> only runs server-side, so the API key never reaches the browser. And
> everything here is confidential-safe by construction: no real DHL data, no
> real names, no real ticket numbers, anywhere in the app or its data files."

---

## 2. Internship manager demo (shorter, different framing)

**Critical framing — say this explicitly, near the start:**

> "I built this independently, on my own time, to structure and reinforce what
> I was learning during the internship. It's not DHL's training system, it
> doesn't contain any real DHL information, and it's not something I'm
> presenting as an official deliverable — I just wanted to show you what I've
> been doing with the concepts you've been teaching me."

Do **not** say "I built DHL's new training system" or anything implying
official status, sponsorship, or endorsement.

**What to walk through (5 minutes, using the same app):**
1. Dashboard → today's goals/questions (tie back to a real recent
   conversation, generically — no names, no real ticket numbers).
2. One Learn topic connected to something they've actually explained to you.
3. One Advanced Investigation, to show you're practicing troubleshooting
   reasoning, not just reading definitions.
4. `/progress` or `/analytics`, to show you're tracking your own development
   deliberately.
5. Mention `/pilot` briefly only if it feels natural — frame it as "a concept
   I've been exploring, not a proposal I'm making right now."

**What to explicitly state, if asked "is this DHL's?":**
- All content (tickets, scenarios, quiz questions) is fake and generic —
  written to teach concepts that apply to any large company's IT operation,
  never DHL specifics.
- No confidential DHL information, real ticket data, real employee/customer
  names, internal URLs, or internal systems are used anywhere.
- This is a personal side project; a future small pilot is only a concept
  (see `docs/PILOT-PROPOSAL.md`), not something already agreed or running.

**3 good questions to ask the manager after the demo:**
1. "Is there a generic (non-confidential) example of how a ticket actually
   gets prioritized here that I could compare against how I modeled priority
   in the simulator?"
2. "Would it be useful for me to structure my remaining internship goals
   around one of these Learning Paths, or is there a different order you'd
   recommend given what the team actually needs from me?"
3. "If a tool like this were ever useful for onboarding future interns, what
   would you actually need to see from it before considering that — technical
   validation, security review, something else?"

---

## Notes for whoever runs this demo

- No fake customer names or fake usage numbers are ever shown — if a page
  would look empty (e.g. no quiz attempts yet in a fresh browser), that's
  fine; say so rather than seeding fake data beforehand.
- If the AI Tutor isn't configured in the demo environment, don't apologize
  for it — the "works with zero setup" story is a feature, not a gap.
- If asked about production readiness, point to `/pilot/readiness` and
  `ENTERPRISE-READINESS.md` rather than improvising an answer.
