"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ebayFees, etsyFees, EBAY, type FeeResult } from "../../lib/fees";

const gbp = (n: number) => `${n < 0 ? "−" : ""}£${Math.abs(n).toFixed(2)}`;
const SEG = ["#2563EB", "#60A5FA", "#93C5FD", "#F59E0B", "#EF4444", "#A78BFA"];

function NumberField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold text-[#334155]">{label}</span>
      <div className="mt-1 flex items-center rounded-xl border border-[#BAE6FD] bg-white focus-within:border-[#14B8A6] focus-within:ring-2 focus-within:ring-[#14B8A6]/30">
        <span className="pl-3 text-sm text-[#64748B]">£</span>
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-full rounded-xl bg-transparent px-2 py-2.5 text-sm text-[#0F172A] outline-none"
        />
      </div>
    </label>
  );
}

function Card({ name, accent, track, r, gross, best }: { name: string; accent: string; track: string; r: FeeResult; gross: number; best: boolean }) {
  const segs = [...r.lines, ...(r.vat > 0 ? [{ label: "VAT on fees (20%)", amount: r.vat }] : [])];
  const feePct = gross > 0 ? Math.round((r.total / gross) * 1000) / 10 : 0;
  return (
    <div className="rounded-2xl border-2 bg-white p-4 shadow-sm sm:p-5" style={{ borderColor: best ? accent : "#E2E8F0" }}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold" style={{ color: accent }}>{name}</h3>
        {best && <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ background: accent }}>Higher profit</span>}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { l: "Fees", v: gbp(r.total), c: "#B91C1C", b: "#FEF2F2" },
          { l: "Fee rate", v: `${feePct}%`, c: "#B45309", b: "#FFFBEB" },
          { l: "Profit", v: gbp(r.profit), c: r.profit >= 0 ? "#15803D" : "#B91C1C", b: r.profit >= 0 ? "#F0FDF4" : "#FEF2F2" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl p-2.5 text-center" style={{ background: k.b }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#475569]">{k.l}</p>
            <p className="mt-0.5 text-lg font-bold tabular-nums" style={{ color: k.c }}>{k.v}</p>
          </div>
        ))}
      </div>

      {segs.length > 0 ? (
        <>
          <div
            className="mt-4 flex h-3 overflow-hidden rounded-full"
            style={{ background: track }}
            role="img"
            aria-label={`Fee breakdown: ${segs.map((s) => `${s.label} ${gbp(s.amount)}`).join(", ")}`}
          >
            {segs.map((s, i) => (
              <div key={s.label} style={{ width: `${r.total > 0 ? (s.amount / r.total) * 100 : 0}%`, background: SEG[i % SEG.length] }} />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5">
            {segs.map((s, i) => (
              <li key={s.label} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 text-[#334155]">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SEG[i % SEG.length] }} aria-hidden="true" />
                  {s.label}
                </span>
                <span className="font-semibold tabular-nums text-[#0F172A]">{gbp(s.amount)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 rounded-xl bg-[#F0FDF4] p-3 text-xs text-[#166534]">UK private sellers pay no eBay selling fees on most items.</p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-sm">
        <span className="text-[#475569]">You receive</span>
        <span className="font-bold tabular-nums text-[#0F172A]">{gbp(r.net)}</span>
      </div>
      {r.margin !== null && <p className="mt-1 text-right text-[11px] text-[#64748B]">Profit margin {r.margin}%</p>}
    </div>
  );
}

function Toggle({ active, onClick, label, on, off }: { active: boolean; onClick: () => void; label: string; on: { bg: string }; off: { border: string; ink: string } }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border px-3 py-1 text-xs font-semibold"
      style={active ? { background: on.bg, borderColor: on.bg, color: "#fff" } : { borderColor: off.border, color: off.ink, background: "#fff" }}
    >
      {label}
    </button>
  );
}

export default function FeeCalculator() {
  const [price, setPrice] = useState("25");
  const [postageCharged, setPostageCharged] = useState("3.50");
  const [itemCost, setItemCost] = useState("8");
  const [postageCost, setPostageCost] = useState("3.20");
  const [business, setBusiness] = useState(true);
  const [vatRegistered, setVatRegistered] = useState(false);
  const [fvf, setFvf] = useState(String(EBAY.defaultFvfPct));
  const [ads, setAds] = useState(0);

  const { eb, et, gross } = useMemo(() => {
    const n = (s: string) => {
      const v = parseFloat(s);
      return Number.isFinite(v) && v >= 0 ? v : 0;
    };
    const input = { price: n(price), postageCharged: n(postageCharged), itemCost: n(itemCost), postageCost: n(postageCost), vatRegistered };
    const fvfPct = Math.min(20, n(fvf));
    return {
      eb: ebayFees(input, { business, fvfPct }),
      et: etsyFees(input, { offsiteAdsPct: ads }),
      gross: input.price + input.postageCharged,
    };
  }, [price, postageCharged, itemCost, postageCost, business, vatRegistered, fvf, ads]);
  const diff = Math.round((eb.profit - et.profit) * 100) / 100;

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#3B82F6] bg-[#F0F9FF] shadow-[0_12px_32px_-14px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#1D4ED8] to-[#3B82F6] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/90" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/30" aria-hidden="true" />
        <span className="ml-1 text-sm font-semibold text-white">eBay UK vs Etsy UK fee calculator</span>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumberField id="price" label="Item price" value={price} onChange={setPrice} />
          <NumberField id="pc" label="Postage buyer pays" value={postageCharged} onChange={setPostageCharged} />
          <NumberField id="cost" label="Your item cost" value={itemCost} onChange={setItemCost} />
          <NumberField id="pcost" label="Your postage cost" value={postageCost} onChange={setPostageCost} />
        </div>

        <div className="grid gap-4 rounded-xl bg-white p-4 text-sm shadow-sm sm:grid-cols-3">
          <fieldset>
            <legend className="text-xs font-semibold text-[#334155]">eBay seller type</legend>
            <div className="mt-1.5 flex gap-2">
              <Toggle active={business} onClick={() => setBusiness(true)} label="Business" on={{ bg: "#2563EB" }} off={{ border: "#BFDBFE", ink: "#1D4ED8" }} />
              <Toggle active={!business} onClick={() => setBusiness(false)} label="Private" on={{ bg: "#2563EB" }} off={{ border: "#BFDBFE", ink: "#1D4ED8" }} />
            </div>
          </fieldset>
          <label className="block">
            <span className="text-xs font-semibold text-[#334155]">eBay final value fee %</span>
            <input
              inputMode="decimal"
              value={fvf}
              disabled={!business}
              onChange={(e) => setFvf(e.target.value.replace(/[^0-9.]/g, ""))}
              className="mt-1 w-full rounded-xl border border-[#BFDBFE] bg-white px-3 py-1.5 text-sm disabled:opacity-50"
            />
            <span className="mt-1 block text-[11px] text-[#64748B]">12.9% in most categories; some are lower</span>
          </label>
          <fieldset>
            <legend className="text-xs font-semibold text-[#334155]">Etsy sale came from Offsite Ads?</legend>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {[0, 15, 12].map((p) => (
                <Toggle key={p} active={ads === p} onClick={() => setAds(p)} label={p === 0 ? "No" : `Yes, ${p}%`} on={{ bg: "#F59E0B" }} off={{ border: "#FDE68A", ink: "#B45309" }} />
              ))}
            </div>
          </fieldset>
          <label className="flex items-center gap-2 sm:col-span-3">
            <input type="checkbox" checked={vatRegistered} onChange={(e) => setVatRegistered(e.target.checked)} className="h-4 w-4 accent-[#14B8A6]" />
            <span className="text-xs text-[#334155]">I&apos;m VAT-registered (I reclaim the 20% VAT charged on fees)</span>
          </label>
        </div>

        <div
          className="rounded-xl border-l-8 p-4"
          style={diff === 0 ? { background: "#F8FAFC", borderColor: "#94A3B8" } : diff > 0 ? { background: "#EFF6FF", borderColor: "#2563EB" } : { background: "#FFFBEB", borderColor: "#F59E0B" }}
        >
          <p className="text-lg font-bold text-[#0F172A]">
            {diff === 0 ? "Both platforms leave the same profit" : `${diff > 0 ? "eBay" : "Etsy"} leaves you ${gbp(Math.abs(diff))} more per sale`}
          </p>
          <p className="mt-1 text-sm text-[#334155]">
            On a {gbp(gross)} order (item + postage). Fees only – promoted listings, returns and your time are not included.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card name="eBay UK" accent="#2563EB" track="#DBEAFE" r={eb} gross={gross} best={diff > 0} />
          <Card name="Etsy UK" accent="#D97706" track="#FEF3C7" r={et} gross={gross} best={diff < 0} />
        </div>

        <div className="flex flex-col items-start gap-3 rounded-xl border border-[#99F6E4] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#334155]">
            Margin looks good? Check how <b>crowded</b> the product is before you list it.
          </p>
          <Link href="/tools/saturation-checker" className="shrink-0 rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0F766E]">
            Saturation checker →
          </Link>
        </div>
      </div>
    </div>
  );
}
