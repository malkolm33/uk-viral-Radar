// UK Viral Radar content robot.
// 1) reads live product data  2) writer drafts an article from those facts only
// 3) automated checks  4) 4 specialist agents review independently
// 5) revise until all approve (max N rounds)  6) add the post to blog-posts.ts
// Publishing itself (pull request for approval, or direct in auto mode) is
// done by .github/workflows/content-robot.yml.
//
// Usage: node .github/scripts/content-robot/run.mjs --type weekly|category
import { readFileSync, writeFileSync, mkdirSync, appendFileSync } from "node:fs";
import { loadProducts, buildFacts } from "./data.mjs";
import { autoCheck } from "./checks.mjs";
import { writeArticle, REVIEWERS, review } from "./agents.mjs";
import { readBlogFile, existingSlugs, postDates, appendPost, writeBlogFile, chartFromFacts } from "./blog-file.mjs";

const config = JSON.parse(readFileSync(new URL("./config.json", import.meta.url), "utf8"));
const type = process.argv.includes("--type") ? process.argv[process.argv.indexOf("--type") + 1] : "weekly";
if (!["weekly", "category"].includes(type)) throw new Error(`Unknown --type "${type}" (use weekly or category).`);
const today = process.env.CONTENT_ROBOT_TODAY || new Date().toISOString().slice(0, 10);
const reportPath = "robot-report.md";

function output(name, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

function finish(report, published, extra = {}) {
  writeFileSync(reportPath, report, "utf8");
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
  output("published", published ? "true" : "false");
  for (const [k, v] of Object.entries(extra)) output(k, v);
  console.log(report);
}

async function main() {
  const source = readBlogFile();

  // Rate limit: never more than maxPostsPerWeek posts in any 7-day window.
  const weekAgo = new Date(Date.parse(today) - 6 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const recent = postDates(source).filter((d) => d >= weekAgo && d <= today).length;
  if (recent >= config.maxPostsPerWeek) {
    return finish(`# İçerik robotu\n\nBu hafta zaten ${recent} yazı yayınlandı (sınır: ${config.maxPostsPerWeek}). Yeni yazı yazılmadı.\n`, false);
  }

  const products = await loadProducts();
  let category = null;
  if (type === "category") {
    // Only categories with enough tracked products for a real deep-dive.
    const counts = {};
    for (const p of products) if (p.category && typeof p.viral_score === "number") counts[p.category] = (counts[p.category] || 0) + 1;
    const cats = Object.keys(counts).filter((c) => counts[c] >= 4).sort();
    if (!cats.length) {
      return finish("# İçerik robotu\n\nHiçbir kategoride en az 4 ürün yok, kategori yazısı yazılmadı.\n", false);
    }
    category = cats[new Date(today).getUTCMonth() % cats.length]; // rotates monthly
  }
  const facts = buildFacts(products, { type, category, topN: config.topProducts, today });
  const slugs = existingSlugs(source);

  // Weak data guard: a "what's rising" article needs something to be rising.
  const rising = facts.products.filter((p) => p.risingSignal);
  if (rising.length < config.minRisingProducts) {
    return finish(
      `# İçerik robotu: yazı YAYINLANMADI (veri yetersiz)\n\nBu dönem sadece ${rising.length} üründe yükseliş sinyali var (en az ${config.minRisingProducts} gerekiyor). Zayıf veriyle "yükselen ürünler" yazısı yazmak yanıltıcı olur, bu yüzden yazı yazılmadı. Site değişmedi.\n\nÖneri: admin panelinden takip edilen ürün sayısını artırın veya ürün listesini güncelleyin.\n`,
      false
    );
  }

  let article = null;
  let previous = null;
  let reviews = [];
  const log = [];

  for (let round = 1; round <= config.maxRevisionRounds; round += 1) {
    article = await writeArticle({ model: config.model, facts, previous });
    const autoProblems = autoCheck(article, facts, slugs);
    if (autoProblems.length) {
      log.push(`Tur ${round}: otomatik kontroller ${autoProblems.length} sorun buldu, yazı düzeltmeye gönderildi.`);
      previous = { article, problems: autoProblems };
      reviews = [];
      continue;
    }
    reviews = await Promise.all(
      REVIEWERS.map((reviewer) => review({ model: config.model, reviewer, article, facts, autoProblems }))
    );
    const rejected = reviews.filter((r) => !r.approved);
    if (rejected.length === 0) {
      log.push(`Tur ${round}: otomatik kontroller geçti, 4 uzmanın 4'ü de onayladı.`);
      break;
    }
    log.push(`Tur ${round}: ${rejected.map((r) => r.name).join(", ")} itiraz etti, yazı düzeltmeye gönderildi.`);
    previous = { article, problems: rejected.flatMap((r) => r.blockers.map((b) => `[${r.name}] ${b}`)) };
    reviews = [];
  }

  let approved = reviews.length === REVIEWERS.length && reviews.every((r) => r.approved);

  // Polish round: apply the agents' minor suggestions, then require all 4
  // approvals again. If the polished draft fails anything, keep the approved one.
  const pending = approved ? reviews.flatMap((r) => r.suggestions.map((s) => `[${r.name}] ${s}`)) : [];
  if (pending.length) {
    try {
      const polished = await writeArticle({ model: config.model, facts, previous: { article, problems: pending, polish: true } });
      polished.slug = article.slug;
      const polishProblems = autoCheck(polished, facts, slugs);
      if (!polishProblems.length) {
        const polishReviews = await Promise.all(
          REVIEWERS.map((reviewer) => review({ model: config.model, reviewer, article: polished, facts, autoProblems: [] }))
        );
        if (polishReviews.every((r) => r.approved)) {
          article = polished;
          reviews = polishReviews;
          log.push(`Son düzeltme turu: uzmanların ${pending.length} küçük önerisi uygulandı, 4 uzman yeniden onayladı.`);
        } else {
          log.push("Son düzeltme turu onay alamadı, onaylanmış önceki hali kullanıldı.");
        }
      } else {
        log.push("Son düzeltme turu otomatik kontrollerden geçemedi, onaylanmış önceki hali kullanıldı.");
      }
    } catch (err) {
      log.push(`Son düzeltme turu yapılamadı (${err.message.slice(0, 60)}), onaylanmış önceki hali kullanıldı.`);
    }
  }
  approved = reviews.length === REVIEWERS.length && reviews.every((r) => r.approved);
  const reviewLines = reviews
    .map((r) => `| ${r.name} | ${r.approved ? "Onayladı" : "İtiraz etti"} | ${r.summary.replace(/\|/g, "/")} |`)
    .join("\n");

  if (!approved) {
    const lastProblems = previous ? previous.problems.map((p) => `- ${p}`).join("\n") : "";
    return finish(
      `# İçerik robotu: yazı YAYINLANMADI\n\n${config.maxRevisionRounds} turda 4 uzmanın hepsinin onayı alınamadı. Site değişmedi.\n\n## Süreç\n${log.map((l) => `- ${l}`).join("\n")}\n\n## Son tur sorunları\n${lastProblems}\n`,
      false
    );
  }

  // Keep a dated copy of the data the article was written from (audit trail,
  // and the basis for week-over-week comparisons later).
  mkdirSync("data/robot-snapshots", { recursive: true });
  writeFileSync(`data/robot-snapshots/${today}-${type}.json`, JSON.stringify(facts, null, 2) + "\n");
  writeBlogFile(appendPost(source, article, today, chartFromFacts(facts)));

  const url = `${config.siteUrl}/blog/${article.slug}`;
  const suggestions = reviews.flatMap((r) => r.suggestions.map((s) => `- [${r.name}] ${s}`)).join("\n") || "- Yok";
  finish(
    `# İçerik robotu: yeni yazı hazır\n\n**${article.title}**\n\n${article.excerpt}\n\nAdres (yayından sonra): ${url}\n\n## 4 uzmanın kararı\n| Uzman | Karar | Not |\n|---|---|---|\n${reviewLines}\n\n## Süreç\n${log.map((l) => `- ${l}`).join("\n")}\n\n## Küçük öneriler (engel değil)\n${suggestions}\n`,
    true,
    { slug: article.slug, title: article.title.replace(/[\r\n]/g, " ") }
  );
}

main().catch((err) => {
  finish(`# İçerik robotu: HATA\n\nYazı yayınlanmadı, site değişmedi.\n\nHata: ${err.message}\n`, false, { error: "true" });
  process.exitCode = 1;
});
