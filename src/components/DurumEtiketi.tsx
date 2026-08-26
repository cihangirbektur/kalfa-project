import { DURUM_ETIKET, DURUM_ROZET_STIL } from "@/lib/tipler";

/**
 * Durum rozetleri marka turuncusundan tamamen ayrı bir renk ailesi kullanır;
 * turuncu yalnızca markaya (sol bar, ana buton, aktif gezinme) aittir.
 */
export function DurumEtiketi({ durum }: { durum: string }) {
  const stil = DURUM_ROZET_STIL[durum] ?? DURUM_ROZET_STIL["taslak"];

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${stil}`}>
      {DURUM_ETIKET[durum] ?? durum}
    </span>
  );
}
