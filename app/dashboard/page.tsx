const googleTrends = require("google-trends-api");
import { createClient } from "../lib/supabase-server";
import UpgradeButton from "../UpgradeButton";
import PayPalButton from "../PayPalButton";
import PayPalCaptureHandler from "../PayPalCaptureHandler";
import ProductGrid from "../ProductGrid";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Rankings - UK Viral Radar",
  description:
    "Live ranked list of trending UK products, scored using real-time Google Trends, Wikipedia, eBay, Etsy and YouTube data.",
  openGraph: {
    title: "Live Rankings - UK Viral Radar",
    description:
      "Live ranked list of trending UK products, scored using real-time Google Trends, Wikipedia, eBay, Etsy and YouTube data.",
    type: "website",
  },
};

async function getYouTubeData(keyword: string): Promise<{ videoCount: number; growth: number }> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return { videoCount: 0, growth: 0 };
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&regionCode=GB&publishedAfter=${sevenDaysAgo}&maxResults=1&key=${apiKey}`;
    const recentResponse = await fetch(recentUrl);
    if (!recentResponse.ok) return { videoCount: 0, growth: 0 };
    const recentData = await recentResponse.json();
    const recentCount = recentData.pageInfo?.totalResults || 0;
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const previousUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&regionCode=GB&publishedAfter=${fourteenDaysAgo}&publishedBefore=${sevenDaysAgo}&maxResults=1&key=${apiKey}`;
    const previousResponse = await fetch(previousUrl);
    const previousData = previousResponse.ok ? await previousResponse.json() : { pageInfo: { totalResults: 0 } };
    const previousCount = previousData.pageInfo?.totalResults || 0;
    const growth = previousCount === 0 ? (recentCount > 0 ? 100 : 0) : Math.round(((recentCount - previousCount) / previousCount) * 100);
    return { videoCount: recentCount, growth };
  } catch (error) {
    return { videoCount: 0, growth: 0 };
  }
}

// eBay image URLs usually end in a size segment like /s-l225.jpg or /s-l500.jpg.
// Swapping it for a larger size (s-l1600) gives a noticeably sharper image for the same listing.
function upgradeEbayImageResolution(url: string | null): string | null {
  if (!url) return null;
  return url.replace(/\/s-l\d+\./, "/s-l1600.");
}

async function getEbayCompetitionData(keyword: string): Promise<{ listingCount: number; avgPrice: number | null; imageUrl: string | null }> {
  try {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    if (!clientId || !clientSecret) return { listingCount: 0, avgPrice: null, imageUrl: null };
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${credentials}` },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    });
    if (!tokenResponse.ok) return { listingCount: 0, avgPrice: null, imageUrl: null };
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const searchResponse = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(keyword)}&limit=20`,
      { headers: { Authorization: `Bearer ${accessToken}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB" } }
    );
    if (!searchResponse.ok) return { listingCount: 0, avgPrice: null, imageUrl: null };
    const searchData = await searchResponse.json();
    const items = searchData.itemSummaries || [];
    const listingCount = searchData.total || items.length;
    const prices = items.map((item: any) => parseFloat(item.price?.value)).filter((p: number) => !isNaN(p));
    const avgPrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b, 0) / prices.length : null;
    const rawImageUrl = items[0]?.image?.imageUrl || items[0]?.thumbnailImages?.[0]?.imageUrl || null;
    const imageUrl = upgradeEbayImageResolution(rawImageUrl);
    return { listingCount, avgPrice, imageUrl };
  } catch (error) {
    return { listingCount: 0, avgPrice: null, imageUrl: null };
  }
}

async function getEtsyData(keyword: string): Promise<{ listingCount: number }> {
  try {
    const apiKey = process.env.ETSY_API_KEY;
    if (!apiKey) return { listingCount: 0 };
    const url = `https://api.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(keyword)}&limit=1`;
    const response = await fetch(url, { headers: { "x-api-key": apiKey } });
    if (!response.ok) return { listingCount: 0 };
    const data = await response.json();
    return { listingCount: data.count || 0 };
  } catch (error) {
    return { listingCount: 0 };
  }
}

async function getWikipediaViews(articleTitle: string): Promise<number> {
  try {
    const today = new Date();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const formatDate = (d: Date) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const start = formatDate(weekAgo);
    const end = formatDate(today);
    const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(articleTitle)}/daily/${start}/${end}`;
    const response = await fetch(url);
    if (!response.ok) return 0;
    const data = await response.json();
    const items = data.items;
    if (!items || items.length < 2) return 0;
    const firstViews = items[0].views;
    const lastViews = items[items.length - 1].views;
    if (firstViews === 0) return 0;
    const growth = ((lastViews - firstViews) / firstViews) * 100;
    return Math.round(growth);
  } catch (error) {
    return 0;
  }
}

function calculateViralScore(signals: { socialGrowth: number; searchGrowth: number; salesSignal: number; adGrowth: number; creatorGrowth: number; competitionPenalty: number; }) {
  const raw = 0.3 * signals.socialGrowth + 0.25 * signals.searchGrowth + 0.2 * signals.salesSignal + 0.15 * signals.adGrowth + 0.1 * signals.creatorGrowth - signals.competitionPenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

async function getSearchData(keyword: string): Promise<{ growth: number; points: number[] }> {
  try {
    const results = await googleTrends.interestOverTime({ keyword: keyword, geo: "GB", startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) });
    const data = JSON.parse(results);
    const timelineData = data.default.timelineData;
    if (!timelineData || timelineData.length === 0) return { growth: 0, points: [] };
    const points = timelineData.map((d: any) => d.value[0]);
    const firstValue = points[0];
    const lastValue = points[points.length - 1] === 0 && points.length > 1 ? points[points.length - 2] : points[points.length - 1];
    if (firstValue === 0) return { growth: 0, points };
    const growth = Math.round(((lastValue - firstValue) / firstValue) * 100);
    return { growth, points };
  } catch (error) {
    return { growth: 0, points: [] };
  }
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const { data: dbProducts } = await supabase.from("products").select("*");

  const rawProducts = (dbProducts || []).map((p: any) => ({
    name: p.name,
    searchKeyword: p.search_keyword,
    wikiTitle: p.wiki_title,
    imageQuery: p.image_query,
    category: p.category,
    competition: p.competition,
    socialGrowth: p.social_growth,
    salesSignal: p.sales_signal,
    adGrowth: p.ad_growth,
    creatorGrowth: p.creator_growth,
    competitionPenalty: p.competition_penalty,
  }));

  const productsWithRealData = await Promise.all(
    rawProducts.map(async (p: any, idx: number) => {
      const searchData = await getSearchData(p.searchKeyword);
      const wikiGrowth = await getWikipediaViews(p.wikiTitle);
      const ebayData = await getEbayCompetitionData(p.searchKeyword);
      const etsyData = await getEtsyData(p.searchKeyword);
      const youtubeData = idx < 1 ? await getYouTubeData(p.searchKeyword) : { videoCount: 0, growth: 0 };
      const realCompetitionPenalty = ebayData.listingCount > 5000 ? 25 : ebayData.listingCount > 1000 ? 15 : ebayData.listingCount > 100 ? 8 : 3;
      const score = calculateViralScore({
        socialGrowth: p.socialGrowth,
        searchGrowth: Math.max(0, searchData.growth),
        salesSignal: p.salesSignal,
        adGrowth: Math.max(0, youtubeData.growth),
        creatorGrowth: Math.max(0, wikiGrowth),
        competitionPenalty: realCompetitionPenalty,
      });
      return {
        ...p,
        searchGrowth: searchData.growth,
        searchPoints: searchData.points,
        wikiGrowth,
        ebayListingCount: ebayData.listingCount,
        ebayAvgPrice: ebayData.avgPrice,
        ebayImageUrl: ebayData.imageUrl,
        etsyListingCount: etsyData.listingCount,
        youtubeVideoCount: youtubeData.videoCount,
        youtubeGrowth: youtubeData.growth,
        score,
      };
    })
  );

  const products = productsWithRealData.sort((a: any, b: any) => b.score - a.score);
  const lastUpdated = new Date().toLocaleString("en-GB", { timeZone: "Europe/London", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 py-10 sm:px-10">
      <PayPalCaptureHandler />
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/" className="text-3xl font-bold tracking-tight text-[#0F172A] hover:opacity-80">UK Viral Product <span className="text-[#16A34A]">Radar</span></Link>
            <p className="mt-1 text-sm text-[#64748B]">Ranked by Viral Score, using live Google Trends, Wikipedia, eBay, Etsy and YouTube data</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 text-xs text-[#64748B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              Live - Updated {lastUpdated}
            </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span className="hidden sm:inline">{user!.email}</span>
                <UpgradeButton email={user!.email!} />
                <PayPalButton email={user!.email!} />
                <a href="/logout" className="rounded-full border border-[#E4E7EC] bg-white px-3 py-1.5 font-medium text-[#0F172A]">Log out</a>
              </div>
            ) : (
              <a href="/login" className="rounded-full bg-[#0F172A] px-3 py-1.5 text-xs font-medium text-white">Log in</a>
            )}
          </div>
        </header>

        <ProductGrid products={products} isLoggedIn={isLoggedIn} />
      </div>
    </main>
  );
}