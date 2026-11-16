// Feature flags read on the server only (never NEXT_PUBLIC_, so they are not
// bundled into the browser).
//
// SHOW_EBAY_PRICES: eBay's API License Agreement (s.8.1(d), s.9.5) needs eBay's
// express prior written permission before we display price statistics derived
// from eBay data (average / median / min / max). Until that permission arrives
// this stays off; set SHOW_EBAY_PRICES=true in Vercel (and the GitHub Actions
// env) to turn prices back on.
export const SHOW_EBAY_PRICES = process.env.SHOW_EBAY_PRICES === "true";
