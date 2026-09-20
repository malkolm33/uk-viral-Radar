// Fetches fresh Google Trends, Wikipedia, eBay, Etsy and YouTube data for
// every product in the Supabase "products" table and writes the results
// into the cached columns: search_growth, wiki_growth, ebay_listing_count,
// ebay_avg_price, etsy_listing_count, youtube_video_count, youtube_growth,
// viral_score and last_updated. It then writes a simple, rule-based "Daily
// Insight" sentence for the day's top product into the "daily_insights"
// table (see writeDailyInsight below) - no AI, just if/else.
//
// This runs once a day via .github/workflows/update-product-data.yml instead
// of app/dashboard/page.tsx calling all five APIs live on every page view.
// That used to be slow for visitors and burned through the free API quotas
// fast - YouTube's daily unit quota especially.
//
// The data-fetching and scoring logic below is intentionally kept identical
// to app/dashboard/page.tsx, so the cached numbers match what that page's
// live fallback path would compute if the cache were ever missing or stale.
//
// Unlike publish-scheduled-posts.mjs, this script does NOT touch git - it
// writes straight to Supabase with the service role key, so there is
// nothing for the workflow to commit or push.

import { createClient } from "@supabase/supabase-js";
import googleTrends from "google-trends-api";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY - add them as repository secrets."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getYouTubeData(keyword) {
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
    const previousData = previousResponse.ok
      ? await previousResponse.json()
      : { pageInfo: { totalResults: 0 } };
    const previousCount = previousData.pageInfo?.totalResults || 0;
    const growth =
      previousCount === 0
        ? recentCount > 0
          ? 100
          : 0
        : Math.round(((recentCount - previousCount) / previousCount) * 100);
    return { videoCount: recentCount, growth };
  } catch (error) {
    return { videoCount: 0, growth: 0 };
  }
}

async function getEbayCompetitionData(keyword) {
  try {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    if (!clientId || !clientSecret) return { listingCount: 0, avgPrice: null };
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    });
    if (!tokenResponse.ok) return { listingCount: 0, avgPrice: null };
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const searchResponse = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(keyword)}&limit=20`,
      { headers: { Authorization: `Bearer ${accessToken}`, "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB" } }
    );
    if (!searchResponse.ok) return { listingCount: 0, avgPrice: null };
    const searchData = await searchResponse.json();
    const items = searchData.itemSummaries || [];
    const listingCount = searchData.total || items.length;
    const prices = items
      .map((item) => parseFloat(item.price?.value))
      .filter((p) => !isNaN(p));
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
    return { listingCount, avgPrice };
  } catch (error) {
    return { listingCount: 0, avgPrice: null };
  }
}

async function getEtsyData(keyword) {
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

async function getWikipediaViews(articleTitle) {
  try {
    const today = new Date();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const formatDate = (d) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
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

function calculateViralScore(signals) {
  const raw =
    0.3 * signals.socialGrowth +
    0.25 * signals.searchGrowth +
    0.2 * signals.salesSignal +
    0.15 * signals.adGrowth +
    0.1 * signals.creatorGrowth -
    signals.competitionPenalty;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

async function getSearchData(keyword) {
  try {
    const results = await googleTrends.interestOverTime({
      keyword: keyword,
      geo: "GB",
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });
    const data = JSON.parse(results);
    const timelineData = data.default.timelineData;
    if (!timelineData || timelineData.length === 0) return { growth: 0 };
    const points = timelineData.map((d) => d.value[0]);
    const firstValue = points[0];
    const lastValue =
      points[points.length - 1] === 0 && points.length > 1
        ? points[points.length - 2]
        : points[points.length - 1];
    if (firstValue === 0) return { growth: 0 };
    const growth = Math.round(((lastValue - firstValue) / firstValue) * 100);
    return { growth };
  } catch (error) {
    return { growth: 0 };
  }
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, search_keyword, wiki_title, social_growth, sales_signal, viral_score");

  if (error) {
    console.error("Failed to load products from Supabase:", error.message);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log("No products found - nothing to update.");
    return;
  }

  let updatedCount = 0;
  // Tracks the highest-scoring product seen this run, so we can build a
  // simple, rule-based "Daily Insight" sentence once every product has been
  // updated - no AI involved, just if/else over the same signals already
  // computed above.
  let topProduct = null;

  for (let idx = 0; idx < products.length; idx += 1) {
    const product = products[idx];

    try {
      const searchData = await getSearchData(product.search_keyword);
      const wikiGrowth = await getWikipediaViews(product.wiki_title);
      const ebayData = await getEbayCompetitionData(product.search_keyword);
      const etsyData = await getEtsyData(product.search_keyword);
      // Only the very first product gets a YouTube lookup - this mirrors the
      // same idx < 1 guard app/dashboard/page.tsx uses, since the YouTube
      // Data API quota is tight and this job already runs for every product
      // once a day.
      const youtubeData =
        idx < 1 ? await getYouTubeData(product.search_keyword) : { videoCount: 0, growth: 0 };

      const realCompetitionPenalty =
        ebayData.listingCount > 5000
          ? 25
          : ebayData.listingCount > 1000
            ? 15
            : ebayData.listingCount > 100
              ? 8
              : 3;

      const score = calculateViralScore({
        socialGrowth: product.social_growth || 0,
        searchGrowth: Math.max(0, searchData.growth),
        salesSignal: product.sales_signal || 0,
        adGrowth: Math.max(0, youtubeData.growth),
        creatorGrowth: Math.max(0, wikiGrowth),
        competitionPenalty: realCompetitionPenalty,
      });

      // Trend detection: most viral products naturally fade within a few
      // weeks, so we keep yesterday's score around (previous_viral_score)
      // and compare it to today's. A drop of more than 15 points flags the
      // product as "declining" so the admin page can warn it might be worth
      // replacing. A brand-new product with no prior score yet (viral_score
      // is null before its first run) has nothing to compare against, so it
      // starts out "stable" rather than being judged on a single data point.
      const previousScore = product.viral_score ?? null;
      const trendStatus =
        previousScore === null
          ? "stable"
          : score - previousScore < -15
            ? "declining"
            : score > previousScore
              ? "rising"
              : "stable";

      const { error: updateError } = await supabase
        .from("products")
        .update({
          search_growth: searchData.growth,
          wiki_growth: wikiGrowth,
          ebay_listing_count: ebayData.listingCount,
          ebay_avg_price: ebayData.avgPrice,
          etsy_listing_count: etsyData.listingCount,
          youtube_video_count: youtubeData.videoCount,
          youtube_growth: youtubeData.growth,
          viral_score: score,
          previous_viral_score: previousScore,
          trend_status: trendStatus,
          last_updated: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (updateError) {
        console.error(`Failed to update "${product.name}":`, updateError.message);
        continue;
      }

      updatedCount += 1;
      console.log(`Updated "${product.name}" - score ${score} (${trendStatus})`);

      if (trendStatus === "declining") {
        console.warn(
          `Declining: "${product.name}" dropped from ${previousScore} to ${score} (-${previousScore - score} points).`
        );
      }

      if (!topProduct || score > topProduct.score) {
        topProduct = {
          name: product.name,
          score,
          searchGrowth: searchData.growth,
          youtubeGrowth: youtubeData.growth,
          wikiGrowth,
        };
      }
    } catch (err) {
      console.error(`Unexpected error updating "${product.name}":`, err);
    }

    // Small delay between products so we don't fire requests at Google
    // Trends' unofficial API back-to-back, which tends to trigger rate
    // limiting when done too quickly.
    await sleep(1500);
  }

  console.log(`Done. Updated ${updatedCount}/${products.length} product(s).`);

  await writeDailyInsight(topProduct);
}

// Builds a simple, rule-based "Daily Insight" sentence from today's
// highest-scoring product - no AI, just if/else over the search/YouTube/
// Wikipedia growth signals already computed above - and saves it to the
// "daily_insights" table (one row per calendar day, upserted by date).
async function writeDailyInsight(topProduct) {
  if (!topProduct) {
    console.log("No product data available - skipping today's Daily Insight.");
    return;
  }

  const { name, score, searchGrowth, youtubeGrowth, wikiGrowth } = topProduct;

  const hasRisingSupportSignal = youtubeGrowth > 0 || wikiGrowth > 0;

  const insightText =
    searchGrowth > 0 && hasRisingSupportSignal
      ? `Today's standout is ${name} - search interest is up ${searchGrowth}%, backed by rising YouTube/Wikipedia activity. Viral Score: ${score}/100.`
      : `No standout risers today - keep an eye on ${name}, currently the highest-scoring product at ${score}/100.`;

  // UTC calendar date, same convention publish-scheduled-posts.mjs uses -
  // avoids timezone edge cases between UK time and the UTC clock this
  // workflow runs on.
  const todayIso = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("daily_insights")
    .upsert(
      { date: todayIso, insight_text: insightText, top_product_name: name },
      { onConflict: "date" }
    );

  if (error) {
    console.error("Failed to save today's Daily Insight:", error.message);
    return;
  }

  console.log(`Daily Insight (${todayIso}): ${insightText}`);
}

main();
