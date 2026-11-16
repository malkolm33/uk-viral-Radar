import type { BlogChart, BlogChartItem } from "../../lib/blog-posts";
import { themeFor, RISING, DECLINING, UP, DOWN } from "../../lib/panel-themes";

// Data snapshot shown inside data-driven posts. Server-rendered, no JS.
// Layout ideas from open-source dashboard work: KPI cards with a delta badge and
// progress bar, a "bar list" with labels inside the bars (Tremor), a diverging
// up/down chart around a zero line, and a table with heat-tinted cells
// (Datawrapper tables). Light theme only; the theme changes per post.

const COMPETITION: Record<string, { bg: string; fg: string; level: number }> = {
  LOW: { bg: "#DCFCE7", fg: "#166534", level: 1 },
  MEDIUM: { bg: "#FEF3C7", fg: "#92400E", level: 2 },
  HIGH: { bg: "#FEE2E2", fg: "#991B1B", level: 3 },
};

const TILES = [
  { stripe: "#14B8A6", bg: "#ECFEFF", ink: "#0F766E" },
  { stripe: "#16A34A", bg: "#F0FDF4", ink: "#15803D" },
  { stripe: "#2563EB", bg: "#EFF6FF", ink: "#1D4ED8" },
  { stripe: "#F59E0B", bg: "#FFFBEB", ink: "#B45309" },
];

function signed(n: number | null | undefined, suffix = "") {
  if (n === null || n === undefined) return "—";
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}${suffix}`;
}

function Delta({ value, suffix = "" }: { value: number | null | undefined; suffix?: string }) {
  if (value === null || value === undefined) return null;
  const up = value > 0;
  const down = value < 0;
  const style = up
    ? { background: "#DBEAFE", color: "#1D4ED8" }
    : down
      ? { background: "#FEE2E2", color: "#B91C1C" }
      : { background: "#F1F5F9", color: "#475569" };
  return (
    <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={style}>
      <span aria-hidden="true">{up ? "▲ " : down ? "▼ " : ""}</span>
      {signed(value, suffix)}
    </span>
  );
}

function barColor(i: BlogChartItem, base: string) {
  if (i.rising) return RISING;
  if (typeof i.change === "number" && i.change <= -15) return DECLINING;
  return base;
}

// Light tint behind a search-growth cell: green-ish for growth, red for decline.
function heat(v: number | null) {
  if (v === null || v === undefined || v === 0) return undefined;
  const a = Math.min(0.55, 0.12 + Math.abs(v) / 200);
  return v > 0 ? `rgba(37,99,235,${a.toFixed(2)})` : `rgba(220,38,38,${a.toFixed(2)})`;
}

export default function DataPanel({ chart, slug }: { chart: BlogChart; slug: string }) {
  const t = themeFor(slug);
  const items = [...chart.items].sort((a, b) => b.score - a.score);
  const showPrice = items.some((i) => typeof i.price === "number");
  if (!items.length) return null;
  const rising = items.filter((i) => i.rising);
  const top = items[0];
  const bestSearch = [...items].filter((i) => typeof i.search === "number").sort((a, b) => (b.search ?? 0) - (a.search ?? 0))[0];
  const max = Math.max(100, ...items.map((i) => i.score));
  const moves = items.filter((i) => typeof i.change === "number" && i.change !== 0).sort((a, b) => (b.change ?? 0) - (a.change ?? 0));
  const maxMove = Math.max(1, ...moves.map((i) => Math.abs(i.change ?? 0)));

  const tiles = [
    { label: "Products analysed", value: String(items.length), note: `of ${chart.tracked} tracked`, progress: items.length / Math.max(1, chart.tracked), delta: null as number | null, deltaSuffix: "" },
    { label: "Rising signals", value: String(rising.length), note: rising.map((r) => r.name).slice(0, 3).join(", ") || "none this time", progress: rising.length / items.length, delta: null, deltaSuffix: "" },
    { label: "Top Viral Score", value: String(top.score), note: top.name, progress: top.score / 100, delta: top.change, deltaSuffix: "" },
    { label: "Biggest search growth", value: bestSearch ? signed(bestSearch.search, "%") : "—", note: bestSearch ? `${bestSearch.name}, 7 days` : "", progress: bestSearch ? Math.min(1, Math.abs(bestSearch.search ?? 0) / 100) : 0, delta: null, deltaSuffix: "" },
  ];

  return (
    <figure
      className="!my-8 overflow-hidden rounded-2xl border-2 text-[#0F172A] shadow-[0_12px_32px_-14px_rgba(15,23,42,0.25)]"
      style={{ borderColor: t.frame, background: t.surface }}
    >
      {/* Coloured title bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
        style={{ background: `linear-gradient(90deg, ${t.headerFrom}, ${t.headerTo})` }}
      >
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/60" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/30" aria-hidden="true" />
          <span className="ml-1 text-sm font-semibold tracking-wide text-white">Data at a glance</span>
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white">
          UK Viral Radar · {chart.label}
        </span>
      </div>

      <div className="space-y-7 p-4 sm:p-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((k, idx) => (
            <div key={k.label} className="rounded-xl border border-t-4 bg-white p-3 shadow-sm" style={{ borderColor: "#E2E8F0", borderTopColor: TILES[idx].stripe }}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#475569]">{k.label}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-bold" style={{ color: TILES[idx].ink }}>{k.value}</span>
                <Delta value={k.delta} suffix={k.deltaSuffix} />
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: TILES[idx].bg }}>
                <div className="h-full rounded-full" style={{ width: `${Math.max(4, Math.round(k.progress * 100))}%`, background: TILES[idx].stripe }} />
              </div>
              <p className="mt-1.5 line-clamp-2 text-[11px] text-[#475569]">{k.note}</p>
            </div>
          ))}
        </div>

        {/* Bar list: Viral Score ranking */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold" style={{ color: t.accent }}>Viral Score ranking (0–100)</p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#334155]">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: t.bar }} aria-hidden="true" />Viral Score</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: RISING }} aria-hidden="true" />Rising signal</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: DECLINING }} aria-hidden="true" />Fell 15+ points</span>
            </div>
          </div>
          <div className="space-y-1.5" role="img" aria-label={`Viral Scores: ${items.map((i) => `${i.name} ${i.score}`).join(", ")}`}>
            {items.map((i) => {
              const c = barColor(i, t.bar);
              const w = Math.max(18, (i.score / max) * 100);
              return (
                <div key={i.name}>
                  {/* On phones the name sits above the bar so it is never cut off */}
                  <span className="mb-0.5 block text-xs font-medium text-[#0F172A] sm:hidden">{i.name}</span>
                  <div className="flex items-center gap-3">
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md border" style={{ background: "#F8FAFC", borderColor: t.track }}>
                    <div className="absolute inset-y-0 left-0 rounded-md border-l-4" style={{ width: `${w}%`, background: `${c}59`, borderLeftColor: c }} />
                    <span className="relative z-10 hidden h-full items-center truncate pl-3 text-xs font-medium text-[#0F172A] sm:flex">{i.name}</span>
                  </div>
                  <span className="flex shrink-0 items-center justify-end gap-1.5 text-sm font-bold tabular-nums sm:w-24" style={{ color: c }}>
                    {i.rising && <span className="text-[10px] font-semibold">▲ Rising</span>}
                    {i.score}
                  </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diverging chart: up or down since yesterday */}
        {moves.length > 0 && (
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold" style={{ color: t.accent }}>Up or down since yesterday (Viral Score points)</p>
              <div className="flex items-center gap-3 text-[11px] text-[#334155]">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: UP }} aria-hidden="true" />Up</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: DOWN }} aria-hidden="true" />Down</span>
              </div>
            </div>
            <div className="space-y-1" role="img" aria-label={`Change since yesterday: ${moves.map((i) => `${i.name} ${signed(i.change)}`).join(", ")}`}>
              {moves.map((i) => {
                const v = i.change ?? 0;
                const w = (Math.abs(v) / maxMove) * 50;
                return (
                  <div key={i.name} className="grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-2 sm:grid-cols-[minmax(0,12rem)_1fr]">
                    <span className="truncate text-xs text-[#334155]">{i.name}</span>
                    <div className="relative h-5">
                      <div className="absolute inset-y-0 left-1/2 w-px bg-[#94A3B8]" aria-hidden="true" />
                      <div
                        className="absolute inset-y-0.5 rounded-sm"
                        style={v > 0 ? { left: "50%", width: `${w}%`, background: UP } : { right: "50%", width: `${w}%`, background: DOWN }}
                      />
                      <span
                        className="absolute top-1/2 -translate-y-1/2 text-[11px] font-semibold tabular-nums"
                        style={v > 0 ? { left: `calc(50% + ${w}% + 4px)`, color: UP } : { right: `calc(50% + ${w}% + 4px)`, color: DOWN }}
                      >
                        {signed(v)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Table with heat-tinted search cells. The price column only appears when a post carries eBay prices (flag-controlled at write time). */}
        <div>
          <p className="mb-3 text-sm font-semibold" style={{ color: t.accent }}>Demand and competition, product by product</p>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm" style={{ borderColor: "#E2E8F0" }}>
            <table className="w-full min-w-[580px] text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wide" style={{ background: t.headBg, color: t.headInk }}>
                <tr>
                  <th className="px-3 py-2 font-semibold">Product</th>
                  <th className="px-3 py-2 text-right font-semibold">Score</th>
                  <th className="px-3 py-2 text-right font-semibold">Since yesterday</th>
                  <th className="px-3 py-2 text-right font-semibold">UK search, 7d</th>
                  <th className="px-3 py-2 font-semibold">Competition</th>
                  {showPrice && <th className="px-3 py-2 text-right font-semibold">Avg eBay price</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {items.map((i) => {
                  const c = COMPETITION[i.competition];
                  return (
                    <tr key={i.name} className="odd:bg-white even:bg-[#F8FAFC]">
                      <td className="px-3 py-2 font-medium text-[#0F172A]">
                        {i.name}
                        {i.rising && <span className="ml-1.5 rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[9px] font-bold text-[#166534]">RISING</span>}
                      </td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: t.bar }}>{i.score}</td>
                      <td className="px-3 py-2 text-right"><Delta value={i.change} /></td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums text-[#0F172A]" style={{ background: heat(i.search) }}>
                        {signed(i.search, "%")}
                      </td>
                      <td className="px-3 py-2">
                        {c ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: c.bg, color: c.fg }}>
                            <span className="flex gap-0.5" aria-hidden="true">
                              {[1, 2, 3].map((n) => (
                                <span key={n} className="h-2 w-1 rounded-sm" style={{ background: n <= c.level ? c.fg : "#FFFFFF" }} />
                              ))}
                            </span>
                            {i.competition}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">—</span>
                        )}
                      </td>
                      {showPrice && <td className="px-3 py-2 text-right tabular-nums text-[#334155]">{typeof i.price === "number" ? `£${i.price.toFixed(2)}` : "—"}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <figcaption className="border-t px-4 py-2.5 text-[11px] text-[#475569] sm:px-6" style={{ borderColor: t.frame, background: "#FFFFFFB3" }}>
        Source: UK Viral Radar daily data ({chart.label}). The Viral Score signals rising interest; it is not a sales forecast. Competition = total live eBay UK + Etsy listings (LOW under 2,000 · MEDIUM under 20,000 · HIGH 20,000+). Blue/red cell shading = UK search growth/decline over 7 days.
      </figcaption>
    </figure>
  );
}
