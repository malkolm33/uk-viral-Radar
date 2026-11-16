import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tools for UK Dropshippers - UK Viral Radar",
  description: "Free tools for UK sellers: check if a product is saturated on eBay UK and Etsy, compare eBay and Etsy fees, and calculate your profit margin before you list.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    href: "/tools/saturation-checker",
    name: "Is my product saturated?",
    text: "Live eBay UK and Etsy listing counts and seller spread for any product.",
    stripe: "#14B8A6",
    bg: "#F0FDFA",
    tag: "Live data",
  },
  {
    href: "/tools/fee-calculator",
    name: "eBay UK vs Etsy UK fee calculator",
    text: "Every 2026 fee side by side, your profit on each platform and which one leaves you more.",
    stripe: "#F59E0B",
    bg: "#FFFBEB",
    tag: "2026 fees",
  },
  {
    href: "/tools/profit-calculator",
    name: "Profit margin calculator",
    text: "Work out your margin and profit per sale before you list a product.",
    stripe: "#2563EB",
    bg: "#EFF6FF",
    tag: "Calculator",
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0D9488] text-sm font-bold text-white">R</div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0F172A]">Back to home</Link>
        </header>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">Free tools for UK sellers</h1>
        <p className="mt-3 text-sm text-[#475569] sm:text-base">No sign-up needed.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="block rounded-2xl border border-t-4 p-5 shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ borderColor: "#E2E8F0", borderTopColor: t.stripe, background: t.bg }}
            >
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: t.stripe }}>{t.tag}</span>
              <h2 className="mt-3 text-lg font-semibold text-[#0F172A]">{t.name}</h2>
              <p className="mt-1 text-sm text-[#475569]">{t.text}</p>
              <span className="mt-3 inline-block text-sm font-semibold" style={{ color: t.stripe }}>Open tool →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
