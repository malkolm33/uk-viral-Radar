# SEO 1. aşama – inceleme raporu

Dal: `seo/faz-1` · İnceleme: Claude, 16 Kasım 2026 · Kurallar: `KURALLAR.md`

## SONUÇ: YAYINA HAZIR

Engel: 0 · Uyarı: 0 (otomatik SEO kontrolü, yerel üretim derlemesinde)

## 6 kontrolün sonucu

| Kontrol | Sonuç | Not |
|---|---|---|
| 1. Teknik SEO | Geçti | Tüm sayfalarda canonical, tek H1, doğru başlık/açıklama uzunluğu, hatasız schema |
| 2. Yapay zekâ aramaları (GEO) | Geçti | `/llms.txt` 6 yazının hepsini listeliyor; fiyat ve kaynak bilgileri her yerde aynı |
| 3. İçerik ve doğruluk | Geçti (düzeltildi) | eBay ücretleri güncellendi, kaynaksız bir istatistik kaldırıldı |
| 4. Görseller | Geçti (düzeltildi) | 2 rastgele görsel yerine siteye özel kapak görseli |
| 5. UK hukuku | Geçti | Kazanç vaadi yok, kişisel veri yok |
| 6. Performans / güvenlik | Geçti | Derleme başarılı; kodda şifre/anahtar yok; schema çıktısı güvenli hale getirildi |

## Bu dalda yapılanlar

**İlk hazırlık**
- Ana sayfaya Organization ve WebSite schema'sı (resmi sosyal hesaplar dahil).
- Her blog yazısına BlogPosting ve Breadcrumb, blog sayfasına Blog schema'sı.
- Canonical adresleri: blog, tüm yazılar, dashboard, compare, profit calculator, contact, privacy, terms.
- `/llms.txt` (yapay zekâ arama motorları için site özeti, kendiliğinden güncellenir).
- Ana sayfa alt kısmına Blog linki; kendi sitemize giden Facebook/Pinterest ikonları kaldırıldı.
- `robots.txt` artık `/api/` adreslerini de dışarıda tutuyor.
- Otomatik SEO kontrol scripti ve her Vercel yayınında çalışan GitHub kontrolü.

**İnceleme sırasında düzeltilenler**
- Dashboard sayfasına ana başlık (H1) eklendi (görünüm değişmedi).
- "eBay UK vs Etsy UK" yazısı: eBay ücretleri 2026'ya göre güncellendi (iş satıcıları için çoğu
  kategoride yaklaşık %12,9 + 10£ üstü siparişte £0,40; bireysel satıcılara satış ücreti yok).
  £30 örneği yeniden hesaplandı (£4,27). "eBay pahalı ürünlerde daha avantajlı" ifadesi yanlıştı,
  düzeltildi. "Her iki sitede listeleme ücretsiz" ifadesi yanlıştı, düzeltildi.
- "Find products that sell" yazısındaki kaynaksız "%35–65 kâr marjı" iddiası kaldırıldı.
- 2 yazıdaki rastgele (picsum) görseller yerine yazının başlığıyla otomatik üretilen markalı kapak
  görseli (`/blog-cover/...`). Lisans sorunu yok, sosyal medya paylaşımında da bu görsel çıkar.
- 1 uzun başlık ve 2 uzun açıklama kısaltıldı.

## Bu aşamanın dışında kalan, sonra ele alınacaklar
- Dashboard'daki kategori görselleri hâlâ rastgele (picsum) görseller.
- Compare sayfasındaki rakip fiyatları ($19.90–$89.99) düzenli olarak doğrulanmalı.
- Dashboard kodunda derlemeyi engellemeyen eski lint uyarıları var.
- Next.js "middleware" dosya adı yerine "proxy" kullanılmasını öneriyor (çalışmayı etkilemiyor).
- 6 Ekim'den beri yeni blog yazısı yok → 2. aşama (verilere dayalı haftalık yazılar).

## Şükrü Bey'in yapması gerekenler (Google girişi gerektiği için)
- Google Search Console → ukviralradar.com → Site haritaları → `sitemap.xml` gönder.
- Bing Webmaster Tools → "Google Search Console'dan içe aktar".
