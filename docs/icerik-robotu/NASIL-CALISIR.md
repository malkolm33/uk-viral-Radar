# İçerik robotu – nasıl çalışır

## Ne yapar
- **Her salı sabahı:** Sitedeki güncel ürün verilerinden "Bu hafta UK'de yükselen ürünler" yazısı yazar.
- **Her ayın 3'ünde:** Bir kategori için (Home, Kitchen, Fitness…) ayrıntılı rapor yazar. Kategori her ay değişir.
- Kapak görseli otomatik oluşur (`/blog-cover/...`).
- Yayından sonra Bing'e "yeni sayfa var" diye haber verir (IndexNow).

## Bir yazı yayına girmeden önce
1. **Otomatik kontroller (yapay zekâ değil, bilgisayar kontrolü):**
   - Yazıdaki her rakam veritabanındaki gerçek verilerde var mı? Yoksa yazı geri gönderilir.
   - Yasak ifadeler: "garanti", "£X kazan", rakip marka adları vb.
   - Başlık, açıklama ve uzunluk sınırları; düz metin biçimi.
2. **4 uzman ajan, birbirinden bağımsız inceler:**
   - SEO uzmanı
   - Editör ve doğruluk kontrolcüsü
   - Hukuk uzmanı (UK reklam kuralları, GDPR)
   - Teknik ve güvenlik uzmanı
3. **Biri bile itiraz ederse** yazı düzeltilir ve baştan incelenir (en fazla 3 tur).
   3 turda dördünün onayı alınamazsa yazı **yayınlanmaz**, site değişmez.
4. Haftada en fazla 2 yazı (Google'ın "toplu içerik" cezasına karşı).

## İki çalışma şekli (`.github/scripts/content-robot/config.json` içindeki `mode`)
- **`approval` (şu an bu):** 4 uzman onaylayınca GitHub'da "Onay bekliyor" başlıklı bir istek açılır,
  e-postana bildirim gelir. İçindeki raporu okuyup **Merge pull request** dersen yazı yayına girer.
  Beğenmezsen **Close pull request** dersin, hiçbir şey değişmez.
- **`auto`:** 4 uzman onaylayınca yazı doğrudan yayına girer. Yayından 3 dakika sonra site otomatik
  kontrol edilir; bir sorun varsa robot değişikliği **kendisi geri alır** ve sana haber verir.

İlk 4–6 hafta `approval` kalmalı. Uzmanların kararları seninkiyle uyuşuyorsa `auto`'ya geçilir.

## Bir sorun olursa
Robot hata verirse GitHub'da "İçerik robotu hata verdi" başlıklı bir kayıt (issue) açar ve e-posta gelir.
Bu durumda site değişmemiştir.

## Elle çalıştırmak
GitHub → Actions → **Content Robot** → **Run workflow** → `weekly` veya `category`.

## Gerekenler
- GitHub gizli anahtarı: `ANTHROPIC_API_KEY` (Claude API anahtarı). Supabase anahtarları zaten var.
- GitHub ayarı: Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests" açık.
  Kapalıysa robot istek yerine bir issue açar ve içine tek tıklık onay bağlantısı koyar.
- Tahmini maliyet: yazı başına yaklaşık £0,30–0,80 (Claude API), ayda yaklaşık £3–6.
