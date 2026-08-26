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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { planUret } from "@/lib/uretim.functions";
import {
  GIPSCI_BILGI_NOTU,
  KATEGORI_ETIKET,
  KONU_BASLIGI_YOK_NOTU,
  OGRETIM_SECENEKLERI,
  PROGRAM_DONEMLERI,
  PROGRAM_DONEMI_ETIKET,
  PROGRAM_GRUP_ETIKET,
  PROGRAM_SIRASI,
  SINIF_DUZEYLERI,
  SINIF_ETIKET,
  SINIF_YAS,
  type AsamaSablonu,
  type AtolyeAlani,
  type Kazanim,
  type KuralProfili,
  type OgretimModeli,
  type PlanIcerik,
} from "@/lib/tipler";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yeni Atölye Planı — KALFA" },
      {
        name: "description",
        content:
          "Kazanım, seviye ve öğretim modeli seçerek yapay zekâ destekli DENEYAP atölye planı üretin.",
      },
      { property: "og:title", content: "Yeni Atölye Planı — KALFA" },
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

  const { data: kazanimlar = [] } = useQuery({
    queryKey: ["kazanimlar"],
    queryFn: async () => {
      const { data, error } = await supabase.from("kazanimlar").select("*").order("kod");
      if (error) throw error;
      return data as Kazanim[];
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
  const [kazanimId, setKazanimId] = useState("");
  const [seviye, setSeviye] = useState<string>("ortaokul");
  const [donem, setDonem] = useState<string>(PROGRAM_DONEMLERI[0].deger);
  const [ogretim, setOgretim] = useState<string>("GIPSCI");
  const [sure, setSure] = useState("90");
  const [ogrenciSayisi, setOgrenciSayisi] = useState("20");
  const [arama, setArama] = useState("");
  const [acik, setAcik] = useState(false);
  const [uretiliyor, setUretiliyor] = useState(false);
  const [hata, setHata] = useState(false);

  const seciliOgretim =
    OGRETIM_SECENEKLERI.find((o) => o.deger === ogretim) ?? OGRETIM_SECENEKLERI[0];
  const seciliSablon = sablonlar.find((s) => s.kod === seciliOgretim.sablon);
  const seciliProfil = profiller.find((p) => p.kod === seciliOgretim.profil);

  const seciliAlan = alanlar.find((a) => a.id === alanId);

  const filtreliKazanimlar = useMemo(
    () =>
      kazanimlar.filter(
        (k) =>
          (seviye === "bilimtr_karma" || k.yas_grubu === seviye) &&
          (!seciliAlan || k.atolye_alani === seciliAlan.ad),
      ),
    [kazanimlar, seviye, seciliAlan],
  );

  const aramaliKazanimlar = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    if (!q) return filtreliKazanimlar;
    return filtreliKazanimlar.filter(
      (k) =>
        k.kod.toLocaleLowerCase("tr").includes(q) || k.metin.toLocaleLowerCase("tr").includes(q),
    );
  }, [filtreliKazanimlar, arama]);

  const secili = kazanimlar.find((k) => k.id === kazanimId);

  useEffect(() => {
    if (kazanimId && !filtreliKazanimlar.some((k) => k.id === kazanimId)) setKazanimId("");
  }, [filtreliKazanimlar, kazanimId]);


  const uret = async () => {
    if (!seciliAlan || !secili || !seciliSablon) {
      toast.error("Atölye alanı, kazanım ve öğretim modeli seçilmelidir.");
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
          program: seciliAlan.program ?? "DENEYAP Teknoloji Atölyesi",
          konu_basliklari: seciliAlan.konu_basliklari ?? [],
          sure_hafta: seciliAlan.sure_hafta ?? 0,
          kazanim_kodu: secili.kod,
          kazanim_metni: secili.metin,
          bloom_seviyesi: secili.bloom_seviyesi,
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
          program_donemi: PROGRAM_DONEMI_ETIKET[donem] ?? donem,
        },
      });
      const icerik = JSON.parse(cevap as string) as PlanIcerik;
      const { data, error } = await supabase
        .from("planlar")
        .insert({
          kazanim_id: kazanimId,
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
            <Select
              value={alanId}
              onValueChange={(v) => {
                setAlanId(v);
                setKazanimId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAM_SIRASI.map((prog) => {
                  const grup = alanlar.filter(
                    (a) => (a.program ?? "DENEYAP Teknoloji Atölyesi") === prog,
                  );
                  if (grup.length === 0) return null;
                  return (
                    <SelectGroup key={prog}>
                      <SelectLabel>
                        {PROGRAM_GRUP_ETIKET[prog]} ({grup.length})
                      </SelectLabel>
                      {grup.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.ad}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Yaş grubu / Düzey</Label>

            <Select value={seviye} onValueChange={setSeviye}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SINIF_DUZEYLERI.map((s) => (
                  <SelectItem key={s.deger} value={s.deger}>
                    {s.etiket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Kazanım</Label>
            <Popover open={acik} onOpenChange={setAcik}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="h-auto min-h-10 w-full justify-start whitespace-normal py-2 text-left font-normal"
                >
                  {secili ? (
                    <span className="flex flex-wrap items-start gap-2">
                      <Badge variant="secondary" className="shrink-0">
                        {secili.kod}
                      </Badge>
                      <span className="flex-1">{secili.metin}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Kazanım seçiniz</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-[--radix-popover-trigger-width] max-w-[calc(100vw-2rem)] p-0"
              >
                <div className="border-b border-border p-2">
                  <Input
                    placeholder="Kod veya metin içinde ara…"
                    value={arama}
                    onChange={(e) => setArama(e.target.value)}
                  />
                </div>
                <div className="max-h-80 overflow-y-auto p-1">
                  {filtreliKazanimlar.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">
                      Bu alan ve seviye için tanımlı kazanım bulunmuyor.
                    </p>
                  ) : aramaliKazanimlar.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">Eşleşen kazanım yok.</p>
                  ) : (
                    aramaliKazanimlar.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => {
                          setKazanimId(k.id);
                          setAcik(false);
                        }}
                        className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                          k.id === kazanimId ? "bg-muted" : ""
                        }`}
                      >
                        <Badge variant="secondary" className="mt-0.5 shrink-0">
                          {k.kod}
                        </Badge>
                        <span className="flex-1 whitespace-normal">{k.metin}</span>
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
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
            <Label>Program dönemi</Label>
            <Select value={donem} onValueChange={setDonem}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROGRAM_DONEMLERI.map((p) => (
                  <SelectItem key={p.deger} value={p.deger}>
                    {p.etiket}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <Badge variant="secondary">
                  {seciliAlan.program ?? "DENEYAP Teknoloji Atölyesi"}
                </Badge>
                <Badge variant="secondary">{KATEGORI_ETIKET[seciliAlan.kategori]}</Badge>
                {seciliAlan.sure_hafta > 0 && (
                  <Badge variant="secondary">{seciliAlan.sure_hafta} hafta</Badge>
                )}
              </div>
              {(seciliAlan.konu_basliklari ?? []).length > 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Konu başlıkları
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(seciliAlan.konu_basliklari ?? []).map((k) => (
                      <Badge key={k} variant="secondary" className="font-normal">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">{KONU_BASLIGI_YOK_NOTU}</p>
              )}

            </div>
          )}

          {secili && (
            <div className="rounded-xl border border-border bg-muted/40 p-4 md:col-span-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-accent text-accent-foreground">{secili.kod}</Badge>
                <Badge variant="secondary">{secili.bloom_seviyesi}</Badge>
                <Badge variant="secondary">
                  {SINIF_ETIKET[secili.yas_grubu] ?? secili.yas_grubu}
                </Badge>
                <Badge variant="secondary">{secili.atolye_alani}</Badge>
              </div>
              <p className="mt-3 text-sm text-foreground">{secili.metin}</p>
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

            {uretiliyor && (
              <div className="rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm">
                <p className="flex items-center gap-2 font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Atölye planı üretiliyor…
                </p>
                <p className="mt-1 text-muted-foreground">
                  Bu işlem 20-60 saniye sürebilir. Lütfen sayfayı kapatmayın.
                </p>
              </div>
            )}

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
