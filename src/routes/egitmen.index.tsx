import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OGRETIM_SECENEK_ETIKET,
  SINIF_DUZEYLERI,
  SINIF_ETIKET,
  SINIF_ROZET,
  type DenetimTuru,
  type Kazanim,
  type Plan,
} from "@/lib/tipler";

export const Route = createFileRoute("/egitmen/")({
  head: () => ({
    meta: [
      { title: "Eğitmen Görünümü — KALFA" },
      {
        name: "description",
        content: "Eğitmenin sınıfta uygulayacağı onaylı atölye planlarının listesi.",
      },
      { property: "og:title", content: "Eğitmen Görünümü — KALFA" },
      {
        property: "og:description",
        content: "Yalnızca pedagojik uzman tarafından onaylanmış atölye planları.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Egitmen,
});

const TUMU = "hepsi";

function Egitmen() {
  const navigate = useNavigate();
  const [alan, setAlan] = useState(TUMU);
  const [seviye, setSeviye] = useState(TUMU);

  const { data: kazanimlar = [] } = useQuery({
    queryKey: ["kazanimlar"],
    queryFn: async () => {
      const { data, error } = await supabase.from("kazanimlar").select("*").order("kod");
      if (error) throw error;
      return data as Kazanim[];
    },
  });

  const { data: planlar = [], isLoading } = useQuery({
    queryKey: ["onayli-planlar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planlar")
        .select("*")
        .eq("durum", "onayli")
        .eq("arsivlendi", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const { data: turlar = [] } = useQuery({
    queryKey: ["onay-turlari"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("denetim_turlari")
        .select("*")
        .eq("karar", "onayli");
      if (error) throw error;
      return data as unknown as DenetimTuru[];
    },
  });

  const onayTarihi = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of turlar) {
      if (!t.plan_id) continue;
      const mevcut = m.get(t.plan_id);
      const tarih = t.karar_tarihi ?? t.created_at;
      if (!mevcut || tarih > mevcut) m.set(t.plan_id, tarih);
    }
    return m;
  }, [turlar]);

  const kazanimHarita = useMemo(() => new Map(kazanimlar.map((k) => [k.id, k])), [kazanimlar]);
  const alanlar = useMemo(
    () => Array.from(new Set(kazanimlar.map((k) => k.atolye_alani))),
    [kazanimlar],
  );

  const liste = planlar.filter((p) => {
    const k = p.kazanim_id ? kazanimHarita.get(p.kazanim_id) : undefined;
    if (alan !== TUMU && k?.atolye_alani !== alan) return false;
    if (seviye !== TUMU && p.yas_grubu !== seviye) return false;
    return true;
  });

  const yedigunOnce = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Onaylı İçerikler</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sınıfta uygulayabileceğiniz, pedagojik uzman onayından geçmiş atölye planları.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select value={alan} onValueChange={setAlan}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Atölye alanı" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TUMU}>Atölye alanı: Tümü</SelectItem>
            {alanlar.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={seviye} onValueChange={setSeviye}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Seviye" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TUMU}>Seviye: Tümü</SelectItem>
            {SINIF_DUZEYLERI.map((s) => (
              <SelectItem key={s.deger} value={s.deger}>
                {SINIF_ETIKET[s.deger]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Yükleniyor…</p>
      ) : planlar.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Henüz onaylı içerik yok. İçerik uzmanı plan ürettiğinde ve pedagojik uzman
            onayladığında planlar burada görünecek.
          </CardContent>
        </Card>
      ) : liste.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            Seçtiğiniz filtrelere uyan onaylı plan yok.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {liste.map((p) => {
            const k = p.kazanim_id ? kazanimHarita.get(p.kazanim_id) : undefined;
            const tarih = p.onay_tarihi ?? onayTarihi.get(p.id) ?? p.created_at;
            const yeni = tarih ? new Date(tarih).getTime() > yedigunOnce : false;
            const model =
              p.kural_profili === "GIPSCI"
                ? "GiPSci"
                : (OGRETIM_SECENEK_ETIKET[p.asama_sablonu ?? ""] ?? "—");
            return (
              <Card
                key={p.id}
                className="cursor-pointer transition-colors hover:border-accent"
                onClick={() => navigate({ to: "/egitmen/$id", params: { id: p.id } })}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      {p.icerik?.plan_basligi ?? "Adsız plan"}
                    </CardTitle>
                    {yeni && <Badge className="bg-accent text-accent-foreground">Yeni</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {k && <Badge variant="secondary">{k.atolye_alani}</Badge>}
                    <Badge variant="secondary">{SINIF_ROZET[p.yas_grubu] ?? p.yas_grubu}</Badge>
                    <Badge variant="secondary">{p.toplam_sure} dk</Badge>
                    <Badge variant="secondary">Model: {model}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Onay tarihi:{" "}
                    {tarih ? new Date(tarih).toLocaleDateString("tr-TR") : "kayıtlı değil"}
                  </p>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
