ALTER TABLE public.atolye_alanlari ADD COLUMN IF NOT EXISTS kaynak text;
ALTER TABLE public.planlar ADD COLUMN IF NOT EXISTS atolye_alani_id uuid;
ALTER TABLE public.planlar ADD COLUMN IF NOT EXISTS konu_basligi text;

UPDATE public.atolye_alanlari SET
  ad = 'Teknoloji Atölyesi',
  amac = 'Kodlamanın temeli olan algoritmik düşünmeyi öğretir; eğitim setleriyle elektronik devreleri ve mekanik sistemleri bütüncül kavratır. Proje tabanlı öğrenmeyle üretim odaklı düşünme alışkanlığı kazandırır.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["3B Modelleme","3B Yazıcı","Artırılmış Gerçeklik","Bilgisayar Kodlama","Elektronik Programlama","Kodlama ve Algoritma","Robotik Projeler","Temel Elektrik Devreleri","İkili Kod Sistemi"],"9-11":["3B Modelleme ve Üretim","Animasyon Yapımı","Artırılmış Gerçeklik","Elektronik Programlama","Enerji Teknolojileri","Oyun Tasarımı","Robotik Projeler","Robotik ve Kodlama","Temel Elektrik Devreleri"],"12-14":["Animasyon Yapımı","Bilgisayar Dilleri","Deneyap Kart Eğitimi","Elektronik Programlama","Enerji Teknolojileri","Mobil Uygulama Geliştirme","Oyun Tasarımı","Robotik Projeler","Yapay Zeka"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Teknoloji';

UPDATE public.atolye_alanlari SET
  ad = 'Matematik Atölyesi',
  amac = 'Günlük hayat problemlerine kendi çözüm yollarını oluşturma becerisini geliştirir. Geometrik ve cebirsel kavramları simülasyon ve üç boyutlu modellemeyle anlamlı hâle getirir.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["Geometrik Şekiller","Grafik Oluşturma","Kesirlere Giriş","Kümeler","Matematik Oyunları","Sayılar","Uzunluk Ölçme","Zaman","Örüntüler"],"9-11":["3 Boyutlu Düşünme","Alan","Açılar","Ağırlık Ölçümü","Denklemler","Geoboard","Kesirler","Kriptoloji","Matematik Oyunları"],"12-14":["Alan","Açılar","Geometrik Şekiller","Hacim","Kesirler","Olasılık","Oran - Orantı","Simetri","Örüntüler"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Matematik';

UPDATE public.atolye_alanlari SET
  ad = 'Girişim Atölyesi',
  amac = 'Küçük yaş grubu öğrencilere fikir geliştirme, inisiyatif alma, risk analizi, maliyet hesabı ve pazar araştırması konularında eğitim vererek geleceğin girişimcilerini yetiştirmeyi hedefler.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["Beyin Fırtınası","Fikir Geliştirme","Takım Çalışması"],"9-11":["Beyin Fırtınası","Eleştirel Düşünme","Fikir Geliştirme","Logo Tasarımı","Münazara","Pazar Analizi","Pazarlama","Takım Çalışması","İnovasyon Çeşitleri"],"12-14":["Beyin Fırtınası","Fikir Geliştirme","Müşteri Analizi","Satış","Sunum Becerileri","Takım Çalışması","Temel Finansal Düşünme","Yatırım","Üretken Olma"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Girişimcilik';

UPDATE public.atolye_alanlari SET
  ad = 'Tasarım Atölyesi',
  amac = 'Öğrencilerin yaratıcılığını ortaya çıkarır. Tezhip, ebru, minyatür gibi geleneksel Türk sanatlarının yanında taş boyama, seramik, dokuma gibi alanlarda tasarım yaparak kendini ifade etme fırsatı sunar.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["Boya-Baskı","Damlatmalı Sanat","Dokuma","Portre Çalışmaları","Sanat Akımları","Seramik Boyama","Soyut Sanat","Sulu Boya","Taş Boyama"],"9-11":["Doodle","Geleneksel Türk Sanatları","Keçeden Ürün Tasarımı","Kumaş Boyama","Kuru Çiçek Tasarımı","Makrome","Portre Çalışmaları","Sanat Akımları","Seramik Boyama"],"12-14":["Boya Baskı","Dokuma","Filografi","Kaligrafi","Kat''ı Sanatı","Keçeden Ürün Tasarımı","Mandala","Origami","Takı Yapımı"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Tasarım';

UPDATE public.atolye_alanlari SET
  ad = 'Doğa Bilimleri Atölyesi',
  amac = 'Fizik, kimya, biyoloji gibi temel bilimleri içeren atölye içerikleriyle öğrencilere doğayı bilimsel bir gözle okuma yeteneği kazandırmayı hedefler. Eğlenceli deneylerle gözlemleyerek, keşfederek ve sorgulayarak öğrenme esas alınır.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["Basınç","Canlıların Birbirleriyle İlişkileri","Doğa Gözlemleri","Doğadaki İşleyiş","Evimizdeki Kimya","Kaldırma Kuvveti","Kuvvet - Enerji İlişkisi","Mikroorganizmalar","Vücudumuzu Tanıyalım"],"9-11":["Atomlar ve Moleküller","Basınç","Doğadaki Sistemler","Evimizdeki Kimya","Hücre","Işık ve Optik","Kaldırma Kuvveti","Kuvvet - Enerji İlişkisi","Paleontoloji Bilimi"],"12-14":["Atomlar ve Moleküller","Elektrik ve Magnetizma","Evimizdeki Kimya","Kalıtım","Kuvvet - Enerji İlişkisi","Optik","Permakültür","Taşlar ve Kayaçlar","Vücudumuzdaki Sistemler"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Doğa Bilimleri';

UPDATE public.atolye_alanlari SET
  ad = 'Astronomi, Havacılık ve Uzay Atölyesi',
  amac = 'Madde, temel kuvvetler, aerodinamik ve aviyonik sistemlerle ilgili bilimsel prensipleri eğlenceli deneylerle keşfettirir. Hava araçlarının çalışma prensipleri simülasyon ve modellemelerle işlenir.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["Ay","Dünyamız ve Evren","Gezegenler","Güneş","Güneş Sistemi","Hava Taşıtları","Havanın Özellikleri","Uzay Teknolojileri","Uzay Çalışanları"],"9-11":["Aerodinamik","Ay","Bulutsular","Evren ve Biz","Gezegenler","Güneş","Güneş Sistemi","Uzay Teknolojileri","Uçma Prensipleri"],"12-14":["Dünya''nın Yapısı","GPS","Gizemli Evren","Güneş Sistemi","Uydular","Uzay Teknolojileri","Uçakların Çalışma Prensipleri","Uçma Prensipleri","Öte Gezegenler"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Astronomi ve Havacılık';

UPDATE public.atolye_alanlari SET
  ad = 'Tarım Teknolojileri Atölyesi',
  amac = 'Sürdürülebilir bir dünya için doğayı seven ve koruyan nesiller yetiştirmeyi hedefler. Zirai bilgi birikimi oluşturur; yazılım ve otomasyon çalışmalarının zirai faaliyetlere entegrasyonunu öğretir.',
  kaynak = 't3bilimturkiye.org/tr/atolyeler',
  konu_basliklari = '{"6-8":["Bitki Besleme Teknolojileri","Bitki Böcekleri","Bitki Sulama ve Sulama Teknolojileri","Bitki İlaçlama","Bitkisel Üretim","Fidancılık, Tohumculuk, Mantarcılık","Gübreleme","Sera Sistemleri","Tarım Araçları"],"9-11":["Akıllı Seralar","Akıllı Sulama Sistemleri","Bitki Besleme Teknolojileri","Bitki Sulama ve Sulama Teknolojileri","Bitkisel Üretim","Fidancılık, Tohumculuk, Mantarcılık","Gübreleme","Hidroponik Tarım","Sera Sistemleri"],"12-14":["Akıllı Seralar","Akıllı Sulama Sistemleri","Aquaponic Tarım","Bitki Besleme Teknolojileri","Bitki Sulama ve Sulama Teknolojileri","Bitkisel Üretim","Fidancılık, Tohumculuk, Mantarcılık","Gübreleme","Sera Sistemleri"]}'::jsonb
WHERE program = 'Bilim Türkiye' AND ad = 'Tarım Teknolojileri';