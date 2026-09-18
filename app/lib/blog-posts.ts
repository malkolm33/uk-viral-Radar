export type BlogPostStatus = "draft" | "scheduled" | "published";

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  // Plain text/markdown for now - paragraphs are separated by a blank line.
  // Swapping this file for a CMS-backed fetch later shouldn't require
  // changing app/blog/page.tsx or app/blog/[slug]/page.tsx.
  content: string;
  date: string; // ISO date, e.g. "2026-09-18" - the date shown to readers on the post
  category: string;
  // "draft": never shown on the site.
  // "scheduled": hidden until publishDate is today or in the past, then shown automatically.
  // "published": always shown.
  status: BlogPostStatus;
  publishDate: string; // ISO date, e.g. "2026-09-18" - when a "scheduled" post should go live
};

export const blogPosts: BlogPost[] = [
  {
    title: "5 UK Dropshipping Trends to Watch",
    slug: "5-uk-dropshipping-trends-to-watch",
    excerpt:
      "Placeholder excerpt - a quick look at five product and market trends UK dropshippers should be watching right now.",
    content: `UK dropshippers who spend their time chasing whatever product is loudest on social media this week tend to burn through ad budget and still end up guessing. A more reliable approach is to watch the broader categories that keep resurfacing across search interest, marketplace listings and short-form video, and then find your own angle within them. Here are five category trends worth tracking in the UK market right now.

## Home Products That Solve a Small Problem

Compact storage, cable management, space-saving furniture and small organisational gadgets consistently perform well with UK buyers, especially renters and students who move often and can't make permanent changes to a property. These products rarely go viral on their own merits - they spread because someone shows a genuinely annoying problem being solved in under thirty seconds. If a product removes friction from everyday flat or house-share life, it has a built-in audience.

## Fitness Equipment for Home Workouts

Home gym equipment has stayed resilient in the UK well beyond the initial pandemic-era spike, driven by the ongoing cost of gym memberships and a steady stream of home-workout content online. Resistance bands, adjustable dumbbells, yoga and recovery accessories, and compact cardio equipment all fall into this bucket. The category rewards sellers who can clearly demonstrate use in a small space, since that's the exact constraint most UK homes have.

## Beauty and Skincare Tools

Beauty has become less about single products and more about routines and tools - skincare fridges, LED devices, gua sha tools, and hair styling gadgets all get sustained search interest in the UK, often driven by tutorial-style content rather than traditional advertising. This category tends to have strong repeat-purchase potential once you find a product that photographs and demonstrates well.

## Kitchen Gadgets With a Visual "Wow" Moment

Kitchen gadgets that make food prep faster or more satisfying to watch - think anything that chops, portions, or presents food in an unusual way - regularly cycle through periods of high UK demand. These products succeed almost entirely on how well they demonstrate in a short video, so sourcing something with a clear, visual use case matters more than technical specifications.

## The TikTok Effect on Category-Wide Demand

Perhaps the biggest shift in UK e-commerce over the past few years is that trends now often move at the category level rather than the single-product level. A short-form video doesn't just sell one item - it can lift search interest and marketplace activity across an entire type of product for weeks. This is exactly why watching live signals across Google Trends, Wikipedia, eBay, Etsy and YouTube matters more than watching any single platform in isolation: by the time a product trend is obvious everywhere at once, the early window has usually already closed.`,
    date: "2026-09-18",
    category: "Trends",
    status: "published",
    publishDate: "2026-09-18",
  },
  {
    title: "eBay UK vs Etsy UK: Where Should You Sell?",
    slug: "ebay-uk-vs-etsy-uk-where-should-you-sell",
    excerpt:
      "A practical comparison of eBay UK and Etsy UK fees, audiences and category fit, to help you decide where a product is worth listing.",
    content: `For UK sellers deciding where to list a product, eBay and Etsy solve different problems and charge for the privilege in different ways. Neither platform is universally "better" - the right choice depends heavily on what you're selling and how you're sourcing it.

## Fees: eBay UK vs Etsy UK

eBay UK charges a final value fee of roughly 12.8% of the sale price plus a flat £0.30 per order, and your first 1,000 listings each month are free. Etsy UK's fee structure is more fragmented: a listing fee of £0.16-0.20 per item, a 6.5% transaction fee, and payment processing of around 4% plus £0.20 per order - which together typically works out to somewhere around 10-11% of the sale price, depending on the order value.

On a £30 product, that works out to roughly £4.14 in eBay fees versus around £3.52 on Etsy - meaning Etsy tends to be slightly cheaper on small and mid-priced items, while eBay's flat per-order fee makes it relatively more efficient on higher-value items where the percentage-based Etsy fees add up faster.

## What Sells Best Where

eBay UK's strength is its sheer breadth of buyer intent: it's the default place UK shoppers go when they already know what they want, which makes it a strong fit for electronics, collectibles, used goods, and high-volume, repeatable sales where you're competing largely on price and shipping speed.

Etsy UK works differently - buyers arrive browsing rather than searching for a specific SKU, and the platform's algorithm and audience both favour handmade goods, vintage items, customisable products, and digital downloads. If your sourcing allows for even light personalisation or a distinct visual style, Etsy rewards that in a way eBay generally doesn't.

## Etsy's Offsite Ads Fee

One cost that catches new Etsy sellers off guard is Offsite Ads. Etsy automatically advertises some listings across the web and on social platforms, and if a sale results from one of those ads, Etsy charges an additional 12-15% fee on top of its standard fees. Shops under a certain revenue threshold can opt out, but larger shops are enrolled automatically - so it's worth checking your settings and factoring this into your margin calculations before assuming Etsy's fees are always the cheaper option.

## So, Which Platform Should You Choose?

In practice, the decision usually comes down to the product rather than a blanket preference for one platform. Commodity items that buyers search for by name tend to do better on eBay; anything with a handmade, vintage, or personalised angle tends to do better on Etsy. Running the same product on both isn't unusual either, since it costs nothing extra in listing fees to test both audiences and see where demand and competition actually sit.

That's also where having visibility into both marketplaces at once helps. UK Viral Radar tracks eBay and Etsy listings side by side alongside broader trend signals, so instead of guessing, you can see which platform currently has less competition for a given product before deciding where to put your listing effort.`,
    date: "2026-09-17",
    category: "Selling Tips",
    status: "published",
    publishDate: "2026-09-17",
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

// A "scheduled" post becomes visible on its own once publishDate has arrived,
// even before the daily GitHub Action flips its status to "published" - this
// is the runtime safety net described in README-BLOG.md.
export function isPostVisible(post: BlogPost): boolean {
  if (post.status === "published") return true;
  if (post.status === "scheduled") {
    const todayIso = new Date().toISOString().slice(0, 10);
    return post.publishDate <= todayIso;
  }
  return false;
}

export function getVisiblePosts(): BlogPost[] {
  return blogPosts.filter(isPostVisible);
}
