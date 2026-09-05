ALTER TABLE public.atolye_alanlari DROP CONSTRAINT IF EXISTS atolye_alanlari_ad_key;
ALTER TABLE public.atolye_alanlari ADD CONSTRAINT atolye_alanlari_program_ad_key UNIQUE (program, ad);

INSERT INTO public.atolye_alanlari (ad, kategori, program, sure_hafta, amac, konu_basliklari, kaynak)
VALUES
('Kişisel Gelişim Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Öğrencinin kendini, çevresini ve sosyal sınırlarını tanımasını destekleyen atölye.','["Doğaya Saygı","Beden Dili","Kişisel Sınırlar"]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Kimya ve İnsan Bilimleri Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Maddenin yapısını ve değişimini deneyler yoluyla keşfettiren atölye.','["Maddenin Tanecikli Yapısı","Maddenin Hal Değişimi"]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Doğa Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Canlılar ve doğal çevre üzerine gözlem temelli atölye.','[]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Fizik Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Kuvvet ve hareket kavramlarını deneyerek kavratan atölye.','["Kuvvet","Sürtünme Kuvveti","Dinamometre"]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Destekleyici Eğitimler Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Programı tamamlayıcı beceri ve etkinlik atölyesi.','[]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Matematik Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Matematiksel düşünmeyi oyun ve materyalle geliştiren atölye.','[]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Teknoloji Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Teknoloji okuryazarlığı ve üretim becerisi kazandıran atölye.','[]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı'),
('Astronomi Havacılık ve Uzay Atölyesi','yuz_yuze','Keşif Kampüsü',0,'Gökyüzü, havacılık ve uzay konularını keşfettiren atölye.','[]'::jsonb,'T3 Vakfı Keşif Kampüsü çocuk üniversitesi programı');