export type BlogPostStatus = "draft" | "scheduled" | "published";

// Data shown as a chart + table on robot-written, data-driven posts
// (rendered by app/blog/[slug]/DataPanel.tsx and on the cover image).
export type BlogChartItem = {
  name: string;
  score: number;
  change: number | null; // Viral Score change since yesterday
  search: number | null; // UK search growth, % over 7 days
  competition: string; // LOW | MEDIUM | HIGH | unknown
  price: number | null; // average eBay UK price, GBP (null while SHOW_EBAY_PRICES is off)
  rising: boolean;
};

export type BlogChart = {
  label: string; // e.g. "Week of 16 Nov 2026"
  tracked: number;
  items: BlogChartItem[];
};

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
  chart?: BlogChart;
};

export const blogPosts: BlogPost[] = [
  {
    title: "5 UK Dropshipping Trends to Watch",
    slug: "5-uk-dropshipping-trends-to-watch",
    excerpt:
      "From problem-solving home gadgets to kitchen tools with a visual wow factor, here are five category trends UK dropshippers should be watching right now.",
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

On eBay UK, private sellers pay no final value fee, but if you are selling as a business (which most dropshippers are), eBay charges a final value fee of around 12.9% of the total sale in most categories (some categories are lower) plus a per-order fee of £0.40 on orders over £10 (£0.30 at £10 or less), as of 2026. Business fees are shown excluding VAT. Etsy UK's fee structure is more fragmented: a listing fee of £0.16-0.20 per item, a 6.5% transaction fee, and payment processing of around 4% plus £0.20 per order - which together typically works out to somewhere around 10-11% of the sale price, depending on the order value.

On a £30 product, that works out to roughly £4.27 in eBay business-seller fees versus around £3.52 on Etsy - so on standard fees alone Etsy usually comes out a little cheaper for business sellers, although Etsy's Offsite Ads fee (below) can quickly reverse that on individual orders.

## What Sells Best Where

eBay UK's strength is its sheer breadth of buyer intent: it's the default place UK shoppers go when they already know what they want, which makes it a strong fit for electronics, collectibles, used goods, and high-volume, repeatable sales where you're competing largely on price and shipping speed.

Etsy UK works differently - buyers arrive browsing rather than searching for a specific SKU, and the platform's algorithm and audience both favour handmade goods, vintage items, customisable products, and digital downloads. If your sourcing allows for even light personalisation or a distinct visual style, Etsy rewards that in a way eBay generally doesn't.

## Etsy's Offsite Ads Fee

One cost that catches new Etsy sellers off guard is Offsite Ads. Etsy automatically advertises some listings across the web and on social platforms, and if a sale results from one of those ads, Etsy charges an additional 12-15% fee on top of its standard fees. Shops under a certain revenue threshold can opt out, but larger shops are enrolled automatically - so it's worth checking your settings and factoring this into your margin calculations before assuming Etsy's fees are always the cheaper option.

## So, Which Platform Should You Choose?

In practice, the decision usually comes down to the product rather than a blanket preference for one platform. Commodity items that buyers search for by name tend to do better on eBay; anything with a handmade, vintage, or personalised angle tends to do better on Etsy. Running the same product on both isn't unusual either, since eBay's free listing allowance and Etsy's small listing fee make it cheap to test both audiences and see where demand and competition actually sit.

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
    title: "Autumn & Winter Dropshipping: What's Selling in the UK Now",
    slug: "autumn-winter-uk-dropshipping-2026",
    excerpt:
      "As UK energy prices stay high and evenings get darker, buying habits shift fast. Here's what's genuinely moving now - not another generic trend list.",
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

One category that's been quietly outperforming expectations is premium pet wellness products - orthopedic pet beds, GPS trackers, joint supplements, that sort of thing. These products can often support healthier margins than typical gadgets, mostly because pet owners treat these as health purchases rather than impulse buys and shop accordingly, the same way they would for their own supplements. It won't stay under-the-radar forever, but it's a decent example of what a genuinely winning product actually looks like right now: not hidden, just overlooked because it's less exciting to talk about than the latest gadget.

Amazon's own Best Sellers page works the same way, and it's easy to forget it's sitting there for free. Sellers already use it every day to see what's actually moving units in a category, not what an algorithm decided to push into someone's feed for a few days. Cross-referencing that against Etsy search trends and eBay listing counts gives you a rough picture of demand versus competition without paying for a single tool.

None of this replaces checking the actual numbers before you commit stock or ad spend to something. UK Viral Radar pulls live search trend and eBay/Etsy competition data into a single score, which is exactly the kind of grunt work good product research requires - just done automatically instead of by hand.`,
    date: "2026-09-30",
    category: "Trends",
    status: "published",
    publishDate: "2026-09-30",
    imageUrl: "/blog-cover/how-to-find-profitable-products-to-sell-online",
  },
  {
    title: "How to Spot Viral and Best-Selling Products in the UK Market",
    slug: "how-to-spot-viral-best-selling-products-uk",
    excerpt:
      "The free signals UK sellers check before committing to a product: ad activity, TikTok Shop momentum, search trends and marketplace competition.",
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
    status: "published",
    publishDate: "2026-10-06",
    imageUrl: "/blog-cover/how-to-spot-viral-best-selling-products-uk",
  },
  {
    title: "Trending Products UK: 3 Rising Home Signals (16 Nov 2026)",
    slug: "uk-fastest-rising-products-week-2026-11-16",
    excerpt:
      "Week of 16 Nov 2026: three of 12 UK Home products show a rising signal. The Smart Water Bottle is the best demand-versus-competition example.",
    content: `Three of the 12 Home products in this week's UK Viral Radar report carry a rising signal: the Neck Massager, the Smart Water Bottle and the Pet Hair Remover. Of those, just the Neck Massager is labelled "rising" overall, with a Viral Score of 22 that is up 4 points since yesterday. The nine products without a rising signal are stable or declining, so this is a quiet week rather than a breakout one, and that matters if you are deciding where to spend your testing budget.

## What the report covers

UK Viral Radar tracks 15 products, and this report covers the 12 listed in the Home category for the week of 16 November 2026. The Viral Score runs from 0 to 100 and combines Google Trends UK search growth, Wikipedia page-view growth, YouTube video growth, and eBay UK and Etsy competition. It is a signal of rising interest, not a forecast of sales. A product can score well and still be a poor business if the market is crowded or the margin is thin.

The rising signal is deliberately simple. It switches on when a product's score rose since yesterday, or when its UK search interest grew 20% or more over seven days. That is why a product can show a rising signal while its overall trend label still says stable, as you will see below.

## Neck Massager: the clearest riser, and the most crowded

The Neck Massager is the only product with a rising trend label. Its score is 22, up 4 since yesterday, and UK search interest grew 52% over seven days, the strongest search growth in the report. The picture is mixed elsewhere, though. Wikipedia page views are down 34% and YouTube video growth is down 16%, so the interest looks driven by search rather than by a wave of new content.

The competition side is where a seller needs to be careful. There are 32,143 eBay UK listings and 256 on Etsy, which puts competition at HIGH. All 20 of the top 20 eBay listings come from different sellers. That figure only describes the top of the results page, so it is not a count of total sellers. Combined with the listing volume, though, it suggests a market where many sellers are already competing.

Rising search against HIGH competition usually means a seller needs an angle rather than just a listing. That could be a bundle, a better photo set, faster UK dispatch or a clear niche such as a particular user group. A plain copy of what is already ranking is unlikely to stand out.

## Smart Water Bottle: rising search, lighter competition

The Smart Water Bottle is the clearest example this week of the demand-versus-competition question. Its score is 25, down 1 since yesterday, and the trend label is stable. It still earns a rising signal because UK search interest grew 38% in seven days. Wikipedia growth is down 20% and YouTube growth is down 8%, so the search lift is not matched elsewhere.

Competition is MEDIUM, with 1,369 eBay UK listings and 816 on Etsy. That is far fewer eBay listings than the Neck Massager or the Pet Hair Remover. There are 52,325 recent YouTube videos on the topic, so the product is clearly known. A smaller listing pool leaves more room to differentiate, but one week of search growth is not proof of lasting demand.

## Pet Hair Remover: search is up, but competition is heavy

The Pet Hair Remover has a score of 14, down 1 since yesterday, and a stable trend. Search interest is up 30% over seven days, which triggers its rising signal. Wikipedia growth is down 14% and YouTube growth is down 12%.

The commercial side is the difficulty. There are 30,020 eBay UK listings and 320 on Etsy, so competition is HIGH. Check live eBay prices before committing: on low-priced items, shipping, platform fees and advertising can take most of the margin, which rewards sellers with cheap, reliable supply and punishes anyone who relies on paid traffic.

## The biggest score is not a rising product

The Portable Ice Maker leads the table with a score of 35, but its rising signal is false. The score fell 3 points since yesterday, search interest is down 7% over seven days, and YouTube growth is down 28%. Its Wikipedia page views are up 175%, which looks dramatic, but that is one signal against several soft ones, and percentage growth can come from a small starting point. It also has 31,916 eBay UK listings and HIGH competition, so a high score here is not a reason to rush.

The Posture Corrector (score 27) is a similar story in a different direction. YouTube growth is up 106%, but search interest is down 18% and its score fell 3 points. With competition at MEDIUM, 8,062 eBay UK listings and 179 on Etsy, it is worth watching to see whether search catches up with the video activity. At the moment it does not qualify as rising.

## Products to be cautious about

Several products show signals pointing the wrong way. The Mini Thermal Printer has search interest down 52% and Wikipedia growth down 52%. The Portable Blender's score dropped 9 points since yesterday, to 12, even though YouTube growth is up 41%. The Reusable Water Bottle is the only product labelled declining: its score is 6 after a 46-point fall since yesterday, with 56,186 eBay UK listings and 12,350 on Etsy.

The Electric Wine Opener has no search growth figure this week, and only 182 recent YouTube videos, with YouTube growth down 66%. When a data source is missing, the score may rest on less information, so read it with extra caution. The same applies to the Magnetic Phone Stand, which also has no search figure and sits at HIGH competition with 26,259 eBay UK listings and 5,367 on Etsy.

## How to use this week's data

Start by separating demand from competition. The Neck Massager has the strongest momentum but the toughest market. The Smart Water Bottle has a smaller listing pool, so on these figures alone it looks the least crowded of the three rising products. That is an observation about the data, not a recommendation to buy or sell it. The Pet Hair Remover has rising search but heavy competition.

Before ordering stock, check the live eBay and Etsy results yourself, check live prices, work out your landed cost and fees, and consider a small test batch or a supplier with no minimum order. This report is not advice on whether any product is suitable, safe or compliant to sell in the UK, so check that for yourself too. With only three rising signals out of 12 products this week, there is no pressure to chase everything. A selective approach, backed by your own margin maths, is the safer reading of the data.`,
    date: "2026-11-16",
    category: "Trends",
    status: "published",
    publishDate: "2026-11-16",
    imageUrl: "/blog-cover/uk-fastest-rising-products-week-2026-11-16",
    chart: {"label": "Week of 16 Nov 2026", "tracked": 15, "items": [{"name": "Portable Ice Maker", "score": 35, "change": -3, "search": -7, "competition": "HIGH", "price": null, "rising": false}, {"name": "Posture Corrector", "score": 27, "change": -3, "search": -18, "competition": "MEDIUM", "price": null, "rising": false}, {"name": "Smart Water Bottle", "score": 25, "change": -1, "search": 38, "competition": "MEDIUM", "price": null, "rising": true}, {"name": "Neck Massager", "score": 22, "change": 4, "search": 52, "competition": "HIGH", "price": null, "rising": true}, {"name": "Resistance Bands", "score": 15, "change": -4, "search": -11, "competition": "HIGH", "price": null, "rising": false}, {"name": "Pet Hair Remover", "score": 14, "change": -1, "search": 30, "competition": "HIGH", "price": null, "rising": true}, {"name": "Mini Thermal Printer", "score": 14, "change": -1, "search": -52, "competition": "MEDIUM", "price": null, "rising": false}, {"name": "Portable Blender", "score": 12, "change": -9, "search": -27, "competition": "MEDIUM", "price": null, "rising": false}, {"name": "LED Strip Lights", "score": 12, "change": 0, "search": -14, "competition": "HIGH", "price": null, "rising": false}, {"name": "Electric Wine Opener", "score": 11, "change": -2, "search": null, "competition": "MEDIUM", "price": null, "rising": false}, {"name": "Magnetic Phone Stand", "score": 10, "change": 0, "search": null, "competition": "HIGH", "price": null, "rising": false}, {"name": "Reusable Water Bottle", "score": 6, "change": -46, "search": 0, "competition": "HIGH", "price": null, "rising": false}]},
  },
  {
    title: "UK Rising Products: Week of 17 Nov 2026",
    slug: "uk-fastest-rising-products-week-2026-11-17",
    excerpt:
      "Only the Posture Corrector shows a big jump this week; the other four rising Home products moved by a point or two.",
    content: `The Posture Corrector is the clear standout in the UK this week, with a Viral Score of 100 after a 69-point jump since yesterday and YouTube video growth of 3,088%. Four other Home products carry a rising flag, but they moved by only one or two points, and UK search interest is down across almost every product we track. That makes this a week for selective, careful research rather than broad optimism.

## What the data covers this week

UK Viral Radar tracks 15 products, and this week's ranked list shows 12 of them, all in the Home category. The Viral Score runs from 0 to 100 and combines Google Trends UK search growth, Wikipedia page-view growth, YouTube video growth, and eBay UK and Etsy competition. It is a signal of rising interest, not a prediction of sales.

A product gets the rising flag when its score went up since yesterday or its UK search interest grew 20% or more over seven days. This week no product with a search figure meets the search test, so every rising flag comes from day-on-day score movement. A score moving up by one point is a much weaker signal than a 69-point jump, and you should read the list with that in mind.

## The Posture Corrector: one real spike

The Posture Corrector sits at rank 1 with a Viral Score of 100, up 69 since yesterday. The YouTube growth figure of 3,088% is what drives it, with 12,721 recent videos. That is a large amount of new video content appearing in a short window.

The other signals are less exciting. UK search interest is down 22% over seven days and Wikipedia page views are flat at 0%. So the picture is a burst of video activity that has not yet shown up in search. That can mean attention is building and search will follow, or it can mean a burst of content that fades. One week of data cannot tell you which, so treat it as a product to watch.

On competition, the Posture Corrector is rated MEDIUM, with 8,075 eBay UK listings and 182 Etsy listings. That is far less crowded than the biggest Home products further down this list. The top 20 eBay listings come from 18 unique sellers, but that figure only describes those 20 listings and says nothing about the total number of sellers. Use the MEDIUM rating and the listing counts to judge how crowded the market is, not the seller count.

## The four smaller risers

Portable Ice Maker scores 24, up 1 point. Wikipedia page views are up 60%, but search is down 21% and YouTube growth is down 51%. Competition is HIGH, with 32,188 eBay UK listings and 1,910 Etsy listings. The interest signals are mixed and the market is already busy.

Resistance Bands scores 19, up 2 points, with Wikipedia growth of 76% and YouTube growth of 8%. Search is down 22%. It has 48,226 eBay UK listings and 2,471 Etsy listings, so it is rated HIGH. A product like this does not need a new trend to sell. It needs a clear angle, such as a bundle, better photography or a particular audience, to stand out from tens of thousands of existing listings.

LED Strip Lights scores 14, up 2 points. Wikipedia growth is 17%, YouTube growth is -30% and search is down 24%. With 55,216 eBay UK listings and 565 Etsy listings, competition is HIGH. That is the biggest eBay count of any of the five risers and the second-largest on the whole list, behind only Reusable Water Bottle at 56,961. A small score rise on a market this big is not a strong reason to start.

Electric Wine Opener scores 12, up 1 point. It has no seven-day search figure, so we cannot say whether search is rising or falling. Wikipedia growth is 15% and YouTube growth is -46%, but only 115 recent videos sit behind that figure, so it is a very small sample and a big percentage swing there means little. Competition is MEDIUM, with 4,842 eBay UK listings and just 31 on Etsy. The Etsy gap is the most interesting detail, though a thin marketplace can also mean there is little demand there.

## Products that cooled off

Several products are not rising and lost ground since yesterday. Mini Thermal Printer fell 12 points to 15, Neck Massager fell 10 to 11, Smart Water Bottle fell 9 to 16 and Pet Hair Remover fell 7 to 7. Daily score moves can be noisy, so one bad day is not a verdict. They do show that this week's list is a mix of small gains and small losses rather than a market in full growth.

Magnetic Phone Stand deserves a mention for a different reason. Its score is steady, but UK search is down 56% over seven days, the biggest search decline on the list, and it faces HIGH competition with 26,115 eBay UK listings and 5,399 Etsy listings. Portable Blender has YouTube growth of 36% and MEDIUM competition at 6,519 eBay UK listings and 90 Etsy listings, but its score is only 10 and it carries no rising flag.

## What this means for a UK seller

First, separate attention from demand. The Posture Corrector's video surge shows people are making and watching content, not that they are buying. Falling search is a reason for caution, and a sensible check is whether search stabilises over the next week or two.

Second, use competition as a filter. All five rising products sit in MEDIUM or HIGH markets: three are rated HIGH (Portable Ice Maker, Resistance Bands and LED Strip Lights) and two are rated MEDIUM (Posture Corrector and Electric Wine Opener). The HIGH ones have tens of thousands of listings, and entering them with a plain, undifferentiated listing means competing mainly on price. MEDIUM-rated products leave more room, but you still need a reason for a buyer to choose you.

Third, the report has no price data, so work out your own numbers before ordering stock. Check the supplier cost, shipping, eBay and Etsy fees and returns, then compare the result with live UK prices. Posture correctors and similar body-worn products can also bring return and sizing questions, so check the relevant UK product rules and your marketplace policies before listing.

Finally, test small. A small order or a made-to-order setup limits your exposure if the video spike fades. One week of data is a starting point for research, not a buying signal on its own.

## How we build this report

UK Viral Radar draws on five data sources. The free view shows three products, and Pro at £9.99 per month shows the full ranking. This week's headline is simple: one product spiked sharply, four moved slightly, and UK search interest is mostly falling. We will keep tracking whether the Posture Corrector's video surge carries through into search.`,
    date: "2026-11-17",
    category: "Trends",
    status: "published",
    publishDate: "2026-11-17",
    imageUrl: "/blog-cover/uk-fastest-rising-products-week-2026-11-17",
    chart: {"label":"Week of 17 Nov 2026","tracked":15,"items":[{"name":"Posture Corrector","score":100,"change":69,"search":-22,"competition":"MEDIUM","price":null,"rising":true},{"name":"Portable Ice Maker","score":24,"change":1,"search":-21,"competition":"HIGH","price":null,"rising":true},{"name":"Resistance Bands","score":19,"change":2,"search":-22,"competition":"HIGH","price":null,"rising":true},{"name":"Smart Water Bottle","score":16,"change":-9,"search":-9,"competition":"MEDIUM","price":null,"rising":false},{"name":"Mini Thermal Printer","score":15,"change":-12,"search":-20,"competition":"MEDIUM","price":null,"rising":false},{"name":"LED Strip Lights","score":14,"change":2,"search":-24,"competition":"HIGH","price":null,"rising":true},{"name":"Electric Wine Opener","score":12,"change":1,"search":null,"competition":"MEDIUM","price":null,"rising":true},{"name":"Neck Massager","score":11,"change":-10,"search":-10,"competition":"HIGH","price":null,"rising":false},{"name":"Magnetic Phone Stand","score":10,"change":0,"search":-56,"competition":"HIGH","price":null,"rising":false},{"name":"Portable Blender","score":10,"change":-2,"search":-9,"competition":"MEDIUM","price":null,"rising":false},{"name":"Pet Hair Remover","score":7,"change":-7,"search":-29,"competition":"HIGH","price":null,"rising":false},{"name":"Reusable Water Bottle","score":6,"change":0,"search":-5,"competition":"HIGH","price":null,"rising":false}]},
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
