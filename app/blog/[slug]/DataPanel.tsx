import type { BlogChart } from "../../lib/blog-posts";

// Data snapshot shown inside robot-written, data-driven posts: headline stats,
// a Viral Score bar chart and the full table. Server-rendered, no JS needed.
// Light theme (site owner's rule: no black/dark backgrounds). Surface is a
// light sky blue; score bars blue-600, rising signal green-600 - rising is
// also labelled in text, so colour is never the only cue.
const SCORE = "#2563EB";
const RISING = "#16A34A";
const COMPETITION: Record<string, { bg: string; fg: string }> = {
  LOW: { bg: "#DCFCE7", fg: "#166534" },
  MEDIUM: { bg: "#FEF3C7", fg: "#92400E" },
  HIGH: { bg: "#FEE2E2", fg: "#991B1B" },
};

function signed(n: number | null, suffix = "") {
  if (n === null || n === undefined) return "—";
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}${suffix}`;
}

function Trend({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  if (value === null || value === undefined) return <span className="text-[#94A3B8]">—</span>;
  const up = value > 0;
  const down = value < 0;
  return (
    <span className={up ? "font-semibold text-[#15803D]" : down ? "font-semibold text-[#B91C1C]" : "text-[#475569]"}>
      <span aria-hidden="true">{up ? "▲ " : down ? "▼ " : ""}</span>
      {signed(value, suffix)}
    </span>
  );
}

export default function DataPanel({ chart }: { chart: BlogChart }) {
  const items = [...chart.items].sort((a, b) => b.score - a.score);
  if (!items.length) return null;
  const rising = items.filter((i) => i.rising);
  const top = items[0];
  const withSearch = items.filter((i) => typeof i.search === "number");
  const bestSearch = withSearch.sort((a, b) => (b.search ?? 0) - (a.search ?? 0))[0];
  const max = Math.max(100, ...items.map((i) => i.score));

  // Each headline tile has its own light tint, accent stripe and number colour.
  const accents = [
    { stripe: "#14B8A6", bg: "#ECFEFF", ink: "#0F766E" },
    { stripe: "#16A34A", bg: "#F0FDF4", ink: "#15803D" },
    { stripe: "#2563EB", bg: "#EFF6FF", ink: "#1D4ED8" },
    { stripe: "#F59E0B", bg: "#FFFBEB", ink: "#B45309" },
  ];
  const tiles = [
    { label: "Products analysed", value: String(items.length), note: `of ${chart.tracked} tracked` },
    { label: "Rising signals", value: String(rising.length), note: rising.map((r) => r.name).slice(0, 3).join(", ") || "none" },
    { label: "Top Viral Score", value: String(top.score), note: top.name },
    {
      label: "Biggest search growth",
      value: bestSearch ? signed(bestSearch.search, "%") : "—",
      note: bestSearch ? `${bestSearch.name}, 7 days` : "",
    },
  ];

  return (
    <figure className="!my-8 overflow-hidden rounded-xl border-2 border-[#14B8A6] bg-[#F0F9FF] text-[#0F172A] shadow-[0_10px_30px_-10px_rgba(20,184,166,0.45)]">
      {/* Turquoise window bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#14B8A6] px-4 py-3">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/60" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" aria-hidden="true" />
          <span className="ml-1 text-sm font-semibold tracking-wide text-white">Data at a glance</span>
        </span>
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white">
          UK Viral Radar · {chart.label}
        </span>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {/* Headline numbers */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((t, idx) => (
            <div key={t.label} className="rounded-lg border border-[#BAE6FD] border-t-4 p-3 shadow-sm" style={{ borderTopColor: accents[idx].stripe, background: accents[idx].bg }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#475569]">{t.label}</p>
              <p className="mt-1 text-2xl font-bold" style={{ color: accents[idx].ink }}>{t.value}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-[#475569]">{t.note}</p>
            </div>
          ))}
        </div>

        {/* Viral Score bars */}
        <div>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-[#0F766E]">Viral Score ranking (0–100)</p>
            <div className="flex items-center gap-4 text-[11px] text-[#334155]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SCORE }} aria-hidden="true" />
                Viral Score
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: RISING }} aria-hidden="true" />
                Rising signal
              </span>
            </div>
          </div>
          <div className="space-y-1.5" role="img" aria-label={`Bar chart of Viral Scores: ${items.map((i) => `${i.name} ${i.score}`).join(", ")}`}>
            {items.map((i) => (
              <div
                key={i.name}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 rounded px-1 py-0.5 hover:bg-white sm:grid-cols-[minmax(0,11rem)_1fr_auto]"
                title={`${i.name}: Viral Score ${i.score}${i.change !== null ? `, ${signed(i.change)} since yesterday` : ""}${i.search !== null ? `, UK search ${signed(i.search, "%")} in 7 days` : ""}, ${i.competition} competition`}
              >
                <span className="truncate text-xs text-[#334155]">{i.name}</span>
                <span className="relative order-last col-span-2 h-3 rounded-r bg-[#DBEAFE] sm:order-none sm:col-span-1">
                  <span
                    className="absolute inset-y-0 left-0 rounded-r"
                    style={{ width: `${Math.max(2, (i.score / max) * 100)}%`, background: i.rising ? RISING : SCORE }}
                  />
                </span>
                <span className="flex w-20 items-center justify-end gap-1.5 text-xs font-semibold tabular-nums text-[#0F172A]">
                  {i.rising && <span className="text-[10px] font-semibold text-[#15803D]">▲ Rising</span>}
                  {i.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Full table */}
        <div>
        <p className="mb-3 text-sm font-semibold text-[#0F766E]">Demand and competition, product by product</p>
        <div className="overflow-x-auto rounded-lg border border-[#99F6E4] bg-white">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-[#CCFBF1] text-[11px] uppercase tracking-wide text-[#115E59]">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 text-right font-medium">Score</th>
                <th className="px-3 py-2 text-right font-medium">Since yesterday</th>
                <th className="px-3 py-2 text-right font-medium">UK search, 7d</th>
                <th className="px-3 py-2 font-medium">Competition</th>
                <th className="px-3 py-2 text-right font-medium">Avg eBay price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {items.map((i) => {
                const c = COMPETITION[i.competition];
                return (
                  <tr key={i.name} className="odd:bg-white even:bg-[#F8FAFC] hover:bg-[#F0FDFA]">
                    <td className="px-3 py-2 font-medium text-[#0F172A]">{i.name}</td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums text-[#1D4ED8]">{i.score}</td>
                    <td className="px-3 py-2 text-right tabular-nums"><Trend value={i.change} /></td>
                    <td className="px-3 py-2 text-right tabular-nums"><Trend value={i.search} suffix="%" /></td>
                    <td className="px-3 py-2">
                      {c ? (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: c.bg, color: c.fg }}>
                          {i.competition}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-[#334155]">
                      {typeof i.price === "number" ? `£${i.price.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      <figcaption className="border-t border-[#99F6E4] bg-[#ECFEFF] px-4 py-2.5 text-[11px] text-[#475569] sm:px-6">
        Source: UK Viral Radar daily data ({chart.label}). The Viral Score signals rising interest; it is not a sales forecast. Competition = total live eBay UK + Etsy listings (LOW under 2,000 · MEDIUM under 20,000 · HIGH 20,000+).
      </figcaption>
    </figure>
  );
}
