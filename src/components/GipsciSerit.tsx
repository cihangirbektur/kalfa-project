import { useState } from "react";
import type { PlanIcerik } from "@/lib/tipler";

/**
 * GiPSci kural profili uygulanan planlarda 5E'den farkı ekranda kanıtlayan şerit.
 * KLASIK profilde hiç görünmez.
 */
export function GipsciSerit({
  icerik,
  kuralProfili,
  toplamSure,
}: {
  icerik: PlanIcerik;
  kuralProfili?: string;
  toplamSure: number;
}) {
  const [acik, setAcik] = useState(false);
  if (kuralProfili !== "GIPSCI") return null;

  const asamalar = icerik.asamalar ?? [];
  const yaratma = asamalar.find((a) =>
    /yarat|açıkla|aciklama|explain/i.test(a.asama ?? ""),
  );
  const yaratmaSure = Number(yaratma?.sure_dk) || 0;
  const yaratmaOran = toplamSure ? Math.round((yaratmaSure / toplamSure) * 100) : 0;
  const kartSayisi = (icerik.merak_tetikleyicileri?.soru_kartlari ?? []).length;
  const urun = icerik.urun_odakli_cikti?.urun_adi;
  const sorgulama = asamalar
    .map((a) => a.ogretmen_eylemi ?? "")
    .find((m) => /\bsor|yönlendir|fark ettir/i.test(m));

  const satirlar: { etiket: string; deger: string }[] = [
    { etiket: "Ürün odaklılık", deger: urun || "ürün tanımlanmamış" },
    {
      etiket: "Merak soru kartları",
      deger: kartSayisi > 0 ? `${kartSayisi} kart üretildi` : "kart üretilmemiş",
    },
    {
      etiket: "Yaratma süresi",
      deger: yaratma ? `${yaratmaSure} dk · %${yaratmaOran}` : "aşama bulunamadı",
    },
    {
      etiket: "Rehberli sorgulama",
      deger: sorgulama ? `“${sorgulama.slice(0, 160)}”` : "örnek cümle bulunamadı",
    },
  ];

  return (
    <div className="rounded-xl border border-sky-300 bg-sky-50">
      <button
        type="button"
        onClick={() => setAcik((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-sky-900"
      >
        <span>
          GiPSci kuralları uygulandı: rehberli sorgulama · ürün odaklılık · merak soru kartları ·
          Yaratma ≥ %20
        </span>
        <span className="text-xs">{acik ? "Kapat" : "Ayrıntı"}</span>
      </button>
      {acik && (
        <ul className="space-y-1 border-t border-sky-200 px-4 py-3 text-sm text-sky-900">
          {satirlar.map((s) => (
            <li key={s.etiket}>
              <span className="font-medium">{s.etiket} → </span>
              <span>{s.deger}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
