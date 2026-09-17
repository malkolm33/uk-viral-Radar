import type { MetadataRoute } from "next";

// TODO: replace with your real production domain once it's live,
// either by setting NEXT_PUBLIC_SITE_URL or editing the fallback below.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ukviralradar.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
