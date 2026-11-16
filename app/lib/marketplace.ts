// Server-only helpers that read live UK marketplace data (eBay UK Browse API,
// Etsy Open API). API keys come from environment variables and never reach the
// browser.

export type EbaySnapshot = {
  total: number; // live eBay UK listings matching the keyword
  sample: number; // listings actually sampled (max 50)
  uniqueSellers: number; // distinct sellers in the sample
  avgPrice: number | null;
  medianPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
};

let cachedToken: { value: string; expires: number } | null = null;

async function ebayToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;
  const id = process.env.EBAY_CLIENT_ID;
  const secret = process.env.EBAY_CLIENT_SECRET;
  if (!id || !secret) return null;
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  cachedToken = { value: data.access_token, expires: Date.now() + (Number(data.expires_in) || 7200) * 1000 };
  return cachedToken.value;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export async function getEbaySnapshot(keyword: string): Promise<EbaySnapshot | null> {
  try {
    const token = await ebayToken();
    if (!token) return null;
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(keyword)}&limit=50`,
      { headers: { Authorization: `Bearer ${token}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB" }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const items: { price?: { value?: string; currency?: string }; seller?: { username?: string } }[] = data.itemSummaries || [];
    const prices = items
      .filter((i) => !i.price?.currency || i.price.currency === "GBP")
      .map((i) => parseFloat(i.price?.value ?? ""))
      .filter((p) => Number.isFinite(p) && p > 0)
      .sort((a, b) => a - b);
    const sellers = new Set(items.map((i) => i.seller?.username).filter(Boolean));
    const mid = Math.floor(prices.length / 2);
    return {
      total: Number(data.total) || items.length,
      sample: items.length,
      uniqueSellers: sellers.size,
      avgPrice: prices.length ? round2(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
      medianPrice: prices.length ? round2(prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2) : null,
      minPrice: prices.length ? round2(prices[0]) : null,
      maxPrice: prices.length ? round2(prices[prices.length - 1]) : null,
    };
  } catch {
    return null;
  }
}

export async function getEtsyCount(keyword: string): Promise<number | null> {
  try {
    const key = process.env.ETSY_API_KEY;
    if (!key) return null;
    const res = await fetch(
      `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=1`,
      { headers: { "x-api-key": key }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

// Same thresholds as the dashboard's competition label.
export function competitionLevel(ebay: number, etsy: number | null): "LOW" | "MEDIUM" | "HIGH" {
  const total = ebay + (etsy ?? 0);
  if (total < 2000) return "LOW";
  if (total < 20000) return "MEDIUM";
  return "HIGH";
}
