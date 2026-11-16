import { NextRequest, NextResponse } from "next/server";
import { getEbaySnapshot, getEtsyCount, competitionLevel } from "../../../lib/marketplace";

// Free "Is this product saturated?" checker. Public, so it is protected by:
// strict input validation, a per-IP rate limit and a result cache (which also
// keeps us well inside the eBay/Etsy API quotas).
const MAX_PER_MINUTE = 6;
const MAX_PER_DAY = 40;
const CACHE_MS = 6 * 60 * 60 * 1000;

const hits = new Map<string, number[]>();
const cache = new Map<string, { at: number; body: unknown }>();

function clientIp(req: NextRequest) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 24 * 3600 * 1000);
  const lastMinute = list.filter((t) => now - t < 60 * 1000).length;
  if (lastMinute >= MAX_PER_MINUTE || list.length >= MAX_PER_DAY) return true;
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // memory guard
  return false;
}

export async function GET(req: NextRequest) {
  const raw = (req.nextUrl.searchParams.get("q") || "").trim().replace(/\s+/g, " ");
  if (raw.length < 3 || raw.length > 60 || !/^[\p{L}\p{N} '&+.-]+$/u.test(raw)) {
    return NextResponse.json({ error: "Please enter a product name of 3–60 letters or numbers." }, { status: 400 });
  }
  const keyword = raw.toLowerCase();

  const hit = cache.get(keyword);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return NextResponse.json(hit.body, { headers: { "Cache-Control": "public, s-maxage=21600" } });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "You have checked a lot of products in a short time. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const [ebay, etsy] = await Promise.all([getEbaySnapshot(keyword), getEtsyCount(keyword)]);
  if (!ebay) {
    return NextResponse.json(
      { error: "Live eBay UK data is temporarily unavailable. Please try again in a few minutes." },
      { status: 503 }
    );
  }

  const body = {
    keyword: raw,
    checkedAt: new Date().toISOString(),
    ebay,
    etsy,
    competition: competitionLevel(ebay.total, etsy),
  };
  cache.set(keyword, { at: Date.now(), body });
  if (cache.size > 2000) cache.clear();
  return NextResponse.json(body, { headers: { "Cache-Control": "public, s-maxage=21600" } });
}
