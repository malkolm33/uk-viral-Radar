# Yayın kuralları – UK Viral Radar

Bu dosya ukviralradar.com'a giden her değişikliğin hangi kontrollerden geçeceğini anlatır.
İncelemeyi Claude yapar. Hermes bu projeye dokunmaz (Hermes sadece DocDream içindir).

## Akış

1. **Hazırlık:** Değişiklik ayrı bir kopyada (dal / branch) yapılır, örneğin `seo/faz-1`.
   Canlı site (`main`) bu sırada değişmez.
2. **İnceleme:** Claude aşağıdaki 6 kontrolü tek tek yapar.
3. **Düzeltme:** Sorun çıkarsa Claude düzeltir ve kontrolleri baştan tekrarlar. Hiç "engel" kalmayana kadar.
4. **Rapor:** Claude sonucu sade Türkçeyle yazar: **"Yayına hazır"** ya da **"Hazır değil"** ve nedeni.
5. **Onay:** Şükrü Bey raporu okur ve onaylarsa canlıya alma dosyasını (`.bat`) çalıştırır.
6. **Canlı kontrol:** Yayından sonra Claude canlı siteyi tekrar kontrol eder. Bir şey bozulduysa önce geri alınır.

## 6 kontrol

**1. Teknik SEO**
- `node .github/scripts/seo-check.mjs <adres>` komutu `RESULT: PASS` vermeli.
- Her sayfada tek bir ana başlık (H1), 65 karakteri geçmeyen başlık, 50–160 karakter açıklama,
  canonical adresi ve sosyal medya paylaşım bilgileri olmalı.
- Yeni sayfalar sitemap'te olmalı; schema (yapısal veri) hatasız olmalı.

**2. Yapay zekâ aramaları (GEO – ChatGPT, Perplexity, Gemini, Google AI)**
- `/llms.txt` yeni sayfaları ve yazıları listelemeli.
- Fiyat (Pro £9.99/ay, ücretsiz ilk 3 ürün), veri kaynakları ve sosyal hesaplar her yerde aynı olmalı
  (tek kaynak: `app/lib/site.ts`).

**3. İçerik ve doğruluk**
- İngiliz İngilizcesi, UK'ye özel içerik (GBP, UK pazaryerleri).
- Her rakam ya sitenin kendi verisinden ya da adı verilen bir kaynaktan gelmeli.
  Uydurma istatistik, yorum veya müşteri görüşü yok.
- Ücret ve kurallar gibi zamanla değişen bilgilerde yıl belirtilmeli.

**4. Görseller**
- Görsel konuyla ilgili olmalı; rastgele görsel yok.
- Lisansı açık olmalı: kendi ürettiğimiz kapaklar (`/blog-cover/...`) veya lisanslı stok fotoğraf.
  eBay/Etsy satıcı fotoğrafları blogda kullanılmaz.
- Her görselin açıklaması (alt metni) olmalı.

**5. UK hukuku**
- Reklam kuralları (ASA/CAP): "garanti kazanç" gibi vaatler yok.
- Rakip karşılaştırmaları adil ve doğrulanabilir olmalı.
- Hiçbir müşterinin veya kişinin bilgisi yer almaz (UK GDPR).

**6. Performans, erişilebilirlik ve güvenlik**
- `npm run build` ve lint hatasız.
- Şifre, anahtar veya `.env` bilgisi kodda yer almaz.
- Yeni sayfa veya API eklenirse güvenlik kontrolü yapılır.

## Engel ve uyarı farkı
- **Engel (yayın durur):** derleme hatası, SEO kontrolü FAIL, yanlış bilgi, uydurma veri,
  lisans şüphesi, hukuki risk, kişisel veri, güvenlik açığı, bozuk sayfa.
- **Uyarı (düzeltilir ya da nedeni yazılır):** karakter uzunlukları, küçük stil konuları.
