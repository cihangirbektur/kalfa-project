import type { Malzeme, Medya } from "./tipler";

/** Adet alanı sayı ya da "20 adet" gibi metin olabilir; baştaki sayıyı ayıklar. */
export function adetSayisi(deger: unknown): number | null {
  if (typeof deger === "number" && Number.isFinite(deger)) return deger;
  if (typeof deger === "string") {
    const eslesme = deger.replace(",", ".").match(/-?\d+(\.\d+)?/);
    if (eslesme) return Number(eslesme[0]);
  }
  return null;
}

/** Adet alanı metinse içindeki birimi ayıklar ("20 adet" → "adet"). */
export function adetBirimi(m: Pick<Malzeme, "adet" | "birim">): string {
  if (m.birim && m.birim.trim()) return m.birim.trim();
  if (typeof m.adet === "string") {
    const kalan = m.adet.replace(/-?\d+([.,]\d+)?/, "").trim();
    if (kalan) return kalan;
  }
  return "";
}

export function adetGosterim(m: Pick<Malzeme, "adet" | "birim">): string {
  const s = adetSayisi(m.adet);
  const birim = adetBirimi(m);
  if (s === null) return String(m.adet ?? "—");
  return birim ? `${s} ${birim}` : String(s);
}

export type MaliyetSonucu = { toplam: number; hesaplanamayan: number };

export function maliyetHesapla(malzemeler: Malzeme[]): MaliyetSonucu {
  let toplam = 0;
  let hesaplanamayan = 0;
  for (const m of malzemeler) {
    const adet = adetSayisi(m.adet);
    const birim = Number(m.tahmini_birim_maliyet_tl) || 0;
    if (adet === null) {
      hesaplanamayan += 1;
      continue;
    }
    toplam += adet * birim;
  }
  return { toplam, hesaplanamayan };
}

export function paraBicimi(deger: number): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(deger);
}

/** Arama bağlantıları KOD tarafından kurulur; modelden URL istenmez. */
export function aramaBaglantilari(terim: string) {
  const q = encodeURIComponent(terim ?? "");
  return {
    youtube: `https://www.youtube.com/results?search_query=${q}`,
    gorsel: `https://www.google.com/search?tbm=isch&q=${q}`,
    web: `https://www.google.com/search?q=${q}`,
  };
}

export function basiliMi(m: Medya): boolean {
  return (m.kategori ?? "").toLowerCase().includes("basili");
}

/** Tek bir materyali ayrı yazdırılabilir sayfa olarak açar. */
export function yazdirilabilirAc(baslik: string, govdeHtml: string) {
  const pencere = window.open("", "_blank", "width=900,height=1000");
  if (!pencere) return;
  pencere.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8" />
<title>${baslik}</title>
<style>
 body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;margin:40px;color:#0f172a;line-height:1.6}
 h1{font-size:22px;margin:0 0 4px}
 h2{font-size:15px;margin:24px 0 6px;text-transform:uppercase;letter-spacing:.05em;color:#475569}
 p{margin:0 0 8px} .kutu{border:1px solid #cbd5e1;border-radius:10px;padding:14px;margin-bottom:12px}
 table{width:100%;border-collapse:collapse;font-size:13px} td,th{border-bottom:1px solid #e2e8f0;padding:6px;text-align:left}
 @media print{ body{margin:16px} }
</style></head><body>${govdeHtml}
<script>window.onload=function(){window.print()}<\/script>
</body></html>`);
  pencere.document.close();
}
