"use client";

import { useState } from "react";

export default function UpgradeButton({ email }: { email: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleUpgrade() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMsg(data.error || "Payment could not start. Please try again.");
    } catch {
      setMsg("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        onClick={handleUpgrade}
        disabled={busy}
        className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
      >
        {busy ? "Opening checkout…" : "Upgrade - £9.99/mo"}
      </button>
      {msg && (
        <span role="alert" className="max-w-[16rem] text-right text-xs text-[#B91C1C]">
          {msg}
        </span>
      )}
    </span>
  );
}
