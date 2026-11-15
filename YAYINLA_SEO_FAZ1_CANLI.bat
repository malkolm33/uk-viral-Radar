@echo off
chcp 65001 >nul
cd /d "%~dp0"
rem seo/faz-1 dalini CANLI siteye alir. SADECE Hermes "APPROVED" raporu verdikten sonra calistirin.
echo.
echo  Bu islem seo/faz-1 dalini CANLI siteye (main) alir.
echo  Hermes'in yayin kapisi raporunda "VERDICT: APPROVED" yaziyor mu?
set /p ONAY= Yaziyorsa ONAY yazip Enter'a basin (baska her sey iptal eder): 
if /i not "%ONAY%"=="ONAY" (
  echo  Iptal edildi. Hicbir sey degismedi.
  pause & exit /b 1
)
echo  [1/3] GitHub'dan son hal aliniyor (Hermes'in duzeltmeleri dahil)...
git fetch origin || goto hata
git checkout main || goto hata
git merge --ff-only origin/main || goto hata
echo  [2/3] seo/faz-1 main'e aliniyor...
git merge --no-ff origin/seo/faz-1 -m "Merge seo/faz-1 (Hermes yayin kapisi onayli)" || goto hata
echo  [3/3] GitHub'a gonderiliyor (Vercel 1-2 dakikada canliya alir)...
git push origin main || goto hata
echo.
echo  TAMAM - canliya gonderildi. 2-3 dakika sonra Hermes'e canli kontrolu yaptirin:
echo    node .github/scripts/seo-check.mjs https://ukviralradar.com
git log --oneline -1
pause
exit /b 0
:hata
echo.
echo  HATA - yukaridaki mesaji Claude'a gosterin. Push olmadiysa canli site degismedi.
pause
exit /b 1
