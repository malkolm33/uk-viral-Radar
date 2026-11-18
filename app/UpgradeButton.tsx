"use client";

import { useState } from "react";
import Link from "next/link";

// One "Upgrade" button that opens a small panel with the price, the renewal
// terms and the 14-day-right acknowledgement (Consumer Contracts Regulations),
// then lets the customer pick card (Stripe) or PayPal.
export default function UpgradeButton({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState<"" | "card" | "paypal">("");
  const [msg, setMsg] = useState("");

  async function go(kind: "card" | "paypal") {
    if (!agreed) {
      setMsg("Please tick the box first.");
      return;
    }
    setBusy(kind);
    setMsg("");
    try {
      const res = await fetch(kind === "card" ? "/api/checkout" : "/api/paypal-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kind === "card" ? { consent: true } : { email, consent: true }),
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
    setBusy("");
  }

  return (
    <span className="relative inline-flex flex-col items-end">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-medium text-white"
      >
        Upgrade - £9.99/mo
      </button>
      {open && (
        <span
          role="dialog"
          aria-label="Upgrade to Pro"
          className="absolute right-0 top-full z-30 mt-2 flex w-72 flex-col gap-2 rounded-lg border-2 border-[#14B8A6] bg-[#F0FDFA] p-3 text-left text-xs text-[#0F172A] shadow-lg"
        >
          <span className="font-semibold">UK Viral Radar Pro - £9.99/month</span>
          <span className="text-[#475569]">
            Renews automatically every month until you cancel. Card subscribers can cancel any time from the
            dashboard. PayPal buys one month and does not renew.
          </span>
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#0D9488]"
            />
            <span>
              I want Pro access to start now, and I understand I lose my 14-day right to cancel once access
              begins. I agree to the{" "}
              <Link href="/terms" className="font-medium text-[#0D9488] underline">
                Terms
              </Link>
              .
            </span>
          </label>
          <span className="flex gap-2">
            <button
              onClick={() => go("card")}
              disabled={!agreed || busy !== ""}
              className="flex-1 rounded-full bg-[#16A34A] px-3 py-1.5 font-medium text-white disabled:opacity-50"
            >
              {busy === "card" ? "Opening…" : "Pay by card"}
            </button>
            <button
              onClick={() => go("paypal")}
              disabled={!agreed || busy !== ""}
              className="flex-1 rounded-full bg-[#0070BA] px-3 py-1.5 font-medium text-white disabled:opacity-50"
            >
              {busy === "paypal" ? "Opening…" : "PayPal"}
            </button>
          </span>
          {msg && (
            <span role="alert" className="text-[#B91C1C]">
              {msg}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
