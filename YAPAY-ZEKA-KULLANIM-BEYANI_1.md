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
| **Denetleyen katman** | Üretilen planı 12 pedagojik kurala karşı bağımsız olarak denetler, bulguları planın içinden alıntıyla kanıtlar | Bulgu bildirir, onay vermez |
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
- **Saha bilgisi** — atölye gerçekliği; DENEYAP'ta ortaokul/lise, Bilim Türkiye'de 6-8 / 9-11 / 12-14 yaş ayrımının kurulması, malzeme ve süre kısıtları
- **Müfredat doğrulaması** — Bilim Türkiye'nin 7 atölye teması ve 189 konu başlığı ile DENEYAP'ın 11 eğitim alanının resmî kaynaklarla eşleştirilmesi
- **Kaynak temini ve okuması** — GiPSci modelinin resmî tanımının kurumdan talep edilmesi, araştırma raporunun okunması ve GiPSci ile 5E arasındaki ilişkinin mimariye doğru yansıtılması
- **Üretilen içeriğin değerlendirilmesi** — çıktı kalitesinin atölye eğitmeni gözüyle denetlenmesi

Takımın üç üyesi de Bilim Güngören DENEYAP Atölyesi'nde Eğitmen Mentör Bursiyeri olarak görev yapmaktadır. Ürünün çözdüğü problemi sahada bizzat yaşayan kişilerdir.

## 4. Veri kaynakları

| Veri | Kaynak | Durum |
|---|---|---|
| DENEYAP 11 eğitim alanı, konu başlıkları, süreler, formatlar | [deneyap.org/tr/egitim/basliklar](https://www.deneyap.org/tr/egitim/basliklar/) | Kamuya açık, resmî |
| Bilim Türkiye 7 atölye teması, yaş gruplarına göre 189 konu başlığı | [t3bilimturkiye.org/tr/atolyeler](https://t3bilimturkiye.org/tr/atolyeler/) | Kamuya açık, resmî |
| 5E öğretim modeli | Bybee ve BSCS, 1987 | Akademik literatür |
| 7E öğretim modeli | Eisenkraft, 2003 | Akademik literatür |
| GiPSci modeli, ICI ölçüm verileri | T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Birimi, Şubat 2026 | Kurumun resmî yayını |
| Kazanım metinleri | Resmî konu başlıklarından türetilmiştir | DENEYAP'ın resmî kazanım metinleri değildir |

## 5. Açıkça belirtilmesi gerekenler

**GiPSci tanımı proje sırasında temin edildi.** Modelin aşamalarına dair erişilebilir bir kaynak başlangıçta bulunamadığı için uydurulmadı; sistemde "aşamalar tanımlanmayı bekliyor" durumunda bırakıldı ve Eğitim ve Ar-Ge Koordinatörlüğü'nden resmî tanım talep edildi. Kurumun Şubat 2026 araştırma raporu temin edildikten sonra model **tek veritabanı kaydıyla** sisteme alındı, hiçbir kod satırı değişmedi.

Raporun okunmasıyla ortaya çıkan bir düzeltme de yapıldı: GiPSci kendi aşama dizisini tanımlamaz, 5E'nin beş aşamalı ders planı formatını kullanır. Bu nedenle sistem aşama şablonunu ve pedagojik kural profilini ayrı katmanlarda tutar. Ayrıntı: [PEDAGOJIK-KURAL-SETI.md](PEDAGOJIK-KURAL-SETI.md).

**Denetim kurallarının yedisi kurumun kendi bulgularından türetilmiştir.** Rapordaki ICI ölçüm sonuçları ve öneri listesi, uydurma pedagojik ölçüt yazmak yerine kaynağı belli kural üretmek için kullanılmıştır. Hangi kuralın hangi bulgudan geldiği kural seti dosyasında tablo hâlinde izlenebilir.

**Kazanım metinleri resmî değildir.** Sistemdeki kazanımlar, DENEYAP'ın yayımlanmış konu başlıklarından kazanım yazım kurallarına uygun biçimde türetilmiştir. Kurumun resmî kazanım dokümanları kamuya açık olmadığından birebir kullanılamamıştır.

**Maliyet tahminleri yaklaşıktır.** Malzeme fiyatları yapay zekâ tahminidir, kesin bütçe verisi değildir.

---

*Bu beyan, projenin neyi yaptığı kadar neyi yapmadığını da açıkça belirtmek amacıyla hazırlanmıştır.*
