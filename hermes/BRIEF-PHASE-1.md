# Phase 1 brief – technical SEO & GEO foundation

> Türkçe özet: 1. aşama değişiklikleri `seo/faz-1` dalında. Hermes bunları PUBLISH-GATE.md'deki
> kurallara göre önizlemede inceleyecek; onaydan sonra canlıya alınacak.

Branch: `seo/faz-1` · Prepared: 2026-11-15 · Status: **waiting for Hermes review**

## What changed
| Area | Change | Files |
|---|---|---|
| Structured data | Organization (with official `sameAs` profiles) + WebSite schema on home page; SoftwareApplication now linked to the Organization | `app/lib/site.ts`, `app/page.tsx` |
| Structured data | BlogPosting + BreadcrumbList on every blog post; Blog schema on `/blog` | `app/blog/[slug]/page.tsx`, `app/blog/page.tsx` |
| Structured data | Contact page reuses the same Organization entity (`@id`) | `app/contact/page.tsx` |
| Security | All JSON-LD output escapes `<` so future auto-generated content cannot break out of the script tag | `app/lib/site.ts` (`jsonLd()`) |
| Canonicals | Added to `/blog`, every post, `/dashboard`, `/compare`, `/tools/profit-calculator`, `/contact`, `/privacy`, `/terms` (only home had one) | page files |
| Blog SEO | Post pages get og:url, published/modified time, section; brand suffix dropped from titles that would exceed 65 chars | `app/blog/[slug]/page.tsx` |
| GEO | New `/llms.txt`, generated automatically from site data and blog posts | `app/llms.txt/route.ts` |
| Navigation | "Blog" link added to the home page footer | `app/page.tsx` |
| Trust | Footer no longer shows Facebook/Pinterest icons that pointed back to our own home page | `app/page.tsx` |
| Crawling | `robots.txt` now also disallows `/api/` | `app/robots.ts` |
| Gate | Automated checker + GitHub Action running it on every Vercel deployment | `.github/scripts/seo-check.mjs`, `.github/workflows/seo-check.yml` |

## Already verified (before handing to Hermes)
- `next build` succeeds; ESLint and TypeScript clean on all changed files.
- `seo-check.mjs` against a local production build: **0 ERRORS**.
- All JSON-LD blocks parse; canonicals resolve to `https://ukviralradar.com/...`.

## Open warnings for the review team (existing content, not caused by this change)
1. `/dashboard` has no `<h1>` → reviewer A: add a visually appropriate H1 (e.g. "Live UK product rankings").
2. Two posts use random placeholder images (picsum.photos):
   `how-to-find-profitable-products-to-sell-online`, `how-to-spot-viral-best-selling-products-uk` → reviewer D.
3. Meta descriptions over 160 chars: `autumn-winter-uk-dropshipping-2026` (163), `how-to-spot-viral-best-selling-products-uk` (173) → reviewer C: tighten excerpts.
4. Title over 65 chars: `autumn-winter-uk-dropshipping-2026` → reviewer C: consider a shorter headline (keep the slug).
5. No new blog post since 6 Oct 2026 → feeds into Phase 2 (data-driven weekly posts).

## Owner actions (need Şükrü Bey's Google login – cannot be automated safely)
- Google Search Console → property `ukviralradar.com` (already verified via meta tag) →
  Sitemaps → submit `https://ukviralradar.com/sitemap.xml`; then URL Inspection → request
  indexing for `/`, `/blog` and `/llms.txt`.
- Bing Webmaster Tools → "Import from Google Search Console" (one click, covers Bing + Copilot + ChatGPT search).
- Vercel → Settings → Deployment Protection → "Protection Bypass for Automation" → copy the secret →
  GitHub repo → Settings → Secrets → Actions → `VERCEL_AUTOMATION_BYPASS_SECRET`
  (lets the SEO Action and Hermes read password-protected preview URLs).
