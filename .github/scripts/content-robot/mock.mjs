// Test double for the Claude API (CONTENT_ROBOT_MOCK=1). Builds an article
// from the real fact sheet in the prompt so the automated checks can pass,
// and lets tests force a rejection to exercise the revision loop.
let reviewRound = 0;

function factsFrom(prompt) {
  const start = prompt.indexOf("{");
  let depth = 0;
  for (let i = start; i < prompt.length; i += 1) {
    if (prompt[i] === "{") depth += 1;
    if (prompt[i] === "}") depth -= 1;
    if (depth === 0) return JSON.parse(prompt.slice(start, i + 1));
  }
  throw new Error("mock: no facts in prompt");
}

export function mockAnswer(role, prompt) {
  if (role === "writer") {
    const f = factsFrom(prompt);
    const p = f.products;
    const para = (x) =>
      `${x.name} sits at number ${x.rank} with a Viral Score of ${x.viralScore}. UK search interest moved ${x.searchGrowth7dPercent} percent over the last 7 days, while eBay UK shows ${x.ebayUkListings} listings from ${x.ebayUniqueSellers} sellers at an average of £${x.ebayUkAvgPriceGBP}. ` +
      "That combination tells a seller how much demand is building compared with how crowded the marketplace already is, which matters more than the score on its own. A rising score with few sellers is an early signal worth testing in small quantities, while a high score with many sellers usually means the easy window has already closed.";
    const filler =
      "The useful way to read these signals is as a shortlist for research rather than a buying list. Check supplier lead times, look at the listing photos competitors use, and work out your landed cost before committing to stock. Trends move quickly in the UK market, so a product that is climbing this week can level off within a fortnight, and a small first order protects you if interest fades.";
    const content = [
      `UK shoppers are showing rising interest in ${p[0].name}, ${p[1].name} and ${p[2].name} this week, according to UK Viral Radar's daily Viral Scores. The scores combine UK search growth, Wikipedia interest, YouTube coverage and marketplace competition, so they flag demand before it becomes obvious.`,
      "## The top movers this week",
      ...p.slice(0, 5).map(para),
      "## Demand versus competition",
      filler,
      "## How to use this list",
      filler.replace("The useful way", "A practical way"),
      `UK Viral Radar tracks ${f.trackedProducts} products every day. The top 3 are free to view, and the full ranked list is available on the Pro plan.`,
    ].join("\n\n");
    return JSON.stringify({
      title: `UK Trending Products This Week (${f.date})`,
      slug: `uk-trending-products-week-${f.date}`,
      excerpt: `The fastest-rising products in the UK this week, ranked by Viral Score, with demand and competition data for each.`,
      category: "Trends",
      content,
    });
  }
  if (role.startsWith("review:")) {
    if (process.env.CONTENT_ROBOT_MOCK_BAD_REVIEW === "1" && role === "review:technical") return '{"verdict":"APPROVE","suggestions":["cut off';
    if (role === "review:editor") reviewRound += 1;
    const reject = process.env.CONTENT_ROBOT_MOCK_REJECT_FIRST === "1" && role === "review:editor" && reviewRound === 1;
    return JSON.stringify(
      reject
        ? { verdict: "REJECT", blockers: ["Test: tighten the opening paragraph."], suggestions: [], summary_tr: "Test reddi." }
        : { verdict: "APPROVE", blockers: [], suggestions: [], summary_tr: `${role} onayladı (test).` }
    );
  }
  throw new Error("mock: unknown role " + role);
}
