"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Disclaimer } from "@/components/Disclaimer";
import { InputField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { isConfigured, user, signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-6">
      <div className="text-center">
        <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-sm shadow-blue-900/20">
          IT
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Sign in</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Access your saved learning progress, quiz results, and investigations.
        </p>
      </div>

      {!isConfigured && (
        <Disclaimer>
          <span className="font-medium">Local Demo Mode.</span> This deployment isn&rsquo;t connected to a Supabase
          project, so accounts aren&rsquo;t available right now — your progress is still saved locally in this
          browser. See <code>docs/SUPABASE-SETUP.md</code> to enable accounts.
        </Disclaimer>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField label="Email" value={email} onChange={setEmail} type="email" />
          <InputField label="Password" value={password} onChange={setPassword} type="password" />

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={submitting} disabled={!isConfigured || !email || !password}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Don&rsquo;t have an account?{" "}
        <Link href="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Create one
        </Link>
      </p>
    </div>
  );
}
