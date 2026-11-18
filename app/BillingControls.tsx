"use client";

import { useEffect, useState } from "react";

// Pro users: opens Stripe's Customer Portal to cancel or change the card.
export function ManageSubscriptionButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function open() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMsg(data.error || "Could not open subscription settings.");
    } catch {
      setMsg("Network error. Please try again.");
    }
    setBusy(false);
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        onClick={open}
        disabled={busy}
        className="rounded-full border border-[#14B8A6] bg-white px-3 py-1.5 text-xs font-medium text-[#0F766E] disabled:opacity-60"
      >
        {busy ? "Opening…" : "Manage subscription"}
      </button>
      {msg && (
        <span role="alert" className="max-w-[16rem] text-right text-xs text-[#B91C1C]">
          {msg}
        </span>
      )}
    </span>
  );
}

// After a card payment Stripe sends the customer back before its webhook may
// have switched Pro on. Show a short note and reload a few times until it has.
export function StripeSuccessNotice({ isPro }: { isPro: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success" || params.get("provider") !== "stripe") return;
    if (isPro) {
      params.delete("payment");
      params.delete("provider");
      const q = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (q ? `?${q}` : ""));
      try {
        sessionStorage.removeItem("stripeWait");
      } catch {}
      return;
    }
    setShow(true);
    let tries = 0;
    try {
      tries = Number(sessionStorage.getItem("stripeWait") || "0");
    } catch {}
    if (tries >= 5) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem("stripeWait", String(tries + 1));
      } catch {}
      window.location.reload();
    }, 4000);
    return () => clearTimeout(t);
  }, [isPro]);

  if (!show) return null;
  return (
    <div role="status" className="mb-6 rounded-lg border-2 border-[#14B8A6] bg-[#F0FDFA] p-4 text-sm text-[#0F172A]">
      Payment received - activating Pro. This page refreshes by itself in a few seconds. If Pro has not appeared
      within a minute, email info@ukviralradar.com and we will switch it on straight away.
    </div>
  );
}
