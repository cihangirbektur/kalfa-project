# Yapay Zekâ Kullanım Beyanı

**KALFA — brAIn Takımı**
T3 Vakfı Bursiyer Yapay Zekâ Creathonu 2026 · Problem 3

---

## Neden bu belge var

Yarışma şartnamesi yapay zekâ kullanımını yasaklamıyor; program zaten bu teknolojiler üzerine kurulu. Bu beyan bir zorunluluk değil, **şeffaflık tercihidir.** Hangi işi kimin yaptığını açıkça yazmak, projenin güvenilirliğinin bir parçasıdır.

## 1. Ürünün içinde çalışan yapay zekâ

Bunlar KALFA'nın işlevidir, geliştirme aracı değildir.

| Katman | İşlev | Karar mercii |
|---|---|---|
| **Üreten katman** | Kazanım ve seviyeye göre atölye planı, etkinlik, eğitsel oyun, malzeme listesi, medya önerisi ve ölçme aracı taslağı üretir | Taslak üretir, karar vermez |
| **Denetleyen katman** | Üretilen planı 10 pedagojik kurala karşı bağımsız olarak denetler, bulguları planın içinden alıntıyla kanıtlar | Bulgu bildirir, onay vermez |
| **İnsan** | Pedagojik uzman içeriği inceler, revizyon ister veya onaylar | **Nihai karar mercii** |

İki yapay zekâ katmanı **ayrı ve bağımsız çağrılardır.** Üreten modelin kendi çıktısını onaylaması denetim sayılmaz; bu ayrım mimarinin temelidir.

Kritik pedagojik bulgu bulunduğunda onay butonu sistem düzeyinde kilitlenir. Yapay zekânın hiçbir çıktısı insan onayı olmadan uygulamaya geçemez.

## 2. Geliştirme sürecinde kullanılan yapay zekâ araçları

| Araç | Nerede kullanıldı |
|---|---|
| **Lovable** | Uygulama arayüzü, veritabanı şeması ve arka uç fonksiyonlarının doğal dil tarifiyle oluşturulması |
| **Lovable AI** | Ürünün içindeki üretim ve denetim çağrıları |
| **Claude** | Problem analizi, ürün stratejisi, pedagojik kural setinin tasarımı, sistem talimatlarının yazımı, müfredat verisinin derlenmesi, dokümantasyon |

## 3. İnsan katkısı

Aşağıdakiler takım tarafından belirlenmiş, doğrulanmış veya sahadan getirilmiştir:

- **Problem seçimi ve ürün konumlandırması** — hangi problemin çözüleceği, ürünün ne olacağı
- **Pedagojik kural setinin geçerliliği** — 10 denetim kuralının 5E modeline ve sahadaki uygulama hatalarına uygunluğu
- **DENEYAP saha bilgisi** — atölye gerçekliği, seviye ayrımının ortaokul/lise olarak kurulması, malzeme ve süre kısıtları
- **Müfredat doğrulaması** — 11 eğitim alanının konu başlıklarının resmî kaynakla eşleştirilmesi
- **Üretilen içeriğin değerlendirilmesi** — çıktı kalitesinin atölye eğitmeni gözüyle denetlenmesi

Takımın üç üyesi de Bilim Güngören DENEYAP Atölyesi'nde Eğitmen Mentör Bursiyeri olarak görev yapmaktadır. Ürünün çözdüğü problemi sahada bizzat yaşayan kişilerdir.

## 4. Veri kaynakları

| Veri | Kaynak | Durum |
|---|---|---|
| 11 eğitim alanı, konu başlıkları, süreler, formatlar | [deneyap.org/tr/egitim/basliklar](https://www.deneyap.org/tr/egitim/basliklar/) | Kamuya açık, resmî |
| 5E öğretim modeli | Bybee ve BSCS, 1987 | Akademik literatür |
| 7E öğretim modeli | Eisenkraft, 2003 | Akademik literatür |
| GİPSCİ modeli | Bilim Türkiye | **Aşama tanımları temin edilemedi** — sisteme tanımlanmadı |
| Kazanım metinleri | Resmî konu başlıklarından türetilmiştir | DENEYAP'ın resmî kazanım metinleri değildir |

## 5. Açıkça belirtilmesi gerekenler

**GİPSCİ modeli tanımlanmamıştır.** Modelin aşamalarına dair erişilebilir bir kaynak bulunamadığı için uydurulmamış, sistemde "aşamalar tanımlanmayı bekliyor" durumunda bırakılmıştır. Eğitim Ar-Ge Koordinatörlüğü'nden resmî tanım talep edilmiştir.

**Kazanım metinleri resmî değildir.** Sistemdeki kazanımlar, DENEYAP'ın yayımlanmış konu başlıklarından kazanım yazım kurallarına uygun biçimde türetilmiştir. Kurumun resmî kazanım dokümanları kamuya açık olmadığından birebir kullanılamamıştır.

**Maliyet tahminleri yaklaşıktır.** Malzeme fiyatları yapay zekâ tahminidir, kesin bütçe verisi değildir.

---

*Bu beyan, projenin neyi yaptığı kadar neyi yapmadığını da açıkça belirtmek amacıyla hazırlanmıştır.*
