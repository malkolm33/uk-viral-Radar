import Link from "next/link";
import type { Metadata } from "next";
import FeeCalculator from "./FeeCalculator";
import { SITE_URL, jsonLd } from "../../lib/site";
import { FEES_CHECKED } from "../../lib/fees";

const TITLE = "eBay UK vs Etsy UK Fee Calculator (2026) - Free";
const DESCRIPTION =
  "Compare eBay UK and Etsy UK seller fees side by side and see which leaves you more profit. Updated for 2026 fees, VAT on fees and Etsy Offsite Ads.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/fee-calculator" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/tools/fee-calculator" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "How much does eBay UK charge business sellers in 2026?",
    a: "In most categories eBay UK charges business sellers a 12.9% final value fee on the total sale (item plus postage), a per-order fee of 40p on orders over £10 (30p at £10 or less, since 12 February 2026) and a 0.35% regulatory operating fee. Sellers who are not VAT-registered also pay 20% VAT on those fees. Some categories have lower rates.",
  },
  {
    q: "Do private sellers pay eBay fees in the UK?",
    a: "UK private sellers pay no final value fee or per-order fee on most items. Fees apply if you sell as a business, which most dropshippers and regular resellers do.",
  },
  {
    q: "What are Etsy's fees for UK sellers?",
    a: "Etsy charges a listing fee of $0.20 (about 16p), a 6.5% transaction fee on the item price plus postage, payment processing of 4% + 20p, and a 0.48% regulatory operating fee for UK sellers (raised from 0.32% on 22 June 2026). If a sale comes from Etsy's Offsite Ads, a further 15% (or 12% for larger shops) applies. VAT is added to these fees for sellers who are not VAT-registered.",
  },
  {
    q: "Is eBay or Etsy cheaper for UK sellers?",
    a: "On standard fees Etsy usually takes a smaller share than eBay for business sellers, but an Offsite Ads sale can make Etsy far more expensive on that order. Enter your own price and costs above to see the exact difference.",
  },
];

export default function FeeCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "eBay UK vs Etsy UK Fee Calculator",
      url: `${SITE_URL}/tools/fee-calculator`,
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
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0D9488] text-sm font-bold text-white">R</div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <Link href="/tools" className="text-sm text-[#64748B] hover:text-[#0F172A]">All free tools</Link>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">eBay UK vs Etsy UK fee calculator</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
          Enter your price and costs to see every fee, your profit and which platform leaves you more money – side by side.
          Fees checked on {FEES_CHECKED}.
        </p>

        <div className="mt-8">
          <FeeCalculator />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[#0F172A]">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-[#E2E8F0] bg-white p-4 open:border-[#BFDBFE]">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[#0F172A]">
                  <span className="mr-2 text-[#2563EB] group-open:hidden">+</span>
                  <span className="mr-2 hidden text-[#2563EB] group-open:inline">–</span>
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-8 text-xs text-[#64748B]">
          Sources: eBay UK fees for business sellers and the eBay UK fee changes of 12 February 2026; Etsy Fees &amp; Payments Policy
          (UK). Fees can change – check the platform before pricing. Not financial or tax advice.
        </p>
      </div>
    </main>
  );
}
