# UK Viral Radar – Publish Gate (Hermes)

> Türkçe özet: Siteye giden HER değişiklik (kod, SEO, blog yazısı, görsel) önce ayrı bir dalda
> (branch) hazırlanır, Vercel önizlemesinde Hermes ve uzman ajanları tarafından incelenir. Tüm
> ERROR'lar giderilip Hermes "APPROVED" demeden ve Şükrü Bey son onayı vermeden `main`'e
> (canlı siteye) hiçbir şey gönderilmez.

This file is the operating rulebook for Hermes Agent when it manages ukviralradar.com.
Hermes coordinates; the specialist reviewers below each sign off on their area.

## 1. Workflow (every change, no exceptions)

1. **Prepare** – the change is made on a branch named `seo/...`, `blog/...`, `fix/...` or `feat/...`.
   Nothing is ever committed straight to `main`.
2. **Preview** – pushing the branch makes Vercel build a preview URL. The GitHub Action
   "SEO/GEO Check" runs automatically against that preview.
3. **Review** – Hermes runs every specialist review in section 2 against the preview URL
   and the diff (`git diff main...<branch>`).
4. **Fix loop** – every ERROR is fixed on the same branch, the preview rebuilds, and the
   reviews run again. Repeat until there are zero ERRORs and every WARNING is either fixed
   or has a written reason to keep it.
5. **Approve** – Hermes writes the approval report (section 4).
6. **Owner sign-off** – Şükrü Bey reads the short report and gives the final OK.
7. **Publish** – only then is the branch merged into `main` (Vercel deploys to production).
8. **Verify live** – run `node .github/scripts/seo-check.mjs https://ukviralradar.com`
   after the production deploy. If anything regressed, revert first, investigate second.

## 2. Specialist reviewers and what each must check

### A. Technical SEO
- `node .github/scripts/seo-check.mjs <preview-url>` → must print `RESULT: PASS`.
- Every indexable page: one `<h1>`, unique title (≤ 65 chars), meta description (50–160 chars),
  absolute canonical, Open Graph tags, no accidental `noindex`.
- New pages are in `/sitemap.xml`; `/robots.txt` does not block them.
- Structured data validates (Google Rich Results Test + validator.schema.org) with no errors.
- No broken internal links; no new 404/500s.

### B. GEO – AI answer engines (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews)
- `/llms.txt` lists every new public page / blog post with an accurate one-line summary.
- Each article opens with a 2–3 sentence direct answer, then specifics (numbers, dates, sources).
- Facts are stated plainly and are quotable on their own; FAQ sections use real questions people ask.
- Entity consistency: brand name, prices (£9.99/month Pro, free top 3), data sources and the
  official social profiles match `app/lib/site.ts` everywhere.

### C. Content editor & fact-checker
- British English spelling and UK context (GBP, UK marketplaces, UK seasons).
- Every number or claim is traceable to UK Viral Radar's own data (Supabase Viral Scores) or a
  named, linked public source. No invented statistics, testimonials, reviews or quotes.
- Genuinely useful to a UK seller; not thin, generic or a rewrite of other sites.
  (Google penalises scaled low-value AI content – quality over quantity.)
- Title, excerpt and headings match what the article actually delivers.

### D. Images & media
- Images are relevant to the article (no random placeholders such as picsum.photos).
- Licence is clear: our own charts/graphics, our own photos, or properly licensed stock.
  Never reuse eBay/Etsy seller photos or any copyrighted brand imagery in blog posts.
- Every image has descriptive alt text; featured images are 1200×630 for social sharing.

### E. Legal & compliance (UK)
- Advertising claims meet the ASA/CAP Code: no guaranteed earnings or "make £X a week" promises.
- Competitor comparisons are fair, dated and verifiable.
- No personal data of any customer or other person appears anywhere (UK GDPR).
- Affiliate or sponsored links are clearly labelled.

### F. Performance, accessibility & security
- Lighthouse on the preview (mobile): Performance, SEO, Accessibility, Best Practices ≥ 90,
  or no drop versus production.
- Icon-only buttons have `aria-label`; form inputs have real `<label>`s.
- No secrets, keys or `.env` values in the diff; no new public API routes without auth/rate limits.
- `npm run build` and `npm run lint` pass.

## 3. Severity rules
- **ERROR** (blocks publishing): failed build, failed SEO check, invalid structured data, factual
  error, invented data, licensing doubt, legal/compliance risk, personal data, security issue,
  broken page or link.
- **WARNING** (fix or justify in writing): length limits, missing nice-to-have schema, minor
  wording or style, small performance drops.

## 4. Approval report format (Hermes writes this before asking for sign-off)

```
PUBLISH GATE REPORT – <branch> – <date>
Preview URL: <url>
A Technical SEO ......... PASS / FAIL  (notes)
B GEO ................... PASS / FAIL
C Content & facts ....... PASS / FAIL / N/A
D Images ................ PASS / FAIL / N/A
E Legal & compliance .... PASS / FAIL
F Perf / a11y / security  PASS / FAIL
Fixed during review: <list>
Open warnings kept (with reason): <list>
VERDICT: APPROVED / CHANGES REQUIRED
```

## 5. Hard rules
- Never push or merge to `main` without an APPROVED report **and** the owner's OK.
- Never weaken or skip a check to make it pass.
- Never publish customer, client or personal details.
- When unsure about a fact, licence or legal point, treat it as an ERROR and ask.
