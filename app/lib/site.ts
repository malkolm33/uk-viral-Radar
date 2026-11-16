// Single source of truth for site-wide SEO values (canonical domain, brand,
// official social profiles). Used by structured data (JSON-LD), llms.txt and
// page metadata so they never drift apart.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ukviralradar.com").replace(/\/$/, "");
export const SITE_NAME = "UK Viral Radar";
export const SITE_DESCRIPTION =
  "Track trending products in the UK market with live data from Google Trends, Wikipedia, eBay, Etsy and YouTube. Built for UK dropshippers and e-commerce sellers.";

// Only real, live profiles belong here - search engines and AI assistants use
// this list (schema.org "sameAs") to confirm which accounts are official.
export const OFFICIAL_PROFILES = [
  "https://www.youtube.com/@ukViralRadar",
  "https://instagram.com/ukviralradar",
  "https://tiktok.com/@ukviralradar",
  "https://reddit.com/user/uk-viral-radar",
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  sameAs: OFFICIAL_PROFILES,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-GB",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// JSON.stringify does not escape "<", so a value containing "</script>" could
// break out of the JSON-LD tag. Escaping it keeps structured data safe even
// when content (e.g. blog posts) is generated automatically in future.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
