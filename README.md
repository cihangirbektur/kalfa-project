# KALFA

> **Kalfa üretir, usta onaylar.**

Bilim Türkiye ve DENEYAP Teknoloji Atölyeleri için yapay zekâ destekli eğitim içeriği üretim ve pedagojik denetim aracı.

**Canlı demo:** https://kalfa-project.lovable.app
**Takım:** brAIn · **Yarışma:** T3 Vakfı Bursiyer Yapay Zekâ Creathonu 2026
**Problem:** Problem 3 — Bilim Türkiye AI Eğitim İçeriği Geliştirme Asistanı (Eğitim Ar-Ge Koordinatörlüğü)

---

## Hangi problemi çözüyor

Nitelikli atölye içeriği üretimi çok aşamalı, uzman yoğun ve tekrar eden bir süreç. Yaş grubu, kazanım, öğretim modeli, etkinlik, oyun, görsel materyal ve ölçme araçları uzman ekiplerce ayrı ayrı elle hazırlanıyor. Sonuçları:

- İçerik üretimi günler, bazen haftalar sürüyor
- Format ve kalite standardı üretenden üretene değişiyor
- Yaş uyarlaması ve revizyonlar işi baştan yaptırıyor

KALFA bu süreci dakikalara indiriyor — ama kararı almıyor. Ürettiği her içerik taslak; nihai pedagojik onay uzmanda kalıyor.

## Nasıl çalışıyor

```
Kazanım + Seviye + Öğretim Modeli
            │
            ▼
   ÜRETEN YAPAY ZEKÂ  ──►  Atölye planı, etkinlikler, eğitsel oyunlar,
            │               malzeme listesi, medya önerileri, ölçme aracı
            ▼
  DENETLEYEN YAPAY ZEKÂ ──►  12 pedagojik kurala karşı bağımsız denetim
            │
            ▼
   PEDAGOJİK UZMAN ONAYI  ──►  Kritik bulgu varsa onay kilitli
            │
            ▼
        EĞİTMEN  ──►  Sınıfta uygular, saha geri bildirimi bırakır
```

**Mimarinin özü:** üreten yapay zekâ ile denetleyen yapay zekâ **ayrı ve bağımsız** çağrılardır. Üreten modelin kendi işini onaylaması denetim değildir.

## Altı zorunlu MVP maddesinin karşılanması

| # | Gereksinim | KALFA'da karşılığı |
|---|---|---|
| 01 | Kazanım, yaş ve model tanımlama | `Yeni Plan` formu — kazanım, seviye, öğretim modeli seçimi |
| 02 | Yaş grubu, atölye alanı, kazanım ve 5E/GiPSCi yapılandırması seçimi | Bilim Türkiye'nin 7 atölye teması (6-8 / 9-11 / 12-14 yaş) ve DENEYAP'ın 11 eğitim alanı (ortaokul/lise); GiPSci, 5E ve 7E modelleri. Form seçilen programa göre koşullu çalışır |
| 03 | AI ders/atölye planı üretimi (aşamalı akış, süre, etkinlik taslağı) | `Aşamalar` sekmesi — model aşamaları, süre dağılımı, öğretmen/öğrenci eylemleri, tetikleyici sorular, kavram yanılgıları |
| 04 | Etkinlik ve eğitsel oyun üretimi | `Etkinlikler` sekmesi — yedi etkinlik tipi, oyun tiplerinde tam oyun yapısı |
| 05 | Deney, oyunlaştırma, kart/kutu oyunu, alternatif etkinlik önerileri | Etkinlik tipleri: deney, kart oyunu, kutu/strateji oyunu, oyunlaştırılmış görev, dijital quiz, simülasyon, istasyon çalışması |
| 06 | Materyal ve medya önerileri | `Malzemeler` sekmesi (maliyet, hazırlık süresi, güvenlik notu, alternatif) ve `Medya` sekmesi (basılı/dijital ayrımı). Plan, A4'e basılabilir 6 sayfalık atölye belgesi olarak çıktı alınabilir |

## Üç temel akışın karşılanması

| Akış | KALFA'da |
|---|---|
| **İçerik Uzmanı:** kazanım + yaş + model seçer → AI plan üretir → etkinlikleri düzenler → içerik paketini kaydeder | `Yeni Plan` → `Plan Görünümü` → düzenle → `Kaydet` (sürüm oluşur) |
| **Pedagojik Uzman:** taslağı inceler → hataları işaretler → revizyon ister → sürümü onaylar | `Denetim Kuyruğu` → `Denetim Paneli` → `Revizyon İste` / `Onayla` |
| **Eğitmen:** onaylı içeriği açar → kılavuz ve materyalleri görür → sınıfta uygular → geri bildirim bırakır | `Onaylı İçerikler` → uygulama görünümü (aşama ve malzeme kontrol listesi) → geri bildirim formu |

## Roller ve yetkiler

| Rol | Gördüğü | Yapabildiği |
|---|---|---|
| İçerik Uzmanı | Kendi taslakları ve revizyon istenenler | Üret, düzenle, denetime gönder |
| Pedagojik Uzman | Yalnızca denetimdeki içerikler | İncele, revizyon iste, onayla |
| Eğitmen | Yalnızca onaylı içerikler | Uygula, geri bildirim bırak |
| Eğitim Yöneticisi | Tam içerik havuzu, sürümler, raporlar | İzle, filtrele, raporla |

Onaylanmamış içerik eğitmen görünümüne düşmez. Bu, brifin *"içerik üretimi, pedagojik kontrol, uygulama ve yönetim aynı onaylı içerik akışı üzerinden ilerlemelidir"* ilkesinin yazılıma dökülmüş hâlidir.

## Pedagojik denetim kuralları

Denetçi katmanı her planı **12 pedagojik kurala** karşı sınar ve her bulguyu planın içinden alıntılanan kanıta bağlar. Kurallar keyfi seçilmedi: **12 kuraldan 7'si T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü'nün Şubat 2026 araştırma raporundaki önerilerden** türetildi.

| # | Kural | Seviye |
|---|---|---|
| 1 | Öğrenci kendi bulgusunu, öğretmen açıklamasından **önce** anlatır | Kritik |
| 2 | Keşfetme aşaması toplam sürenin en az **%25**'i | Kritik |
| 3 | Yaratma/Açıklama aşaması toplam sürenin en az **%20**'si | Kritik |
| 4 | Öğretmen cevabı vermez, yapılandırılmış soruyla yönlendirir | Kritik |
| 5 | Plan somut bir öğrenci ürünüyle biter | Kritik |
| 6 | Her etkinlik kazanımla açıkça hizalı | Kritik |
| 7 | Riskli malzemede güvenlik notu zorunlu | Kritik |
| 8 | Aşama süreleri toplamı, verilen toplam süreye eşit | Uyarı |
| 9 | En az 4 merak soru kartı, her biri hipoteze çağırır | Uyarı |
| 10 | Biçimlendirici değerlendirme ders boyuna dağılır | Uyarı |
| 11 | Süreç odaklı değerlendirme var, yalnızca ürün ölçülmüyor | Uyarı |
| 12 | Kavram yanılgıları öngörülmüş | Bilgi |

**Kritik bulgu varken onay butonu sistem tarafından kilitlenir.** Uzman isterse bile onaylayamaz.

Her kuralın gerekçesi, kaynağı ve kaynak izlenebilirlik tablosu için: [PEDAGOJIK-KURAL-SETI.md](PEDAGOJIK-KURAL-SETI.md)


## Öğretim modeli bağımsızlığı

Öğretim modelleri koda gömülü değil, veri katmanında tutulur. `ogretim_modelleri` tablosundaki her kayıt aşama adlarını, sırasını, amaçlarını ve süre oranlarını taşır.

- **5E** — Bybee ve BSCS (1987): Girme, Keşfetme, Açıklama, Derinleştirme, Değerlendirme
- **7E** — Eisenkraft (2003): Ortaya Çıkarma, Girme, Keşfetme, Açıklama, Derinleştirme, Değerlendirme, Genişletme
- **GiPSci** — Bilim Türkiye'nin özgün modeli: *Guided Inquiry and Product-based Science in Science Centers* (Rehberli Sorgulama, Ürün Odaklı Bilim). Beş aşaması: Harekete Geçme, Keşfetme, Yaratma/Açıklama, Derinleştirme, Değerlendirme. Üç temel unsuru rehberli sorgulama, ürün tabanlı öğrenme ve bilim merkezlerinin etkileşimli öğrenme ortamıdır.

Modelin mimariden bağımsız olması sınandı: GiPSci'nin resmî tanımı proje sırasında temin edildi ve **tek veritabanı kaydı** eklenerek sisteme alındı. Hiçbir kod satırı değişmedi.

Kaynak: T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Birimi, *"GiPSci" Yaklaşımının Bilim Türkiye Programı Kapsamında Sorgulama Becerilerini Geliştirmeye Yönelik Çok Yönlü İncelemesi*, Şubat 2026. Ayrıca bkz. Birgili, Bulut, Gülünay, Koçoğlu ve Baş (2025), *Research in Science & Technological Education*.

## Problemin kanıtı: kurumun kendi ölçümü

Aynı araştırma raporu, GiPSci uygulamasını 28 merkezde ölçtü. ICI (İlgi–Merak–Sorgulama) ölçeğinde (1–3):

| Boyut | Ortalama | Standart sapma |
|---|---|---|
| İlgi | 2.08 | 0.94 |
| Merak | 1.88 | 0.68 |
| **Sorgulama** | **1.05** | 0.86 |

Sorgulama, üç boyutun en zayıfı. Raporun kendi öneri listesi — yapılandırılmış soru kartları, oyunlaştırma, farklılaştırılmış içerik, süreç odaklı değerlendirme, tasarım aşamasına daha fazla süre ve yapay zekâ destekli öğrenme — KALFA'nın denetim kural setine birebir çevrilmiştir. Hangi kuralın hangi bulgudan geldiği [PEDAGOJIK-KURAL-SETI.md](PEDAGOJIK-KURAL-SETI.md) dosyasında izlenebilir.

## Müfredat verisi

İki program da gerçek, yayınlanmış müfredat verisiyle sisteme tanımlıdır. Üretilen içerik bu konu başlıklarına bağlanır, müfredat dışına çıkılmaz.

### Bilim Türkiye — 7 atölye teması, 189 konu başlığı

Doğa Bilimleri, Matematik, Teknoloji, Girişim, Sanat, Kültür ve Uzay atölyeleri; her tema **6–8 / 9–11 / 12–14 yaş** gruplarına göre ayrı konu başlıklarıyla tanımlı. Program türleri: bir saatlik atölye, paket program, dönemlik eğitim, tematik atölye.

Kaynak: [t3bilimturkiye.org/tr/atolyeler](https://t3bilimturkiye.org/tr/atolyeler/)

### DENEYAP Teknoloji Atölyeleri — 11 eğitim alanı

Yüz yüze: Robotik ve Kodlama (12 hafta), Elektronik Programlama ve Nesnelerin İnterneti (13), Tasarım ve Üretim (12), Enerji Teknolojileri (12), Havacılık ve Uzay Teknolojileri (12), İleri Robotik (7), Malzeme Bilimi ve Nanoteknoloji (6)
Hibrit: Yazılım Teknolojileri (7)
Çevrim içi: Siber Güvenlik (8), Yapay Zeka (8), Mobil Uygulama (6)

Kaynak: [deneyap.org/tr/egitim/basliklar](https://www.deneyap.org/tr/egitim/basliklar/)

### Programa bağlı form

Atölye alanı seçildiğinde yaş grubu, program türü ve konu başlığı alanları o programa göre yeniden kurulur. Bilim Türkiye seçiliyken DENEYAP kademeleri **hiç görünmez**, tersi de geçerlidir. İki programın seçenekleri karışmaz.


## Teknoloji

| Katman | Teknoloji |
|---|---|
| Arayüz | React + TypeScript + Tailwind |
| Veritabanı ve arka uç | Lovable Cloud |
| Yapay zekâ | Lovable AI |
| Barındırma | Lovable |
| Sürüm kontrolü | GitHub |

Yapay zekâ çağrıları arka uç fonksiyonları üzerinden yapılır; API anahtarları arayüz kodunda tutulmaz.

## Veri modeli

| Tablo | İçerik |
|---|---|
| `atolye_alanlari` | Bilim Türkiye 7 teması + DENEYAP 11 eğitim alanı; program, kategori, süre, yaş grubuna göre konu başlıkları |
| `ogretim_modelleri` | Model adı, aşamalar (jsonb), süre oranları |
| `kazanimlar` | Kod, metin, atölye alanı, seviye, Bloom seviyesi |
| `planlar` | Kazanım, model, seviye, süre, durum, versiyon, içerik (jsonb) |
| `denetim_bulgulari` | Kural no, seviye, geçti/kaldı, mesaj, kanıt alıntısı |
| `geri_bildirimler` | Uygulandı mı, eğitmen notu, tarih |
| `surumler` | Versiyon no, anlık kopya, tarih |

## KVKK ve veri güvenliği

KALFA **tasarım gereği kişisel veri işlemez.** Girdi kazanım, seviye ve ders parametreleridir; çıktı eğitim içeriğidir. Öğrenci adı, numarası veya başka bir kimlik verisi sistemde tutulmaz. Eğitmen geri bildirimlerinde de öğrenci bilgisi istenmez.

Ayrıntılı belgeler: [KVKK Aydınlatma Metni](KVKK-AYDINLATMA-METNI.md) · [Gizlilik Politikası](GIZLILIK-POLITIKASI.md) · [Kullanım Koşulları](KULLANIM-KOSULLARI.md) · [Çerez Bildirimi](CEREZ-BILDIRIMI.md)

## Yapay zekâ kullanım beyanı

Geliştirme sürecinde yapay zekâ araçlarının nerede kullanıldığı şeffaf biçimde beyan edilmiştir: [YAPAY-ZEKA-KULLANIM-BEYANI.md](YAPAY-ZEKA-KULLANIM-BEYANI.md)

## Ekip — brAIn

*Turning Ideas into Intelligence*

| | |
|---|---|
| **Cihangir Bektur** | Yıldız Teknik Üniversitesi, Elektronik ve Haberleşme Mühendisliği · T3 Vakfı Eğitmen Mentör Bursiyeri |
| **Hasan Koçak** | Yıldız Teknik Üniversitesi, Makine Mühendisliği · T3 Vakfı Eğitmen Mentör Bursiyeri |
| **Dilara Öztürk** | Yıldız Teknik Üniversitesi, İlköğretim Matematik Öğretmenliği · T3 Vakfı Eğitmen Mentör Bursiyeri |

Üç takım üyesi de Bilim Güngören DENEYAP Atölyesi'nde Eğitmen Mentör Bursiyeri olarak görev yapmaktadır. Bu problemi çözmeye çalıştığımız içerikleri sahada bizzat hazırlayan kişiler biziz.

## Durum

**Çalışan prototip**, canlı ve erişilebilir. Üretim, bağımsız denetim, revizyon döngüsü, uzman onayı, eğitmen uygulaması ve saha geri bildirimi uçtan uca çalışır durumda.

Henüz yapılmadı: gerçek kimlik doğrulama ve satır düzeyi yetkilendirme (roller şu an arayüz düzeyinde ayrılıyor), saha pilotu ve ICI ölçümü.

T3 Vakfı Bursiyer Yapay Zekâ Creathonu 2026 teslimi için geliştirilmiştir.

## Lisans

[LICENSE](LICENSE) dosyasına bakınız.
