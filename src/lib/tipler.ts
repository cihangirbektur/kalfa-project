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
  icerik: PlanIcerik;
  created_at: string;
};

export const YAS_GRUPLARI = ["9-11", "12-14", "15-17"] as const;
export const DURUMLAR = ["taslak", "denetimde", "onayli"] as const;

export const DURUM_ETIKET: Record<string, string> = {
  taslak: "Taslak",
  denetimde: "Denetimde",
  onayli: "Onaylı",
};
