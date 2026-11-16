// Automated, non-AI checks. They run BEFORE the 4 agents see an article:
// if any of these fail the article is sent back for revision.
const BANNED = [
  /guarantee/i, /get rich/i, /passive income/i, /risk[- ]free/i,
  /\b(make|earn)\s+£\s?\d/i, /\bovernight success/i, /\bsure[- ]fire\b/i,
  /sell the trend/i, /\bzik\b/i, /jungle scout/i, /\bminea\b/i,
];

function numbersIn(text) {
  return (text.match(/\d[\d,]*(?:\.\d+)?/g) || []).map((n) => Number(n.replace(/,/g, "")));
}

// Every number the article may legitimately contain: the facts (and their
// rounded / absolute forms), list positions, years and fixed site facts.
function allowedNumbers(facts) {
  const allowed = new Set();
  const add = (v) => {
    if (typeof v !== "number" || !Number.isFinite(v)) return;
    for (const x of [v, Math.abs(v)]) {
      allowed.add(x);
      allowed.add(Math.round(x));
      allowed.add(Math.round(x * 10) / 10);
      allowed.add(Math.round(x * 100) / 100);
    }
  };
  const walk = (o) => {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === "object") Object.values(o).forEach(walk);
    else add(o);
  };
  walk(facts);
  for (let i = 0; i <= 20; i += 1) allowed.add(i);
  for (let y = 2024; y <= 2030; y += 1) allowed.add(y);
  [7, 24, 30, 100, 9.99, 15, 2000, 20000].forEach((n) => allowed.add(n));
  const d = new Date(facts.date);
  allowed.add(d.getUTCDate());
  return allowed;
}

export function autoCheck(article, facts, existingSlugs) {
  const problems = [];
  const need = ["title", "slug", "excerpt", "content", "category"];
  for (const k of need) if (!article[k] || typeof article[k] !== "string") problems.push(`Missing field "${k}".`);
  if (problems.length) return problems;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || article.slug.length > 80)
    problems.push("Slug must be lowercase words joined by hyphens, max 80 characters.");
  if (existingSlugs.includes(article.slug)) problems.push(`Slug "${article.slug}" already exists - choose a new one.`);
  if (article.title.length > 65) problems.push(`Title is ${article.title.length} characters - max 65.`);
  if (article.excerpt.length < 70 || article.excerpt.length > 155)
    problems.push(`Excerpt is ${article.excerpt.length} characters - must be 70-155.`);

  const words = article.content.trim().split(/\s+/).length;
  if (words < 500 || words > 1400) problems.push(`Article is ${words} words - must be 500-1400.`);

  const blocks = article.content.split(/\n\n+/);
  if (!blocks.some((b) => b.startsWith("## "))) problems.push("Use at least two '## ' subheadings.");
  for (const b of blocks) {
    if (/^#(?!# )/.test(b) || /^###/.test(b)) problems.push("Only '## ' subheadings are allowed (no #, ###).");
    if (/^\s*([-*•]|\d+\.)\s/m.test(b)) problems.push("No bullet or numbered lists - the blog renders plain paragraphs only.");
    if (/\*\*|__|`|\]\(|<\/?[a-z]/i.test(b)) problems.push("No markdown bold, links, code or HTML - plain text only.");
  }

  const all = `${article.title}\n${article.excerpt}\n${article.content}`;
  for (const re of BANNED) if (re.test(all)) problems.push(`Banned wording found (${re}).`);

  const allowed = allowedNumbers(facts);
  const unknown = [...new Set(numbersIn(all).filter((n) => !allowed.has(n)))];
  if (unknown.length)
    problems.push(`These numbers are not in the fact sheet (possible invented data): ${unknown.join(", ")}. Use only numbers from the facts.`);

  // eBay price statistics need eBay's written permission (API licence s.8.1(d)).
  // Until SHOW_EBAY_PRICES=true, no £ amounts may appear except the Pro plan price.
  if (process.env.SHOW_EBAY_PRICES !== "true") {
    const pounds = (all.match(/£\s?\d[\d,]*(?:\.\d+)?/g) || []).filter((m) => !/^£\s?9\.99$/.test(m));
    if (pounds.length) problems.push(`Price figures are not allowed in posts right now (found: ${[...new Set(pounds)].join(", ")}). Remove all £ amounts.`);
  }

  const names = facts.products.map((p) => p.name.toLowerCase());
  const mentioned = names.filter((n) => all.toLowerCase().includes(n)).length;
  if (mentioned < Math.min(3, names.length)) problems.push("Mention at least 3 tracked products by their exact name.");

  return [...new Set(problems)];
}
