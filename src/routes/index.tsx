import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRol } from "@/lib/rol";
import { YAS_GRUPLARI, type Kazanim, type OgretimModeli } from "@/lib/tipler";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yeni Atölye Planı — KALFA" },
      {
        name: "description",
        content:
          "Kazanım, yaş grubu ve öğretim modeli seçerek 5E uyumlu DENEYAP atölye planı oluşturun.",
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
  const { rol } = useRol();
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
  const [yasGrubu, setYasGrubu] = useState<string>("12-14");
  const [modelId, setModelId] = useState("");
  const [sure, setSure] = useState("90");
  const [ogrenciSayisi, setOgrenciSayisi] = useState("20");
  const [butce, setButce] = useState("2500");
  const [envanter, setEnvanter] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const alanlar = useMemo(
    () => Array.from(new Set(kazanimlar.map((k) => k.atolye_alani))),
    [kazanimlar],
  );
  const filtreliKazanimlar = useMemo(
    () => kazanimlar.filter((k) => !alan || k.atolye_alani === alan),
    [kazanimlar, alan],
  );

  if (rol !== "İçerik Uzmanı") {
    return (
      <Bilgi
        baslik="Yeni Plan Formu"
        metin="Bu ekran İçerik Uzmanı rolüne özeldir. Üst bardan rolü değiştirebilirsiniz."
      />
    );
  }

  const uret = async () => {
    if (!kazanimId || !modelId) {
      toast.error("Kazanım ve öğretim modeli seçilmelidir.");
      return;
    }
    setKaydediliyor(true);
    const kazanim = kazanimlar.find((k) => k.id === kazanimId);
    const { data, error } = await supabase
      .from("planlar")
      .insert({
        kazanim_id: kazanimId,
        model_id: modelId,
        yas_grubu: yasGrubu,
        toplam_sure: Number(sure) || 90,
        ogrenci_sayisi: Number(ogrenciSayisi) || 20,
        butce: Number(butce) || 0,
        durum: "taslak",
        versiyon: 1,
        icerik: {
          baslik: kazanim ? `${kazanim.kod} atölyesi` : "Yeni atölye planı",
          ozet: "İçerik henüz üretilmedi. Yapay zekâ üretimi sonraki adımda eklenecek.",
          envanter,
          asamalar: [],
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
          Kazanım ve kısıtları belirleyin; sistem 5E uyumlu atölye planını hazırlasın.
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
                {alanlar.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Kazanım</Label>
            <Select value={kazanimId} onValueChange={setKazanimId}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {filtreliKazanimlar.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.kod} — {k.metin.slice(0, 48)}…
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Yaş grubu</Label>
            <Select value={yasGrubu} onValueChange={setYasGrubu}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YAS_GRUPLARI.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Öğretim modeli</Label>
            <Select value={modelId} onValueChange={setModelId}>
              <SelectTrigger>
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {modeller.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.ad}
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

          <div className="space-y-2">
            <Label htmlFor="butce">Bütçe üst sınırı (TL)</Label>
            <Input
              id="butce"
              type="number"
              value={butce}
              onChange={(e) => setButce(e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="envanter">Mevcut malzeme envanteri</Label>
            <Textarea
              id="envanter"
              rows={5}
              placeholder="Atölyede hâlihazırda bulunan malzemeleri yazın."
              value={envanter}
              onChange={(e) => setEnvanter(e.target.value)}
            />
          </div>

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

function Bilgi({ baslik, metin }: { baslik: string; metin: string }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{baslik}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{metin}</CardContent>
      </Card>
    </div>
  );
}
