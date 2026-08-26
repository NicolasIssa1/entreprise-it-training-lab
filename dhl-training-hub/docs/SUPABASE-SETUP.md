# Supabase Setup Guide

This app works with **zero setup** — without a Supabase project connected, it
runs in **Local Demo Mode**: everything is saved to your browser's storage
only, exactly like Phases 1-4. This guide is for turning on real accounts and
cloud sync (Phase 5), so your progress follows you across devices/browsers.

You do not need any prior Supabase experience. This should take about 10-15
minutes.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free
   account).
2. Click **New Project**.
3. Pick an organization (or create one), give the project a name (e.g.
   `enterprise-it-training-lab`), and choose a database password. **Save this
   password somewhere safe** — you won't need it for this app (the app never
   touches the database password directly), but you'll want it if you ever
   need to connect another tool directly to the database.
4. Choose the region closest to you and click **Create new project**. It
   takes a minute or two to provision.

## 2. Get your project URL and anon key

1. Once the project is ready, go to **Project Settings** (gear icon) →
   **Data API** (or **API** in older dashboard layouts).
2. Copy the **Project URL** — it looks like `https://xxxxxxxx.supabase.co`.
3. Under **Project API keys**, copy the key labeled **anon** / **public**
   (NOT `service_role` — that key must never be used in this app or any
   browser-facing code).

## 3. Create `.env.local`

In the `dhl-training-hub/` folder (next to `package.json`), create a file
named `.env.local` (copy `.env.example` if that's easier) with:

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Paste in the values from step 2. This file is already gitignored — it will
never be committed.

## 4. Run the SQL migration

This creates all the tables, security rules, and triggers the app needs.

1. In the Supabase dashboard, open the **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `dhl-training-hub/supabase/migrations/0001_init.sql` in this
   repository, copy its entire contents, and paste it into the SQL editor.
4. Click **Run**. You should see a success message. (The script is safe to
   run more than once — every statement guards against objects that already
   exist.)
5. Optional sanity check: go to **Table Editor** in the sidebar. You should
   see 8 new tables: `profiles`, `learning_progress`, `quiz_attempts`,
   `investigation_progress`, `investigation_completions`, `daily_logs`,
   `cv_achievements`, `team_checklist_progress`.

## 5. Configure authentication

The app uses plain email + password sign-up.

1. Go to **Authentication** → **Providers** in the sidebar and confirm
   **Email** is enabled (it is by default).
2. Go to **Authentication** → **Settings** (or **URL Configuration**).
   - **Email confirmation**: by default, Supabase requires users to confirm
     their email before signing in. For quick personal testing, you can
     disable this under **Authentication → Providers → Email → "Confirm
     email"** — toggle it off. If you leave it on, you'll need to check your
     inbox and click the confirmation link after signing up before you can
     sign in.
   - You don't need to configure a custom SMTP provider for personal use —
     Supabase's built-in email sending works fine for confirmation emails at
     low volume.

## 6. Start the app

```bash
cd dhl-training-hub
npm install   # first time only
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The nav bar should no
longer show the amber **Local Demo Mode** badge — instead you'll see **Sign
In** / **Create Account**.

## 7. Create your user account

1. Click **Create Account** in the nav.
2. Enter an email, a password (6+ characters), and optionally a display name.
3. Submit. If email confirmation is on, check your inbox and click the link,
   then come back and sign in. If it's off, you'll be signed in immediately.

## 8. Verify database writes

1. Go to `/learn` in the app and mark a topic as complete (or take a quiz, or
   start an Advanced Investigation).
2. In the Supabase dashboard, open **Table Editor** → `learning_progress` (or
   `quiz_attempts` / `investigation_progress`). You should see a new row with
   your `user_id` and the data you just created.
3. If you had existing progress in this browser from before connecting
   Supabase, you should also see a green banner at the top of the app the
   first time you sign in: "Your existing local progress has been synced to
   your account." — and the corresponding rows should already be present in
   the tables above.

## 9. Verify Row Level Security

This confirms other users can't see your data (and you can't see theirs).

1. In the Supabase dashboard, go to **Authentication** → **Users** and create
   a second test user (or sign up a second account through the app in a
   private/incognito window).
2. Sign in as that second user in the app. You should see a fresh, empty
   account — none of the first user's learning progress, quiz results, etc.
3. In the SQL Editor, you can also directly confirm RLS is active by running:
   ```sql
   select relname, relrowsecurity from pg_class
   where relname in ('learning_progress', 'quiz_attempts', 'investigation_progress',
     'investigation_completions', 'daily_logs', 'cv_achievements', 'team_checklist_progress', 'profiles');
   ```
   Every row should show `relrowsecurity = true`.

## Troubleshooting

- **"Cloud accounts aren't available in Local Demo Mode"** on the sign-in
  page: your `.env.local` isn't being picked up. Confirm the file is named
  exactly `.env.local`, is in `dhl-training-hub/` (not the repo root), and
  restart `npm run dev` after creating/editing it (Next.js only reads env
  files at server start).
- **Sign-up succeeds but sign-in fails with "email not confirmed"**: either
  confirm via the email link, or disable email confirmation (step 5 above).
- **Nothing appears in the database after using the app**: open your
  browser's dev tools console — repository errors are logged there in
  development. Also double check the anon key and URL were copied correctly
  (a stray trailing space is a common culprit).
- **Regenerating types after schema changes**: if you modify the SQL
  migration, keep `src/lib/supabase/database.types.ts` in sync manually, or
  regenerate via the Supabase CLI:
  ```bash
  npx supabase gen types typescript --project-id <your-project-id> > src/lib/supabase/database.types.ts
  ```
  (requires `npx supabase login` first).

## What this environment could NOT verify for you

This guide was written without a real Supabase project connected — nothing
above involving an actual remote database call (sign-up, sign-in, table
writes, RLS enforcement, the migration banner) has been tested against a live
Supabase backend. What *has* been verified: the app builds and type-checks
cleanly against this schema, Local Demo Mode works with no configuration, and
the SQL migration is syntactically consistent with the TypeScript repository
layer. Please walk through steps 6-9 above yourself once you've connected a
real project, and see the Phase 5 report for the exact test list.
