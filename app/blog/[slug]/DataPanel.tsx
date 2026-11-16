import type { BlogChart } from "../../lib/blog-posts";

// Data snapshot shown inside robot-written, data-driven posts: headline stats,
// a Viral Score bar chart and the full table. Server-rendered, no JS needed.
// Colours validated for the dark panel (dataviz validator, surface #0B1220):
// score bars #2F8FE0, rising signal #1FAF6A - rising is also labelled in text.
const SCORE = "#2F8FE0";
const RISING = "#1FAF6A";
const COMPETITION: Record<string, { bg: string; fg: string }> = {
  LOW: { bg: "rgba(31,175,106,0.16)", fg: "#6EE7A8" },
  MEDIUM: { bg: "rgba(242,169,59,0.16)", fg: "#F7C873" },
  HIGH: { bg: "rgba(229,83,75,0.18)", fg: "#F59A94" },
};

function signed(n: number | null, suffix = "") {
  if (n === null || n === undefined) return "—";
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}${suffix}`;
}

function Trend({ value, suffix = "" }: { value: number | null; suffix?: string }) {
  if (value === null || value === undefined) return <span className="text-[#64748B]">—</span>;
  const up = value > 0;
  const down = value < 0;
  return (
    <span className={up ? "text-[#6EE7A8]" : down ? "text-[#F59A94]" : "text-[#CBD5E1]"}>
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
    <figure className="!my-8 overflow-hidden rounded-xl border border-[#1E293B] bg-[#0B1220] text-[#E2E8F0] shadow-lg">
      {/* Window bar */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] bg-[#0F172A] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E5534B]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#F2A93B]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#1FAF6A]" aria-hidden="true" />
        <span className="ml-2 truncate text-xs font-medium text-[#94A3B8]">
          UK Viral Radar · Data snapshot · {chart.label}
        </span>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {/* Headline numbers */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-lg border border-[#1E293B] bg-[#111A2E] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">{t.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{t.value}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-[#94A3B8]">{t.note}</p>
            </div>
          ))}
        </div>

        {/* Viral Score bars */}
        <div>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-white">Viral Score (0–100)</p>
            <div className="flex items-center gap-4 text-[11px] text-[#CBD5E1]">
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
                className="group grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 rounded px-1 py-0.5 hover:bg-white/5 sm:grid-cols-[minmax(0,11rem)_1fr_auto]"
                title={`${i.name}: Viral Score ${i.score}${i.change !== null ? `, ${signed(i.change)} since yesterday` : ""}${i.search !== null ? `, UK search ${signed(i.search, "%")} in 7 days` : ""}, ${i.competition} competition`}
              >
                <span className="truncate text-xs text-[#CBD5E1]">{i.name}</span>
                <span className="relative order-last col-span-2 h-3 rounded-r bg-white/[0.06] sm:order-none sm:col-span-1">
                  <span
                    className="absolute inset-y-0 left-0 rounded-r"
                    style={{ width: `${Math.max(2, (i.score / max) * 100)}%`, background: i.rising ? RISING : SCORE }}
                  />
                </span>
                <span className="flex w-20 items-center justify-end gap-1.5 text-xs tabular-nums text-white">
                  {i.rising && <span className="text-[10px] font-semibold text-[#6EE7A8]">▲ Rising</span>}
                  {i.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Full table */}
        <div className="overflow-x-auto rounded-lg border border-[#1E293B]">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead className="bg-[#111A2E] text-[11px] uppercase tracking-wide text-[#94A3B8]">
              <tr>
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 text-right font-medium">Score</th>
                <th className="px-3 py-2 text-right font-medium">Since yesterday</th>
                <th className="px-3 py-2 text-right font-medium">UK search, 7d</th>
                <th className="px-3 py-2 font-medium">Competition</th>
                <th className="px-3 py-2 text-right font-medium">Avg eBay price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {items.map((i) => {
                const c = COMPETITION[i.competition];
                return (
                  <tr key={i.name} className="hover:bg-white/5">
                    <td className="px-3 py-2 text-white">{i.name}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">{i.score}</td>
                    <td className="px-3 py-2 text-right tabular-nums"><Trend value={i.change} /></td>
                    <td className="px-3 py-2 text-right tabular-nums"><Trend value={i.search} suffix="%" /></td>
                    <td className="px-3 py-2">
                      {c ? (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: c.bg, color: c.fg }}>
                          {i.competition}
                        </span>
                      ) : (
                        <span className="text-[#64748B]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-[#CBD5E1]">
                      {typeof i.price === "number" ? `£${i.price.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <figcaption className="border-t border-[#1E293B] px-4 py-2.5 text-[11px] text-[#94A3B8] sm:px-6">
        Source: UK Viral Radar daily data ({chart.label}). The Viral Score signals rising interest; it is not a sales forecast. Competition = total live eBay UK + Etsy listings (LOW under 2,000 · MEDIUM under 20,000 · HIGH 20,000+).
      </figcaption>
    </figure>
  );
}
