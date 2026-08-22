import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  KATEGORI_ETIKET,
  PROGRAM_DONEMLERI,
  SINIF_DUZEYLERI,
  SINIF_ETIKET,
  type Kazanim,
  type OgretimModeli,
} from "@/lib/tipler";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yeni Atölye Planı — KALFA" },
      {
        name: "description",
        content:
          "Kazanım, sınıf düzeyi ve öğretim modeli seçerek DENEYAP atölye planı oluşturun.",
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

  const [alan, setAlan] = useState("");
  const [kazanimId, setKazanimId] = useState("");
  const [sinif, setSinif] = useState<string>("6-7");
  const [donem, setDonem] = useState<string>(PROGRAM_DONEMLERI[0].deger);
  const [modelId, setModelId] = useState("");
  const [sure, setSure] = useState("90");
  const [ogrenciSayisi, setOgrenciSayisi] = useState("20");
  const [arama, setArama] = useState("");
  const [acik, setAcik] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  // 5E varsayılan olarak seçili gelsin
  useEffect(() => {
    if (modelId) return;
    const varsayilan = modeller.find((m) => m.ad === "5E");
    if (varsayilan) setModelId(varsayilan.id);
  }, [modeller, modelId]);

  const alanGruplari = useMemo(() => {
    const gruplar: Record<string, string[]> = { yuz_yuze: [], cevrim_ici: [] };
    for (const k of kazanimlar) {
      const g = gruplar[k.kategori] ?? (gruplar[k.kategori] = []);
      if (!g.includes(k.atolye_alani)) g.push(k.atolye_alani);
    }
    return gruplar;
  }, [kazanimlar]);

  const alanaGoreKazanimlar = useMemo(
    () => kazanimlar.filter((k) => !alan || k.atolye_alani === alan),
    [kazanimlar, alan],
  );
  const filtreliKazanimlar = useMemo(
    () => alanaGoreKazanimlar.filter((k) => k.yas_grubu === sinif),
    [alanaGoreKazanimlar, sinif],
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
  const seciliModel = modeller.find((m) => m.id === modelId);

  // Seçili kazanım artık filtreye uymuyorsa temizle
  useEffect(() => {
    if (kazanimId && !filtreliKazanimlar.some((k) => k.id === kazanimId)) setKazanimId("");
  }, [filtreliKazanimlar, kazanimId]);

  const uret = async () => {
    if (!kazanimId || !modelId) {
      toast.error("Kazanım ve öğretim modeli seçilmelidir.");
      return;
    }
    setKaydediliyor(true);
    const toplamSure = Number(sure) || 90;
    const asamalar = (seciliModel?.asamalar ?? []).map((a) => ({
      ad: a.ad,
      sure: Math.round(toplamSure * (a.oran ?? 0)),
      amac: a.amac,
      ogretmen_eylemi: "",
      ogrenci_eylemi: "",
      tetikleyici_sorular: [],
      kavram_yanilgilari: [],
    }));
    const { data, error } = await supabase
      .from("planlar")
      .insert({
        kazanim_id: kazanimId,
        model_id: modelId,
        yas_grubu: sinif,
        program_donemi: donem,
        toplam_sure: toplamSure,
        ogrenci_sayisi: Number(ogrenciSayisi) || 20,
        durum: "taslak",
        versiyon: 1,
        icerik: {
          baslik: secili ? `${secili.kod} atölyesi` : "Yeni atölye planı",
          ozet: "İçerik henüz üretilmedi. Yapay zekâ üretimi sonraki adımda eklenecek.",
          asamalar,
          etkinlikler: [],
          malzemeler: [],
          medya: [],
        },
      })
      .select("id")
      .single();
    setKaydediliyor(false);
    if (error) {
      toast.error("Plan oluşturulamadı: " + error.message);
      return;
    }
    toast.success("Plan taslağı oluşturuldu.");
    navigate({ to: "/plan/$id", params: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Yeni Plan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kazanım ve kısıtları belirleyin; sistem seçilen öğretim modeline uygun atölye planını
          hazırlasın.
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
              value={alan}
              onValueChange={(v) => {
                setAlan(v);
                setKazanimId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {(["yuz_yuze", "cevrim_ici"] as const).map((kat) =>
                  (alanGruplari[kat] ?? []).length ? (
                    <SelectGroup key={kat}>
                      <SelectLabel>{KATEGORI_ETIKET[kat]}</SelectLabel>
                      {(alanGruplari[kat] ?? []).map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ) : null,
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sınıf düzeyi</Label>
            <Select value={sinif} onValueChange={setSinif}>
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
                      Bu sınıf düzeyi için tanımlı kazanım bulunmuyor.
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
            {filtreliKazanimlar.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Bu sınıf düzeyi için tanımlı kazanım bulunmuyor.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Öğretim modeli</Label>
            <Select value={modelId} onValueChange={setModelId}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {modeller.map((m) => {
                  const asamaSayisi = (m.asamalar ?? []).length;
                  if (asamaSayisi === 0) {
                    return (
                      <TooltipProvider key={m.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <SelectItem value={m.id} disabled>
                                {m.ad} (aşamalar tanımlanmayı bekliyor)
                              </SelectItem>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            Bilim Türkiye&apos;nin özgün öğretim modeli. Aşama tanımları Eğitim
                            Ar-Ge Koordinatörlüğü&apos;nden temin edildiğinde sisteme tek kayıt
                            olarak eklenecektir; yazılım değişikliği gerekmez.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }
                  return (
                    <SelectItem key={m.id} value={m.id}>
                      {m.ad}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
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

          <div className="md:col-span-2">
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={uret}
              disabled={kaydediliyor}
            >
              {kaydediliyor ? "Üretiliyor…" : "Planı Üret"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
