"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Home", "Electronics", "Fitness", "Beauty", "Kitchen"];

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product: any, i: number) => {
          const status = getStatusLabel(product.score);
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
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ color: barColor, backgroundColor: `${barColor}1A` }}>{status.label}</span>
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
