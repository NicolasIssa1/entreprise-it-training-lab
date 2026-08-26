"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/repositories/profileRepository";
import { migrateLocalDataToCloud } from "@/lib/migration";

interface AuthActionResult {
  error: string | null;
}

interface AuthContextValue {
  /** Whether Supabase env vars are present at all — false means the whole app
   * runs in Local Demo Mode (see root CLAUDE.md). */
  isConfigured: boolean;
  user: User | null;
  session: Session | null;
  /** True only while the initial session check is in flight — never true
   * indefinitely, even if Supabase is unreachable (see the effect below). */
  loading: boolean;
  migrationMessage: string | null;
  dismissMigrationMessage: () => void;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthActionResult>;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Supabase auth errors are technical and sometimes leak internal wording —
 * translate the common ones into plain language rather than showing them raw. */
function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Incorrect email or password.";
  if (lower.includes("user already registered")) return "An account with that email already exists — try signing in instead.";
  if (lower.includes("password should be at least")) return "Password must be at least 6 characters.";
  if (lower.includes("email not confirmed")) return "Please confirm your email address before signing in — check your inbox.";
  if (lower.includes("rate limit")) return "Too many attempts — please wait a moment and try again.";
  if (lower.includes("network")) return "Network error — check your connection and try again.";
  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [migrationMessage, setMigrationMessage] = useState<string | null>(null);
  const [migratedForUserId, setMigratedForUserId] = useState<string | null>(null);

  // Initial session check + subscribe to future auth changes (sign in/out,
  // token refresh). Local Demo Mode (no client) resolves loading immediately.
  useEffect(() => {
    const supabase = getSupabaseClient();
    // When not configured, `loading` was already initialized to false above —
    // nothing to do here (and nothing to subscribe to).
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Runs once per signed-in user: ensure a profile row exists, then run the
  // one-time local->cloud migration if this account hasn't been migrated yet
  // (see lib/migration.ts). migratedForUserId guards against re-running on
  // every re-render/token refresh within the same session.
  useEffect(() => {
    if (!user || migratedForUserId === user.id) return;
    let cancelled = false;

    (async () => {
      const profile = await ensureProfile(user.id);
      if (!profile || profile.localMigrationVersion >= 1) {
        if (!cancelled) setMigratedForUserId(user.id);
        return;
      }

      const result = await migrateLocalDataToCloud(user.id);
      if (cancelled) return;
      setMigratedForUserId(user.id);
      if (result.hadLocalData) {
        setMigrationMessage(
          result.failedDomains.length === 0
            ? "Your existing local progress has been synced to your account."
            : "Most progress was synced, but some legacy records could not be imported.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, migratedForUserId]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string): Promise<AuthActionResult> => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: "Cloud accounts aren't available in Local Demo Mode." };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: displayName ? { data: { display_name: displayName } } : undefined,
    });
    return { error: error ? friendlyAuthError(error.message) : null };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthActionResult> => {
    const supabase = getSupabaseClient();
    if (!supabase) return { error: "Cloud accounts aren't available in Local Demo Mode." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? friendlyAuthError(error.message) : null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setMigratedForUserId(null);
  }, []);

  const dismissMigrationMessage = useCallback(() => setMigrationMessage(null), []);

  return (
    <AuthContext.Provider
      value={{
        isConfigured: isSupabaseConfigured,
        user,
        session,
        loading,
        migrationMessage,
        dismissMigrationMessage,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
