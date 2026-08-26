import { supabase } from "@/integrations/supabase/client";

export const GORSEL_KOVASI = "plan-gorselleri";

const STIL_KISITLARI = [
  "Eğitim materyali görseli, sade ve net.",
  "Beyaz veya çok açık arka plan.",
  "Çocuklara uygun, ürkütücü olmayan.",
  "Fotogerçekçi değil, sade illüstrasyon.",
  "Görselin içine hiçbir metin, harf, rakam veya etiket yazma.",
].join(" ");

export function gorselIstemiKur(girdi: {
  kazanim: string;
  seviye: string;
  atolye_alani: string;
  aciklama: string;
}) {
  return [
    `Kazanım: ${girdi.kazanim}`,
    `Sınıf seviyesi: ${girdi.seviye}`,
    `Atölye alanı: ${girdi.atolye_alani}`,
    `Görsel içeriği: ${girdi.aciklama}`,
    `Stil: ${STIL_KISITLARI}`,
  ].join("\n");
}

function b64Blob(b64: string): Blob {
  const ikili = atob(b64);
  const dizi = new Uint8Array(ikili.length);
  for (let i = 0; i < ikili.length; i++) dizi[i] = ikili.charCodeAt(i);
  return new Blob([dizi], { type: "image/png" });
}

/** Görsel üretir, depolamaya yazar ve dosya yolunu döndürür. */
export async function gorselUretVeYukle(planId: string, indeks: number, istem: string) {
  const res = await fetch("/api/gorsel-uret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ istem }),
  });
  const govde = (await res.json()) as { b64?: string; hata?: string };
  if (!res.ok || !govde.b64) throw new Error(govde.hata ?? "Görsel üretilemedi.");

  const yol = `${planId}/medya-${indeks}-${Date.now()}.png`;
  const { error } = await supabase.storage
    .from(GORSEL_KOVASI)
    .upload(yol, b64Blob(govde.b64), { contentType: "image/png", upsert: true });
  if (error) throw new Error("Görsel kaydedilemedi: " + error.message);
  return yol;
}

export async function gorselBaglantisi(yol: string): Promise<string | null> {
  const { data } = await supabase.storage.from(GORSEL_KOVASI).createSignedUrl(yol, 60 * 60);
  return data?.signedUrl ?? null;
}
