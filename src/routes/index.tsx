import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { AsamaliBekleme, URETIM_ADIMLARI } from "@/components/AsamaliBekleme";

import { toast } from "sonner";
import { planUret } from "@/lib/uretim.functions";
import {
  BILIMTR,
  BILIMTR_KAYNAK_NOTU,
  BILIMTR_PROGRAM_TURLERI,
  BILIMTR_PROGRAM_TURU_ETIKET,
  BILIMTR_YAS_GRUPLARI,
  GIPSCI_BILGI_NOTU,
  KATEGORI_ETIKET,
  KESIF,
  KESIF_KAYNAK_NOTU,
  KESIF_PROGRAM_TURLERI,
  KESIF_PROGRAM_TURU_ETIKET,
  KESIF_PROGRAM_TURU_NOTU,
  KESIF_YAS_GRUPLARI,

  MODEL_BILGI,
  OGRETIM_SECENEKLERI,
  PROGRAM_GRUP_ETIKET,
  SINIF_ETIKET,
  SINIF_YAS,
  konuBasliklariAl,
  type AsamaSablonu,
  type AtolyeAlani,
  type KuralProfili,
  type OgretimModeli,
  type PlanIcerik,
} from "@/lib/tipler";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KALFA — Bilim Türkiye Atölye İçeriği" },
      {
        name: "description",
        content:
          "Kazanım, seviye ve öğretim modeli seçerek yapay zekâ destekli Bilim Türkiye atölye planı üretin.",
      },
      { property: "og:title", content: "KALFA — Bilim Türkiye Atölye İçeriği" },
      {
        property: "og:description",
        content: "Kalfa üretir, usta onaylar: yapay zekâ destekli atölye içeriği üretim aracı.",
      },
    ],
  }),
  component: YeniPlan,
});

function YeniPlan() {
  const navigate = useNavigate();
  const uretFn = useServerFn(planUret);

  const { data: alanlar = [] } = useQuery({
    queryKey: ["atolye_alanlari"],
    queryFn: async () => {
      const { data, error } = await supabase.from("atolye_alanlari").select("*").order("ad");
      if (error) throw error;
      return data as unknown as AtolyeAlani[];
    },
  });

  const { data: modeller = [] } = useQuery({
    queryKey: ["modeller"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ogretim_modelleri").select("*").order("ad");
      if (error) throw error;
      return data as unknown as OgretimModeli[];
    },
  });

  const { data: sablonlar = [] } = useQuery({
    queryKey: ["asama_sablonlari"],
    queryFn: async () => {
      const { data, error } = await supabase.from("asama_sablonlari").select("*").order("kod");
      if (error) throw error;
      return data as unknown as AsamaSablonu[];
    },
  });

  const { data: profiller = [] } = useQuery({
    queryKey: ["kural_profilleri"],
    queryFn: async () => {
      const { data, error } = await supabase.from("kural_profilleri").select("*").order("kod");
      if (error) throw error;
      return data as unknown as KuralProfili[];
    },
  });

  const [alanId, setAlanId] = useState("");
  const [konuBasligi, setKonuBasligi] = useState("");
  const [seviye, setSeviye] = useState<string>(BILIMTR_YAS_GRUPLARI[0].deger);
  const [donem, setDonem] = useState<string>(BILIMTR_PROGRAM_TURLERI[0].deger);
  const [ogretim, setOgretim] = useState<string>("GIPSCI");
  const [sure, setSure] = useState(String(BILIMTR_PROGRAM_TURLERI[0].sure));
  const [ogrenciSayisi, setOgrenciSayisi] = useState("20");
  const [uretiliyor, setUretiliyor] = useState(false);
  const [hata, setHata] = useState(false);

  const seciliOgretim =
    OGRETIM_SECENEKLERI.find((o) => o.deger === ogretim) ?? OGRETIM_SECENEKLERI[0];
  const seciliSablon = sablonlar.find((s) => s.kod === seciliOgretim.sablon);
  const seciliProfil = profiller.find((p) => p.kod === seciliOgretim.profil);

  /** Yeni plan üretimi Bilim Türkiye ve Keşif Kampüsü atölyeleri için yapılır. */
  const btAlanlar = useMemo(() => alanlar.filter((a) => a.program === BILIMTR), [alanlar]);
  const kesifAlanlar = useMemo(() => alanlar.filter((a) => a.program === KESIF), [alanlar]);
  const formAlanlari = useMemo(() => [...btAlanlar, ...kesifAlanlar], [btAlanlar, kesifAlanlar]);
  const seciliAlan = formAlanlari.find((a) => a.id === alanId);
  const program = seciliAlan?.program ?? BILIMTR;
  const kesifMi = program === KESIF;

  const yasGruplari = kesifMi ? KESIF_YAS_GRUPLARI : BILIMTR_YAS_GRUPLARI;
  const programTurleri = kesifMi ? KESIF_PROGRAM_TURLERI : BILIMTR_PROGRAM_TURLERI;

  const alanSec = (yeniId: string) => {
    setAlanId(yeniId);
    setKonuBasligi("");
    const yeni = formAlanlari.find((a) => a.id === yeniId);
    const yeniProgram = yeni?.program ?? BILIMTR;
    if (yeniProgram !== program) {
      const yasListe = yeniProgram === KESIF ? KESIF_YAS_GRUPLARI : BILIMTR_YAS_GRUPLARI;
      const turListe = yeniProgram === KESIF ? KESIF_PROGRAM_TURLERI : BILIMTR_PROGRAM_TURLERI;
      setSeviye(yasListe[0].deger);
      setDonem(turListe[0].deger);
      setSure(String(turListe[0].sure));
    }
  };

  const programTuruSec = (v: string) => {
    setDonem(v);
    const t = programTurleri.find((p) => p.deger === v);
    if (t) setSure(String(t.sure));
  };

  const konuSecenekleri = useMemo(
    () => konuBasliklariAl(seciliAlan, seviye),
    [seciliAlan, seviye],
  );

  /** Keşif Kampüsü'nde örnek konu listesi olmayan atölyelerde başlık serbest yazılır. */
  const serbestKonu = kesifMi && konuSecenekleri.length === 0;

  useEffect(() => {
    if (serbestKonu) return;
    if (konuBasligi && !konuSecenekleri.includes(konuBasligi)) setKonuBasligi("");
  }, [konuSecenekleri, konuBasligi, serbestKonu]);




  const uret = async () => {
    if (!seciliAlan || !seciliSablon || !konuBasligi) {
      toast.error("Atölye, yaş grubu, konu başlığı ve öğretim modeli seçilmelidir.");
      return;
    }
    setHata(false);
    setUretiliyor(true);
    const toplamSure = Number(sure) || 90;
    const sayi = Number(ogrenciSayisi) || 20;
    const eskiModel = modeller.find((m) => m.ad === seciliOgretim.sablon);
    try {
      const cevap = await uretFn({
        data: {
          atolye_alani: seciliAlan.ad,
          program,
          konu_basliklari: konuBasliklariAl(seciliAlan, seviye),
          sure_hafta: seciliAlan.sure_hafta ?? 0,
          konu_basligi: konuBasligi,
          kazanim_turet: true,
          kazanim_kodu: "",
          kazanim_metni: "",
          bloom_seviyesi: "",
          seviye: SINIF_ETIKET[seviye] ?? seviye,
          yas_araligi: SINIF_YAS[seviye] ?? "",
          model_adi: seciliOgretim.etiket,
          asama_sablonu: seciliSablon.kod,
          asama_sablonu_kaynagi: seciliSablon.kaynak ?? "",
          kural_profili: seciliOgretim.profil,
          model_asamalari: (seciliSablon.asamalar ?? []).map((a) => ({
            ad: a.ad,
            oran: a.oran ?? 0,
            amac: a.amac ?? "",
          })),
          toplam_sure: toplamSure,
          ogrenci_sayisi: sayi,
          program_donemi: BILIMTR_PROGRAM_TURU_ETIKET[donem] ?? donem,
        },
      });
      const icerik = JSON.parse(cevap as string) as PlanIcerik;
      icerik.kazanim_turetildi = true;
      const { data, error } = await supabase
        .from("planlar")
        .insert({
          kazanim_id: null,
          atolye_alani_id: seciliAlan.id,
          konu_basligi: konuBasligi,
          model_id: eskiModel?.id ?? null,
          asama_sablonu: seciliOgretim.sablon,
          kural_profili: seciliOgretim.profil,
          yas_grubu: seviye,
          program_donemi: donem,
          toplam_sure: toplamSure,
          ogrenci_sayisi: sayi,
          durum: "taslak",
          versiyon: 1,
          icerik: icerik as never,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      toast.success("Atölye planı üretildi.");
      navigate({ to: "/plan/$id", params: { id: data.id } });
    } catch (e) {
      console.error("[plan üretimi]", e);
      setHata(true);
      toast.error("Üretim başarısız, tekrar deneyin.");
    } finally {
      setUretiliyor(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="space-y-6 rounded-xl border bg-primary p-6 text-primary-foreground">
        <header className="space-y-2">
          <p className="text-3xl font-semibold tracking-tight">KALFA</p>
          <p className="text-base font-medium opacity-90">Kalfa üretir, usta onaylar.</p>
          <p className="max-w-2xl text-sm opacity-85">
            Bilim Türkiye atölyeleri için kazanıma bağlı atölye içeriği üretir,
            ürettiğini bağımsız bir pedagojik denetçiyle sınar, son sözü uzmana bırakır.
          </p>
        </header>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {[
            ["ÜRETEN YAPAY ZEKÂ", "Plan, etkinlik, oyun, malzeme, ölçme üretir"],
            ["BAĞIMSIZ DENETÇİ", "12 pedagojik kurala karşı sınar, kanıt alıntısı verir"],
            ["UZMAN ONAYI", "Kritik bulgu varsa onay kilitlenir"],
          ].map(([ad, aciklama], i) => (
            <div key={ad} className="flex flex-1 items-center gap-3">
              <div className="flex-1 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 p-4">
                <p className="text-xs font-semibold tracking-[0.12em]">{ad}</p>
                <p className="mt-2 text-xs opacity-85">{aciklama}</p>
              </div>
              {i < 2 && (
                <span aria-hidden className="hidden text-lg opacity-70 sm:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <ul className="grid gap-2 text-xs sm:grid-cols-2">
          {[
            ["İçerik Uzmanı", "Kazanım seçer, içerik üretir, düzenler"],
            ["Pedagojik Uzman", "Bulguları inceler, onaylar veya revizyon ister"],
            ["Eğitmen", "Onaylı içeriği açar, uygular, geri bildirim bırakır"],
            ["Eğitim Yöneticisi", "Havuzu ve süreci izler"],
          ].map(([rolAdi, gorev]) => (
            <li key={rolAdi} className="rounded-lg bg-primary-foreground/10 p-3">
              <span className="font-medium">{rolAdi}</span>
              <span className="block opacity-85">{gorev}</span>
            </li>
          ))}
        </ul>

        <p className="border-t border-primary-foreground/20 pt-3 text-[11px] opacity-70">
          Denetim kuralları, T3 Vakfı Eğitim ve Ar-Ge Koordinatörlüğü Araştırma Raporu (Şubat
          2026) bulgularına dayanır.
        </p>
      </section>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Yeni Plan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kazanım ve kısıtları belirleyin; sistem seçilen öğretim modeline uygun atölye planını
          üretsin.
        </p>
      </div>


      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Atölye alanı</Label>
            <Select value={alanId} onValueChange={alanSec}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    {PROGRAM_GRUP_ETIKET[BILIMTR]} ({btAlanlar.length})
                  </SelectLabel>
                  {btAlanlar.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.ad}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Yaş grubu / Düzey</Label>

            <Select value={seviye} onValueChange={setSeviye}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {BILIMTR_YAS_GRUPLARI.map((s) => (
                  <SelectItem key={s.deger} value={s.deger}>
                    {s.etiket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Konu başlığı</Label>
            <Select value={konuBasligi} onValueChange={setKonuBasligi}>
              <SelectTrigger>
                <SelectValue placeholder="Konu başlığı seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {konuSecenekleri.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Kazanım metni, seçilen konu başlığından üretim sırasında türetilir ve plan
              sayfasında düzenlenebilir.
            </p>
          </div>


          <div className="space-y-2 md:col-span-2">
            <Label>Öğretim modeli</Label>
            <Select value={ogretim} onValueChange={setOgretim}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {OGRETIM_SECENEKLERI.map((o) => (
                  <SelectItem key={o.deger} value={o.deger}>
                    {o.etiket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(() => {
              const bilgi =
                MODEL_BILGI[seciliOgretim.profil === "GIPSCI" ? "GIPSCI" : seciliOgretim.sablon];
              const asamaZinciri = (seciliSablon?.asamalar ?? []).map((a) => a.ad).join(" → ");
              return (
                <div className="rounded-lg border border-border bg-muted/60 p-3 text-xs text-muted-foreground">
                  <p className="text-sm font-medium text-foreground">
                    {bilgi?.ad ?? seciliOgretim.etiket}
                  </p>
                  {bilgi?.acilim && <p className="mt-0.5 italic">{bilgi.acilim}</p>}
                  {asamaZinciri && (
                    <p className="mt-2">
                      <span className="font-medium text-foreground">Aşamalar: </span>
                      {asamaZinciri}
                    </p>
                  )}
                  {seciliOgretim.profil === "GIPSCI" && <p className="mt-2">{GIPSCI_BILGI_NOTU}</p>}
                  <p className="mt-2">
                    Kaynak:{" "}
                    {seciliOgretim.profil === "GIPSCI"
                      ? (seciliProfil?.kaynak ?? bilgi?.kaynak ?? "—")
                      : (seciliSablon?.kaynak ?? bilgi?.kaynak ?? "—")}
                  </p>
                </div>
              );
            })()}

          </div>


          <div className="space-y-2">
            <Label>Program türü</Label>
            <Select value={donem} onValueChange={programTuruSec}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {BILIMTR_PROGRAM_TURLERI.map((p) => (
                  <SelectItem key={p.deger} value={p.deger}>
                    {p.etiket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Kaynak: T3 Vakfı Araştırma Raporu, Şubat 2026 — Bilim Türkiye program çeşitliliği
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sure">Toplam süre (dk)</Label>
            <Input id="sure" type="number" value={sure} onChange={(e) => setSure(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogrenci">Öğrenci sayısı</Label>
            <Input
              id="ogrenci"
              type="number"
              value={ogrenciSayisi}
              onChange={(e) => setOgrenciSayisi(e.target.value)}
            />
          </div>

          {seciliAlan && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 md:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-accent text-accent-foreground">{seciliAlan.ad}</Badge>
                <Badge variant="secondary">{program}</Badge>
                <Badge variant="secondary">{KATEGORI_ETIKET[seciliAlan.kategori]}</Badge>
                {seciliAlan.sure_hafta > 0 && (
                  <Badge variant="secondary">{seciliAlan.sure_hafta} hafta</Badge>
                )}
              </div>
              {seciliAlan.amac && (
                <p className="mt-3 text-sm text-muted-foreground">{seciliAlan.amac}</p>
              )}
              {konuSecenekleri.length > 0 && (
                <>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Konu başlıkları · {SINIF_ETIKET[seviye] ?? seviye}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {konuSecenekleri.map((k) => (
                      <Badge key={k} variant="secondary" className="font-normal">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
              <p className="mt-3 text-xs text-muted-foreground">{BILIMTR_KAYNAK_NOTU}</p>
            </div>
          )}



          <div className="space-y-3 md:col-span-2">
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={uret}
              disabled={uretiliyor}
            >
              {uretiliyor ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Atölye planı üretiliyor…
                </span>
              ) : (
                "Planı Üret"
              )}
            </Button>

            <AsamaliBekleme
              adimlar={URETIM_ADIMLARI}
              aktif={uretiliyor}
              not="Bu işlem 20-60 saniye sürebilir. Lütfen sayfayı kapatmayın."
            />


            {hata && !uretiliyor && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
                <span className="font-medium text-destructive">
                  Üretim başarısız, tekrar deneyin.
                </span>
                <Button variant="outline" size="sm" onClick={uret}>
                  Tekrar Dene
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
