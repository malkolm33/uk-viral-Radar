export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  // Plain text/markdown for now - paragraphs are separated by a blank line.
  // Swapping this file for a CMS-backed fetch later shouldn't require
  // changing app/blog/page.tsx or app/blog/[slug]/page.tsx.
  content: string;
  date: string; // ISO date, e.g. "2026-09-18"
  category: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "5 UK Dropshipping Trends to Watch",
    slug: "5-uk-dropshipping-trends-to-watch",
    excerpt:
      "Placeholder excerpt - a quick look at five product and market trends UK dropshippers should be watching right now.",
    content: `This is placeholder content for "5 UK Dropshipping Trends to Watch". Replace this with the full article whenever it's ready.

In the meantime, here's a rough outline to fill in: what the trend is, why UK demand for it is growing, and where to source it competitively. Feel free to send over the real text and it can be dropped straight into this post.`,
    date: "2026-09-18",
    category: "Trends",
  },
  {
    title: "eBay UK vs Etsy UK: Where Should You Sell?",
    slug: "ebay-uk-vs-etsy-uk-where-should-you-sell",
    excerpt:
      "Placeholder excerpt - comparing eBay UK and Etsy UK for dropshippers and small sellers, from fees to audience to what sells best on each.",
    content: `This is placeholder content for "eBay UK vs Etsy UK: Where Should You Sell?". Replace this with the full comparison whenever it's ready.

In the meantime, here's a rough outline to fill in: fee structures on each platform, typical buyer intent, and which product categories tend to perform better on eBay UK versus Etsy UK.`,
    date: "2026-09-17",
    category: "Selling Tips",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
