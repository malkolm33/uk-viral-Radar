import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Viral Radar - Spot Trending Products Before Your Competitors",
  description:
    "Track trending products in the UK market with live data from Google Trends, Wikipedia, eBay, Etsy and YouTube. Built for UK dropshippers and e-commerce sellers.",
  openGraph: {
    title: "UK Viral Radar - Spot Trending Products Before Your Competitors",
    description:
      "Track trending products in the UK market with live data from Google Trends, Wikipedia, eBay, Etsy and YouTube. Built for UK dropshippers and e-commerce sellers.",
    type: "website",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "UK Viral Radar",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Track trending products in the UK market with live data from Google Trends, Wikipedia, eBay, Etsy and YouTube. Built for UK dropshippers and e-commerce sellers.",
  offers: {
    "@type": "Offer",
    price: "9.99",
    priceCurrency: "GBP",
  },
};

const dataSources = [
  {
    name: "Google Trends",
    description: "Search interest over the last 7 days, so you catch demand while it's still climbing.",
  },
  {
    name: "Wikipedia",
    description: "Page-view spikes that often show up before a product goes mainstream.",
  },
  {
    name: "eBay",
    description: "Live UK listing counts and average price, so you know how crowded a niche already is.",
  },
  {
    name: "Etsy",
    description: "Listing volume from independent sellers, a useful early-adopter signal.",
  },
  {
    name: "YouTube",
    description: "Growth in recent video coverage - a strong leading indicator for what's about to trend.",
  },
];

const freeFeatures = [
  "Top 3 trending products, updated live",
  "Viral Score for each product",
  "Search growth and competition snapshot",
];

const proFeatures = [
  "Full ranked list of every tracked product",
  "Live Google Trends, Wikipedia, eBay, Etsy and YouTube data",
  "eBay and Etsy competition counts with average price",
  "New products added as they start trending",
];

const faqs = [
  {
    question: "How does the Viral Score work?",
    answer:
      "Each product gets a single 0-100 score built from live search growth, social and creator momentum, and a competition penalty from current marketplace listings - so you can compare opportunities at a glance instead of checking five different tools.",
  },
  {
    question: "Which data sources do you use?",
    answer:
      "Google Trends and Wikipedia for demand and interest growth, eBay and Etsy for live UK listing counts and pricing, and YouTube for recent video coverage - all combined automatically into the Viral Score.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Pro is a monthly subscription with no lock-in - cancel whenever you like and you won't be charged again.",
  },
  {
    question: "Do you support PayPal?",
    answer: "Yes. You can subscribe with either PayPal or a card via Stripe - whichever you prefer.",
  },
  {
    question: "How often is data updated?",
    answer:
      "Rankings refresh daily, pulling fresh Google Trends, Wikipedia, eBay, Etsy and YouTube data each time so the list reflects what's trending right now.",
  },
  {
    question: "Is this only for UK sellers?",
    answer:
      "The radar is tuned for the UK market - GBP pricing, UK marketplace data and UK-relevant trends - which makes it most useful for sellers targeting UK customers.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
              R
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-sm text-[#64748B] hover:text-[#0F172A] sm:inline"
            >
              Live rankings
            </Link>
            <Link
              href="/blog"
              className="hidden text-sm text-[#64748B] hover:text-[#0F172A] sm:inline"
            >
              Blog
            </Link>
            <Link
              href="/compare"
              className="hidden text-sm text-[#64748B] hover:text-[#0F172A] sm:inline"
            >
              Compare
            </Link>
            <Link
              href="#faq"
              className="hidden text-sm text-[#64748B] hover:text-[#0F172A] sm:inline"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="hidden text-sm text-[#64748B] hover:text-[#0F172A] sm:inline"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-xs font-medium text-[#0F172A]"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-[#16A34A] px-3 py-1.5 text-xs font-medium text-white"
            >
              Get Started
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-white px-3 py-1 text-xs font-medium text-[#64748B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              Built exclusively for UK dropshippers and e-commerce sellers
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
              The trend radar built <span className="text-[#16A34A]">just for the UK market</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-[#64748B] sm:text-lg">
              Most trend tools are US-first and treat the UK as an afterthought. We&apos;re not - every
              signal is UK data: Google Trends, Wikipedia, eBay, Etsy and YouTube, combined into a
              single Viral Score, so you find winning UK products before your global-focused
              competitors even notice them.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/login"
                className="rounded-full bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border border-[#E4E7EC] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A]"
              >
                View live rankings
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#64748B]">Free preview available - no credit card required</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">How it works</h2>
            <p className="mt-3 text-sm text-[#64748B] sm:text-base">
              One Viral Score, built from five live signals updated every day.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dataSources.map((source) => (
              <div
                key={source.name}
                className="rounded-lg border border-[#E4E7EC] bg-white p-5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-[#F7F8FA] text-sm font-semibold text-[#16A34A]">
                  {source.name.charAt(0)}
                </div>
                <h3 className="text-sm font-semibold text-[#0F172A]">{source.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">{source.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">Simple pricing</h2>
            <p className="mt-3 text-sm text-[#64748B] sm:text-base">
              Start free, upgrade whenever you&apos;re ready to see the full list.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E4E7EC] bg-white p-8">
              <h3 className="text-sm font-semibold text-[#64748B]">Free</h3>
              <p className="mt-2 text-3xl font-bold text-[#0F172A]">£0</p>
              <ul className="mt-6 space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#0F172A]">
                    <span className="mt-0.5 text-[#16A34A]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="mt-8 block rounded-md border border-[#E4E7EC] bg-white py-2.5 text-center text-sm font-medium text-[#0F172A]"
              >
                View live rankings
              </Link>
            </div>
            <div className="relative rounded-lg border border-[#16A34A] bg-white p-8">
              <div className="absolute -top-3 right-6 rounded-full bg-[#16A34A] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                Pro
              </div>
              <h3 className="text-sm font-semibold text-[#64748B]">Pro</h3>
              <p className="mt-2 text-3xl font-bold text-[#0F172A]">
                £9.99<span className="text-base font-medium text-[#64748B]">/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#0F172A]">
                    <span className="mt-0.5 text-[#16A34A]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="mt-8 block rounded-md bg-[#16A34A] py-2.5 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-[#16A34A]/30 bg-[#16A34A]/5 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
              <div className="text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">Other tools</p>
                <p className="mt-2 text-2xl font-bold text-[#64748B] line-through decoration-2">
                  $19.90-$89.99<span className="text-sm font-medium">/mo</span>
                </p>
              </div>
              <div className="text-2xl text-[#16A34A]">→</div>
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16A34A]">UK Viral Radar</p>
                <p className="mt-2 text-3xl font-bold text-[#0F172A]">
                  £9.99<span className="text-base font-medium text-[#64748B]">/mo</span>
                </p>
              </div>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-center text-sm text-[#64748B]">
              Most trend-spotting tools charge $19.90-$89.99/mo for broad, global data most UK sellers
              never use. We focus on the UK market only, so you get sharper signals for a fraction of
              the price.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm text-[#64748B] sm:text-base">
              Can&apos;t find what you&apos;re looking for? <Link href="/contact" className="font-medium text-[#16A34A] underline">Get in touch</Link>.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-[#E4E7EC] rounded-lg border border-[#E4E7EC] bg-white">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-[#0F172A]">
                  {faq.question}
                  <span className="shrink-0 text-[#64748B] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-[#E4E7EC]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-8 sm:px-10">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748B]">
            <Link href="/dashboard" className="hover:text-[#0F172A]">Live rankings</Link>
            <Link href="/compare" className="hover:text-[#0F172A]">Compare</Link>
            <Link href="#faq" className="hover:text-[#0F172A]">FAQ</Link>
            <Link href="/contact" className="hover:text-[#0F172A]">Contact</Link>
            <Link href="/privacy" className="hover:text-[#0F172A]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#0F172A]">Terms of Service</Link>
          </nav>
          <p className="text-center text-xs text-[#64748B]">
            © {new Date().getFullYear()} UK Viral Radar. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
