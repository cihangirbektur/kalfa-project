import type { DenetimTuru } from "@/lib/tipler";

/**
 * Sürüm numarası yalnızca revizyon sonrası tekrar gönderimde artar.
 * Her denetim turunun hangi sürümü denetlediğini tur sırasından türetir.
 */
export function turSurumleri(turlar: DenetimTuru[]): Map<string, number> {
  const sirali = [...turlar].sort((a, b) => a.tur_no - b.tur_no);
  const harita = new Map<string, number>();
  let surum = 1;
  for (const t of sirali) {
    harita.set(t.id, surum);
    if (t.karar === "revizyon_istendi") surum += 1;
  }
  return harita;
}

/** Onaylanan sürüm numarası (onay kararı verilen turun sürümü). */
export function onaylananSurum(turlar: DenetimTuru[]): number | null {
  const harita = turSurumleri(turlar);
  const onay = [...turlar].sort((a, b) => b.tur_no - a.tur_no).find((t) => t.karar === "onayli");
  return onay ? (harita.get(onay.id) ?? null) : null;
}

export function kararEtiketi(karar: string | null): string {
  if (karar === "onayli") return "Onaylandı";
  if (karar === "revizyon_istendi") return "Revizyon istendi";
  return "Karar bekliyor";
}
