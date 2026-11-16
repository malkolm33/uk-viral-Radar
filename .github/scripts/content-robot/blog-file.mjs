// Reads and safely appends posts to app/lib/blog-posts.ts.
import { readFileSync, writeFileSync } from "node:fs";

export const BLOG_FILE = "app/lib/blog-posts.ts";

export function readBlogFile() {
  return readFileSync(BLOG_FILE, "utf8");
}

export function existingSlugs(source) {
  return [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

export function postDates(source) {
  return [...source.matchAll(/\bdate:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
}

const str = (s) => JSON.stringify(String(s)); // double-quoted, fully escaped
// Template literal body: escape backslashes, backticks and "${".
const tpl = (s) => String(s).replace(/\r/g, "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

// Compact data for the post's chart + table (see BlogChart in blog-posts.ts).
export function chartFromFacts(facts) {
  const d = new Date(`${facts.date}T00:00:00Z`);
  const when = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return {
    label: facts.type === "category" ? `${facts.category} · ${when}` : `Week of ${when}`,
    tracked: facts.trackedProducts,
    items: facts.products.map((p) => ({
      name: p.name,
      score: p.viralScore,
      change: p.scoreChangeSinceYesterday ?? null,
      search: p.searchGrowth7dPercent ?? null,
      competition: p.competition,
      price: p.ebayUkAvgPriceGBP ?? null,
      rising: Boolean(p.risingSignal),
    })),
  };
}

export function appendPost(source, article, today, chart) {
  const nl = source.includes("\r\n") ? "\r\n" : "\n";
  // Same field order as README-BLOG.md - publish-scheduled-posts.mjs relies on
  // `status:` being directly followed by `publishDate:`.
  const entry = [
    "  {",
    `    title: ${str(article.title)},`,
    `    slug: ${str(article.slug)},`,
    "    excerpt:",
    `      ${str(article.excerpt)},`,
    `    content: \`${tpl(article.content)}\`,`,
    `    date: "${today}",`,
    `    category: ${str(article.category || "Trends")},`,
    `    status: "published",`,
    `    publishDate: "${today}",`,
    `    imageUrl: "/blog-cover/${article.slug}",`,
    ...(chart ? [`    chart: ${JSON.stringify(chart)},`] : []),
    "  },",
  ].join("\n").replace(/\n/g, nl);

  const marker = source.indexOf("export const blogPosts");
  const close = source.indexOf(`${nl}];`, marker);
  if (marker === -1 || close === -1) throw new Error("Could not find the blogPosts array in blog-posts.ts");
  return source.slice(0, close) + nl + entry + source.slice(close);
}

export function writeBlogFile(source) {
  writeFileSync(BLOG_FILE, source, "utf8");
}
