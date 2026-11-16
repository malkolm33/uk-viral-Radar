// Reads the live product data that the daily "Update Product Data" job keeps
// fresh in Supabase. These numbers are the ONLY facts an article may use.
import { readFileSync } from "node:fs";

const FIELDS = [
  "name", "category", "viral_score", "previous_viral_score", "trend_status",
  "search_growth", "wiki_growth", "youtube_growth", "youtube_video_count",
  "ebay_listing_count", "ebay_avg_price", "ebay_unique_seller_count",
  "etsy_listing_count", "last_updated",
];

export async function loadProducts() {
  if (process.env.CONTENT_ROBOT_FIXTURE) {
    return JSON.parse(readFileSync(process.env.CONTENT_ROBOT_FIXTURE, "utf8"));
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase secrets are missing.");
  const res = await fetch(
    `${url}/rest/v1/products?select=${FIELDS.join(",")}&order=viral_score.desc.nullslast`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`Supabase error ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

// Builds the fact sheet handed to the writer and the checkers.
// type "weekly": top products overall. type "category": one category in depth.
export function buildFacts(products, { type, category, topN, today }) {
  const valid = products.filter((p) => typeof p.viral_score === "number");
  if (valid.length < 5) throw new Error(`Only ${valid.length} products have a Viral Score - not enough to write about.`);

  // Data older than 3 days means the daily job is failing - do not publish stale "trends".
  const newest = Math.max(...valid.map((p) => Date.parse(p.last_updated || 0)));
  if (Date.now() - newest > 3 * 24 * 3600 * 1000 && !process.env.CONTENT_ROBOT_FIXTURE) {
    throw new Error("Product data is more than 3 days old - the daily data job needs checking first.");
  }

  const pool = type === "category" ? valid.filter((p) => p.category === category) : valid;
  const top = pool.slice(0, topN).map((p, i) => ({
    rank: i + 1,
    name: p.name,
    category: p.category,
    viralScore: p.viral_score,
    scoreChangeSinceYesterday:
      typeof p.previous_viral_score === "number" ? p.viral_score - p.previous_viral_score : null,
    trend: p.trend_status,
    searchGrowth7dPercent: p.search_growth,
    wikipediaGrowthPercent: p.wiki_growth,
    youtubeGrowthPercent: p.youtube_growth,
    youtubeRecentVideos: p.youtube_video_count,
    ebayUkListings: p.ebay_listing_count,
    ebayUkAvgPriceGBP: typeof p.ebay_avg_price === "number" ? Math.round(p.ebay_avg_price * 100) / 100 : null,
    ebayUniqueSellers: p.ebay_unique_seller_count,
    etsyListings: p.etsy_listing_count,
    saturated: (p.ebay_unique_seller_count ?? 0) >= 15,
  }));

  const categories = [...new Set(valid.map((p) => p.category).filter(Boolean))].sort();
  return {
    type,
    category: type === "category" ? category : null,
    date: today,
    trackedProducts: valid.length,
    categories,
    products: top,
    about: {
      site: "UK Viral Radar",
      viralScore: "0-100 score combining Google Trends UK search growth, Wikipedia page-view growth, YouTube video growth, eBay UK and Etsy competition",
      dataSources: 5,
      freeProductsShown: 3,
      proPriceGBPPerMonth: 9.99,
    },
  };
}
