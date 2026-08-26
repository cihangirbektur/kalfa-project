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
    { "ad": "", "adet": 20, "birim": "adet | set | paket | kutu | metre",
      "tahmini_birim_maliyet_tl": 0,
      "hazirlik_suresi_dk": 0, "guvenlik_notu": "", "alternatif": "",
      "basilabilir_mi": false }
  ],
  "medya_onerileri": [
    { "ad": "",
      "tip": "gorsel | animasyon | video | simulasyon | calisma_yapragi | soru_karti_destesi | poster | yonerge_karti | rubrik_formu | oyun_mati | etiket",
      "kategori": "basili | dijital", "aciklama": "", "arama_terimi": "",
      "onerilen_kaynak": "", "ne_icerir": "", "sayfa_sayisi": 1,
      "baski_notu": "", "kullanilacak_asama": "" }
  ],

  "merak_tetikleyicileri": {
    "soru_kartlari": ["", "", "", ""],
    "merak_kutusu_notu": ""
  },
  "urun_odakli_cikti": {
    "urun_adi": "",
    "urun_tipi": "fiziksel_nesne | dijital_icerik | bilimsel_sunum",
    "ogrenci_ne_uretecek": "",
    "degerlendirme_olcutu": ""
  },
  "degerlendirme": {
    "bicimlendirici": [ { "asama": "", "soru": "" } ],
    "surec_odakli": [ { "ne_gozlemlenecek": "", "yansitici_arac": "" } ],
    "duzey_belirleyici": { "gorev": "",
      "rubrik": [ { "kriter": "", "3_puan": "", "2_puan": "", "1_puan": "" } ] }
  }
}

En az 3 etkinlik üret, tiplerini çeşitlendir, en az biri oyun tipi olsun.
oyun_yapisi yalnızca oyun tiplerinde dolu, diğerlerinde null.

EK ALAN KURALLARI:
- merak_tetikleyicileri.soru_kartlari en az 4 adet olsun. Her kart, öğrencinin
  sergide veya atölye girişinde okuyup kendi hipotezini kurmasını sağlayan kısa
  bir soru olsun; cevabı içermesin.
- merak_kutusu_notu, öğrencinin cevabını yazıp kutuya atacağı tek satırlık
  yönlendirme olsun.
- urun_odakli_cikti somut olsun; "öğrendiklerini paylaşır" gibi belirsiz ifade yasak.
- degerlendirme.surec_odakli en az 2 madde içersin ve ürünü değil, öğrencinin
  düşünme sürecini gözlemlesin.

MALZEME ALANI KURALI:
- "adet" alanı YALNIZCA SAYI olsun (örnek: 20). İçine birim yazma.
- Birim ayrı alanda olsun: "birim" (adet, set, paket, kutu, metre gibi).
  "20 adet" biçiminde tek alan YASAK.

MEDYA VE BASILI MATERYAL KURALLARI:
- Hiçbir alana URL, bağlantı veya web adresi YAZMA. Bağlantıları uygulama
  kendisi kurar. Yalnızca "arama_terimi" yaz.
- "onerilen_kaynak": konuya uygun, bildiğin bir platformun yalnızca ADI
  (örnek: "PhET simülasyonları", "Blockly Games", "TÜBİTAK Bilim Genç",
  "Scratch"). Bağlantı değil, isim.
- medya_onerileri içinde kategori "dijital" olan EN AZ 2 kayıt üret. Bu
  ZORUNLUDUR; basılı materyal ürettin diye dijitali atlama. Dijital kayıtların
  tipleri BİRBİRİNDEN FARKLI olsun ve şu havuzdan seçilsin:
  video | animasyon | simulasyon | interaktif_arac | dijital_quiz
  Her dijital kayıtta "arama_terimi" ve "kullanilacak_asama" dolu olsun.
- medya_onerileri içinde kategori "basili" olan EN AZ 3 kayıt üret. Basılı
  kayıtlarda şu alanlar dolu olsun: ad, tip (calisma_yapragi |
  soru_karti_destesi | poster | yonerge_karti | rubrik_formu | oyun_mati |
  etiket), ne_icerir (materyalin üzerinde tam olarak ne yazacağı, tek
  paragraf), sayfa_sayisi, baski_notu (renkli mi siyah-beyaz mı, A4 mü A3 mü,
  laminasyon gerekli mi, kaç kopya), kullanilacak_asama.
- Basılı materyallerden biri MUTLAKA merak soru kartı destesi olsun ve
  ne_icerir alanı merak_tetikleyicileri.soru_kartlari içindeki soruları
  birebir barındırsın.
- Etkinliklerde kart oyunu varsa, o oyunun kart destesi de ayrı bir basılı
  materyal olarak listelensin.
- İki gruptan biri boş kalırsa plan EKSİK sayılır. Her iki grubu da doldur.


SÜRE KURALLARI (her plan için geçerli):
- Yaratma/Açıklama aşaması toplam sürenin en az %20'si olsun.
- Keşfetme aşaması toplam sürenin en az %25'i olsun.

AŞAMA İSİMLERİ: yalnızca sana verilen AŞAMA ŞABLONU'ndaki adları kullan,
verilen sırayla. Kendi aşama adı uydurma.

YAŞ UYUMU: dil ve soyutlama seviyesi verilen yaş aralığına uygun olsun.
9–11 yaş için somut, elle tutulur, tek adımlı örnekler; 13–15 yaş için
değişkenli ve çok adımlı düşünme; 6–14 karma grup seçildiyse en küçük yaşa
göre anlaşılır, en büyüğe göre zenginleştirilebilir olsun.`;

const GIPSCI_KURALLARI = `
KURAL PROFİLİ: GIPSCI — Rehberli Sorgulama, Ürün Odaklı Bilim.
Şu üç kısıtı ihlal etme:
1. Öğretmen eylemi hiçbir aşamada cevabı doğrudan vermesin; yapılandırılmış
   soru sorarak yönlendirsin. "Açıklar", "anlatır", "gösterir" yerine "sorar",
   "yönlendirir", "fark ettirir" fiilleriyle yaz.
2. Her plan somut bir öğrenci ürünüyle bitsin. urun_odakli_cikti asla boş
   kalmasın ve belirsiz olmasın.
3. En az 4 merak soru kartı ve bir merak kutusu notu üret.
Üçüncü aşama Yaratma/Açıklama sırasıyla işlensin — yaratma öndedir.`;

const KLASIK_KURALLARI = `
KURAL PROFİLİ: KLASIK. Yalnızca aşama sırası ve süre dengesi denetlenir.
merak_tetikleyicileri ve urun_odakli_cikti isteğe bağlıdır; uygun düşüyorsa
doldur, düşmüyorsa null bırak.`;

const KAZANIM_TURETME = `
KAZANIM TÜRETME (Bilim Türkiye): Bu üretimde hazır kazanım metni YOK; sana bir
KONU BAŞLIĞI verildi. Kazanımı sen türeteceksin ve "kazanim" nesnesine
yazacaksın. Kurallar:
- Tek cümle olsun ve gözlemlenebilir bir öğrenci davranışı tanımlasın.
- Fiil seçimi yaş grubuna uygun olsun: 6-8 yaş → tanır, eşleştirir, gösterir;
  9-11 yaş → açıklar, karşılaştırır, uygular; 12-14 yaş → tasarlar, analiz
  eder, değerlendirir.
- Konu başlığının dışına çıkma.
- "kazanim.kod" alanına konu başlığının kendisini yaz, "bloom_seviyesi" alanına
  seçtiğin fiile karşılık gelen Bloom düzeyini yaz.`;

const girdiSemasi = z.object({
  atolye_alani: z.string(),
  program: z.string().optional(),
  konu_basliklari: z.array(z.string()),
  sure_hafta: z.number(),
  konu_basligi: z.string().optional(),
  kazanim_turet: z.boolean().optional(),
  kazanim_kodu: z.string(),
  kazanim_metni: z.string(),
  bloom_seviyesi: z.string(),
  seviye: z.string(),
  yas_araligi: z.string().optional(),
  model_adi: z.string(),
  asama_sablonu: z.string().optional(),
  asama_sablonu_kaynagi: z.string().optional(),
  kural_profili: z.string().optional(),
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
      `PROGRAM: ${data.program ?? "DENEYAP Teknoloji Atölyesi"}`,
      data.konu_basliklari.length > 0
        ? `ALANIN KONU BAŞLIKLARI: ${data.konu_basliklari.join(", ")}`
        : `ALANIN KONU BAŞLIKLARI: tanımlı değil — üretimi tema tanımı üzerinden yap, etkinlikler tema düzeyinde kalsın.`,
      `ALANIN SÜRESİ: ${data.sure_hafta} hafta`,
      `KAZANIM KODU: ${data.kazanim_kodu}`,
      `KAZANIM METNİ: ${data.kazanim_metni}`,
      `BLOOM SEVİYESİ: ${data.bloom_seviyesi}`,
      `SEVİYE: ${data.seviye}`,
      `YAŞ ARALIĞI: ${data.yas_araligi ?? "belirtilmedi"}`,
      `ÖĞRETİM MODELİ: ${data.model_adi}`,
      `AŞAMA ŞABLONU: ${data.asama_sablonu ?? data.model_adi}${
        data.asama_sablonu_kaynagi ? ` (${data.asama_sablonu_kaynagi})` : ""
      }`,
      `KURAL PROFİLİ: ${data.kural_profili ?? "KLASIK"}`,
      `ŞABLONUN AŞAMALARI VE SÜRE ORANLARI: ${data.model_asamalari
        .map((a) => `${a.ad} (%${Math.round((a.oran ?? 0) * 100)} — ${a.amac})`)
        .join(" | ")}`,
      `TOPLAM SÜRE: ${data.toplam_sure} dk`,
      `ÖĞRENCİ SAYISI: ${data.ogrenci_sayisi}`,
      `PROGRAM DÖNEMİ: ${data.program_donemi}`,
    ].join("\n");

    const sistemMetni =
      SISTEM_TALIMATI +
      (data.kural_profili === "GIPSCI" ? GIPSCI_KURALLARI : KLASIK_KURALLARI);

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
            { role: "system", content: sistemMetni },
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
