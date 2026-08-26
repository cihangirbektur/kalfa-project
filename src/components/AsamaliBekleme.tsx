import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const URETIM_ADIMLARI = [
  "Kazanım ve model okunuyor…",
  "Aşamalar kuruluyor…",
  "Etkinlikler ve oyun yapısı yazılıyor…",
  "Malzeme ve ölçme araçları hazırlanıyor…",
];

export const DENETIM_ADIMLARI = [
  "Plan okunuyor…",
  "12 pedagojik kural sınanıyor…",
  "Kanıt alıntıları çıkarılıyor…",
];

/** Bekleme sırasında sırayla değişen durum metni (gerçek ilerlemeyi göstermez). */
export function useAsamaliMesaj(adimlar: string[], aktif: boolean, araMs = 4000) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!aktif) {
      setI(0);
      return;
    }
    const t = setInterval(() => setI((o) => Math.min(o + 1, adimlar.length - 1)), araMs);
    return () => clearInterval(t);
  }, [aktif, adimlar.length, araMs]);
  return adimlar[i] ?? adimlar[0];
}

export function AsamaliBekleme({
  adimlar,
  aktif,
  not,
}: {
  adimlar: string[];
  aktif: boolean;
  not?: string;
}) {
  const mesaj = useAsamaliMesaj(adimlar, aktif);
  if (!aktif) return null;
  return (
    <div
      className="rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm"
      role="status"
      aria-live="polite"
    >
      <p className="flex items-center gap-2 font-medium">
        <Loader2 className="h-4 w-4 animate-spin" />
        {mesaj}
      </p>
      {not && <p className="mt-1 leading-relaxed text-muted-foreground">{not}</p>}
    </div>
  );
}
