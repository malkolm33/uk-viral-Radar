// Automated SEO / GEO pre-publish check.
// Usage:  node .github/scripts/seo-check.mjs https://<preview-or-live-url>
// Exit code 0 = no blocking errors, 1 = at least one ERROR (do not publish).
// No dependencies - plain Node 18+ (uses global fetch).

const base = (process.argv[2] || "https://ukviralradar.com").replace(/\/$/, "");
const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

async function get(path) {
  const headers = { "User-Agent": "UKViralRadar-SEO-Check/1.0" };
  // Vercel preview deployments are password-protected by default. Set
  // VERCEL_AUTOMATION_BYPASS_SECRET (Vercel > Settings > Deployment Protection >
  // Protection Bypass for Automation) so the check can read preview pages.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  const res = await fetch(base + path, { redirect: "follow", headers });
  return { status: res.status, text: await res.text(), type: res.headers.get("content-type") || "" };
}

const pick = (html, re) => (html.match(re) || [])[1];
const attr = (tag, name) => pick(tag, new RegExp(`${name}=["']([^"']*)["']`, "i"));
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function metaContent(html, key) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const t = tags.find((m) => new RegExp(`(name|property)=["']${key}["']`, "i").test(m));
  return t ? decode(attr(t, "content")) : undefined;
}

function checkPage(path, html, { indexable = true, requireSchema = [] } = {}) {
  const title = decode(pick(html, /<title[^>]*>([^<]*)<\/title>/i));
  if (!title) err(path, "missing <title>");
  else if (title.length > 65) warn(path, `title is ${title.length} chars (aim for <= 65): "${title}"`);

  const desc = metaContent(html, "description");
  if (!desc) err(path, "missing meta description");
  else if (desc.length < 50 || desc.length > 160) warn(path, `meta description is ${desc.length} chars (aim for 50-160)`);

  const canonTag = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i) || [])[0];
  const canon = canonTag && attr(canonTag, "href");
  if (indexable) {
    if (!canon) err(path, "missing canonical link");
    else if (!/^https:\/\//.test(canon)) err(path, `canonical is not absolute: ${canon}`);
  }

  const robots = metaContent(html, "robots") || "";
  if (indexable && /noindex/i.test(robots)) err(path, "page is noindex but should be indexable");

  const h1s = (html.match(/<h1\b/gi) || []).length;
  if (h1s !== 1) warn(path, `has ${h1s} <h1> tags (expected exactly 1)`);

  for (const k of ["og:title", "og:description"]) if (!metaContent(html, k)) warn(path, `missing ${k}`);

  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const noAlt = imgs.filter((i) => !/\balt=["'][^"']+["']/i.test(i) && !/aria-hidden=["']true["']/i.test(i));
  if (noAlt.length) warn(path, `${noAlt.length} image(s) without alt text`);

  const types = [];
  for (const block of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(block[1]);
      (Array.isArray(data) ? data : [data]).forEach((d) => types.push(d["@type"]));
    } catch (e) {
      err(path, `invalid JSON-LD: ${e.message}`);
    }
  }
  for (const t of requireSchema) if (!types.includes(t)) err(path, `missing ${t} structured data`);
  return { title, types };
}

const report = [];
try {
  // Core pages and the structured data each one must carry.
  const pages = [
    ["/", ["SoftwareApplication", "FAQPage", "Organization", "WebSite"]],
    ["/blog", ["Blog"]],
    ["/dashboard", []],
    ["/compare", []],
    ["/tools", []],
    ["/tools/saturation-checker", ["WebApplication", "FAQPage"]],
    ["/tools/fee-calculator", ["WebApplication", "FAQPage"]],
    ["/tools/profit-calculator", []],
    ["/about", ["AboutPage"]],
    ["/contact", []],
    ["/privacy", []],
    ["/terms", []],
  ];
  for (const [path, schema] of pages) {
    const r = await get(path);
    if (r.status === 401 && path === "/") throw new Error("HTTP 401 - deployment is protected; set VERCEL_AUTOMATION_BYPASS_SECRET");
    if (r.status !== 200) { err(path, `HTTP ${r.status}`); continue; }
    const { types } = checkPage(path, r.text, { requireSchema: schema });
    report.push(`${path}  ->  schema: ${types.join(", ") || "-"}`);
    if (path === "/" && !/href=["']\/blog["']/.test(r.text)) warn(path, "no link to /blog on home page");
  }

  // Blog posts: discovered from the sitemap so new posts are always covered.
  const sm = await get("/sitemap.xml");
  if (sm.status !== 200) err("/sitemap.xml", `HTTP ${sm.status}`);
  const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const posts = urls.filter((u) => /\/blog\/[^/]+$/.test(u)).map((u) => new URL(u).pathname);
  if (!posts.length) warn("/sitemap.xml", "no blog posts listed");
  for (const p of posts) {
    const r = await get(p);
    if (r.status !== 200) { err(p, `HTTP ${r.status} (listed in sitemap)`); continue; }
    const { types } = checkPage(p, r.text, { requireSchema: ["BlogPosting", "BreadcrumbList"] });
    report.push(`${p}  ->  schema: ${types.join(", ")}`);
    const ogImage = metaContent(r.text, "og:image") || "";
    if (!ogImage) warn(p, "no featured/og:image");
    else if (/picsum\.photos/.test(ogImage)) warn(p, "featured image is a random placeholder (picsum.photos) - replace with a relevant image");
  }

  const rb = await get("/robots.txt");
  if (rb.status !== 200 || !/sitemap:/i.test(rb.text)) err("/robots.txt", "missing or has no Sitemap line");
  if (/disallow:\s*\/\s*$/im.test(rb.text)) err("/robots.txt", "blocks the whole site");

  const ll = await get("/llms.txt");
  if (ll.status !== 200 || !ll.text.startsWith("# ")) err("/llms.txt", "missing or malformed");
  else {
    const missing = posts.filter((p) => !ll.text.includes(p));
    if (missing.length) err("/llms.txt", `does not list ${missing.length} blog post(s): ${missing.join(", ")}`);
  }
} catch (e) {
  err("check", `could not complete: ${e.message}`);
}

console.log(`SEO/GEO check for ${base}\n`);
console.log(report.join("\n"));
console.log(`\nERRORS (${errors.length}) - must be fixed before publishing:`);
errors.forEach((e) => console.log("  x " + e));
console.log(`\nWARNINGS (${warnings.length}) - review, fix where sensible:`);
warnings.forEach((w) => console.log("  ! " + w));
console.log(errors.length ? "\nRESULT: FAIL - do not publish" : "\nRESULT: PASS");
process.exit(errors.length ? 1 : 0);
