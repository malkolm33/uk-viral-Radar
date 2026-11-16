import { getVisiblePosts } from "../lib/blog-posts";
import { SITE_URL, SITE_NAME, OFFICIAL_PROFILES } from "../lib/site";

// llms.txt (https://llmstxt.org) - a plain-text summary of the site for AI
// assistants and answer engines (ChatGPT, Perplexity, Gemini, Claude...).
// Generated from the same data as the blog, so new posts appear automatically.
// Refreshed at most once an hour, like the blog pages.
export const revalidate = 3600;

export function GET() {
  const posts = [...getVisiblePosts()].sort((a, b) => b.date.localeCompare(a.date));

  const lines = [
    `# ${SITE_NAME}`,
    "",
    "> UK Viral Radar is a UK-focused product trend tracker for dropshippers and e-commerce sellers. It ranks products by a daily Viral Score built from five live data sources: Google Trends (UK search interest), Wikipedia page views, eBay UK listings and prices, Etsy listing volume and YouTube video coverage.",
    "",
    "Key facts:",
    "- Market: United Kingdom only (UK search, UK marketplaces, prices in GBP).",
    "- Data is refreshed automatically every day.",
    "- Pricing: Free plan shows the top 3 products; Pro is £9.99/month for the full ranked list. Payments via Stripe or PayPal.",
    "- Audience: UK dropshippers, eBay and Etsy sellers and small e-commerce brands looking for rising products before they saturate.",
    "",
    "## Main pages",
    `- [Home](${SITE_URL}/): What UK Viral Radar is, how the Viral Score works, pricing and FAQ`,
    `- [Live rankings](${SITE_URL}/dashboard): Today's ranked list of trending UK products with Viral Scores`,
    `- [Compare](${SITE_URL}/compare): How UK Viral Radar compares with other trend research tools on price and UK coverage`,
    `- [Is my product saturated? (free checker)](${SITE_URL}/tools/saturation-checker): Live eBay UK and Etsy listing counts, seller spread and typical price for any product`,
    `- [eBay UK vs Etsy UK fee calculator](${SITE_URL}/tools/fee-calculator): Every 2026 eBay UK and Etsy UK seller fee side by side, with profit per sale`,
    `- [Free profit margin calculator](${SITE_URL}/tools/profit-calculator): Work out margin before listing a product`,
    `- [Contact](${SITE_URL}/contact): Questions, feedback and support`,
    "",
    "## Blog",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt.replace(/\s+/g, " ").trim()}`),
    "",
    "## Optional",
    `- [Privacy Policy](${SITE_URL}/privacy)`,
    `- [Terms of Service](${SITE_URL}/terms)`,
    ...OFFICIAL_PROFILES.map((url) => `- [Official profile](${url})`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
