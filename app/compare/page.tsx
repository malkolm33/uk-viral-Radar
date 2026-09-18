import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Viral Radar vs Other Trend Tools - Compare Pricing & Features",
  description:
    "See how UK Viral Radar compares to typical trend research tools on pricing, UK-specific data coverage and free tier access, before you choose a tool.",
  openGraph: {
    title: "UK Viral Radar vs Other Trend Tools - Compare Pricing & Features",
    description:
      "See how UK Viral Radar compares to typical trend research tools on pricing, UK-specific data coverage and free tier access, before you choose a tool.",
    type: "website",
  },
};

const comparisonRows = [
  {
    feature: "Monthly price",
    us: "£9.99/mo",
    others: "$19.90-$89.99/mo",
  },
  {
    feature: "UK-specific data",
    us: "Yes",
    others: "No / Limited",
  },
  {
    feature: "Data sources",
    us: "5 live sources (Google Trends, Wikipedia, eBay, Etsy, YouTube)",
    others: "Varies, often global-only and fewer sources",
  },
  {
    feature: "Free tier",
    us: "Top 3 trending products, live, no card required",
    others: "Often none, or a short limited-time trial",
  },
];

const whyUsPoints = [
  {
    title: "Built only for the UK market",
    description:
      "Every signal - search interest, marketplace listings, video coverage - is UK data, not a global dataset with the UK buried somewhere inside it.",
  },
  {
    title: "One score, five live sources",
    description:
      "Google Trends, Wikipedia, eBay, Etsy and YouTube data are combined into a single Viral Score automatically, instead of you checking five separate tools by hand.",
  },
  {
    title: "One simple price",
    description:
      "£9.99/month, one plan, no tiered upsells or annual-only discounts - so you always know exactly what you're paying for.",
  },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F172A] text-sm font-bold text-white">
              R
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">UK Viral Radar</span>
          </Link>
          <Link href="/" className="text-sm text-[#64748B] hover:text-[#0F172A]">
            Back to home
          </Link>
        </header>

        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          UK Viral Radar vs Other Trend Research Tools
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#64748B] sm:text-base">
          Most trend research tools are built for a global or US audience first, with UK data bundled
          in as an afterthought - and priced for agencies rather than individual sellers. UK Viral
          Radar takes the opposite approach: every signal is UK-specific, and it&apos;s priced for a
          single UK seller, not a team. Here&apos;s how that plays out in practice.
        </p>

        <div className="mt-10 overflow-x-auto rounded-lg border border-[#E4E7EC] bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E4E7EC] bg-[#F7F8FA]">
                <th scope="col" className="px-5 py-3 font-semibold text-[#0F172A]">
                  Feature
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-[#16A34A]">
                  UK Viral Radar
                </th>
                <th scope="col" className="px-5 py-3 font-semibold text-[#64748B]">
                  Typical Alternatives
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {comparisonRows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-5 py-4 text-left font-medium text-[#0F172A]">
                    {row.feature}
                  </th>
                  <td className="px-5 py-4 text-[#0F172A]">{row.us}</td>
                  <td className="px-5 py-4 text-[#64748B]">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">
            Why UK sellers choose us
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {whyUsPoints.map((point) => (
              <div key={point.title} className="rounded-lg border border-[#E4E7EC] bg-white p-5">
                <h3 className="text-sm font-semibold text-[#0F172A]">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{point.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-lg border border-[#16A34A]/30 bg-[#16A34A]/5 p-8 text-center sm:p-10">
          <h2 className="text-lg font-semibold text-[#0F172A] sm:text-xl">
            See it for yourself - free, no card required
          </h2>
          <Link
            href="/login"
            className="rounded-full bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white"
          >
            Try UK Viral Radar Free
          </Link>
        </div>
      </div>
    </main>
  );
}
