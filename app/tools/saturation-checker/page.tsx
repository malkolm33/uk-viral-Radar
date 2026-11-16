import Link from "next/link";
import type { Metadata } from "next";
import SaturationChecker from "./SaturationChecker";
import { SITE_URL, jsonLd } from "../../lib/site";

const TITLE = "Is My Product Saturated? Free UK Saturation Checker";
const DESCRIPTION =
  "Check if a product is saturated in the UK before you sell it. Live eBay UK and Etsy listing counts and seller spread - free, no sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/saturation-checker" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/tools/saturation-checker" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "How do I know if a product is saturated in the UK?",
    a: "Look at how many live listings it already has on UK marketplaces. This checker counts live eBay UK and Etsy listings: under 2,000 combined is low competition, under 20,000 is medium and 20,000 or more is high, which usually means the product is saturated.",
  },
  {
    q: "Does a saturated product mean I can't sell it?",
    a: "Not always. A saturated product can still work if you have a clear advantage such as your own brand, a niche variant, a better bundle or lower costs. Without an advantage, a less crowded product is usually the safer choice.",
  },
  {
    q: "Where does the data come from?",
    a: "Live listing counts come from the official eBay UK Browse API and the Etsy Open API at the moment you check. Results are cached for up to 6 hours.",
  },
  {
    q: "Is low competition enough to pick a product?",
    a: "No. Low competition can also mean low demand. Combine it with a demand signal such as rising UK search interest - which is what the UK Viral Radar live rankings track every day.",
  },
];

export default function SaturationCheckerPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "UK Product Saturation Checker",
      url: `${SITE_URL}/tools/saturation-checker`,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0D9488] text-sm font-bold text-white">R</div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <Link href="/tools" className="text-sm text-[#64748B] hover:text-[#0F172A]">All free tools</Link>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">Is my product saturated?</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
          Type a product to see how crowded it is on UK marketplaces right now: live eBay UK and Etsy listing counts, how many
          different sellers compete, with a one-click link to live eBay prices. Free, no sign-up.
        </p>

        <div className="mt-8">
          <SaturationChecker />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[#0F172A]">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-[#E2E8F0] bg-white p-4 open:border-[#99F6E4]">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[#0F172A]">
                  <span className="mr-2 text-[#0D9488] group-open:hidden">+</span>
                  <span className="mr-2 hidden text-[#0D9488] group-open:inline">–</span>
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-sm text-[#475569]">
          Also free: <Link href="/tools/profit-calculator" className="font-medium text-[#0D9488] underline">profit margin calculator</Link>.
        </p>
      </div>
    </main>
  );
}
