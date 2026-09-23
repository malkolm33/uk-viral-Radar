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
  // Featured image for the blog card, the post header and social share
  // previews (Open Graph). Optional so older/future posts without one still
  // render fine - app/blog/page.tsx and app/blog/[slug]/page.tsx both guard
  // on this being present before rendering an <img>.
  imageUrl?: string;
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
    imageUrl: "https://picsum.photos/seed/uk-trends-lifestyle-2026/1200/630",
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
    imageUrl: "https://loremflickr.com/1200/630/marketplace,ecommerce/all",
  },
  {
    title: "Winter Dropshipping: What Sells Best in the UK During Cold Months",
    slug: "winter-dropshipping-uk-trends",
    excerpt:
      "As temperatures drop, UK shopping habits shift. Here's what UK dropshippers should focus on during the colder months.",
    content: `As the UK moves into autumn and winter, buyer behaviour shifts in ways that create a fairly predictable seasonal window for certain product categories. Sellers who plan sourcing a few weeks ahead of these shifts - rather than reacting once a category is already trending - tend to catch demand earlier and face less listing competition.

## Portable and Personal Heating

Rising energy bills have made UK shoppers increasingly cautious about heating a whole home when only one or two rooms are in regular use, and that's driven steady demand for personal and portable heating solutions - small space heaters, heated blankets, heated insoles and USB-powered hand warmers all fall into this category. What makes these products particularly attractive for dropshippers is that they solve a cost problem as much as a comfort one, which tends to widen the audience beyond just people who feel the cold easily.

## Cold-Weather Clothing Accessories

Rather than full winter coats, which are heavy, expensive to ship and highly size-dependent, the stronger dropshipping opportunity tends to sit in accessories: thermal gloves, neck warmers, heated socks, and thick beanie hats. These are lightweight, size-flexible, and easy to bundle or upsell alongside other winter items, which makes them a lower-risk entry point into the cold-weather category.

## Home Comfort Products

Beyond direct heating, a broader category of home comfort products sees a reliable uplift once the clocks change: draught excluders, thermal curtains, weighted blankets, and cosy loungewear. These products benefit from the same energy-cost mindset driving personal heating demand, framed around making a home feel warmer without turning the heating up, which resonates strongly with UK households right now.

## Christmas and Holiday Season Gifting

From late November onward, search interest and marketplace activity shift heavily toward gifting - and products that photograph well, ship quickly, and suit a specific gift-giving occasion (stocking fillers, secret Santa, last-minute gifts) tend to outperform generic listings. This window is short and highly competitive, so the sellers who do best are usually the ones already testing and refining a small gifting range before the season peaks, rather than starting from scratch in December.

## Planning Ahead of the Season

The common thread across all four categories is that UK winter demand is driven as much by cost-consciousness as by cold weather itself - products that frame themselves around saving money while staying comfortable tend to have the broadest appeal. Tracking search growth and marketplace listing counts for these categories now, before the season is in full swing, is exactly the kind of early signal that makes the difference between sourcing ahead of the competition and catching a trend after it has already peaked.`,
    date: "2026-09-21",
    category: "Trends",
    status: "published",
    publishDate: "2026-09-21",
    imageUrl: "https://loremflickr.com/1200/630/winter,shopping/all",
  },
  {
    title: "Autumn and Winter Dropshipping: What's Actually Selling in the UK Right Now",
    slug: "autumn-winter-uk-dropshipping-2026",
    excerpt:
      "As UK energy prices stay high and evenings get darker, buying habits shift fast. Here's what's genuinely moving right now - not just another generic trending list.",
    content: `Energy prices in the UK haven't dropped the way anyone hoped, and that's quietly reshaping how people spend at home this autumn. The old winter playbook - chunky coats, novelty gifts, generic "cosy" products - still works, but it's not where the real movement is right now. The bigger shift is behavioural: people are heating themselves, not their houses. That's not a marketing angle I'm inventing - it's just what happens when a full central heating cycle costs what it costs this year. If you're sourcing for the next few months, that one sentence should shape most of your picks.

## Warming the Room You're Actually In

Electric blankets are still the obvious pick, and they're selling for a reason - a decent one runs maybe 3p an hour, versus heating a whole room for the evening. Heated insoles solve a real problem for anyone standing at a desk or in a cold kitchen, and they land for around £8-15 while selling comfortably above that. Warm-toned LED strip lighting - not the RGB gaming kind, the soft amber 2700K stuff - has quietly become a winter staple too, because a warmly lit room feels warmer even before the thermostat moves. None of these are exciting products. They're just useful, and useful sells hard in a cost-of-living winter.

## Heated Clothing Accessories Are the Sleeper Category

This is where I'd actually put effort right now. Thermal base layers, touchscreen gloves, and ear warmers share three things that make them genuinely easy to dropship: no real sizing headaches since most are one-size or stretch-fit, almost no returns because of it, and they're light - a pair of gloves ships for pennies compared to a coat. You're not fighting size-exchange emails or eating return shipping on a £40 jacket. A pair of decent touchscreen gloves lands around £6-9 and sells for £15-20 without much friction.

## The Battery Warning Nobody Mentions

Here's the part that catches people out. Anything with a lithium battery - heated gloves, heated insoles with a battery pack, USB hand warmers - counts as "dangerous goods" for shipping purposes. That's not a scare phrase, it's a real customs and carrier category. It means fewer courier options will accept it without extra paperwork (a UN38.3 test summary from your supplier, ideally), some air routes reject it outright, and delivery windows can stretch by a week or two compared to a normal parcel. Ask your supplier for that UN38.3 document before you commit stock, and build the longer shipping time into what you tell customers. A surprised customer waiting two extra weeks leaves a bad review; a warned one usually doesn't.

## January Is When Everyone Else Gives Up

Puzzles, resistance bands, home workout kit, reading lamps, weighted blankets - the whole "staying in and getting through winter" category actually peaks in January, not December. Most sellers chase the Christmas gift rush and then quietly stop paying attention right when New Year's resolutions and dark 5pm evenings are driving genuine demand. A weighted blanket, sourced around £15-20 and sold for £35-50, doesn't need a gift-wrap moment to sell - it needs someone stuck indoors in January looking for something to do, or something about themselves to fix. That gap, right when competitors have moved on to the next thing, is worth sourcing into on purpose.

## Before You Put Money Into Any of This

Order samples and place your first real stock order now, not in November. Most of this needs 6-8 weeks lead time if you're sourcing from overseas, and that window closes fast once a category starts trending publicly. Before committing budget to any single product here, it's worth checking actual demand rather than assuming the category story holds for your specific item - on UK Viral Radar, the Home and Kitchen categories are exactly where this kind of thing tends to show up first, so a quick look at search growth and listing counts before you order is a cheap way to avoid guessing wrong.`,
    date: "2026-09-23",
    category: "Trends",
    status: "published",
    publishDate: "2026-09-23",
    imageUrl: "https://loremflickr.com/1200/630/winter,cozy,home/all",
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

// Standard "X min read" estimate - average adult reading speed is roughly
// 200 words per minute. Rounded up so a short post never reads as "0 min".
export function getReadingTimeMinutes(post: BlogPost): number {
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

// Other visible posts in the same category, for the "Related posts" section
// at the bottom of a post - newest first, current post excluded.
export function getRelatedPosts(post: BlogPost, limit = 2): BlogPost[] {
  return getVisiblePosts()
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
