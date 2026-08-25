import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Pedagojik denetçi — plan üretiminden TAMAMEN AYRI ve BAĞIMSIZ bir çağrıdır.
 * Denetçi plan üretmez, yalnızca verilen planı 12 kurala karşı denetler.
 */
const DENETCI_TALIMATI = `Sen DENEYAP Teknoloji Atölyeleri ve Bilim Türkiye için çalışan BAĞIMSIZ bir
pedagojik denetçisin. Planı SEN üretmedin. Görevin yalnızca denetlemektir;
plan üretmez, plan yazmaz, eksik bölüm tamamlamazsın.

Sana JSON biçiminde bir atölye planı verilecek. Aşağıdaki 12 kuralın her birini
tek tek değerlendir. Hiçbir kuralı atlama; tam 12 bulgu üret.

KURALLAR:
1  [kritik] Öğrenci kendi bulgusunu, öğretmenin açıklamasından ÖNCE kendi
   kelimeleriyle anlatıyor mu? Açıklama aşamasında öğretmen önce terminolojiyi
   veriyorsa kural ihlal edilmiştir.
2  [kritik] Keşfetme (Explore) aşamasının süresi toplam sürenin en az %25'i mi?
3  [kritik] Yaratma/Açıklama aşamasının süresi toplam sürenin en az %20'si mi?
   Tasarıma zaman ayrılmazsa ürün ortaya çıkmaz.
4  [kritik] Öğretmen eylemleri cevabı doğrudan veriyor mu, yoksa soruyla mı
   yönlendiriyor? Cevabı doğrudan veren bir ifade varsa kural İHLAL edilmiştir.
5  [kritik] Plan somut bir öğrenci ürünüyle bitiyor mu? urun_odakli_cikti dolu
   ve belirsiz olmayan bir ürün tanımlıyor mu?
6  [kritik] Her etkinlik kazanımla açıkça hizalı mı? kazanim_hizasi alanı boş
   veya genel geçer ise ihlaldir.
7  [kritik] Riskli malzemede (kesici, ısı kaynağı, kimyasal, elektrik, küçük
   yutulabilir parça) güvenlik notu var mı?
8  [uyari] Aşama sürelerinin toplamı, planın toplam süresine eşit mi?
9  [uyari] En az 4 merak soru kartı üretilmiş mi ve her biri öğrenciyi hipotez
   kurmaya çağırıyor mu?
10 [uyari] Biçimlendirici değerlendirme tek aşamaya mı toplanmış, yoksa ders
   boyuna mı dağılmış? Tek aşamada toplanmışsa ihlaldir.
11 [uyari] Süreç odaklı değerlendirme var mı, yoksa yalnızca ürün mü ölçülüyor?
12 [bilgi] Kavram yanılgıları öngörülmüş mü?

DEĞERLENDİRME İLKELERİ:
- kanit_alintisi alanı planın İÇİNDEN birebir kopyalanmış bir metin parçası
  olmalı. Asla cümle uydurma, yeniden yazma veya özetleme. Alıntılanacak metin
  yoksa kanit_alintisi boş string olsun ve mesajda eksikliği belirt.
- gecti alanı yalnızca kural gerçekten sağlanıyorsa true olsun. Şüphedeysen
  ve kanıt bulamıyorsan false ver.
- Süre kurallarında yüzdeyi hesapla ve mesajda sayıyla belirt.
- oneri tek cümlelik, uygulanabilir bir düzeltme önerisi olsun. Kural geçtiyse
  oneri boş string olabilir.
- ilgili_asama, bulgunun ilgili olduğu aşama adı olsun; plan geneliyse "Genel".
- Tüm metinler Türkçe olsun.

Yanıtını YALNIZCA geçerli JSON olarak ver. Markdown, açıklama veya giriş cümlesi
kullanma. Doğrudan { ile başla.

BEKLENEN JSON:
{
  "bulgular": [
    { "kural_no": 1, "seviye": "kritik | uyari | bilgi", "gecti": true,
      "mesaj": "", "kanit_alintisi": "", "ilgili_asama": "", "oneri": "" }
  ]
}`;

const girdiSemasi = z.object({
  plan_id: z.string().uuid(),
  kural_profili: z.string().optional(),
  toplam_sure: z.number(),
  seviye: z.string().optional(),
  plan_json: z.string(),
});

const bulguSemasi = z.object({
  kural_no: z.number().int().min(1).max(12),
  seviye: z.string(),
  gecti: z.boolean(),
  mesaj: z.string().default(""),
  kanit_alintisi: z.string().default(""),
  ilgili_asama: z.string().default(""),
  oneri: z.string().default(""),
});

const cikisSemasi = z.object({ bulgular: z.array(bulguSemasi).min(1) });

function seviyeNormalize(s: string, kuralNo: number) {
  const d = s.toLocaleLowerCase("tr");
  if (d.startsWith("krit")) return "kritik";
  if (d.startsWith("uya")) return "uyari";
  if (d.startsWith("bil")) return "bilgi";
  return kuralNo <= 7 ? "kritik" : kuralNo <= 11 ? "uyari" : "bilgi";
}

function jsonAyikla(metin: string): unknown {
  const temiz = metin
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(temiz);
  } catch {
    const bas = temiz.indexOf("{");
    const son = temiz.lastIndexOf("}");
    if (bas === -1 || son <= bas) throw new Error("JSON bulunamadı");
    return JSON.parse(temiz.slice(bas, son + 1));
  }
}

export const planDenetle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => girdiSemasi.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Yapay zekâ anahtarı yapılandırılmamış.");

    const kullaniciMesaji = [
      `PLANIN TOPLAM SÜRESİ: ${data.toplam_sure} dk`,
      `SEVİYE: ${data.seviye ?? "belirtilmedi"}`,
      `KURAL PROFİLİ: ${data.kural_profili ?? "KLASIK"}`,
      "DENETLENECEK PLAN (JSON):",
      data.plan_json,
    ].join("\n");

    const cagir = async () => {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-3-flash",
          messages: [
            { role: "system", content: DENETCI_TALIMATI },
            { role: "user", content: kullaniciMesaji },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        const govde = await res.text();
        if (res.status === 429)
          throw new Error("Denetim isteği yoğunluk nedeniyle reddedildi. Az sonra tekrar deneyin.");
        if (res.status === 402) throw new Error("Yapay zekâ kredisi tükendi. Lütfen kredi ekleyin.");
        throw new Error(`Denetim hatası (${res.status}): ${govde.slice(0, 200)}`);
      }

      const govde = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const metin = govde.choices?.[0]?.message?.content ?? "";
      if (!metin) throw new Error("Denetçiden boş yanıt geldi.");
      const cozum = cikisSemasi.parse(jsonAyikla(metin));
      return cozum.bulgular.map((b) => ({
        plan_id: data.plan_id,
        kural_no: b.kural_no,
        seviye: seviyeNormalize(b.seviye, b.kural_no),
        gecti: b.gecti,
        mesaj: b.mesaj,
        kanit_alintisi: b.kanit_alintisi,
        ilgili_asama: b.ilgili_asama,
        oneri: b.oneri,
      }));
    };

    try {
      return await cagir();
    } catch (ilkHata) {
      console.error("[planDenetle] ilk deneme başarısız:", ilkHata);
      return await cagir();
    }
  });
