"use client";

import { useState } from "react";

type Result = {
  netProfit: number;
  profitMargin: number;
  verdict: { label: string; color: string };
};

function getVerdict(profitMargin: number) {
  if (profitMargin >= 30) return { label: "Great margin", color: "#16A34A" };
  if (profitMargin >= 15) return { label: "Acceptable", color: "#D97706" };
  return { label: "Low margin - reconsider", color: "#DC2626" };
}

export default function ProfitCalculatorForm() {
  const [sellingPrice, setSellingPrice] = useState("");
  const [productCost, setProductCost] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [platformFeePercent, setPlatformFeePercent] = useState("10");
  const [result, setResult] = useState<Result | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();

    const price = parseFloat(sellingPrice) || 0;
    const cost = parseFloat(productCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const feePercent = parseFloat(platformFeePercent) || 0;

    const platformFee = price * (feePercent / 100);
    const netProfit = price - cost - shipping - platformFee;
    const profitMargin = price > 0 ? (netProfit / price) * 100 : 0;

    setResult({ netProfit, profitMargin, verdict: getVerdict(profitMargin) });
  }

  return (
    <div className="rounded-lg border border-[#E4E7EC] bg-white p-6 sm:p-8">
      <form onSubmit={handleCalculate} className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#0F172A]">Selling Price (£)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="e.g. 24.99"
            className="rounded-md border border-[#E4E7EC] px-3 py-2 text-[#0F172A] outline-none focus:border-[#0F172A]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#0F172A]">Product Cost (£)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={productCost}
            onChange={(e) => setProductCost(e.target.value)}
            placeholder="e.g. 8.50"
            className="rounded-md border border-[#E4E7EC] px-3 py-2 text-[#0F172A] outline-none focus:border-[#0F172A]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#0F172A]">Shipping Cost (£)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            required
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            placeholder="e.g. 3.00"
            className="rounded-md border border-[#E4E7EC] px-3 py-2 text-[#0F172A] outline-none focus:border-[#0F172A]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-[#0F172A]">Platform Fee %</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            required
            value={platformFeePercent}
            onChange={(e) => setPlatformFeePercent(e.target.value)}
            placeholder="e.g. 10"
            className="rounded-md border border-[#E4E7EC] px-3 py-2 text-[#0F172A] outline-none focus:border-[#0F172A]"
          />
          <span className="text-xs leading-relaxed text-[#64748B]">
            Default is 10%. As a guide: eBay UK is around 12.8% + 30p per order, and Etsy UK
            works out to roughly 10-11% once listing, transaction and payment fees are combined
            - adjust this to match the platform you're selling on.
          </span>
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Calculate
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 border-t border-[#E4E7EC] pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[#F7F8FA] p-5">
              <div className="text-xs font-medium text-[#64748B]">Net Profit</div>
              <div className="mt-1 text-2xl font-bold text-[#0F172A]">
                £{result.netProfit.toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg bg-[#F7F8FA] p-5">
              <div className="text-xs font-medium text-[#64748B]">Profit Margin</div>
              <div className="mt-1 text-2xl font-bold text-[#0F172A]">
                {result.profitMargin.toFixed(1)}%
              </div>
            </div>
          </div>

          <div
            className="mt-4 rounded-md px-4 py-2.5 text-sm font-medium"
            style={{ color: result.verdict.color, backgroundColor: `${result.verdict.color}1A` }}
          >
            {result.verdict.label}
          </div>
        </div>
      )}
    </div>
  );
}
