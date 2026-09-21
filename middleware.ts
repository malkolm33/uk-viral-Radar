import { NextRequest, NextResponse } from "next/server";

// Only runs for requests to /dashboard - everything else (including
// /api/checkout, /api/paypal-checkout and every other API route) never
// passes through this file at all, so payment flows are untouched.
export const config = {
  matcher: "/dashboard",
};

// Simple in-memory rate limit: max requests per IP within a rolling window.
// 30 requests/minute is far above what a real visitor generates just by
// browsing the dashboard, but low enough to slow down a scraper hammering
// the page in a tight loop.
const RATE_LIMIT = 30;
const WINDOW_MS = 60 * 1000; // 1 minute

// ip -> { count of requests seen in the current window, when that window started }
// See the summary given to the user for why this in-memory map is a
// best-effort deterrent rather than a hard guarantee - it resets whenever
// the function instance restarts and isn't shared across instances/regions.
const requestLog = new Map<string, { count: number; windowStart: number }>();

// Cheap cleanup so requestLog doesn't grow forever if this instance stays
// warm for a long time and sees many distinct IPs. Runs occasionally rather
// than on every request to keep the common case fast.
function cleanupStaleEntries(now: number) {
  if (requestLog.size < 5000) return;
  for (const [ip, entry] of requestLog) {
    if (now - entry.windowStart > WINDOW_MS) {
      requestLog.delete(ip);
    }
  }
}

function getClientIp(request: NextRequest): string {
  // Vercel (and most proxies) set x-forwarded-for as "client, proxy1, proxy2...".
  // The first entry is the original client.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  // No IP header available (e.g. local dev without a proxy in front) - treat
  // as a single shared bucket rather than skipping the check entirely.
  return "unknown";
}

export function middleware(request: NextRequest) {
  const ip = getClientIp(request);
  const now = Date.now();

  cleanupStaleEntries(now);

  const entry = requestLog.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // First request from this IP, or its previous window has expired -
    // start a fresh window.
    requestLog.set(ip, { count: 1, windowStart: now });
    return NextResponse.next();
  }

  entry.count += 1;

  if (entry.count > RATE_LIMIT) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  return NextResponse.next();
}
