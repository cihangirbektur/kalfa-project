CREATE TABLE public.atolye_alanlari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL UNIQUE,
  kategori text NOT NULL DEFAULT 'yuz_yuze',
  sure_hafta integer NOT NULL DEFAULT 0,
  amac text,
  konu_basliklari jsonb NOT NULL DEFAULT '[]'::jsonb,
  kitap_ortaokul_url text,
  kitap_lise_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atolye_alanlari TO authenticated;
GRANT SELECT ON public.atolye_alanlari TO anon;
GRANT ALL ON public.atolye_alanlari TO service_role;
ALTER TABLE public.atolye_alanlari ENABLE ROW LEVEL SECURITY;
CREATE POLICY acik_erisim ON public.atolye_alanlari FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.atolye_alanlari (ad, kategori, sure_hafta, amac, konu_basliklari) VALUES
('Robotik ve Kodlama', 'yuz_yuze', 12, 'Robotik ve Kodlama atölyesi, DENEYAP programında 12 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Akış Diyagramı Oluşturma", "Algoritma", "Sensörler", "Karar Yapıları", "Motor Kullanımı", "Döngü Yapıları"]'::jsonb),
('Elektronik Programlama ve Nesnelerin İnterneti', 'yuz_yuze', 13, 'Elektronik Programlama ve Nesnelerin İnterneti atölyesi, DENEYAP programında 13 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Nesnelerin İnterneti (IoT)", "Robot Kol Yapımı", "LCD Ekran ve Hata Ayıklama", "Motorlar - DC/Servo Motor", "Mühendislik Tasarım Süreçleri"]'::jsonb),
('Tasarım ve Üretim', 'yuz_yuze', 12, 'Tasarım ve Üretim atölyesi, DENEYAP programında 12 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Tasarım Odaklı Düşünme", "2 Boyutlu Çizim Programları", "3 Boyutlu Modelleme Programları", "Lazer Markalama", "Torna-Freze-CNC Tezgah"]'::jsonb),
('Enerji Teknolojileri', 'yuz_yuze', 12, 'Enerji Teknolojileri atölyesi, DENEYAP programında 12 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Yenilenebilir Enerji Kaynakları", "Sürdürülebilirlik", "Enerji Türleri", "Pil Teknolojileri", "Elektrikli Araçlar"]'::jsonb),
('Havacılık ve Uzay Teknolojileri', 'yuz_yuze', 12, 'Havacılık ve Uzay Teknolojileri atölyesi, DENEYAP programında 12 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Havacılık Tarihi", "Uçuşun Esasları", "Havacılıkta Kullanılan Malzemeler", "Başlangıç Model Uçak Yapımı", "İHA Sistemleri", "İtki Sistemleri"]'::jsonb),
('İleri Robotik', 'yuz_yuze', 7, 'İleri Robotik atölyesi, DENEYAP programında 7 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Robot Çeşitleri", "Endüstriyel Alanlardaki Teknolojik Uygulamalar", "C++ Programlama Dili", "3D Yazıcı", "Algılayıcı Seçme"]'::jsonb),
('Malzeme Bilimi ve Nanoteknoloji', 'yuz_yuze', 6, 'Malzeme Bilimi ve Nanoteknoloji atölyesi, DENEYAP programında 6 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Atomik ve Nano Yapı", "Elektron Mikroskobu", "Atomik Kuvvet Mikroskobu", "Biyomimikri", "Nanomalzemeler ve Kullanım Alanları"]'::jsonb),
('Yazılım Teknolojileri', 'hibrit', 7, 'Yazılım Teknolojileri atölyesi, DENEYAP programında 7 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Temel Programlama Mantığı", "Algoritma Tasarımı", "C++ Programlama Dili", "Karar Verme ve Döngü Komutları", "Nesne Yönelimli Programlama"]'::jsonb),
('Siber Güvenlik', 'cevrim_ici', 8, 'Siber Güvenlik atölyesi, DENEYAP programında 8 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Sanal Makine", "Kali Linux Kurulumu", "Temel Komutlar ve Araçlar", "Parola ve Parola Tahmin Saldırıları", "Kriptografi", "Basit Şifreleme Algoritmaları", "Sayısal İmza"]'::jsonb),
('Yapay Zeka', 'cevrim_ici', 8, 'Yapay Zeka atölyesi, DENEYAP programında 8 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Verinin Önemi ve Veri İşleme", "Python ile Yapay Zeka Mantığı ve Veri Organizasyonu", "Yapay Zeka Matematiği ve Bulanık Mantık Tekniği"]'::jsonb),
('Mobil Uygulama', 'cevrim_ici', 6, 'Mobil Uygulama atölyesi, DENEYAP programında 6 hafta süren ve alanın temel konularını uygulamalı olarak ele alan bir atölyedir.', '["Mobilite Kavramı", "App Inventor Uygulamaları", "Android Studio Uygulamaları", "Flutter Yazılım Geliştirme Kiti", "ThingSpeak", "Java Programlama Dili"]'::jsonb);

DELETE FROM public.kazanimlar;

INSERT INTO public.kazanimlar (kod, metin, atolye_alani, yas_grubu, bloom_seviyesi, kategori) VALUES
('RK-O1', 'Basit bir algoritmayı akış diyagramına dökerek karar yapılarıyla çalıştırır', 'Robotik ve Kodlama', 'ortaokul', 'Uygulama', 'yuz_yuze'),
('RK-L1', 'İki farklı algoritmanın verimliliğini adım sayısı üzerinden karşılaştırır', 'Robotik ve Kodlama', 'lise', 'Değerlendirme', 'yuz_yuze'),
('EP-O1', 'Bir sensörden gelen veriyi okuyup LCD ekranda görüntüler ve eşik değere göre çıktı üretir', 'Elektronik Programlama ve Nesnelerin İnterneti', 'ortaokul', 'Uygulama', 'yuz_yuze'),
('EP-L1', 'Nesnelerin interneti yaklaşımıyla veri toplayan ve uzaktan izlenebilen bir sistem tasarlar', 'Elektronik Programlama ve Nesnelerin İnterneti', 'lise', 'Sentez', 'yuz_yuze'),
('TU-O1', 'Tasarım odaklı düşünme basamaklarını izleyerek bir ihtiyaca yönelik prototip üretir', 'Tasarım ve Üretim', 'ortaokul', 'Uygulama', 'yuz_yuze'),
('TU-L1', 'Üç boyutlu modelleme programıyla tasarladığı parçanın üretim yöntemini gerekçelendirir', 'Tasarım ve Üretim', 'lise', 'Sentez', 'yuz_yuze'),
('ET-O1', 'Enerji dönüşümünü bir düzenek üzerinde gözlemleyerek enerji türlerini sınıflandırır', 'Enerji Teknolojileri', 'ortaokul', 'Kavrama', 'yuz_yuze'),
('ET-L1', 'İki farklı yenilenebilir enerji kaynağını verim ve sürdürülebilirlik açısından karşılaştırır', 'Enerji Teknolojileri', 'lise', 'Değerlendirme', 'yuz_yuze'),
('HU-O1', 'Uçuşun esaslarını basit bir model uçak yaparak gösterir', 'Havacılık ve Uzay Teknolojileri', 'ortaokul', 'Uygulama', 'yuz_yuze'),
('HU-L1', 'İHA sistemlerinde itki seçiminin uçuş performansına etkisini inceler', 'Havacılık ve Uzay Teknolojileri', 'lise', 'Analiz', 'yuz_yuze'),
('IR-O1', 'Robot çeşitlerini kullanım alanlarına göre sınıflandırır', 'İleri Robotik', 'ortaokul', 'Kavrama', 'yuz_yuze'),
('IR-L1', 'Belirlenen bir robotik probleme uygun algılayıcıyı gerekçelendirerek seçer', 'İleri Robotik', 'lise', 'Analiz', 'yuz_yuze'),
('MN-O1', 'Biyomimikri örneklerinden yola çıkarak doğadaki yapıların malzeme tasarımına nasıl ilham verdiğini açıklar', 'Malzeme Bilimi ve Nanoteknoloji', 'ortaokul', 'Kavrama', 'yuz_yuze'),
('MN-L1', 'Nanomalzemelerin kullanım alanlarını yüzey alanı-hacim ilişkisi üzerinden inceler', 'Malzeme Bilimi ve Nanoteknoloji', 'lise', 'Analiz', 'yuz_yuze'),
('YT-O1', 'Bir problemi akış diyagramına dökerek karar ve döngü yapılarıyla çözer', 'Yazılım Teknolojileri', 'ortaokul', 'Uygulama', 'hibrit'),
('YT-L1', 'Nesne yönelimli programlama yaklaşımıyla sınıf ve nesne kullanan küçük bir uygulama tasarlar', 'Yazılım Teknolojileri', 'lise', 'Sentez', 'hibrit'),
('SG-O1', 'Güçlü ve zayıf parolayı ölçütlere dayanarak ayırt eder ve parola saldırı türlerini açıklar', 'Siber Güvenlik', 'ortaokul', 'Kavrama', 'cevrim_ici'),
('SG-L1', 'Basit bir şifreleme algoritması kullanarak veriyi şifreler ve çözer', 'Siber Güvenlik', 'lise', 'Uygulama', 'cevrim_ici'),
('YZ-O1', 'Verinin yapay zekâ için önemini günlük hayat örnekleriyle açıklar', 'Yapay Zeka', 'ortaokul', 'Kavrama', 'cevrim_ici'),
('YZ-L1', 'Bulanık mantık yaklaşımının klasik mantıktan farkını örnek bir karar problemi üzerinde inceler', 'Yapay Zeka', 'lise', 'Analiz', 'cevrim_ici'),
('MU-O1', 'App Inventor kullanarak tek ekranlı işlevsel bir mobil uygulama oluşturur', 'Mobil Uygulama', 'ortaokul', 'Uygulama', 'cevrim_ici'),
('MU-L1', 'Belirlenen bir kullanıcı ihtiyacı için veri alışverişi yapan mobil uygulama akışı tasarlar', 'Mobil Uygulama', 'lise', 'Sentez', 'cevrim_ici');

UPDATE public.planlar SET yas_grubu = CASE WHEN yas_grubu IN ('8-9','10-11','lise') THEN 'lise' ELSE 'ortaokul' END;

UPDATE public.planlar SET kazanim_id = NULL WHERE kazanim_id IS NOT NULL;