@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem SEO 1. asama degisikliklerini seo/faz-1 dalina gonderir.
rem CANLI SITE DEGISMEZ - Vercel sadece bir ONIZLEME adresi olusturur, Hermes onu inceler.
echo.
echo  [1/4] GitHub ile karsilastiriliyor...
git fetch origin || goto hata
git merge-base --is-ancestor main origin/main
if errorlevel 1 (
  echo  DURDU: bilgisayardaki main GitHub'da olmayan degisiklik iceriyor. Hicbir sey degismedi. Claude'a bu ekrani gosterin.
  pause & exit /b 1
)
git merge --ff-only origin/main || goto hata
echo  [2/4] seo/faz-1 dali olusturuluyor...
git checkout -B seo/faz-1 || goto hata
echo  [3/4] Degisiklikler kaydediliyor...
git add app/lib/site.ts app/llms.txt/route.ts app/page.tsx app/blog/page.tsx "app/blog/[slug]/page.tsx" app/compare/page.tsx app/contact/page.tsx app/dashboard/page.tsx app/privacy/page.tsx app/terms/page.tsx app/tools/profit-calculator/page.tsx app/robots.ts .github/scripts/seo-check.mjs .github/workflows/seo-check.yml hermes/PUBLISH-GATE.md hermes/BRIEF-PHASE-1.md YAYINLA_SEO_FAZ1_ONIZLEME.bat YAYINLA_SEO_FAZ1_CANLI.bat || goto hata
git commit -m "SEO faz 1: Organization/WebSite/BlogPosting/Breadcrumb schema, canonical'lar, llms.txt, footer blog linki, SEO kontrol scripti ve Hermes yayin kapisi" || goto hata
echo  [4/4] GitHub'a gonderiliyor (sadece onizleme dali)...
git push -u origin seo/faz-1 || goto hata
git checkout main || goto hata
echo.
echo  TAMAM - seo/faz-1 dali gonderildi. Canli site DEGISMEDI.
echo  Vercel 1-2 dakikada onizleme adresini olusturur (Vercel panelinde Deployments altinda).
echo  Simdi Hermes'e su mesaji verin:
echo    "hermes/PUBLISH-GATE.md kurallarina gore seo/faz-1 dalini incele, brief: hermes/BRIEF-PHASE-1.md"
pause
exit /b 0
:hata
echo.
echo  HATA - yukaridaki mesaji Claude'a gosterin. Canli site degismedi.
pause
exit /b 1
