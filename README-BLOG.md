# Blog Yazıları - Zamanlanmış Yayın Sistemi

Bu sistem, blog yazılarını önceden hazırlayıp belirli bir tarihte otomatik olarak
yayınlamanı sağlar. Her şey `app/lib/blog-posts.ts` dosyasında yönetiliyor.

## Bir yazının 3 durumu (status)

- `"draft"` — Sadece bu dosyada durur, sitede hiçbir yerde görünmez.
- `"scheduled"` — `publishDate` tarihine kadar sitede görünmez. O tarih gelip
  geçtiği an (en geç ~1 saat içinde, aşağıya bak) otomatik olarak görünür olur.
- `"published"` — Her zaman görünür.

## Yeni bir yazıyı önceden hazırlamak (zamanlanmış yayın)

1. `app/lib/blog-posts.ts` dosyasını aç.
2. `blogPosts` dizisinin (array) başına veya sonuna, aşağıdaki formatta yeni bir
   obje ekle:

   ```ts
   {
     title: "Yazının Başlığı",
     slug: "yazinin-basligi-url-uyumlu",
     excerpt: "Blog listesinde görünecek kısa özet cümlesi.",
     content: `İlk paragraf metni.

   ## İstersen Alt Başlık (opsiyonel)

   İkinci paragraf metni.`,
     date: "2026-10-01",
     category: "Trends",
     status: "scheduled",
     publishDate: "2026-10-01",
   },
   ```

3. `status` alanını `"scheduled"` yap.
4. `publishDate` alanına, yazının otomatik yayınlanmasını istediğin tarihi
   `YYYY-AA-GG` formatında yaz (örn. `"2026-10-01"`).
5. `date` alanını da genelde `publishDate` ile aynı tarihe eşitle - bu, yazı
   sayfasında okuyucuya gösterilen tarih.
6. Dosyayı kaydet, her zamanki gibi git commit + push yap.

Bu kadar. O tarih geldiğinde ekstra bir işlem yapmana gerek yok - sistem
kendiliğinden devreye girer (aşağıda nasıl olduğu anlatılıyor).

## Arka planda nasıl çalışıyor?

İki ayrı güvenlik katmanı var, biri diğerini tamamlıyor:

1. **Site tarafında otomatik kontrol**: Blog sayfaları en geç saatte bir
   kendini tazeliyor (yeniden kontrol ediyor). `scheduled` bir yazının
   `publishDate`'i bugüne gelmiş/geçmişse, siteye deploy yapmana gerek
   kalmadan otomatik görünür olur.
2. **Günlük GitHub Actions ile temizlik**: Her gün UK saatiyle sabah 08:00
   civarında (`.github/workflows/publish-scheduled-posts.yml`) otomatik
   çalışan bir işlem, zamanı gelmiş `scheduled` yazıların `status`'unu kalıcı
   olarak `"published"` yapıp GitHub'a otomatik commit + push atıyor. Bu da
   Vercel'de otomatik yeni bir deploy tetikliyor. Böylece dosyadaki durum da
   gerçeği yansıtmış oluyor, sadece "görünüyor ama etiketi hâlâ scheduled"
   diye kalmıyor.

Yani pratikte: yazıyı `scheduled` olarak ekleyip tarihini belirledikten sonra
hiçbir şey yapmana gerek yok.

## Bir yazıyı yayından kaldırmak / gizlemek istersen

`status` alanını `"draft"` yap. Yazı hemen sitede görünmez olur (bir sonraki
deploy'da).

## Sistemi elle test etmek istersen

GitHub reposunda **Actions** sekmesine git, soldan **"Publish Scheduled Blog
Posts"** workflow'unu seç, sağ üstten **"Run workflow"** butonuna bas. Bu,
zamanlanmış saati beklemeden işlemi hemen bir kez çalıştırır - zamanı gelmiş
yazı varsa `status`'unu günceller ve commit atar, yoksa "hiçbir şey yapılmadı"
şeklinde loglar ve dosyada değişiklik yapmaz.

## Önemli: format tutarlılığı

Otomatik yayın script'i (`.github/scripts/publish-scheduled-posts.mjs`), her
yazıda `status:` satırının hemen ardından `publishDate:` satırının gelmesini
bekliyor - yukarıdaki örnekteki gibi. Yeni yazı eklerken bu sırayı bozmadığın
sürece (yani örnekteki formatı kopyala-yapıştır ile kullandığın sürece) her
şey sorunsuz çalışır.
