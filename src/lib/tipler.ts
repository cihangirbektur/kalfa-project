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
  tahmini_birim_maliyet_tl: number;
  hazirlik_suresi_dk: number;
  guvenlik_notu: string;
  alternatif: string;
  basilabilir_mi: boolean;
};

export type Medya = {
  tip: string;
  kategori: string;
  aciklama: string;
  arama_terimi: string;
  kullanilacak_asama: string;
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

export type AtolyeAlani = {
  id: string;
  ad: string;
  kategori: string;
  program: string;
  sure_hafta: number;
  amac: string | null;
  konu_basliklari: string[];
  kitap_ortaokul_url: string | null;
  kitap_lise_url: string | null;
};

export const PROGRAM_SIRASI = ["Bilim Türkiye", "DENEYAP Teknoloji Atölyesi"] as const;

export const PROGRAM_GRUP_ETIKET: Record<string, string> = {
  "Bilim Türkiye": "Bilim Türkiye Atölye Temaları",
  "DENEYAP Teknoloji Atölyesi": "DENEYAP Teknoloji Atölyesi Eğitim Alanları",
};

export const KONU_BASLIGI_YOK_NOTU =
  "Bu tema için resmî konu başlıkları henüz sisteme tanımlı değil; üretim tema tanımı üzerinden yapılır. Konu başlıkları Eğitim ve Ar-Ge Koordinatörlüğü'nden temin edildiğinde tek veri kaydıyla eklenir.";

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
  icerik: PlanIcerik;
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
  onayli: "Onaylı",
};
