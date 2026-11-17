import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ukviralradar.com";

// Private areas stay out for everyone. /login and /reset-password are NOT
// blocked here on purpose: they carry a "noindex" tag, and crawlers must be
// allowed to fetch the page to see it.
const PRIVATE = ["/admin", "/api/", "/logout"];

// AI search / answer bots: they read pages to cite and link to us in answers
// (ChatGPT search, Perplexity, Claude). Fully welcome on the public site.
const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User"];

// AI training crawlers: welcome on our own content, but kept away from pages
// that mainly display marketplace data (eBay/Etsy API licences limit copying
// and redistribution of that data).
const AI_TRAINING = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "Applebot-Extended"];
const MARKETPLACE_DATA = ["/dashboard"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_SEARCH, allow: "/", disallow: PRIVATE },
      { userAgent: AI_TRAINING, allow: "/", disallow: [...PRIVATE, ...MARKETPLACE_DATA] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
