# KVKK Aydınlatma Metni

**KALFA — Bilim Türkiye / DENEYAP Atölye İçeriği Üretim Aracı**
Son güncelleme: 26 Ağustos 2026 · Sürüm: Ön Prototip

---

## 1. Giriş

Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi kapsamında hazırlanmıştır. KALFA, T3 Vakfı Bursiyer Yapay Zekâ Creathonu 2026 kapsamında brAIn takımı tarafından geliştirilen bir **ön prototiptir**.

## 2. Temel ilke: veri minimizasyonu

KALFA, **tasarım gereği kişisel veri işlememektedir.** Bu, sonradan alınmış bir önlem değil, ürünün mimarisine baştan yerleştirilmiş bir kısıttır.

Sistemin girdisi öğretim parametreleridir, çıktısı eğitim içeriğidir. Arada öğrenciye ait hiçbir veri bulunmaz.

## 3. İşlenen veri kategorileri

| Kategori | Örnek | Kişisel veri mi? |
|---|---|---|
| Öğretim verisi | Kazanım kodu, atölye alanı, sınıf seviyesi, ders süresi, öğrenci sayısı | Hayır |
| Üretilen içerik | Atölye planı, etkinlik, malzeme listesi, ölçme aracı | Hayır |
| Denetim kaydı | Pedagojik bulgular, onay durumu, sürüm geçmişi | Hayır |
| Kullanıcı rolü | Seçili rol bilgisi (İçerik Uzmanı, Pedagojik Uzman, Eğitmen, Eğitim Yöneticisi) | Hayır — kimlikle ilişkilendirilmez |
| Eğitmen geri bildirimi | Serbest metin uygulama notu | Kullanıcı kendi girerse olabilir |

## 4. İşlenmeyen veriler

Aşağıdaki veriler sistemde **hiçbir aşamada** toplanmaz, işlenmez veya saklanmaz:

- Öğrenci adı, soyadı, T.C. kimlik numarası, okul numarası
- Öğrenci başarı, not veya değerlendirme kaydı
- Öğrenci fotoğrafı, ses veya görüntü kaydı
- Veli iletişim bilgisi
- Konum verisi
- Biyometrik veya sağlık verisi

## 5. Öğrenci sayısı bilgisi hakkında

Formda istenen "öğrenci sayısı", malzeme miktarı ve etkinlik kurgusunun hesaplanması için kullanılan **sayısal bir parametredir**. Belirli bir öğrenciyi işaret etmez, kimlikle ilişkilendirilemez ve bu nedenle kişisel veri niteliği taşımaz.

## 6. Eğitmen geri bildirimi

Eğitmen, uyguladığı atölye hakkında serbest metin not bırakabilir. Bu alanın amacı içeriğin iyileştirilmesidir.

**Kullanıcı uyarısı:** Bu alana öğrenci adı, numarası veya kimliği belirlenebilir başka bir bilgi yazılmamalıdır. Arayüzde bu yönde bilgilendirme yapılır. Bu alana girilen içeriğin sorumluluğu giren kullanıcıya aittir.

## 7. Yapay zekâ işleme faaliyeti

İçerik üretimi ve pedagojik denetim için yapay zekâ servislerine istek gönderilir. Gönderilen veri yalnızca şunlardan oluşur:

- Kazanım kodu ve metni
- Atölye alanı ve konu başlıkları
- Sınıf seviyesi, süre, öğrenci sayısı
- Öğretim modeli aşamaları
- Denetim aşamasında: üretilmiş plan içeriği

Bu isteklerin hiçbirinde kişisel veri bulunmaz.

## 8. Saklama süresi

Üretilen içerikler ve sürüm geçmişi, ilgili kurumun içerik havuzunda kurumsal ihtiyaç süresince saklanır. Ön prototip aşamasında veriler yalnızca gösterim amacıyla tutulmakta olup, değerlendirme süreci tamamlandığında silinebilir.

## 9. Erişim ve güvenlik

- Rol bazlı erişim denetimi uygulanır; her rol yalnızca kendi sorumluluk alanındaki içeriği görür
- Onaylanmamış içerik eğitmen görünümüne düşmez
- Yapay zekâ servis anahtarları arka uçta tutulur, arayüz koduna yazılmaz
- Tüm iletişim HTTPS üzerinden yapılır

## 10. İlgili kişi hakları

KVKK'nın 11. maddesi kapsamındaki haklar saklıdır. Sistem kişisel veri işlemediğinden bu haklar pratikte yalnızca kullanıcının kendi girdiği geri bildirim metinleri için geçerlidir; bu içerikler talep üzerine silinir.

## 11. İletişim

brAIn Takımı — T3 Vakfı Bursiyer Yapay Zekâ Creathonu 2026
Program iletişimi: girisim@turkiyeteknolojitakimi.org
