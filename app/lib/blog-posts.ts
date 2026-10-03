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
    imageUrl: "https://images.unsplash.com/photo-1649073005971-37babef31983?w=1200&h=630&fit=crop&q=80&auto=format",
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
    imageUrl: "https://images.unsplash.com/photo-1449247666642-264389f5f5b1?w=1200&h=630&fit=crop&q=80&auto=format",
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
    imageUrl: "https://images.unsplash.com/photo-1607626856747-14da3dec6188?w=1200&h=630&fit=crop&q=80&auto=format",
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
    imageUrl: "https://images.unsplash.com/photo-1750814019023-4e43037f5075?w=1200&h=630&fit=crop&q=80&auto=format", 
  },
  {
    title: "How to Find Products That Actually Sell (Without Guessing)",
    slug: "how-to-find-profitable-products-to-sell-online",
    excerpt:
      "A practical look at how sellers actually spot profitable dropshipping products in 2026, instead of copying whatever's trending on someone else's feed.",
    content: `Most people picking dropshipping products in 2026 are still doing it backwards. They open TikTok, see something get half a million likes, and assume that's the signal. By the time a product is viral enough for you to notice it casually scrolling, a few thousand other sellers have already noticed it too - and the margin has usually gone with them.

Real product research isn't about spotting the loudest thing online. It's slower and less exciting than that: checking what's actually selling on the marketplaces where people buy, not just where they scroll, and being honest with yourself about whether you're early or six months late.

## Stop Competing on Price Alone

The obvious trap right now is picking cheap, generic items and trying to out-price Temu, SHEIN or Amazon's own basics. You won't win that fight. Those platforms manufacture and ship at a scale no dropshipper can match, and any product that competes purely on being inexpensive gets its margin crushed within weeks of catching on. The sellers still making decent money on profitable dropshipping products in 2026 have mostly stopped trying to be the cheapest option and started looking for products where price isn't the main conversation - because they solve a specific problem, or because they're personal enough that a buyer isn't comparing five listings side by side.

## Etsy Is Quietly Telling You What's Working

If you want a free, fairly reliable read on trending products in the UK, Etsy's own search trends are worth checking before you spend a penny on ads. Personalized gifts, wedding and event items, home decor, and digital downloads have been among the fastest-growing search categories there this year, and it's not hard to see why - a digital download on Etsy has close to zero fulfilment cost, and a personalized item is inherently harder to price-compare than a generic one. The lesson generalises past Etsy too: products that can be made to feel specific to the buyer, rather than interchangeable with ten other listings, tend to hold their margin longer and stay genuinely low competition products to sell, at least for a while.

## Get Specific With Your Keywords

This is where a lot of product research goes wrong - people search "personalized jewellery," conclude the whole space is saturated, and move on. The real opportunity is usually one layer down. A long-tail search like "personalized birthstone bracelet for mum" converts at a completely different rate than the broad term, and it's far less competitive because most sellers never bother going that specific. The same logic holds whether you're browsing eBay listings, checking Pinterest search suggestions, or figuring out how to find dropshipping niches from scratch - the long-tail version of a search almost always tells you more about buyer intent than the broad one does, and it takes about thirty extra seconds to type.

## A Niche Worth a Closer Look

One category that's been quietly outperforming expectations is premium pet wellness products - orthopedic pet beds, GPS trackers, joint supplements, that sort of thing. Sellers in this space have reported margins in the 35-65% range, which is unusually high for physical products, mostly because pet owners treat these as health purchases rather than impulse buys and shop accordingly, the same way they would for their own supplements. It won't stay under-the-radar forever, but it's a decent example of what a genuinely winning product actually looks like right now: not hidden, just overlooked because it's less exciting to talk about than the latest gadget.

Amazon's own Best Sellers page works the same way, and it's easy to forget it's sitting there for free. Sellers already use it every day to see what's actually moving units in a category, not what an algorithm decided to push into someone's feed for a few days. Cross-referencing that against Etsy search trends and eBay listing counts gives you a rough picture of demand versus competition without paying for a single tool.

None of this replaces checking the actual numbers before you commit stock or ad spend to something. UK Viral Radar pulls live search trend and eBay/Etsy competition data into a single score, which is exactly the kind of grunt work good product research requires - just done automatically instead of by hand.`,
    date: "2026-09-30",
    category: "Trends",
    status: "published",
    publishDate: "2026-09-30",
    imageUrl: "https://picsum.photos/seed/profitable-products-research-2026/1200/630",
  },
  {
    title: "How to Spot Viral and Best-Selling Products in the UK Market",
    slug: "how-to-spot-viral-best-selling-products-uk",
    excerpt:
      "A practical look at the free signals UK sellers actually check before committing to a product - ad activity, TikTok Shop momentum, search trends and marketplace competition.",
    content: `Spotting a winning product isn't luck. It's pattern recognition - you're watching the same handful of signals every serious UK seller checks before committing stock or ad spend. None of these signals mean much on their own. Stacked together, they tell you whether you've found one of the real best selling products UK buyers actually want, or just another product someone's pushing hard on ads this week.

## Ad Activity Signals

If a product has been running ads for 14+ days, that's not nothing. Sellers don't keep paying for ads that lose money - they pull them within days if the numbers don't work. So when you see a product still running, with comments like "where do I buy this" or "link please," you're looking at real demand, not a guess.

**Facebook Ad Library** is the free way to check this. No login, no account needed. Search a keyword or a competitor's page and see every active ad, how long it's been running, and what people are saying in the comments. It's one of the few places where you can watch other sellers test a product for you, for free, before you spend a penny of your own budget.

## TikTok Shop Momentum

TikTok Shop GMV and live creator activity tell you what's actually moving right now in the UK - not what was trending three months ago on a blog post. This is where find trending products TikTok Shop UK research gets interesting, because the platform rewards speed. A product can go from nobody's heard of it to everywhere in under two weeks, then fade almost as fast once every seller piles in.

**TikTok's own Creative Center** is free and legitimate - filter by Top Products and set the region to UK. You'll see what's actually selling through the platform right now, not what an algorithm thinks you'll click on.

## Search and Seasonal Signals

**Google Trends** for the UK region is still one of the most underused free tools out there. The key is telling the difference between a real trend and a one-off spike - a product that's been climbing steadily for six weeks is a very different bet than one that spiked for three days because of a single viral video.

Check by UK region too. London, Manchester, Scotland - interest doesn't always spread evenly, and a product that's genuinely trending in one region can look flat in national averages. If you're selling to a specific area, or testing regional ads before going nationwide, regional data tells you more than the headline number ever will.

## Marketplace Competition Signals

Here's where a lot of UK dropshipping viral products research falls apart. A product shows up trending in every signal you check - ads, TikTok, search - and you get excited. Then you check eBay or Etsy and find 50+ sellers already listing it.

That's saturation, and it kills margins fast. Live listing counts and unique seller counts on eBay and Etsy matter because they tell you whether you're early or whether you've just found what everyone else found last week. A trending product with low competition is the actual target. A trending product with heavy competition is a race to the bottom on price, and that race rarely ends well for anyone who joined late.

## The UK Buyer Checklist

Before you commit to a product, run it through these three checks:

- **Visual and demonstrable** - it should solve a problem in under 30 seconds on video. If you can't show why someone needs it quickly, it's a harder sell no matter how useful it actually is.
- **Impulse-buy price range** - £15 to £40 is the "easy yes" bracket for most UK buyers. Below that and margins get thin; above it and you're asking for more consideration than an impulse buy usually gets.
- **Fast UK delivery** - buyers here expect their order quickly. Factor in where you're actually fulfilling from, because a two-week wait kills conversion no matter how good the product is.

Checking all of this by hand means five or six browser tabs open at once - Ad Library, TikTok Creative Center, Google Trends, eBay, Etsy, maybe Pinterest too. UK Viral Radar pulls several of these free signals together in one place: live Google Trends and eBay/Etsy competition data on every product, plus direct links to Facebook Ad Library, TikTok Creative Center and Pinterest Trends, so you're not checking five different sites by hand every time you want to size up a product.`,
    date: "2026-10-06",
    category: "Trends",
    status: "scheduled",
    publishDate: "2026-10-06",
    imageUrl: "https://picsum.photos/seed/uk-viral-products-research-2026/1200/630",
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
