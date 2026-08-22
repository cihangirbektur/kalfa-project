export type Asama = {
  ad: string;
  sure: number;
  amac: string;
  ogretmen_eylemi: string;
  ogrenci_eylemi: string;
  tetikleyici_sorular: string[];
  kavram_yanilgilari: string[];
};

export type Etkinlik = {
  tip: string;
  ad: string;
  asama: string;
  sure: number;
  adimlar: string[];
  kazanim_hizasi: string;
  farklilastirma: { destek: string; zenginlestirme: string };
};

export type Malzeme = {
  ad: string;
  adet: number;
  birim_maliyet: number;
  hazirlik_suresi: number;
  guvenlik_notu: string;
  alternatif: string;
};

export type Medya = {
  tip: string;
  aciklama: string;
  arama_terimi: string;
  asama: string;
};

export type Olcme = {
  bicimlendirici_sorular: string[];
  performans_gorevi: string;
  rubrik: { kriter: string; puan3: string; puan2: string; puan1: string }[];
};

export type PlanIcerik = {
  baslik?: string;
  ozet?: string;
  asamalar?: Asama[];
  etkinlikler?: Etkinlik[];
  malzemeler?: Malzeme[];
  medya?: Medya[];
  olcme?: Olcme;
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
  icerik: PlanIcerik;
  created_at: string;
};

export const SINIF_DUZEYLERI = [
  { deger: "4-5", etiket: "4-5. sınıf (9-11 yaş)" },
  { deger: "6-7", etiket: "6-7. sınıf (11-13 yaş)" },
  { deger: "8-9", etiket: "8-9. sınıf (13-15 yaş)" },
  { deger: "10-11", etiket: "10-11. sınıf (15-17 yaş)" },
] as const;

export const SINIF_ETIKET: Record<string, string> = Object.fromEntries(
  SINIF_DUZEYLERI.map((s) => [s.deger, s.etiket]),
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
  cevrim_ici: "Çevrim İçi Eğitimler",
};
export const DURUMLAR = ["taslak", "denetimde", "onayli"] as const;

export const DURUM_ETIKET: Record<string, string> = {
  taslak: "Taslak",
  denetimde: "Denetimde",
  onayli: "Onaylı",
};
