"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage unavailable (e.g. blocked) - fail safe by not showing a banner
      // that could never remember the user's choice.
    }
  }, []);

  function handleChoice(choice: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore - worst case the banner reappears next visit.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4E7EC] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-4 sm:flex-row sm:px-10">
        <p className="text-center text-sm text-[#64748B] sm:text-left">
          We use cookies to improve your experience and analyze site usage. See our{" "}
          <Link href="/privacy" className="font-medium text-[#0F172A] underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => handleChoice("declined")}
            className="rounded-full border border-[#E4E7EC] bg-white px-4 py-1.5 text-xs font-medium text-[#64748B] hover:text-[#0F172A]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-full bg-[#16A34A] px-4 py-1.5 text-xs font-medium text-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
