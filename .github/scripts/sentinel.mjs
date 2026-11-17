// Daily Sentinel ("Günlük Nöbetçi"): checks the LIVE site every day, even when
// nobody has changed anything. Writes a Markdown report to sentinel-report.md
// and exits 1 if anything is broken, so the workflow can open a GitHub issue
// (GitHub then emails the repo owner).
// Usage: node .github/scripts/sentinel.mjs [https://ukviralradar.com]
// No dependencies - plain Node 18+.

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const base = (process.argv[2] || "https://ukviralradar.com").replace(/\/$/, "");
const problems = [];
const warnings = [];
const ok = [];
const UA = { "User-Agent": "UKViralRadar-Sentinel/1.0" };

async function fetchOnce(url, opts = {}) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow", headers: UA, signal: AbortSignal.timeout(30000), ...opts });
    const text = await res.text();
    return { status: res.status, text, ms: Date.now() - t0, type: res.headers.get("content-type") || "" };
  } catch (e) {
    return { status: 0, text: "", ms: Date.now() - t0, error: String(e) };
  }
}

// One retry (after 5 s) for network errors / 5xx, so a single cold start or
// blip does not raise an alarm. HEAD falls back to GET if the server refuses it.
async function fetchTimed(url, opts = {}) {
  let r = await fetchOnce(url, opts);
  if (opts.method === "HEAD" && (r.status === 405 || r.status === 403)) r = await fetchOnce(url);
  if (r.status === 0 || r.status >= 500) {
    await new Promise((s) => setTimeout(s, 5000));
    r = await fetchOnce(url, opts.method === "HEAD" ? {} : opts);
  }
  return r;
}

// 1) Key pages must load (200) and not be slow.
const KEY_PAGES = ["/", "/dashboard", "/blog", "/compare", "/tools", "/tools/saturation-checker", "/tools/fee-calculator",
  "/tools/profit-calculator", "/about", "/contact", "/privacy", "/terms", "/robots.txt", "/sitemap.xml", "/llms.txt"];
for (const p of KEY_PAGES) {
  const r = await fetchTimed(base + p);
  if (r.status !== 200) problems.push(`Page ${p} returned ${r.status || "no response"}${r.error ? ` (${r.error})` : ""}`);
  else if (r.ms > 5000) warnings.push(`Page ${p} is slow: ${r.ms} ms`);
  else ok.push(`${p} ${r.ms} ms`);
}

// 2) Every URL in the sitemap must load (catches broken blog posts / removed pages).
const sm = await fetchTimed(base + "/sitemap.xml");
const urls = [...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length < 5) problems.push(`Sitemap has only ${urls.length} URLs - it may be broken`);
let smBad = 0;
for (const u of urls) {
  const r = await fetchTimed(u, { method: "HEAD" });
  if (r.status !== 200) { smBad++; problems.push(`Sitemap URL ${u} returned ${r.status || "no response"}`); }
}
ok.push(`Sitemap: ${urls.length} URLs checked, ${smBad} broken`);

// 3) robots.txt must point to the sitemap and must not block the whole site or AI crawlers.
const rb = await fetchTimed(base + "/robots.txt");
if (!/sitemap:/i.test(rb.text)) problems.push("robots.txt does not list the sitemap");
if (/User-agent:\s*\*\s*\n\s*Disallow:\s*\/\s*$/im.test(rb.text)) problems.push("robots.txt blocks the whole site for all crawlers");
// Check each robots group on its own so a rule for one bot is never blamed on another.
const groups = rb.text.split(/\n\s*\n/);
for (const bot of ["OAI-SearchBot", "PerplexityBot", "Claude-SearchBot", "Googlebot", "Bingbot"]) {
  const blocked = groups.some((g) => new RegExp(`User-agent:\\s*${bot}\\b`, "i").test(g) && /^Disallow:\s*\/\s*$/im.test(g));
  if (blocked) problems.push(`robots.txt blocks ${bot} (search / AI answer visibility)`);
}

// 4) eBay licence guard: no price statistics may leak while SHOW_EBAY_PRICES is off.
const sat = await fetchTimed(base + "/api/tools/saturation?q=heated%20blanket");
if (sat.status === 200) {
  try {
    const j = JSON.parse(sat.text);
    if (j.ebay && (j.ebay.avgPrice !== null || j.ebay.medianPrice !== null)) {
      warnings.push("Saturation API is returning eBay prices - only OK if eBay has given written permission (SHOW_EBAY_PRICES=true)");
    } else ok.push("Saturation API answers, no eBay prices shown");
  } catch { problems.push("Saturation API returned invalid JSON"); }
} else if (sat.status === 503) warnings.push("Saturation API: eBay temporarily unavailable (503)");
else if (sat.status !== 429) problems.push(`Saturation API returned ${sat.status || "no response"}`);

// 5) Content freshness: the dashboard data should be updated daily.
const dash = await fetchTimed(base + "/dashboard");
const iso = [...dash.text.matchAll(/20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/g)].map((m) => Date.parse(m[0] + "Z")).filter((x) => x && x <= Date.now() + 36e5);
if (!iso.length) warnings.push("Could not find any data timestamps on the dashboard to check freshness");
else {
  const newest = Math.max(...iso);
  const hours = Math.round((Date.now() - newest) / 36e5);
  if (hours > 48) warnings.push(`Dashboard data looks ${hours} hours old - check the "Update Product Data" job`);
  else ok.push(`Dashboard data age ~${hours} h`);
}

// 6) Full SEO/GEO check (titles, descriptions, canonicals, schema, llms.txt) - reuses the existing script.
const seo = spawnSync(process.execPath, [fileURLToPath(new URL("./seo-check.mjs", import.meta.url)), base], { encoding: "utf8", timeout: 240000 });
const seoOut = (seo.stdout || "") + (seo.stderr || "");
if (seo.status !== 0) problems.push("SEO/GEO check found errors (see details below)");
else ok.push("SEO/GEO check passed");

// 7) TLS certificate should not be close to expiry.
try {
  const tls = await import("node:tls");
  const host = new URL(base).hostname;
  const days = await new Promise((resolve, reject) => {
    const s = tls.connect(443, host, { servername: host }, () => {
      const c = s.getPeerCertificate(); s.end();
      resolve(Math.round((Date.parse(c.valid_to) - Date.now()) / 864e5));
    });
    s.on("error", reject); s.setTimeout(15000, () => { s.destroy(); reject(new Error("timeout")); });
  });
  if (!Number.isFinite(days)) warnings.push("Could not read the HTTPS certificate expiry date");
  else if (days < 14) problems.push(`HTTPS certificate expires in ${days} days`);
  else ok.push(`HTTPS certificate valid for ${days} more days`);
} catch (e) {
  if (String(e.code || "").startsWith("CERT_") || /certificate/i.test(e.message)) problems.push(`HTTPS certificate problem: ${e.message}`);
  else warnings.push(`Could not check HTTPS certificate: ${e.message}`);
}

// Neutralise text that could break the Markdown code block or ping GitHub users.
const safe = (x) => String(x).replace(/`{3}/g, "ʼʼʼ").replace(/@/g, "@\u200b");
const date = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
const report = [
  `# Daily Sentinel report - ${date}`,
  "",
  problems.length ? `## ❌ Problems (${problems.length})\n${problems.map((p) => `- ${safe(p)}`).join("\n")}` : "## ✅ No problems found",
  warnings.length ? `\n## ⚠️ Warnings (${warnings.length})\n${warnings.map((w) => `- ${safe(w)}`).join("\n")}` : "",
  `\n## Passed checks\n${ok.map((o) => `- ${o}`).join("\n")}`,
  `\n<details><summary>SEO/GEO check output</summary>\n\n\`\`\`\n${safe(seoOut.slice(-6000))}\n\`\`\`\n</details>`,
].join("\n");
writeFileSync("sentinel-report.md", report);
console.log(report);
process.exit(problems.length ? 1 : 0);
