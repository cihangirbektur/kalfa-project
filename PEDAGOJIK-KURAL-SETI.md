# Pedagojik Denetim Kural Seti

**KALFA — brAIn Takımı**
T3 Vakfı Bursiyer Yapay Zekâ Creathonu 2026 · Problem 3

---

## Bu dosya neden var

KALFA'nın denetçi katmanı, üretilen her atölye planını 12 pedagojik kurala karşı sınar. Bu kurallar keyfi seçilmedi. Her biri ya akademik literatürden ya da **kurumun kendi saha ölçümünden** geliyor.

Bu dosya, hangi kuralın hangi kaynaktan türediğini tek tek gösterir. Uygulamada da her denetim bulgusunun altında aynı kaynak satırı görünür.

## Kaynak: kurumun kendi ölçümü

T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Birimi, Şubat 2026'da GiPSci modelinin sahadaki etkisini ölçtü. Karma yöntem: 20 atölye gözlemi, 161 öğrenci ürünü, 10 eğitmen görüşmesi, 405 eğitmen anketi, 14 uzman değerlendirmesi. 7 Avrasya ülkesi, 12 il, 28 merkez, 6–14 yaş.

ICI (İlgi–Merak–Sorgulama) ölçeği, 1–3 rubrik:

| Boyut | Ortalama | SS |
|---|---|---|
| İlgi | 2.08 | 0.94 |
| Merak | 1.88 | 0.68 |
| **Sorgulama** | **1.05** | 0.86 |

Raporun sonucu: model ilgi ve merakta iyi çalışıyor, **sorgulama düzeyinde güçlendirilmeye ihtiyaç duyuyor.**

Raporun iyileştirme önerileri:

- Yapılandırılmış soru kartları ve merak notlarının sayısı ve işlevselliği artırılmalı
- Atölyelerde zaman yönetimi hassaslaştırılmalı, **tasarım sürecine yeterli zaman** ayrılmalı
- Bireysel sorgu aşamalarına ayrılan süre artırılmalı
- Katılımcı profiline göre **farklılaştırılmış içerik** oluşturulmalı
- Ölçme yalnızca ürüne değil, **sürece** de odaklanmalı; yansıtıcı araçlar kullanılmalı
- Oyunlaştırma unsurları eklenmeli
- **Yapay zekâ destekli öğrenme** entegre edilmeli

## GiPSci ile 5E aynı şey mi?

Hayır — ama aynı aşama yapısını kullanıyorlar. Bu ayrım ürünün veri modeline birebir yansıtılmıştır.

Araştırma raporu bunu açıkça söylüyor: *"GiPSci modeli, Rehberli Sorgulama sürecini sistematikleştirmek ve kalıcı öğrenme sağlamak için 5 aşamalı bir ders planı formatını kullanmaktadır."* Yani GiPSci yeni bir aşama dizisi icat etmez; 5E'nin aşama formatını **kullanır** ve üzerine kendi ilkelerini ekler.

KALFA bu yüzden iki katmanı ayrı tutar:

**1. Aşama şablonu** — dersin iskeleti. Kaç aşama, hangi sırayla, hangi süre oranıyla.

| Şablon | Aşamalar |
|---|---|
| 5E | Harekete Geçme · Keşfetme · Açıklama/Yaratma · Derinleştirme · Değerlendirme |
| 7E | Ortaya Çıkarma · Harekete Geçme · Keşfetme · Açıklama · Derinleştirme · Değerlendirme · Genişletme |

**2. Pedagojik kural profili** — üretimin ve denetimin uyacağı ilkeler.

| Profil | Zorunlu kıldığı |
|---|---|
| Klasik | Yalnızca aşama sırası ve süre dengesi (kural 1, 2, 6, 7, 8, 10, 12) |
| GiPSci | Yukarıdakiler **+** rehberli sorgulama, ürün odaklılık, bağlamsal öğrenme (kural 3, 4, 5, 9, 11 de devreye girer) |

**GiPSci = 5E aşama şablonu + GiPSci kural profili.**

GiPSci profilinin eklediği üç şey aşama değil, kısıttır:

- **Rehberli sorgulama** — eğitmen hiçbir aşamada cevabı doğrudan vermez, yapılandırılmış soruyla yönlendirir. Bu bir aşama değil, beş aşamanın tamamında geçerli bir davranış kuralıdır.
- **Ürün tabanlı öğrenme** — oturum somut bir öğrenci ürünüyle biter: fiziksel nesne, dijital içerik veya bilimsel sunum. Klasik 5E böyle bir zorunluluk taşımaz.
- **Bağlamsal öğrenme** — sergi ve atölye tek bir bütün olarak planlanır; soru kartları ve merak kutuları sergiden atölyeye köprü kurar. Tamamen GiPSci'ye özgüdür.

Küçük ama anlamlı bir ayrıntı: raporda GiPSci'nin üçüncü aşaması **"Yaratma / Açıklama"** sırasıyla yazılıdır, klasik 5E'de ise "Açıklama / Yaratma". Yaratmanın öne alınması modelin ürün odaklılığının işaretidir ve sistemde bu sıra korunmuştur.

Kullanıcı arayüzünde tek bir "Öğretim modeli" seçimi görünür. İki katman arka planda birleştirilir; kullanıcıya karmaşıklık yansıtılmaz.

## Kural seti ve kaynak izi

| # | Kural | Seviye | Kaynak |
|---|---|---|---|
| 1 | Öğrenci kendi bulgusunu, öğretmen açıklamasından **önce** anlatır | KRİTİK | 5E modeli — Bybee ve BSCS (1987, 2006) |
| 2 | Keşfetme aşaması toplam sürenin en az **%25**'i | KRİTİK | Rapor: "bireysel sorgu aşamalarına ayrılan sürenin artırılması" |
| 3 | Yaratma/Açıklama aşaması toplam sürenin en az **%20**'si | KRİTİK | Rapor: "tasarım sürecine yeterli zaman ayrılmalıdır" |
| 4 | Öğretmen cevabı vermez, yapılandırılmış soruyla yönlendirir | KRİTİK | GiPSci — rehberli sorgulama ilkesi; Hmelo-Silver vd. (2007) |
| 5 | Plan somut bir öğrenci ürünüyle biter | KRİTİK | GiPSci — ürün tabanlı öğrenme ilkesi; Krajcik ve Blumenfeld (2006) |
| 6 | Her etkinlik kazanımla açıkça hizalı | KRİTİK | Öğretim tasarımı hizalama ilkesi |
| 7 | Riskli malzemede güvenlik notu zorunlu | KRİTİK | Atölye güvenlik uygulaması |
| 8 | Aşama süreleri toplamı, verilen toplam süreye eşit | UYARI | Rapor: "zaman yönetimi konusunda daha hassas planlama" |
| 9 | En az 4 merak soru kartı, her biri hipoteze çağırır | UYARI | Rapor: "soru kartlarının sayısı ve işlevselliği artırılmalıdır" |
| 10 | Biçimlendirici değerlendirme ders boyuna dağılır | UYARI | Biçimlendirici değerlendirme ilkesi |
| 11 | Süreç odaklı değerlendirme var, yalnızca ürün ölçülmüyor | UYARI | Rapor: "süreç değerlendirmeye de odaklanmalıdır" |
| 12 | Kavram yanılgıları öngörülmüş | BİLGİ | Yapılandırmacı öğrenme yaklaşımı — Fosnot (2013) |

**Yedi kural doğrudan kurumun kendi araştırma bulgularından türemiştir** (2, 3, 4, 5, 8, 9, 11).

## Kritik ve uyarı ayrımı neden var

Kritik bulgu, planın pedagojik bütünlüğünü bozan hatadır. Bu bulgu varken **onay butonu sistem düzeyinde kilitlenir**; pedagojik uzman isterse de onaylayamaz. Uyarı ve bilgi seviyesindeki bulgular onayı engellemez, uzmanın değerlendirmesine bırakılır.

Bu ayrım bilinçlidir. Her bulguyu engelleyici yapmak sistemi kullanılamaz kılar; hiçbirini engelleyici yapmamak denetimi süse çevirir.

## Kanıt zorunluluğu

Denetçi her bulgu için planın **içinden birebir alıntı** vermek zorundadır. Alıntı üretemiyorsa bulgu geçersizdir.

Bunun nedeni pratiktir: kanıt istemeyen bir denetçi, olmayan hatayı bildirebilir. Uzmanın bulguyu doğrulaması için alıntıya bakması yeterli olmalı, planın tamamını yeniden okuması gerekmemeli.

## Denetçi neden ayrı bir çağrı

Üreten model kendi çıktısını denetlemez. Denetim, ayrı ve bağımsız bir yapay zekâ çağrısıdır ve yalnızca üretilmiş metni girdi alır.

Aynı çağrı içinde "üret ve kontrol et" demek denetim değildir; modelin kendi ürettiği metni savunmasıdır. Bu ayrım ürünün mimarisinin temelidir.

## Kaynakça

Birgili, B., Bulut, M. A., Gülünay, O., Koçoğlu, M. ve Baş, F. R. (2025). Technology-enhanced "GipSci" approach in developing contexts performs well at interest and curiosity, yet, needs reinforcing at inquiry level. *Research in Science & Technological Education.*

Bybee, R. W., Taylor, J. A., Gardner, A., Van Scotter, P., Carlson Powell, J., Westbrook, A. ve Landes, N. (2006). *The BSCS 5E instructional model: Origins, effectiveness, and applications.* BSCS.

Eisenkraft, A. (2003). Expanding the 5E model. *The Science Teacher, 70*(6).

Fosnot, C. T. (2013). *Constructivism: Theory, perspectives, and practice* (2. baskı). Teachers College Press.

Hmelo-Silver, C. E., Duncan, R. G. ve Chinn, C. A. (2007). Scaffolding and achievement in problem-based and inquiry learning. *Educational Psychologist, 42*(2), 99–107.

Krajcik, J. S. ve Blumenfeld, P. (2006). Project-based learning. *The Cambridge Handbook of the Learning Sciences.*

Pedaste, M. vd. (2015). Phases of inquiry-based learning: Definitions and the inquiry cycle. *Educational Research Review, 14*, 47–61.

T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Birimi (2026). *"GiPSci" Yaklaşımının Bilim Türkiye Programı Kapsamında Sorgulama Becerilerini Geliştirmeye Yönelik Çok Yönlü İncelemesi.* Şubat 2026.
