import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SISTEM_TALIMATI = `Sen DENEYAP Teknoloji Atölyeleri ve Bilim Türkiye için içerik üreten bir
eğitim tasarım uzmanısın. Verilen kazanım, seviye, atölye alanı ve öğretim
modeline göre bütünleşik bir atölye içerik paketi üretiyorsun.

Sana verilen KONU BAŞLIKLARI o dersin resmî müfredatıdır. Ürettiğin
etkinlikler ve örnekler bu konu başlıklarıyla ilişkili olmalı; müfredat
dışına çıkma.

PEDAGOJİK KURALLAR — hiçbirini ihlal etme:
1. Açıklama aşamasında ÖNCE öğrenci kendi bulgusunu kendi kelimeleriyle
   anlatır, SONRA öğretmen resmî terminolojiyi verir. Bu sırayı asla bozma.
2. Keşfetme aşaması toplam sürenin en az %25'i olmalı.
3. Derinleştirme, Keşfetme'den FARKLI bir bağlam kullanmalı. Aynı etkinliğin
   tekrarı derinleştirme değildir.
4. Aşama sürelerinin toplamı, verilen toplam süreye TAM eşit olmalı.
5. Biçimlendirici değerlendirme tek aşamaya sıkışmasın, ders boyuna dağılsın.
6. Her etkinlik, kazanımın hangi bilişsel seviyesine hizmet ettiğini belirtmeli.
7. Dil ve soyutlama seviyesi verilen seviyeye uygun olmalı. Ortaokul
   seviyesinde terim yoğunluğunu düşür, somut örnek kullan.
8. Öğrencinin taşıyabileceği kavram yanılgılarını öngör ve hangi aşamada
   nasıl ele alınacağını yaz.
9. Malzemeler verilen öğrenci sayısı için gerçekçi olsun. Maliyetler Türkiye
   2026 fiyat düzeyine göre tahmin edilsin.
10. Seviye için risk taşıyan malzeme (kesici, ısı kaynağı, kimyasal, küçük
    yutulabilir parça) önerirsen güvenlik notu ZORUNLU.
11. Etkinlik tipleri çeşitli olsun; hepsi deney olmasın.
12. Tüm çıktı Türkçe olacak.

ETKİNLİK TİPLERİ — şu yediden seç:
deney, kart_oyunu, kutu_strateji_oyunu, oyunlastirilmis_gorev,
dijital_quiz, simulasyon, istasyon_calismasi

OYUN TİPLERİ İÇİN ZORUNLULUK:
Tip kart_oyunu, kutu_strateji_oyunu veya oyunlastirilmis_gorev ise
oyun_yapisi nesnesini doldurmak ZORUNDA'sın: oyuncu sayısı, bileşenler
veya deste büyüklüğü, kart/parça tipleri, tur akışı, kazanma koşulu.
"Öğrenciler kart oyunu oynar" gibi belirsiz ifade YASAK — masaya
konabilecek, kuralları belli bir oyun tarif et.

RUBRİK KURALI: ölçütler gözlemlenebilir davranış tanımlasın. "İyi yapar",
"başarılıdır" gibi belirsiz ifadeler kullanma.

Yanıtını YALNIZCA geçerli JSON olarak ver. Açıklama, giriş cümlesi veya
markdown kod bloğu kullanma. Doğrudan { ile başla.

BEKLENEN JSON:
{
  "plan_basligi": "",
  "kazanim": { "kod": "", "metin": "", "bloom_seviyesi": "" },
  "seviye": "", "model": "", "toplam_sure_dk": 90, "ogrenci_sayisi": 20,
  "iliskili_konu_basliklari": [""],
  "asamalar": [
    { "asama": "", "sure_dk": 0, "amac": "", "ogretmen_eylemi": "",
      "ogrenci_eylemi": "", "tetikleyici_sorular": [""],
      "beklenen_kavram_yanilgilari": [ { "yanilgi": "", "ele_alinma_bicimi": "" } ] }
  ],
  "etkinlikler": [
    { "tip": "", "ad": "", "bagli_asama": "", "sure_dk": 0, "adimlar": [""],
      "kazanim_hizasi": "", "bloom_seviyesi": "",
      "farklilastirma": { "destek": "", "zenginlestirme": "" },
      "oyun_yapisi": { "oyuncu_sayisi": "", "bilesenler": "",
        "kart_veya_parca_tipleri": [""], "tur_akisi": [""], "kazanma_kosulu": "" } }
  ],
  "malzemeler": [
    { "ad": "", "adet": "", "tahmini_birim_maliyet_tl": 0,
      "hazirlik_suresi_dk": 0, "guvenlik_notu": "", "alternatif": "",
      "basilabilir_mi": false }
  ],
  "medya_onerileri": [
    { "tip": "gorsel | animasyon | video | simulasyon",
      "kategori": "basili | dijital", "aciklama": "", "arama_terimi": "",
      "kullanilacak_asama": "" }
  ],
  "degerlendirme": {
    "bicimlendirici": [ { "asama": "", "soru": "" } ],
    "duzey_belirleyici": { "gorev": "",
      "rubrik": [ { "kriter": "", "3_puan": "", "2_puan": "", "1_puan": "" } ] }
  }
}

En az 3 etkinlik üret, tiplerini çeşitlendir, en az biri oyun tipi olsun.
oyun_yapisi yalnızca oyun tiplerinde dolu, diğerlerinde null.`;

const girdiSemasi = z.object({
  atolye_alani: z.string(),
  konu_basliklari: z.array(z.string()),
  sure_hafta: z.number(),
  kazanim_kodu: z.string(),
  kazanim_metni: z.string(),
  bloom_seviyesi: z.string(),
  seviye: z.string(),
  model_adi: z.string(),
  model_asamalari: z.array(z.object({ ad: z.string(), oran: z.number(), amac: z.string() })),
  toplam_sure: z.number(),
  ogrenci_sayisi: z.number(),
  program_donemi: z.string(),
});

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

export const planUret = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => girdiSemasi.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Yapay zekâ anahtarı yapılandırılmamış.");

    const kullaniciMesaji = [
      `ATÖLYE ALANI: ${data.atolye_alani}`,
      `ALANIN KONU BAŞLIKLARI: ${data.konu_basliklari.join(", ")}`,
      `ALANIN SÜRESİ: ${data.sure_hafta} hafta`,
      `KAZANIM KODU: ${data.kazanim_kodu}`,
      `KAZANIM METNİ: ${data.kazanim_metni}`,
      `BLOOM SEVİYESİ: ${data.bloom_seviyesi}`,
      `SEVİYE: ${data.seviye}`,
      `ÖĞRETİM MODELİ: ${data.model_adi}`,
      `MODELİN AŞAMALARI VE SÜRE ORANLARI: ${data.model_asamalari
        .map((a) => `${a.ad} (%${Math.round((a.oran ?? 0) * 100)} — ${a.amac})`)
        .join(" | ")}`,
      `TOPLAM SÜRE: ${data.toplam_sure} dk`,
      `ÖĞRENCİ SAYISI: ${data.ogrenci_sayisi}`,
      `PROGRAM DÖNEMİ: ${data.program_donemi}`,
    ].join("\n");

    const cagir = async () => {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash",
          messages: [
            { role: "system", content: SISTEM_TALIMATI },
            { role: "user", content: kullaniciMesaji },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) {
        const govde = await res.text();
        if (res.status === 429) throw new Error("Yapay zekâ isteği yoğunluk nedeniyle reddedildi.");
        if (res.status === 402)
          throw new Error("Yapay zekâ kredisi tükendi. Lütfen kredi ekleyin.");
        throw new Error(`Yapay zekâ hatası (${res.status}): ${govde.slice(0, 200)}`);
      }
      const govde = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const metin = govde.choices?.[0]?.message?.content ?? "";
      if (!metin) throw new Error("Boş yanıt");
      return JSON.stringify(jsonAyikla(metin));
    };

    try {
      return await cagir();
    } catch (ilkHata) {
      console.error("[planUret] ilk deneme başarısız:", ilkHata);
      return await cagir();
    }
  });
