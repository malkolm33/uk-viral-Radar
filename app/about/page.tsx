import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, jsonLd } from "../lib/site";

const TITLE = "About UK Viral Radar - How We Track UK Product Trends";
const DESCRIPTION =
  "What UK Viral Radar is, who it is for, which data sources it uses and how the daily Viral Score works. Independent UK trend research for online sellers.";
const UPDATED = "17 November 2026";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/about" },
};

// Short, self-contained statements: easy for readers to scan and for search
// engines / AI assistants to quote accurately. Keep them true and dated.
const FACTS = [
  { k: "What it is", v: "UK Viral Radar is a UK-focused product trend tracker for dropshippers, eBay and Etsy sellers and small online shops." },
  { k: "Data sources", v: "Google Trends (UK search interest), English Wikipedia page views (global), new YouTube videos, and daily listing counts from eBay UK and Etsy (global listings)." },
  { k: "Update frequency", v: "Product data and the Viral Score are normally refreshed daily." },
  { k: "Price", v: "The top 3 trending products are free with no card required. Pro, with the full list, costs £9.99 per month." },
  { k: "Free tools", v: "Saturation checker, eBay UK vs Etsy UK fee calculator and profit calculator - all free, no sign-up." },
  { k: "Market", v: "UK-focused: UK Google search and eBay UK, with prices and tools built for UK sellers." },
  { k: "Independence", v: "UK Viral Radar is independent and not affiliated with, endorsed or sponsored by Google, Wikipedia, YouTube, eBay or Etsy. These names are trademarks of their respective owners. This product uses the Etsy API but is not endorsed or certified by Etsy, Inc." },
  { k: "Based in", v: "Operated from the United Kingdom." },
  { k: "Contact", v: "info@ukviralradar.com" },
];

const STEPS = [
  { t: "Collect", d: "Every day we pull UK search interest, Wikipedia reading interest, new video coverage on YouTube and marketplace listing counts for each tracked product." },
  { t: "Compare", d: "Each signal is compared with its own recent past, so we measure momentum (is interest rising?) rather than raw popularity." },
  { t: "Score", d: "Rising signals push the Viral Score (0-100) up; a high eBay UK listing volume pulls it down. A product scores well when interest is growing and competition still looks manageable." },
  { t: "Check", d: "Scores are a starting point, not a guarantee of sales. We show the underlying signals so you can judge them yourself, and our free tools help you check competition and fees before you list." },
];

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: TITLE,
    url: `${SITE_URL}/about`,
    description: DESCRIPTION,
    dateModified: "2026-11-17",
    inLanguage: "en-GB",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0D9488] text-sm font-bold text-white">R</div>
            <span className="text-sm font-semibold text-[#0F172A]">{SITE_NAME}</span>
          </Link>
          <Link href="/tools" className="text-sm text-[#475569] hover:text-[#0F172A]">Free tools</Link>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">About UK Viral Radar</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
          UK Viral Radar helps UK online sellers spot products whose UK demand is rising while marketplace competition still looks low,
          using UK-focused data, refreshed daily.
        </p>

        <section className="mt-8 overflow-hidden rounded-2xl border-2 border-[#14B8A6] bg-[#F0FDFA] shadow-sm">
          <h2 className="bg-[#0D9488] px-5 py-3 text-sm font-semibold text-white">Key facts · updated {UPDATED}</h2>
          <dl className="divide-y divide-[#CCFBF1]">
            {FACTS.map((f) => (
              <div key={f.k} className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">{f.k}</dt>
                <dd className="text-sm text-[#0F172A] sm:text-base">{f.k === "Contact" ? <a className="font-semibold text-[#0D9488] hover:underline" href="mailto:info@ukviralradar.com">{f.v}</a> : f.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="methodology" className="mt-12 scroll-mt-6">
          <h2 className="text-xl font-semibold text-[#0F172A]">How the Viral Score works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.t} className="rounded-xl border border-[#BAE6FD] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0284C7] text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="font-semibold text-[#0F172A]">{s.t}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 rounded-2xl border border-[#E2E8F0] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#0F172A]">Who it is for</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#475569]">
            UK dropshippers, eBay and Etsy sellers, Amazon UK and TikTok Shop sellers, and anyone researching what UK shoppers are starting to
            buy. UK Viral Radar is built for the UK market: the top 3 products are free, and Pro is £9.99 per month.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0F766E]">See today&apos;s rankings</Link>
            <Link href="/tools" className="rounded-xl border border-[#99F6E4] px-4 py-2 text-sm font-semibold text-[#0F766E] hover:bg-[#F0FDFA]">Try the free tools</Link>
            <Link href="/contact" className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]">Contact us</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
