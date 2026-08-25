
CREATE TABLE public.asama_sablonlari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kod text NOT NULL UNIQUE,
  ad text NOT NULL,
  kaynak text,
  asamalar jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.asama_sablonlari TO authenticated;
GRANT SELECT ON public.asama_sablonlari TO anon;
GRANT ALL ON public.asama_sablonlari TO service_role;
ALTER TABLE public.asama_sablonlari ENABLE ROW LEVEL SECURITY;
CREATE POLICY acik_erisim ON public.asama_sablonlari FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.kural_profilleri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kod text NOT NULL UNIQUE,
  ad text NOT NULL,
  aciklama text,
  kaynak text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kural_profilleri TO authenticated;
GRANT SELECT ON public.kural_profilleri TO anon;
GRANT ALL ON public.kural_profilleri TO service_role;
ALTER TABLE public.kural_profilleri ENABLE ROW LEVEL SECURITY;
CREATE POLICY acik_erisim ON public.kural_profilleri FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.asama_sablonlari (kod, ad, kaynak, asamalar) VALUES
('5E', '5E aşama şablonu', 'Bybee ve BSCS (1987, 2006)', '[
 {"ad":"Harekete Geçme (Engage)","oran":0.10,"amac":"Merak uyandırma ve ön bilgiyi açığa çıkarma"},
 {"ad":"Keşfetme (Explore)","oran":0.30,"amac":"Öğrencinin doğrudan deneyimle veri toplaması"},
 {"ad":"Açıklama/Yaratma (Explain/Create)","oran":0.25,"amac":"Bulgunun öğrenci diliyle açıklanması ve somut ürüne dönüşmesi"},
 {"ad":"Derinleştirme (Elaborate)","oran":0.20,"amac":"Kavramın farklı bir bağlama aktarılması"},
 {"ad":"Değerlendirme (Evaluate)","oran":0.15,"amac":"Öğrenmenin ve sürecin değerlendirilmesi"}
]'::jsonb),
('7E', '7E aşama şablonu', 'Eisenkraft (2003)', '[
 {"ad":"Ortaya Çıkarma (Elicit)","oran":0.07,"amac":"Ön bilgi ve kavram yanılgılarının ortaya çıkarılması"},
 {"ad":"Harekete Geçme (Engage)","oran":0.10,"amac":"Merak uyandırma ve odaklanma"},
 {"ad":"Keşfetme (Explore)","oran":0.28,"amac":"Doğrudan deneyimle veri toplama"},
 {"ad":"Açıklama (Explain)","oran":0.20,"amac":"Bulgunun açıklanması ve terminolojinin verilmesi"},
 {"ad":"Derinleştirme (Elaborate)","oran":0.17,"amac":"Farklı bağlamda uygulama"},
 {"ad":"Değerlendirme (Evaluate)","oran":0.10,"amac":"Öğrenmenin değerlendirilmesi"},
 {"ad":"Genişletme (Extend)","oran":0.08,"amac":"Kavramın günlük yaşama ve yeni alanlara taşınması"}
]'::jsonb);

INSERT INTO public.kural_profilleri (kod, ad, aciklama, kaynak) VALUES
('KLASIK', 'Klasik', 'Yalnızca aşama sırası ve süre dengesi denetlenir.', NULL),
('GIPSCI', 'GiPSci — Rehberli Sorgulama, Ürün Odaklı Bilim', 'Guided Inquiry and Product-based Science in Science Centers. Üç ilkeyi zorunlu kılar: rehberli sorgulama (eğitmen cevabı vermez, yapılandırılmış soruyla yönlendirir), ürün tabanlı öğrenme (oturum somut bir öğrenci ürünüyle biter), bağlamsal öğrenme (sergi–atölye köprüsü, soru kartları ve merak kutusu).', 'T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu, Şubat 2026');

ALTER TABLE public.planlar ADD COLUMN IF NOT EXISTS asama_sablonu text NOT NULL DEFAULT '5E';
ALTER TABLE public.planlar ADD COLUMN IF NOT EXISTS kural_profili text NOT NULL DEFAULT 'KLASIK';

ALTER TABLE public.atolye_alanlari ADD COLUMN IF NOT EXISTS program text NOT NULL DEFAULT 'DENEYAP Teknoloji Atölyesi';
UPDATE public.atolye_alanlari SET program = 'DENEYAP Teknoloji Atölyesi' WHERE program IS NULL OR program = '';

INSERT INTO public.atolye_alanlari (ad, kategori, sure_hafta, amac, konu_basliklari, program) VALUES
('Teknoloji', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: teknoloji.', '[]'::jsonb, 'Bilim Türkiye'),
('Astronomi ve Havacılık', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: astronomi ve havacılık.', '[]'::jsonb, 'Bilim Türkiye'),
('Matematik', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: matematik.', '[]'::jsonb, 'Bilim Türkiye'),
('Doğa Bilimleri', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: doğa bilimleri.', '[]'::jsonb, 'Bilim Türkiye'),
('Tasarım', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: tasarım.', '[]'::jsonb, 'Bilim Türkiye'),
('Girişimcilik', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: girişimcilik.', '[]'::jsonb, 'Bilim Türkiye'),
('Tarım Teknolojileri', 'yuz_yuze', 0, 'Bilim Türkiye atölye teması: tarım teknolojileri.', '[]'::jsonb, 'Bilim Türkiye');
