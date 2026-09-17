"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError("Check your email to confirm your account, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-6">
      <div className="w-full max-w-sm rounded-lg border border-[#E4E7EC] bg-white p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold text-[#0F172A]">
            UK Viral Radar
          </span>
        </div>

        <h1 className="mb-6 text-xl font-semibold text-[#0F172A]">
          {isSignUp ? "Create an account" : "Log in"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#64748B]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#64748B]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-[#DC2626]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#0F172A] py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loading ? "Please wait..." : isSignUp ? "Sign up" : "Log in"}
          </button>
        </form>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="mt-4 text-sm text-[#64748B] underline"
        >
          {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
        </button>
      </div>
    </main>
  );
}