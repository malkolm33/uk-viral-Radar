import type { MetadataRoute } from "next";

// TODO: replace with your real production domain once it's live,
// either by setting NEXT_PUBLIC_SITE_URL or editing the fallback below.
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ukviralradar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; changeFrequency: "daily" | "monthly"; priority: number }[] = [
    { path: "", changeFrequency: "monthly", priority: 1 },
    { path: "/dashboard", changeFrequency: "daily", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
