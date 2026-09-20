"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    // The recovery link the user clicked in their email already signed them
    // in to a temporary session via the redirectTo URL, so this updates the
    // password on that session.
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1500);
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
          Set a new password
        </h1>

        {success ? (
          <p className="text-sm text-[#16A34A]">
            Password updated. Redirecting to log in...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-[#64748B]">New password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-[#64748B]">Confirm new password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"
              />
            </div>

            {error && <p className="text-sm text-[#DC2626]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#0F172A] py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
