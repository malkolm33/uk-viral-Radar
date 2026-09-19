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

// Small, original icons for the "How it works" row - each uses the associated
// brand's real color palette to be instantly recognisable, without reproducing
// any brand's actual logo or wordmark.
function GoogleTrendsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 18l5-5" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 13l5 2" stroke="#EA4335" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 15l5-8" stroke="#FBBC05" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M17 7l5-3" stroke="#34A853" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19.4 3.4l2.6.6-.6 2.6" stroke="#34A853" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="2" cy="18" r="1.3" fill="#4285F4" />
      <circle cx="7" cy="13" r="1.3" fill="#EA4335" />
      <circle cx="12" cy="15" r="1.3" fill="#FBBC05" />
      <circle cx="17" cy="7" r="1.3" fill="#34A853" />
    </svg>
  );
}

function WikipediaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 5.5c1.6-.7 3.4-1 5-.9 1.6.1 3.1.6 4 1.4.9-.8 2.4-1.3 4-1.4 1.6-.1 3.4.2 5 .9v13c-1.6-.7-3.4-1-5-.9-1.6.1-3.1.6-4 1.4-.9-.8-2.4-1.3-4-1.4-1.6-.1-3.4.2-5 .9v-13z"
        stroke="#334155"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 6v13" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function EbayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 6a1 1 0 011-1h8l8 6.5-8 6.5H4a1 1 0 01-1-1V6z"
        stroke="#334155"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="7.2" cy="9.4" r="1.15" fill="#E53238" />
      <circle cx="10.6" cy="9.4" r="1.15" fill="#0064D2" />
      <circle cx="7.2" cy="13" r="1.15" fill="#F5AF02" />
      <circle cx="10.6" cy="13" r="1.15" fill="#86B817" />
    </svg>
  );
}

function EtsyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 20.3S4.5 15.7 4.5 10.1C4.5 6.9 6.9 4.5 9.7 4.5c1.6 0 2.9.8 3.8 2 .9-1.2 2.2-2 3.8-2 2.8 0 5.2 2.4 5.2 5.6 0 5.6-7.5 10.2-7.5 10.2H12z"
        fill="#F45800"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 7.5v9l8-4.5-8-4.5z" fill="white" />
    </svg>
  );
}

const DATA_SOURCE_VISUALS: Record<string, { Icon: () => React.JSX.Element; bg: string }> = {
  "Google Trends": { Icon: GoogleTrendsIcon, bg: "#F7F8FA" },
  Wikipedia: { Icon: WikipediaIcon, bg: "#F7F8FA" },
  eBay: { Icon: EbayIcon, bg: "#F7F8FA" },
  Etsy: { Icon: EtsyIcon, bg: "#FDF0E7" },
  YouTube: { Icon: YouTubeIcon, bg: "#FF0000" },
};

// Static, illustrative preview of the dashboard for the hero section - not
// connected to any live data, just a lightweight mockup so visitors can see
// what the product looks like before signing up.
const heroPreviewProducts = [
  { rank: 1, name: "Portable Ice Maker", score: 87, label: "Early Winner", color: "#16A34A" },
  { rank: 2, name: "LED Strip Lights", score: 76, label: "Strong", color: "#16A34A" },
  { rank: 3, name: "Collagen Face Serum", score: 52, label: "Watching", color: "#D97706" },
];

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E4E7EC] bg-white shadow-xl">
      <div className="flex items-center gap-2 border-b border-[#E4E7EC] bg-[#F7F8FA] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-2 flex-1 truncate rounded-full border border-[#E4E7EC] bg-white px-3 py-1 text-[11px] text-[#64748B]">
          ukviralradar.com/dashboard
        </div>
      </div>
      <div className="space-y-2.5 bg-[#F7F8FA] p-4">
        {heroPreviewProducts.map((product) => (
          <div
            key={product.rank}
            className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E7EC] bg-white p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#F1F5F9] text-xs font-semibold text-[#64748B]">
                #{product.rank}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#0F172A]">{product.name}</p>
                <p className="text-[10px] text-[#64748B]">
                  Score: <span className="font-semibold" style={{ color: product.color }}>{product.score}</span>/100
                </p>
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{ color: product.color, backgroundColor: `${product.color}1A` }}
            >
              {product.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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

// Simple, single-path brand glyphs (all normalized to a 24x24 viewBox) so each
// renders crisply at a small size with just `fill="currentColor"` - no external
// icon library needed. Links are placeholders until real accounts exist.
const socialLinks: { name: string; href: string; path: string }[] = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@ukViralRadar",
    path: "M23.498 6.186a2.994 2.994 0 0 0-2.108-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.39.524A2.994 2.994 0 0 0 .502 6.186 31.26 31.26 0 0 0 0 12a31.26 31.26 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.108 2.117c1.885.524 9.39.524 9.39.524s7.505 0 9.39-.524a2.994 2.994 0 0 0 2.108-2.117A31.26 31.26 0 0 0 24 12a31.26 31.26 0 0 0-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/ukviralradar",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 .001 12.324A6.162 6.162 0 0 0 12 5.838ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  {
    name: "Facebook",
    href: "https://ukviralradar.com",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@ukviralradar",
    path: "M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z",
  },
  {
    name: "Pinterest",
    href: "https://ukviralradar.com",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.885 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.211 0-2.363-.63-2.751-1.379l-.748 2.858c-.271 1.043-1.002 2.35-1.492 3.146 1.124.345 2.317.535 3.554.535 6.62 0 11.99-5.366 11.99-11.988C23.983 5.367 18.617 0 12.017 0Z",
  },
  {
    name: "Reddit",
    href: "https://reddit.com/user/uk-viral-radar",
    path: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0Zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701ZM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249Zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249Zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095Z",
  },
];

function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

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
              href="/tools/profit-calculator"
              className="hidden text-sm text-[#64748B] hover:text-[#0F172A] sm:inline"
            >
              Free Tools
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
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-10">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-white px-3 py-1 text-xs font-medium text-[#64748B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                Built exclusively for UK dropshippers and e-commerce sellers
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0F172A] sm:text-5xl">
                The trend radar built <span className="text-[#16A34A]">just for the UK market</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-[#64748B] sm:text-lg lg:mx-0">
                Most trend tools are US-first and treat the UK as an afterthought. We&apos;re not - every
                signal is UK data: Google Trends, Wikipedia, eBay, Etsy and YouTube, combined into a
                single Viral Score, so you find winning UK products before your global-focused
                competitors even notice them.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <DashboardPreview />
            </div>
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
            {dataSources.map((source) => {
              const visual = DATA_SOURCE_VISUALS[source.name];
              const Icon = visual.Icon;
              return (
                <div
                  key={source.name}
                  className="rounded-lg border border-[#E4E7EC] bg-white p-5"
                >
                  <div
                    className="mb-3 flex h-12 w-12 items-center justify-center rounded-full shadow-sm"
                    style={{ backgroundColor: visual.bg }}
                  >
                    <Icon />
                  </div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">{source.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#64748B]">{source.description}</p>
                </div>
              );
            })}
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
            <div className="relative z-10 rounded-lg border-2 border-[#16A34A] bg-white p-8 shadow-xl sm:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#16A34A] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Most Popular
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
            <Link href="/tools/profit-calculator" className="hover:text-[#0F172A]">Free Tools</Link>
            <Link href="#faq" className="hover:text-[#0F172A]">FAQ</Link>
            <Link href="/contact" className="hover:text-[#0F172A]">Contact</Link>
            <Link href="/privacy" className="hover:text-[#0F172A]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#0F172A]">Terms of Service</Link>
          </nav>
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E7EC] text-[#64748B] transition-colors hover:border-[#0F172A] hover:text-[#0F172A]"
              >
                <SocialIcon path={social.path} />
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-[#64748B]">
            © {new Date().getFullYear()} UK Viral Radar. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
