// UK marketplace fee rules, checked 16 Nov 2026 against eBay UK's business
// seller fee page / Feb-2026 rate-card change and Etsy's UK fee policy.
// Update these constants (and FEES_CHECKED) whenever the platforms change fees.
export const FEES_CHECKED = "16 November 2026";

export const EBAY = {
  defaultFvfPct: 12.9, // most categories, business sellers
  perOrderUpTo10: 0.3,
  perOrderAbove10: 0.4, // since 12 Feb 2026
  regulatoryPct: 0.35,
};

export const ETSY = {
  listingFee: 0.16, // charged as $0.20, approx in GBP
  transactionPct: 6.5,
  processingPct: 4,
  processingFixed: 0.2,
  regulatoryPct: 0.48, // UK, since 22 Jun 2026
};

export const VAT_RATE = 0.2;

export type FeeInput = {
  price: number; // item price charged to buyer
  postageCharged: number; // postage the buyer pays
  itemCost: number; // what the item costs you
  postageCost: number; // what posting it costs you
  vatRegistered: boolean;
};

export type FeeLine = { label: string; amount: number };
export type FeeResult = { lines: FeeLine[]; fees: number; vat: number; total: number; net: number; profit: number; margin: number | null };

const r2 = (n: number) => Math.round(n * 100) / 100;

function finish(lines: FeeLine[], input: FeeInput): FeeResult {
  const fees = lines.reduce((s, l) => s + l.amount, 0);
  const vat = input.vatRegistered ? 0 : fees * VAT_RATE; // VAT on fees; VAT-registered sellers reclaim it
  const total = fees + vat;
  const gross = input.price + input.postageCharged;
  const net = gross - total;
  const profit = net - input.itemCost - input.postageCost;
  return {
    lines: lines.map((l) => ({ ...l, amount: r2(l.amount) })),
    fees: r2(fees),
    vat: r2(vat),
    total: r2(total),
    net: r2(net),
    profit: r2(profit),
    margin: gross > 0 ? Math.round((profit / gross) * 1000) / 10 : null,
  };
}

export function ebayFees(input: FeeInput, opts: { business: boolean; fvfPct: number }): FeeResult {
  const total = input.price + input.postageCharged;
  if (!opts.business) return finish([], { ...input, vatRegistered: true });
  return finish(
    [
      { label: `Final value fee (${opts.fvfPct}%)`, amount: (total * opts.fvfPct) / 100 },
      { label: "Per-order fee", amount: total > 10 ? EBAY.perOrderAbove10 : EBAY.perOrderUpTo10 },
      { label: `Regulatory operating fee (${EBAY.regulatoryPct}%)`, amount: (total * EBAY.regulatoryPct) / 100 },
    ],
    input
  );
}

export function etsyFees(input: FeeInput, opts: { offsiteAdsPct: number }): FeeResult {
  const total = input.price + input.postageCharged;
  const lines: FeeLine[] = [
    { label: "Listing fee", amount: ETSY.listingFee },
    { label: `Transaction fee (${ETSY.transactionPct}%)`, amount: (total * ETSY.transactionPct) / 100 },
    { label: `Payment processing (${ETSY.processingPct}% + 20p)`, amount: (total * ETSY.processingPct) / 100 + ETSY.processingFixed },
    { label: `Regulatory operating fee (${ETSY.regulatoryPct}%)`, amount: (total * ETSY.regulatoryPct) / 100 },
  ];
  if (opts.offsiteAdsPct > 0) lines.push({ label: `Offsite Ads (${opts.offsiteAdsPct}%)`, amount: (total * opts.offsiteAdsPct) / 100 });
  return finish(lines, input);
}
