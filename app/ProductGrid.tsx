"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Home", "Electronics", "Fitness", "Beauty", "Kitchen"];

const CATEGORY_CONTENT: Record<string, { title: string; text: string; image: string }> = {
  All: {
    title: "UK Trending Products, Updated Daily",
    text: "UK Viral Radar combines five live data sources - Google Trends, Wikipedia, eBay, Etsy and YouTube - into a single Viral Score, updated every day. Instead of manually checking search volume, marketplace listings and social buzz across separate tools, you get one ranked list built specifically for the UK market. Every signal here reflects real UK demand: UK search interest, UK eBay listings and pricing, and UK-relevant video coverage - not global trends that may not translate to British buyers. Whether you're sourcing for a dropshipping store or looking for the next product to add to your range, this daily-updated radar gives you an early, UK-specific signal before a product becomes obvious to everyone else.",
    image: "https://picsum.photos/seed/uk-viral-radar-trending/600/400",
  },
  Home: {
    title: "Home & Living Products Trending in the UK",
    text: "Home and living products are among the steadiest categories on UK Viral Radar, and a lot of that demand comes from renters and students who need to decorate and organise without making permanent changes to a property they don't own. Adhesive shelving, removable wallpaper, tension rods and command-style hooks let people personalise a flat or student room while staying deposit-safe - a real concern for the UK's large renting population. TikTok's #TikTokMadeMeBuyIt trend has been a major driver here, turning clever, low-cost home fixes into viral must-haves almost overnight. Products that solve a small everyday annoyance, install in minutes and leave no marks tend to perform especially well, and they often show up first as fast-growing search terms before marketplace listings catch up. Pinterest often surfaces these trends 30-90 days before they peak on Google - worth checking directly on product cards below.",
    image: "https://picsum.photos/seed/uk-home-living-category/600/400",
  },
  Electronics: {
    title: "Trending Electronics & Tech Accessories in the UK",
    text: "Electronics and tech accessories remain one of the most consistently in-demand categories for UK shoppers, from smart home devices to phone accessories and wireless earbuds. What makes this category especially interesting for dropshippers is how quickly a product with a genuine \"wow factor\" - something visually impressive or clever enough to demonstrate in a short video - can spread across TikTok and drive a sudden spike in UK search interest and marketplace listings. These spikes often show up in Google Trends and YouTube data days or weeks before a product becomes mainstream, which is exactly the kind of early signal this radar is built to catch. Watch for consistent search growth alongside rising eBay competition - that combination usually means a trend is just getting started.",
    image: "https://picsum.photos/seed/uk-electronics-category/600/400",
  },
  Fitness: {
    title: "Home Fitness Gear for UK Flats and Small Spaces",
    text: "Fitness products behave differently in the UK than in markets with larger homes: compact, space-saving gear consistently outperforms bulky equipment. Resistance bands, foldable yoga mats and adjustable dumbbells suit the UK's smaller flats and houses, and unlike seasonal fitness spikes tied to New Year's resolutions, demand for these compact essentials tends to hold steady across the year rather than crashing after January. That makes home fitness a category worth tracking continuously rather than only at the start of the year. Look for products that fold flat, stack easily or serve more than one purpose - they tend to have broader appeal to UK buyers working out in limited space, and they show up repeatedly across our eBay and Etsy listing data.",
    image: "https://picsum.photos/seed/uk-fitness-category/600/400",
  },
  Beauty: {
    title: "Clean Beauty and Skincare Trends in the UK",
    text: "The UK beauty and skincare market has been growing strongly, with industry estimates putting annual growth above 5% - and two trends are driving much of that momentum. The first is \"clean beauty\": UK shoppers are increasingly checking ingredient lists and favouring simpler, more transparent formulations. The second is \"dupe culture\" - the search for affordable alternatives to expensive, prestige skincare and makeup brands that deliver similar results at a fraction of the price. Products that tap into either trend, especially ones with visible before-and-after results, tend to build momentum quickly through search interest and video coverage before wider competition catches on. Keep an eye on rising Wikipedia and search growth here - beauty trends often move fast. Pinterest often surfaces these trends 30-90 days before they peak on Google - worth checking directly on product cards below.",
    image: "https://picsum.photos/seed/uk-beauty-category/600/400",
  },
  Kitchen: {
    title: "Smart Kitchen Gadgets Driving UK Sales",
    text: "Rising energy costs in the UK have pushed many households toward kitchen gadgets that promise to save money as well as time, and air fryers are the clearest example - they cook faster and use a fraction of the energy of a traditional oven, which has kept demand strong well beyond the initial hype cycle. The same logic extends to other practical kitchen gadgets: multi-use tools, small efficient appliances and gadgets that solve a specific everyday annoyance tend to perform well with UK buyers who are increasingly price- and energy-conscious. These products often show steadier, less volatile search growth compared to more impulse-driven categories, making them a reliable one to track for consistent, lower-risk trending opportunities. Pinterest often surfaces these trends 30-90 days before they peak on Google - worth checking directly on product cards below.",
    image: "https://picsum.photos/seed/uk-kitchen-category/600/400",
  },
};

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#E60023" className="h-3 w-3 shrink-0" aria-hidden="true">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.885 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.211 0-2.363-.63-2.751-1.379l-.748 2.858c-.271 1.043-1.002 2.35-1.492 3.146 1.124.345 2.317.535 3.554.535 6.62 0 11.99-5.366 11.99-11.988C23.983 5.367 18.617 0 12.017 0z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#000000" className="h-3 w-3 shrink-0" aria-hidden="true">
      <path d="M16.6 5.82c-1.005-.985-1.57-2.326-1.57-3.82h-3.14v13.87c0 1.548-1.26 2.808-2.81 2.808a2.81 2.81 0 0 1-2.81-2.81c0-1.548 1.26-2.807 2.81-2.807.31 0 .604.05.884.14V9.9a6.02 6.02 0 0 0-.884-.066 5.95 5.95 0 0 0-5.95 5.95A5.95 5.95 0 0 0 9.08 21.73a5.95 5.95 0 0 0 5.95-5.95V9.03a8.29 8.29 0 0 0 4.85 1.55V7.44c-1.14 0-2.19-.34-3.28-1.62z" />
    </svg>
  );
}

function UKFlag() {
  return (
    <svg viewBox="0 0 60 30" className="h-4 w-6 rounded-sm shadow-sm">
      <clipPath id="uk-flag-clip"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (!points || points.length < 2) return <div className="h-8 w-full" />;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const width = 100;
  const height = 28;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-8 w-full" preserveAspectRatio="none">
      <polyline points={coords.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getStatusLabel(score: number) {
  if (score >= 85) return { label: "Early Winner", color: "text-green-400" };
  if (score >= 75) return { label: "Strong", color: "text-emerald-400" };
  if (score >= 60) return { label: "Rising", color: "text-blue-400" };
  if (score >= 40) return { label: "Watching", color: "text-yellow-400" };
  return { label: "Weak", color: "text-gray-500" };
}

// Velocity is the average of the three growth signals (search, YouTube, Wikipedia) -
// it answers "how fast is this accelerating right now", separately from the Viral
// Score, which answers "how good does this product look overall".
function getVelocity(searchGrowth: number, youtubeGrowth: number, wikiGrowth: number) {
  const averageGrowth = (searchGrowth + youtubeGrowth + wikiGrowth) / 3;
  if (averageGrowth > 50) {
    return { label: "Accelerating", emoji: "🚀", color: "#16A34A", averageGrowth };
  }
  if (averageGrowth >= 15) {
    return { label: "Rising", emoji: "📈", color: "#2563EB", averageGrowth };
  }
  if (averageGrowth >= 0) {
    return { label: "Stable", emoji: "➡️", color: "#64748B", averageGrowth };
  }
  return { label: "Cooling", emoji: "📉", color: "#D97706", averageGrowth };
}

function ProductImage({ src, fallbackSrc, alt }: { src: string; fallbackSrc: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-[#E4E7EC]" />}
      <img
        src={currentSrc}
        alt={alt}
        className={`h-full w-full object-contain p-3 transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setLoaded(false);
          } else {
            setLoaded(true);
          }
        }}
      />
    </>
  );
}

export default function ProductGrid({ products, isLoggedIn }: { products: any[]; isLoggedIn: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);

  const categoryContent = CATEGORY_CONTENT[selectedCategory] || CATEGORY_CONTENT.All;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-[#0F172A] text-white"
                : "border border-[#E4E7EC] bg-white text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-5 rounded-lg border border-[#E4E7EC] bg-[#F7F8FA] p-5 sm:flex-row sm:items-center sm:p-6">
        <img
          key={categoryContent.image}
          src={categoryContent.image}
          alt={categoryContent.title}
          className="h-40 w-full shrink-0 rounded-lg object-cover shadow-sm sm:h-32 sm:w-48"
        />
        <div>
          <h2 className="text-lg font-semibold text-[#0F172A]">{categoryContent.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{categoryContent.text}</p>
        </div>
      </div>

      <div className="mb-6 flex items-start gap-2 rounded-md border border-[#E4E7EC] bg-white px-4 py-3 text-xs leading-relaxed text-[#64748B]">
        <span className="shrink-0">💡</span>
        <p>
          <span className="font-semibold text-[#0F172A]">How to read the Viral Score:</span>{" "}
          It combines 5 live signals (search trends, Wikipedia interest, eBay/Etsy competition, YouTube activity) into one score.{" "}
          <span className="font-medium text-[#0F172A]">Early Winner</span> and <span className="font-medium text-[#0F172A]">Strong</span> scores suggest low competition with rising demand — worth investigating first.{" "}
          The second badge next to it is <span className="font-medium text-[#0F172A]">Velocity</span> — the average growth across search, YouTube and Wikipedia, showing how fast momentum is building right now: 🚀 Accelerating, 📈 Rising, ➡️ Stable, or 📉 Cooling.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product: any, i: number) => {
          const status = getStatusLabel(product.score);
          const velocity = getVelocity(product.searchGrowth || 0, product.youtubeGrowth || 0, product.wikiGrowth || 0);
          const isLocked = !isLoggedIn && i >= 3;
          const barColor = product.score >= 60 ? "#16A34A" : product.score >= 40 ? "#D97706" : "#DC2626";
          return (
            <div key={i} className="relative overflow-hidden rounded-lg border border-[#E4E7EC] bg-white">
              {isLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-md">
                  <div className="rounded-full bg-[#0F172A] p-3 text-white">Lock</div>
                  <a href="/login" className="rounded-md bg-[#0F172A] px-4 py-2 text-sm font-medium text-white">Sign up to unlock</a>
                </div>
              )}
              <div className="relative h-36 w-full bg-[#F1F5F9]">
                <ProductImage
                  key={product.ebayImageUrl || product.imageQuery}
                  src={product.ebayImageUrl || `https://picsum.photos/seed/${encodeURIComponent(product.imageQuery)}/400/300`}
                  fallbackSrc={`https://picsum.photos/seed/${encodeURIComponent(product.imageQuery)}/400/300`}
                  alt={product.name}
                />
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-sm">
                  <UKFlag />
                  <span className="text-[10px] font-medium text-[#0F172A]">UK</span>
                </div>
                <div className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[#64748B] shadow-sm">#{i + 1}</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-[#0F172A]">{product.name}</h2>
                  {product.category && (
                    <span className="shrink-0 rounded-full bg-[#F7F8FA] px-2 py-0.5 text-[10px] font-medium text-[#64748B]">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div>
                    <span className="text-xl font-bold" style={{ color: barColor }}>{product.score}</span>
                    <span className="text-xs text-[#64748B]"> /100</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ color: barColor, backgroundColor: `${barColor}1A` }}>{status.label}</span>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ color: velocity.color, backgroundColor: `${velocity.color}1A` }}>{velocity.emoji} {velocity.label}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Sparkline points={product.searchPoints} color={barColor} />
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[#E4E7EC] pt-3 text-xs text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Search growth</span>
                    <span className={product.searchGrowth < 0 ? "text-[#DC2626]" : "text-[#16A34A]"}>{product.searchGrowth > 0 ? "+" : ""}{product.searchGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wikipedia interest</span>
                    <span className={product.wikiGrowth < 0 ? "text-[#DC2626]" : "text-[#16A34A]"}>{product.wikiGrowth > 0 ? "+" : ""}{product.wikiGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>eBay listings (live)</span>
                    <span className="text-[#0F172A]">{product.ebayListingCount}</span>
                  </div>
                  {product.searchKeyword && (
                    <div className="flex justify-end">
                      <a
                        href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=GB&q=${encodeURIComponent(product.searchKeyword)}&media_type=all`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#2563EB] underline decoration-[#2563EB]/40 underline-offset-2 hover:text-[#0F172A] hover:decoration-[#0F172A]/40"
                      >
                        Check Facebook ads for this product →
                      </a>
                    </div>
                  )}
                  {product.searchKeyword && (
                    <div className="flex justify-end">
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`site:myshopify.com "${product.searchKeyword}"`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#2563EB] underline decoration-[#2563EB]/40 underline-offset-2 hover:text-[#0F172A] hover:decoration-[#0F172A]/40"
                      >
                        See who&apos;s selling this on Shopify →
                      </a>
                    </div>
                  )}
                  {product.searchKeyword && (
                    <div className="flex justify-end">
                      <a
                        href={`https://trends.pinterest.com/?q=${encodeURIComponent(product.searchKeyword)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-[11px] text-[#2563EB] hover:text-[#0F172A]"
                      >
                        <PinterestIcon />
                        <span className="underline decoration-[#2563EB]/40 underline-offset-2 group-hover:decoration-[#0F172A]/40">
                          Check Pinterest Trends →
                        </span>
                      </a>
                    </div>
                  )}
                  {product.ebayUniqueSellerCount > 0 && (
                    <div className="flex justify-between">
                      <span>Unique sellers</span>
                      <span className="text-[#0F172A]">{product.ebayUniqueSellerCount}</span>
                    </div>
                  )}
                  {product.ebayAvgPrice && (
                    <div className="flex justify-between">
                      <span>Avg. price</span>
                      <span className="text-[#0F172A]">£{product.ebayAvgPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Etsy listings (live)</span>
                    <span className="text-[#0F172A]">{product.etsyListingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>YouTube videos (7d, live)</span>
                    <span className="text-[#0F172A]">{product.youtubeVideoCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>YouTube growth</span>
                    <span className={product.youtubeGrowth < 0 ? "text-[#DC2626]" : "text-[#16A34A]"}>{product.youtubeGrowth > 0 ? "+" : ""}{product.youtubeGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Competition</span>
                    <span className="text-[#0F172A]">{product.competition}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <p className="py-10 text-center text-sm text-[#64748B]">No products in this category yet.</p>
      )}
    </>
  );
}
