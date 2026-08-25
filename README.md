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
  DENETLEYEN YAPAY ZEKÂ ──►  10 pedagojik kurala karşı bağımsız denetim
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
| 02 | Yaş grubu, atölye alanı, kazanım ve 5E/GiPSCi yapılandırması seçimi | 11 gerçek DENEYAP eğitim alanı, Ortaokul/Lise seviyesi, 5E ve 7E modelleri |
| 03 | AI ders/atölye planı üretimi (aşamalı akış, süre, etkinlik taslağı) | `Aşamalar` sekmesi — model aşamaları, süre dağılımı, öğretmen/öğrenci eylemleri, tetikleyici sorular, kavram yanılgıları |
| 04 | Etkinlik ve eğitsel oyun üretimi | `Etkinlikler` sekmesi — yedi etkinlik tipi, oyun tiplerinde tam oyun yapısı |
| 05 | Deney, oyunlaştırma, kart/kutu oyunu, alternatif etkinlik önerileri | Etkinlik tipleri: deney, kart oyunu, kutu/strateji oyunu, oyunlaştırılmış görev, dijital quiz, simülasyon, istasyon çalışması |
| 06 | Materyal ve medya önerileri | `Malzemeler` sekmesi (maliyet, hazırlık süresi, güvenlik notu, alternatif) ve `Medya` sekmesi (basılı/dijital ayrımı) |

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

Denetçi katmanı her planı 10 kurala karşı kontrol eder ve her bulguyu planın içinden alıntılanan kanıta bağlar.

| # | Kural | Seviye |
|---|---|---|
| 1 | Öğrenci açıklaması, öğretmen açıklamasından önce mi? | Kritik |
| 2 | Keşfetme süresi toplamın en az %25'i mi? | Kritik |
| 3 | Aşama süreleri toplamı toplam süreye eşit mi? | Uyarı |
| 4 | Derinleştirme yeni bir bağlam kullanıyor mu? | Kritik |
| 5 | Biçimlendirici değerlendirme ders boyuna dağılmış mı? | Uyarı |
| 6 | Her etkinlik kazanımla hizalı mı? | Kritik |
| 7 | Dil ve soyutlama seviyesi uygun mu? | Uyarı |
| 8 | Riskli malzemede güvenlik notu var mı? | Kritik |
| 9 | Malzemeler öğrenci sayısı ve bütçeye uyuyor mu? | Uyarı |
| 10 | Kavram yanılgıları öngörülmüş mü? | Bilgi |

Kritik bulgu varken onay butonu sistem tarafından kilitlenir.

Kurallar, 5E modelinin sahada en sık yapılan uygulama hatalarından türetilmiştir. Özellikle 1. kural kritiktir: öğretmen kavramı öğrenciden önce açıklarsa Keşfetme aşaması anlamsızlaşır ve model klasik anlatıma döner.

## Öğretim modeli bağımsızlığı

Öğretim modelleri koda gömülü değil, veri katmanında tutulur. `ogretim_modelleri` tablosundaki her kayıt aşama adlarını, sırasını, amaçlarını ve süre oranlarını taşır.

- **5E** — Bybee ve BSCS (1987): Girme, Keşfetme, Açıklama, Derinleştirme, Değerlendirme
- **7E** — Eisenkraft (2003): Ortaya Çıkarma, Girme, Keşfetme, Açıklama, Derinleştirme, Değerlendirme, Genişletme
- **GİPSCİ** — Bilim Türkiye'nin özgün modeli. Aşama tanımları Eğitim Ar-Ge Koordinatörlüğü'nden talep edilmiştir; tanımlar temin edildiğinde **tek veritabanı kaydı** eklenerek desteklenir, yazılım değişikliği gerekmez.

## Müfredat verisi

11 DENEYAP eğitim alanı, resmî konu başlıkları ve süreleriyle sisteme tanımlıdır. Üretilen etkinlikler bu konu başlıklarına bağlanır, müfredat dışına çıkılmaz.

Yüz yüze: Robotik ve Kodlama (12 hafta), Elektronik Programlama ve Nesnelerin İnterneti (13), Tasarım ve Üretim (12), Enerji Teknolojileri (12), Havacılık ve Uzay Teknolojileri (12), İleri Robotik (7), Malzeme Bilimi ve Nanoteknoloji (6)
Hibrit: Yazılım Teknolojileri (7)
Çevrim içi: Siber Güvenlik (8), Yapay Zeka (8), Mobil Uygulama (6)

Kaynak: [deneyap.org/tr/egitim/basliklar](https://www.deneyap.org/tr/egitim/basliklar/)

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
| `atolye_alanlari` | 11 eğitim alanı, kategori, süre, konu başlıkları, ders kitabı bağlantıları |
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

Bu bir **ön prototiptir**, T3 Vakfı Bursiyer Yapay Zekâ Creathonu 26 Ağustos 2026 teslimi için geliştirilmiştir.

## Lisans

[LICENSE](LICENSE) dosyasına bakınız.
