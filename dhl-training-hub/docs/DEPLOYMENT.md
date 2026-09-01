# Deployment Readiness (Phase 10)

This documents what's needed to deploy Enterprise IT Training Lab, and what
gaps remain before it would be a real production/enterprise deployment. **No
deployment has been performed as part of Phase 10** — this is a readiness
audit and setup guide only, per the Phase 10 brief's "do not deploy
automatically" instruction.

## Is the app deployment-compatible today?

Yes, structurally. It's a standard Next.js App Router app with no
server-rendered personalized content (every page hydrates its own state
client-side after mount — see `CLAUDE.md`'s Phase 5 auth architecture note),
one server-only API route (`/api/tutor`), and zero hardcoded `localhost` or
machine-specific paths (checked by grep across `src/` and `next.config.ts` —
none found). `npm run build` (Turbopack) completes cleanly with a full static
+ SSG page tree.

## Recommended target: Vercel

Vercel is the natural fit — it's built by the Next.js team, supports the App
Router's static/SSG/dynamic route mix used here out of the box, and needs no
custom server config for the one dynamic route (`/api/tutor`).

## Required environment variables

All are optional individually — the app runs in Local Demo Mode with AI
disabled if none are set — but a real deployment intended for real use should
set all four:

| Variable | Where | Client-visible? | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel project env vars | Yes (by design — `NEXT_PUBLIC_`) | From your Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel project env vars | Yes (by design) | The **anon** key only — RLS is what keeps this safe to expose, see `supabase/migrations/0001_init.sql` |
| `ANTHROPIC_API_KEY` | Vercel project env vars | **Never** — server-only | Do not prefix with `NEXT_PUBLIC_`. Confirmed absent from client bundles in this repo's current code — recheck after any change to `src/lib/ai/` |
| `ANTHROPIC_MODEL` | Vercel project env vars (optional) | Never | Defaults to `claude-sonnet-5` if unset |

Never set `SUPABASE_SERVICE_ROLE_KEY` or any database password as an
environment variable in this project — nothing in the codebase needs it, and
introducing it would be a regression (see `docs/SUPABASE-SETUP.md`).

## Supabase configuration for a real deployment

1. Run `supabase/migrations/0001_init.sql` then `0002_tutor.sql` in the
   Supabase SQL editor (see `docs/SUPABASE-SETUP.md` for the full first-time
   walkthrough).
2. **Auth → URL Configuration**: set **Site URL** to your production domain
   (e.g. `https://your-deployment.vercel.app`), and add it under **Redirect
   URLs** too. This app's `signUp`/`signInWithPassword` calls
   (`src/lib/auth/AuthProvider.tsx`) don't pass an explicit `emailRedirectTo`,
   so Supabase's confirmation emails fall back to the dashboard's Site URL —
   if that's left at `localhost:3000`, confirmation links sent to real users
   after deployment will point at localhost. This is the one auth-related
   deployment step that's easy to miss.
3. Confirm email confirmation is enabled or disabled deliberately (Supabase
   project default is enabled) — either is fine for this app, but decide
   rather than leaving the default unexamined, since it changes what a new
   signup actually experiences.
4. RLS is already enabled on every table via the migration — nothing else to
   configure there.

## Anthropic API key

Create a key at [console.anthropic.com](https://console.anthropic.com) (a
separate credential from a Claude Code/Claude.ai subscription — see
`docs/AI-TUTOR.md`). Set spending limits/alerts on the Anthropic console
before a real deployment goes live with real traffic — this app's own rate
limiting (`lib/ai/rateLimit.ts`) is an in-memory, best-effort, single-process
limiter, explicitly documented as not a substitute for real infrastructure
protection (it also resets on every redeploy and doesn't share state across
multiple serverless instances, which Vercel will run under real load).

## Production security boundaries (already in place)

- `ANTHROPIC_API_KEY` is read only in `src/lib/ai/anthropic.ts`, imported
  only by the server-only `src/app/api/tutor/route.ts` Route Handler.
- No server-side Supabase client exists (a deliberate Phase 5/6 architecture
  choice) — the browser only ever holds the public anon key, and Row Level
  Security is the actual access-control boundary on every table.
- `/api/tutor` never returns a raw provider error or stack trace to the
  client (see `docs/AI-TUTOR.md`'s error handling section).

## Runtime assumptions to double-check post-deploy

- The app assumes it's always reached over HTTPS in production (Supabase
  Auth and the Anthropic API both require it) — Vercel provides this by
  default, but a custom domain needs its own TLS confirmed.
- No cron jobs, background workers, or scheduled tasks exist — nothing to
  configure beyond the Next.js app itself and the one API route.
- `localStorage` behavior (Local Demo Mode, the optimistic cache layer even in
  Cloud Mode) is per-browser/per-device by nature — this is documented
  behavior, not a deployment bug, but worth restating so a first deploy isn't
  mistaken for broken cross-device sync when it's actually the local cache
  working as designed.

## Post-deploy smoke tests

Run the same checks used in this Phase 10 pass, against the real deployed
URL instead of `localhost`:

1. Every route from the Phase 10 route smoke test returns 200 (see the Phase
   10 completion report for the full list).
2. Sign up with a real (or a disposable test) email → confirm the
   confirmation email link points at the production domain, not localhost.
3. Sign in → make a change in one persistence domain (e.g. complete a lesson)
   → reload → confirm it persisted to Supabase, not just localStorage (check
   the table directly in the Supabase dashboard if unsure).
4. Sign out, sign back in on a different browser/device with the same
   account → confirm the same data appears (proves real cross-device sync).
5. If `ANTHROPIC_API_KEY` is set: send one `/tutor` message and confirm a
   real grounded response, not a "not configured" message.
6. Confirm `GET /api/tutor` returns `{ configured: true }` if a key is set
   (used by `/pilot/readiness`'s live check).

## Production/pilot limitations (explicitly not built)

Deploying this app does **not** make it enterprise production software. The
following are deliberately not built — see `ENTERPRISE-READINESS.md` for the
full, longer-standing list this restates:

- No real organization/multi-tenant accounts
- No real multi-user manager dashboard or cohort/aggregate view (`/manager-preview`
  and `/pilot/report` only ever show the signed-in user's own data)
- No SSO or SCIM
- No enterprise audit logging
- No compliance certification of any kind
- No official integration with any real company system
- No production SLA or on-call support model
- No public share links
- No payments or billing
- No organization admin console

Making this list explicit is a credibility decision, not a weakness to hide —
see `/pilot/readiness` in the app for the same list, self-checked live rather
than hardcoded as a claim.
