import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether cloud persistence/auth is configured at all. When false, the app
 * runs in Local Demo Mode: every data hook falls back to its existing
 * localStorage-only behavior from Phases 1-4, and the auth UI explains that
 * sign-in isn't available. This lets the repo run/demo with zero setup — see
 * root CLAUDE.md, "Local Demo Mode."
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient<Database> | null = null;

/**
 * Lazily creates a single browser Supabase client; returns null when not
 * configured so callers branch once instead of re-checking env vars
 * everywhere. Deliberately client-only (no @supabase/ssr, no middleware): every
 * page in this app is a client component that hydrates its own state after
 * mount, the same pattern the existing localStorage hooks already use, so
 * there's no server-rendered personalized content that needs a server-side
 * Supabase client or session-refreshing middleware. Row Level Security (see
 * supabase/migrations/0001_init.sql) is the real security boundary regardless
 * of what the client does — see root CLAUDE.md.
 */
export function getSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
