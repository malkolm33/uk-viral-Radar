"use client";

import { useState } from "react";
import Link from "next/link";

type Result = {
  keyword: string;
  checkedAt: string;
  ebay: { total: number; sample: number; uniqueSellers: number; avgPrice: number | null; medianPrice: number | null; minPrice: number | null; maxPrice: number | null };
  etsy: number | null;
  competition: "LOW" | "MEDIUM" | "HIGH";
};

const EXAMPLES = ["heated insoles", "neck massager", "pet hair remover", "led strip lights", "portable blender"];

const VERDICT = {
  LOW: {
    title: "Not saturated – there is room to enter",
    text: "Few live listings across eBay UK and Etsy. Check that there is real demand (search interest) before you order stock.",
    bg: "#F0FDF4", border: "#22C55E", ink: "#166534", chip: "#DCFCE7",
  },
  MEDIUM: {
    title: "Competitive – you will need an angle",
    text: "A healthy number of sellers already. Win with a better bundle, photos, price point or faster UK delivery rather than a plain copy.",
    bg: "#FFFBEB", border: "#F59E0B", ink: "#92400E", chip: "#FEF3C7",
  },
  HIGH: {
    title: "Saturated on UK marketplaces",
    text: "Very crowded. Unless you have a clear advantage (own brand, niche variant, lower costs), a less crowded product is usually a better bet.",
    bg: "#FEF2F2", border: "#EF4444", ink: "#991B1B", chip: "#FEE2E2",
  },
} as const;

const nf = new Intl.NumberFormat("en-GB");
const gbp = (n: number | null) => (n === null ? "—" : `£${n.toFixed(2)}`);

// Position on a log scale from 10 to 200,000 listings, as a percentage.
function gaugePos(total: number) {
  const v = Math.log10(Math.max(10, Math.min(200000, total)));
  return ((v - 1) / (Math.log10(200000) - 1)) * 100;
}

export default function SaturationChecker() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function check(q: string) {
    const term = q.trim();
    if (!term) return;
    setQuery(term);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tools/saturation?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!res.ok) {
        setResult(null);
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Could not reach the checker. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const v = result ? VERDICT[result.competition] : null;
  const combined = result ? result.ebay.total + (result.etsy ?? 0) : 0;
  const spread = result && result.ebay.sample ? result.ebay.uniqueSellers / result.ebay.sample : 0;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#14B8A6] bg-[#F0F9FF] shadow-[0_12px_32px_-14px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" aria-hidden="true" />
        <span className="ml-1 text-sm font-semibold text-white">Saturation checker · live eBay UK + Etsy data</span>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            check(query);
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="sat-q" className="sr-only">Product name</label>
          <input
            id="sat-q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={60}
            placeholder="Type a product, e.g. heated insoles"
            className="flex-1 rounded-xl border border-[#99F6E4] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/30"
          />
          <button
            type="submit"
            disabled={loading || query.trim().length < 3}
            className="rounded-xl bg-[#0D9488] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F766E] disabled:opacity-50"
          >
            {loading ? "Checking…" : "Check saturation"}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#475569]">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => check(ex)}
              className="rounded-full border border-[#BAE6FD] bg-white px-3 py-1 text-[#0369A1] hover:border-[#14B8A6] hover:text-[#0F766E]"
            >
              {ex}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
            {error}
          </p>
        )}

        {result && v && (
          <div className="space-y-5" aria-live="polite">
            {/* Verdict */}
            <div className="rounded-xl border-l-8 p-4 sm:p-5" style={{ background: v.bg, borderColor: v.border }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: v.ink }}>
                Result for “{result.keyword}”
              </p>
              <p className="mt-1 text-xl font-bold" style={{ color: v.ink }}>{v.title}</p>
              <p className="mt-1 text-sm text-[#334155]">{v.text}</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "eBay UK listings", value: nf.format(result.ebay.total), stripe: "#2563EB", bg: "#EFF6FF", ink: "#1D4ED8", p: gaugePos(result.ebay.total) / 100, note: "live, all sellers" },
                { label: "Etsy listings", value: result.etsy === null ? "—" : nf.format(result.etsy), stripe: "#F59E0B", bg: "#FFFBEB", ink: "#B45309", p: result.etsy ? gaugePos(result.etsy) / 100 : 0, note: result.etsy === null ? "not available right now" : "live, worldwide shops" },
                { label: "Different sellers", value: `${result.ebay.uniqueSellers}/${result.ebay.sample}`, stripe: "#8B5CF6", bg: "#F5F3FF", ink: "#6D28D9", p: spread, note: "in the top eBay results" },
                { label: "Typical eBay price", value: gbp(result.ebay.medianPrice), stripe: "#16A34A", bg: "#F0FDF4", ink: "#15803D", p: 0, note: `average ${gbp(result.ebay.avgPrice)}` },
              ].map((k) => (
                <div key={k.label} className="rounded-xl border border-t-4 bg-white p-3 shadow-sm" style={{ borderColor: "#E2E8F0", borderTopColor: k.stripe }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#475569]">{k.label}</p>
                  <p className="mt-1 text-2xl font-bold" style={{ color: k.ink }}>{k.value}</p>
                  {k.p > 0 && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: k.bg }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.max(4, Math.round(k.p * 100))}%`, background: k.stripe }} />
                    </div>
                  )}
                  <p className="mt-1.5 text-[11px] text-[#475569]">{k.note}</p>
                </div>
              ))}
            </div>

            {/* Competition gauge */}
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-[#0F766E]">Competition meter</p>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: v.chip, color: v.ink }}>
                  {result.competition} · {nf.format(combined)} listings
                </span>
              </div>
              <div className="relative">
                <div className="flex h-4 overflow-hidden rounded-full">
                  <div className="h-full bg-[#BBF7D0]" style={{ width: `${gaugePos(2000)}%` }} />
                  <div className="h-full bg-[#FDE68A]" style={{ width: `${gaugePos(20000) - gaugePos(2000)}%` }} />
                  <div className="h-full flex-1 bg-[#FECACA]" />
                </div>
                <div
                  className="absolute -top-1.5 h-7 w-1.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#0F172A] shadow"
                  style={{ left: `${gaugePos(combined)}%` }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-[#475569]">
                <span>LOW · under 2,000</span>
                <span>MEDIUM · under 20,000</span>
                <span>HIGH · 20,000+</span>
              </div>
            </div>

            {/* Price range */}
            {result.ebay.minPrice !== null && result.ebay.maxPrice !== null && (
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-[#0F766E]">eBay UK price range (top {result.ebay.sample} listings)</p>
                <div className="relative h-3 rounded-full bg-gradient-to-r from-[#DBEAFE] via-[#BFDBFE] to-[#93C5FD]">
                  {result.ebay.medianPrice !== null && result.ebay.maxPrice > result.ebay.minPrice && (
                    <div
                      className="absolute -top-1 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-[#2563EB] shadow"
                      style={{ left: `${((result.ebay.medianPrice - result.ebay.minPrice) / (result.ebay.maxPrice - result.ebay.minPrice)) * 100}%` }}
                      title={`Typical price ${gbp(result.ebay.medianPrice)}`}
                    />
                  )}
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-[#475569]">Lowest <b className="text-[#0F172A]">{gbp(result.ebay.minPrice)}</b></span>
                  <span className="text-[#1D4ED8]">Typical <b>{gbp(result.ebay.medianPrice)}</b></span>
                  <span className="text-[#475569]">Highest <b className="text-[#0F172A]">{gbp(result.ebay.maxPrice)}</b></span>
                </div>
              </div>
            )}

            {/* Next step */}
            <div className="flex flex-col items-start gap-3 rounded-xl border border-[#99F6E4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#334155]">
                Competition is only half the picture. See which products have <b>rising demand</b> right now.
              </p>
              <Link href="/dashboard" className="shrink-0 rounded-xl bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803D]">
                View live rankings →
              </Link>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Checked {new Date(result.checkedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}. Live listing counts from eBay UK and Etsy; results are cached for up to 6 hours. This measures marketplace competition, not demand, and is not business advice.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
