"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire this up to a real email/notification service.
    // For now we just confirm receipt in the UI.
    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
        </Link>

        <div className="rounded-lg border border-[#E4E7EC] bg-white p-8">
          <h1 className="text-xl font-semibold text-[#0F172A]">Contact us</h1>
          <p className="mt-1.5 text-sm text-[#64748B]">
            Questions, feedback or a feature request? Send us a message and we&apos;ll get back to you.
          </p>

          {sent ? (
            <div className="mt-6 rounded-md border border-[#16A34A]/30 bg-[#16A34A]/5 p-4 text-center">
              <p className="text-sm font-medium text-[#16A34A]">Message sent!</p>
              <p className="mt-1 text-xs text-[#64748B]">Thanks for reaching out - we&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#64748B]">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"
                />
              </div>

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
                <label className="mb-1 block text-sm text-[#64748B]">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-md border border-[#E4E7EC] px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-[#16A34A] py-2 text-sm font-medium text-white"
              >
                Send message
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-[#64748B]">
          <Link href="/" className="hover:text-[#0F172A]">Back to home</Link>
        </p>
      </div>
    </main>
  );
}
