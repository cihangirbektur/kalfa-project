export type KavramYanilgisi = { yanilgi: string; ele_alinma_bicimi: string };

export type Asama = {
  asama: string;
  sure_dk: number;
  amac: string;
  ogretmen_eylemi: string;
  ogrenci_eylemi: string;
  tetikleyici_sorular: string[];
  beklenen_kavram_yanilgilari: KavramYanilgisi[];
};

export type OyunYapisi = {
  oyuncu_sayisi: string;
  bilesenler: string;
  kart_veya_parca_tipleri: string[];
  tur_akisi: string[];
  kazanma_kosulu: string;
} | null;

export const OYUN_TIPLERI = ["kart_oyunu", "kutu_strateji_oyunu", "oyunlastirilmis_gorev"] as const;

export const ETKINLIK_TIPLERI = [
  "deney",
  "kart_oyunu",
  "kutu_strateji_oyunu",
  "oyunlastirilmis_gorev",
  "dijital_quiz",
  "simulasyon",
  "istasyon_calismasi",
] as const;

export const ETKINLIK_TIP_ETIKET: Record<string, string> = {
  deney: "Deney",
  kart_oyunu: "Kart Oyunu",
  kutu_strateji_oyunu: "Kutu/Strateji Oyunu",
  oyunlastirilmis_gorev: "Oyunlaştırılmış Görev",
  dijital_quiz: "Dijital Quiz",
  simulasyon: "Simülasyon",
  istasyon_calismasi: "İstasyon Çalışması",
};

export type Etkinlik = {
  tip: string;
  ad: string;
  bagli_asama: string;
  sure_dk: number;
  adimlar: string[];
  kazanim_hizasi: string;
  bloom_seviyesi: string;
  farklilastirma: { destek: string; zenginlestirme: string };
  oyun_yapisi: OyunYapisi;
};

export type Malzeme = {
  ad: string;
  adet: string | number;
  birim?: string;
  tahmini_birim_maliyet_tl: number;
  hazirlik_suresi_dk: number;
  guvenlik_notu: string;
  alternatif: string;
  basilabilir_mi: boolean;
};

export type Medya = {
  ad?: string;
  tip: string;
  kategori: string;
  aciklama: string;
  arama_terimi: string;
  onerilen_kaynak?: string;
  kullanilacak_asama: string;
  /** Basılı materyal alanları */
  ne_icerir?: string;
  sayfa_sayisi?: number | string;
  baski_notu?: string;
  /** Kullanıcı isteğiyle üretilen görselin depolama yolu */
  gorsel_yolu?: string;
};


export type SurecOdakli = { ne_gozlemlenecek: string; yansitici_arac: string };

export type Degerlendirme = {
  bicimlendirici: { asama: string; soru: string }[];
  duzey_belirleyici: {
    gorev: string;
    rubrik: { kriter: string; "3_puan": string; "2_puan": string; "1_puan": string }[];
  };
  surec_odakli?: SurecOdakli[];
};

export type MerakTetikleyicileri = {
  soru_kartlari?: string[];
  merak_kutusu_notu?: string;
} | null;

export type UrunOdakliCikti = {
  urun_adi?: string;
  urun_tipi?: string;
  ogrenci_ne_uretecek?: string;
  degerlendirme_olcutu?: string;
} | null;

export type PlanIcerik = {
  plan_basligi?: string;
  kazanim?: { kod: string; metin: string; bloom_seviyesi: string };
  seviye?: string;
  model?: string;
  toplam_sure_dk?: number;
  ogrenci_sayisi?: number;
  iliskili_konu_basliklari?: string[];
  asamalar?: Asama[];
  etkinlikler?: Etkinlik[];
  malzemeler?: Malzeme[];
  medya_onerileri?: Medya[];
  degerlendirme?: Degerlendirme;
  merak_tetikleyicileri?: MerakTetikleyicileri;
  urun_odakli_cikti?: UrunOdakliCikti;
};


export type Kazanim = {
  id: string;
  kod: string;
  metin: string;
  atolye_alani: string;
  yas_grubu: string;
  bloom_seviyesi: string;
  kategori: string;
};

export type KonuBasliklari = string[] | Record<string, string[]>;

export type AtolyeAlani = {
  id: string;
  ad: string;
  kategori: string;
  program: string;
  sure_hafta: number;
  amac: string | null;
  konu_basliklari: KonuBasliklari;
  kaynak?: string | null;
  kitap_ortaokul_url: string | null;
  kitap_lise_url: string | null;
};

export const PROGRAM_SIRASI = ["Bilim Türkiye", "DENEYAP Teknoloji Atölyesi"] as const;

export const PROGRAM_GRUP_ETIKET: Record<string, string> = {
  "Bilim Türkiye": "Bilim Türkiye Atölyeleri",
  "DENEYAP Teknoloji Atölyesi": "DENEYAP Teknoloji Atölyesi Eğitim Alanları",
};

export const BILIMTR = "Bilim Türkiye";

/** Bilim Türkiye yaş grupları (konu_basliklari jsonb anahtarlarıyla birebir). */
export const BILIMTR_YAS_GRUPLARI = [
  { deger: "6-8", etiket: "6 - 8 Yaş" },
  { deger: "9-11", etiket: "9 - 11 Yaş" },
  { deger: "12-14", etiket: "12 - 14 Yaş" },
] as const;

export const BILIMTR_YAS_ETIKET: Record<string, string> = Object.fromEntries(
  BILIMTR_YAS_GRUPLARI.map((y) => [y.deger, y.etiket]),
);

/** Kaynak: T3 Vakfı Araştırma Raporu, Şubat 2026 — Bilim Türkiye program çeşitliliği */
export const BILIMTR_PROGRAM_TURLERI = [
  { deger: "bir_saatlik", etiket: "Bir saatlik atölye", sure: 60 },
  { deger: "paket", etiket: "Paket program", sure: 120 },
  { deger: "donemlik", etiket: "Dönemlik eğitim", sure: 90 },
  { deger: "tematik", etiket: "Tematik atölye", sure: 90 },
] as const;

export const BILIMTR_PROGRAM_TURU_ETIKET: Record<string, string> = Object.fromEntries(
  BILIMTR_PROGRAM_TURLERI.map((p) => [p.deger, p.etiket]),
);

export const BILIMTR_KAYNAK_NOTU =
  "Konu başlıkları t3bilimturkiye.org/tr/atolyeler adresinde yayımlanan resmî atölye içeriklerinden alınmıştır.";

/** Seçilen atölye ve yaş grubuna ait konu başlıklarını döndürür. */
export function konuBasliklariAl(
  alan: Pick<AtolyeAlani, "konu_basliklari"> | undefined,
  yasGrubu?: string,
): string[] {
  const kb = alan?.konu_basliklari;
  if (!kb) return [];
  if (Array.isArray(kb)) return kb;
  if (yasGrubu && Array.isArray(kb[yasGrubu])) return kb[yasGrubu];
  return Object.values(kb).flat();
}


export type AsamaSablonu = {
  id: string;
  kod: string;
  ad: string;
  kaynak: string | null;
  asamalar: { ad: string; oran: number; amac: string }[];
};

export type KuralProfili = {
  id: string;
  kod: string;
  ad: string;
  aciklama: string | null;
  kaynak: string | null;
};

/** Kullanıcıya gösterilen tek seçim; arka planda iki katmana açılır. */
export const OGRETIM_SECENEKLERI = [
  {
    deger: "GIPSCI",
    etiket: "GiPSci (Rehberli Sorgulama, Ürün Odaklı Bilim)",
    sablon: "5E",
    profil: "GIPSCI",
  },
  { deger: "5E", etiket: "5E", sablon: "5E", profil: "KLASIK" },
  { deger: "7E", etiket: "7E", sablon: "7E", profil: "KLASIK" },
] as const;

export const OGRETIM_SECENEK_ETIKET: Record<string, string> = {
  GIPSCI: "GiPSci",
  "5E": "5E",
  "7E": "7E",
};

export const GIPSCI_BILGI_NOTU =
  "GiPSci, 5E'nin beş aşamalı ders planı formatını kullanır. Ek olarak rehberli sorgulamayı, ürün odaklılığı ve bağlamsal öğrenmeyi zorunlu kılar. Bu nedenle GiPSci'de üçüncü aşama Yaratma/Açıklama sırasıyla yazılır — yaratma öndedir.";

export type OgretimModeli = {
  id: string;
  ad: string;
  asamalar: { ad: string; oran: number; amac: string }[];
  denetim_kurallari: unknown;
};

export type Plan = {
  id: string;
  kazanim_id: string | null;
  model_id: string | null;
  yas_grubu: string;
  toplam_sure: number;
  ogrenci_sayisi: number;
  butce: number;
  durum: string;
  versiyon: number;
  program_donemi?: string;
  asama_sablonu?: string;
  kural_profili?: string;
  arsivlendi?: boolean;
  arsivlenme_tarihi?: string | null;
  onay_tarihi?: string | null;
  icerik: PlanIcerik;
  created_at: string;
};

export type DenetimTuru = {
  id: string;
  plan_id: string | null;
  tur_no: number;
  denetci_notu: string | null;
  karar: string | null;
  karar_tarihi: string | null;
  kritik_sayisi: number;
  uyari_sayisi: number;
  bilgi_sayisi: number;
  created_at: string;
};

export type GeriBildirim = {
  id: string;
  plan_id: string | null;
  uygulandi_mi: boolean;
  not_metni: string | null;
  created_at: string;
};

export const SINIF_DUZEYLERI = [
  {
    deger: "ortaokul",
    etiket: "Ortaokul düzeyi · DENEYAP 4–5. sınıf · 9–11 yaş",
    kisa: "Ortaokul",
    yas: "9–11 yaş",
  },
  {
    deger: "lise",
    etiket: "Lise düzeyi · DENEYAP 8–9. sınıf ve hazırlık · 13–15 yaş",
    kisa: "Lise",
    yas: "13–15 yaş",
  },
  {
    deger: "bilimtr_karma",
    etiket: "Bilim Türkiye atölye grubu · 6–14 yaş",
    kisa: "Bilim Türkiye atölye grubu",
    yas: "6–14 yaş",
  },
] as const;

export const SINIF_ETIKET: Record<string, string> = Object.fromEntries(
  SINIF_DUZEYLERI.map((s) => [s.deger, s.etiket]),
);

export const SINIF_ROZET: Record<string, string> = Object.fromEntries(
  SINIF_DUZEYLERI.map((s) => [s.deger, `${s.kisa} · ${s.yas}`]),
);

export const SINIF_YAS: Record<string, string> = Object.fromEntries(
  SINIF_DUZEYLERI.map((s) => [s.deger, s.yas]),
);


export const PROGRAM_DONEMLERI = [
  { deger: "proje_temelli", etiket: "Proje Temelli Dersler Dönemi (ilk 24 ay)" },
  { deger: "takimlar", etiket: "Takımlar Dönemi (son 12 ay)" },
] as const;

export const PROGRAM_DONEMI_ETIKET: Record<string, string> = Object.fromEntries(
  PROGRAM_DONEMLERI.map((p) => [p.deger, p.etiket]),
);

export const KATEGORI_ETIKET: Record<string, string> = {
  yuz_yuze: "Yüz Yüze Eğitimler",
  hibrit: "Hibrit Eğitimler",
  cevrim_ici: "Çevrim İçi Eğitimler",
};

export const KATEGORI_SIRASI = ["yuz_yuze", "hibrit", "cevrim_ici"] as const;

export const DURUMLAR = ["taslak", "denetimde", "onayli"] as const;

export const DURUM_ETIKET: Record<string, string> = {
  taslak: "Taslak",
  denetimde: "Denetimde",
  revizyon_istendi: "Revizyon İstendi",
  onayli: "Onaylı",
  arsivlendi: "Arşivlendi",
};

/** Durum rozetleri kendi renk ailesinde; marka turuncusu kullanılmaz. */
export const DURUM_ROZET_STIL: Record<string, string> = {
  taslak: "bg-slate-100 text-slate-700",
  denetimde: "bg-sky-100 text-sky-800",
  revizyon_istendi: "bg-amber-100 text-amber-800",
  onayli: "bg-emerald-100 text-emerald-800",
  arsivlendi: "bg-slate-100/70 text-slate-500 italic",
};


export type DenetimBulgusu = {
  id: string;
  plan_id: string | null;
  kural_no: number;
  seviye: string;
  gecti: boolean;
  mesaj: string | null;
  kanit_alintisi: string | null;
  ilgili_asama: string | null;
  oneri: string | null;
  tur_id?: string | null;
  created_at: string;
};

export const KURAL_METINLERI: Record<number, string> = {
  1: "Öğrenci kendi bulgusunu, öğretmen açıklamasından önce anlatıyor mu?",
  2: "Keşfetme aşaması toplam sürenin en az %25'i mi?",
  3: "Yaratma/Açıklama aşaması toplam sürenin en az %20'si mi?",
  4: "Öğretmen eylemleri cevabı vermek yerine soruyla mı yönlendiriyor?",
  5: "Plan somut bir öğrenci ürünüyle bitiyor mu?",
  6: "Her etkinlik kazanımla açıkça hizalı mı?",
  7: "Riskli malzemede güvenlik notu var mı?",
  8: "Aşama süreleri toplamı toplam süreye eşit mi?",
  9: "En az 4 merak soru kartı var mı ve hipotez kurmaya çağırıyor mu?",
  10: "Biçimlendirici değerlendirme ders boyuna dağılmış mı?",
  11: "Süreç odaklı değerlendirme var mı?",
  12: "Kavram yanılgıları öngörülmüş mü?",
};

export const SEVIYE_ETIKET: Record<string, string> = {
  kritik: "Kritik",
  uyari: "Uyarı",
  bilgi: "Bilgi",
};

export const BASILI_TIP_ETIKET: Record<string, string> = {
  calisma_yapragi: "Çalışma Yaprağı",
  soru_karti_destesi: "Soru Kartı Destesi",
  poster: "Poster",
  yonerge_karti: "Yönerge Kartı",
  rubrik_formu: "Rubrik Formu",
  oyun_mati: "Oyun Matı",
  etiket: "Etiket",
};

/** Denetim bulgularının dayandığı kaynak metinleri (kural numarasına göre). */
export const KURAL_KAYNAKLARI: Record<number, string> = {
  1: "Kaynak: 5E öğretim modeli (Bybee ve BSCS, 1987)",
  2: "Kaynak: T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu, Şubat 2026 — sorgulama boyutu ICI ölçeğinde en zayıf alan (1.05)",
  3: "Kaynak: T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu, Şubat 2026 — sorgulama boyutu ICI ölçeğinde en zayıf alan (1.05)",
  4: "Kaynak: GiPSci modeli — rehberli sorgulama ve ürün tabanlı öğrenme ilkesi",
  5: "Kaynak: GiPSci modeli — rehberli sorgulama ve ürün tabanlı öğrenme ilkesi",
  7: "Kaynak: atölye güvenlik uygulaması",
  9: "Kaynak: T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu, Şubat 2026 — sorgulama boyutu ICI ölçeğinde en zayıf alan (1.05)",
  11: "Kaynak: T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu, Şubat 2026 — sorgulama boyutu ICI ölçeğinde en zayıf alan (1.05)",
};

/** Öğretim modeli bilgi kartı içerikleri. */
export const MODEL_BILGI: Record<
  string,
  { ad: string; acilim: string; kaynak: string }
> = {
  GIPSCI: {
    ad: "GiPSci",
    acilim: "Guided Inquiry and Product-based Science in Science Centers",
    kaynak: "T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu, Şubat 2026",
  },
  "5E": {
    ad: "5E",
    acilim: "Engage · Explore · Explain · Elaborate · Evaluate",
    kaynak: "Bybee ve BSCS, 1987",
  },
  "7E": {
    ad: "7E",
    acilim: "Elicit · Engage · Explore · Explain · Elaborate · Evaluate · Extend",
    kaynak: "Eisenkraft, 2003",
  },
};

/** Üretimde beklenen dijital medya tipleri ve alt sınırlar. */
export const DIJITAL_MEDYA_TIPLERI = [
  "video",
  "animasyon",
  "simulasyon",
  "interaktif_arac",
  "dijital_quiz",
] as const;

export const MEDYA_ALT_SINIR = { dijital: 2, basili: 3 };
