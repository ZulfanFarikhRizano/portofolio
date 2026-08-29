"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Email atau password salah.");
      return;
    }

    const next = searchParams.get("next") || "/admin";
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-ink">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-ink/10 bg-white/60 p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-2">
          <Lock className="size-5" />
          <h1 className="text-[18px] font-medium uppercase tracking-wide">Admin Login</h1>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">{error}</p>
        )}

        <label className="mb-3 block">
          <span className="mb-1 block text-[13px] text-ink/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-[14px] outline-none focus:border-ink/40"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1 block text-[13px] text-ink/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3 py-2 text-[14px] outline-none focus:border-ink/40"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium uppercase tracking-wide text-cream transition hover:bg-ink/85 disabled:opacity-50"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Masuk
        </button>
      </form>
    </div>
  );
}
