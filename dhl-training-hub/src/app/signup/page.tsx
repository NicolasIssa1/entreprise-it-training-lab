"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { InputField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { ProductMarkTile } from "@/components/ProductMark";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function SignUpPage() {
  const router = useRouter();
  const { isConfigured, user, signUp } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await signUp(email, password, displayName.trim() || undefined);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setAccountCreated(true);
  }

  return (
    <div className="relative mx-auto max-w-md space-y-6 py-6">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div className="text-center">
        <ProductMarkTile size={44} className="mx-auto mb-3" />
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Create your account</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Save your learning progress, quiz results, and investigations to your own account.
        </p>
      </div>

      {!isConfigured && (
        <Disclaimer>
          <span className="font-medium">Local Demo Mode.</span> This deployment isn&rsquo;t connected to a Supabase
          project, so accounts aren&rsquo;t available right now — your progress is still saved locally in this
          browser. See <code>docs/SUPABASE-SETUP.md</code> to enable accounts.
        </Disclaimer>
      )}

      {isConfigured && accountCreated ? (
        <Card>
          <SectionHeading title="Account created" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            If your project requires email confirmation, check your inbox for a confirmation link before signing in.
            Otherwise, you&rsquo;re already signed in and can head to your dashboard.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            Go to sign in →
          </Link>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField label="Display name (optional)" value={displayName} onChange={setDisplayName} />
            <InputField label="Email" value={email} onChange={setEmail} type="email" />
            <InputField label="Password (at least 6 characters)" value={password} onChange={setPassword} type="password" />

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" loading={submitting} disabled={!isConfigured || !email || !password}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </Card>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
