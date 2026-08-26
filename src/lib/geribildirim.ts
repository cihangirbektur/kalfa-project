import type { GeriBildirim } from "@/lib/tipler";

/**
 * Geri bildirimlerde kişisel veri tutulmaz. Yalnızca rol ve zorlanılan aşama,
 * not metninin başındaki makine okunur etikete gömülür.
 */
const ETIKET = /^\[kalfa\|rol:([^|\]]*)\|asama:([^|\]]*)\]\s*/i;

export function geriBildirimKodla(girdi: {
  rol: string;
  asama: string;
  metin: string;
}): string {
  const bas = `[kalfa|rol:${girdi.rol.replace(/[|\]]/g, "")}|asama:${girdi.asama.replace(
    /[|\]]/g,
    "",
  )}]`;
  return `${bas} ${girdi.metin.trim()}`.trim();
}

export type CozulmusBildirim = {
  id: string;
  plan_id: string | null;
  uygulandi_mi: boolean;
  rol: string;
  asama: string;
  metin: string;
  created_at: string;
};

export function geriBildirimCoz(g: GeriBildirim): CozulmusBildirim {
  const ham = g.not_metni ?? "";
  const eslesme = ham.match(ETIKET);
  return {
    id: g.id,
    plan_id: g.plan_id,
    uygulandi_mi: Boolean(g.uygulandi_mi),
    rol: eslesme?.[1]?.trim() || "Eğitmen",
    asama: eslesme?.[2]?.trim() || "",
    metin: ham.replace(ETIKET, "").trim(),
    created_at: g.created_at,
  };
}

export function bildirimleriCoz(liste: GeriBildirim[]): CozulmusBildirim[] {
  return liste.map(geriBildirimCoz);
}

export type BildirimOzeti = {
  toplam: number;
  uygulamaSayisi: number;
  asamaDagilimi: { asama: string; adet: number }[];
  enZorAsama: { asama: string; adet: number } | null;
};

export function bildirimOzeti(liste: CozulmusBildirim[]): BildirimOzeti {
  const sayac = new Map<string, number>();
  for (const b of liste) {
    if (!b.asama) continue;
    sayac.set(b.asama, (sayac.get(b.asama) ?? 0) + 1);
  }
  const asamaDagilimi = [...sayac.entries()]
    .map(([asama, adet]) => ({ asama, adet }))
    .sort((a, b) => b.adet - a.adet || a.asama.localeCompare(b.asama, "tr"));
  return {
    toplam: liste.length,
    uygulamaSayisi: liste.filter((b) => b.uygulandi_mi).length,
    asamaDagilimi,
    enZorAsama: asamaDagilimi[0] ?? null,
  };
}

export function tarihBicimi(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR");
}
