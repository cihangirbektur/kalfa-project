import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DenetimBulgusu, GeriBildirim, Kazanim, Plan } from "@/lib/tipler";
import { bildirimOzeti, bildirimleriCoz } from "@/lib/geribildirim";

export const Route = createFileRoute("/raporlar")({
  head: () => ({
    meta: [
      { title: "Raporlar — KALFA" },
      {
        name: "description",
        content:
          "Üretilen atölye planlarının sayısı, onay durumu, ortalama kritik bulgu ve alan bazlı onaylı içerik dağılımı.",
      },
      { property: "og:title", content: "Raporlar — KALFA" },
      {
        property: "og:description",
        content: "Eğitim yöneticisi için plan üretim, denetim ve onay özeti.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Raporlar,
});

function Raporlar() {
  const { data: planlar = [], isLoading } = useQuery({
    queryKey: ["planlar"],
    queryFn: async () => {
      const { data, error } = await supabase.from("planlar").select("*");
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const { data: kazanimlar = [] } = useQuery({
    queryKey: ["kazanimlar"],
    queryFn: async () => {
      const { data, error } = await supabase.from("kazanimlar").select("*");
      if (error) throw error;
      return data as Kazanim[];
    },
  });

  const { data: bulgular = [] } = useQuery({
    queryKey: ["tum-bulgular"],
    queryFn: async () => {
      const { data, error } = await supabase.from("denetim_bulgulari").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as DenetimBulgusu[];
    },
  });

  const { data: bildirimler = [] } = useQuery({
    queryKey: ["tum-geribildirim"],
    queryFn: async () => {
      const { data, error } = await supabase.from("geri_bildirimler").select("*");
      if (error) throw error;
      return (data ?? []) as unknown as GeriBildirim[];
    },
  });

  const sahaOzeti = useMemo(() => bildirimOzeti(bildirimleriCoz(bildirimler)), [bildirimler]);



  const harita = useMemo(() => new Map(kazanimlar.map((k) => [k.id, k])), [kazanimlar]);
  const aktif = planlar.filter((p) => !p.arsivlendi);

  const onayli = aktif.filter((p) => p.durum === "onayli").length;
  const denetimde = aktif.filter((p) => p.durum === "denetimde").length;

  const ortalamaKritik = useMemo(() => {
    const planIdler = new Set(bulgular.map((b) => b.plan_id).filter(Boolean) as string[]);
    if (planIdler.size === 0) return "0.0";
    const kritik = bulgular.filter((b) => b.seviye === "kritik" && !b.gecti).length;
    return (kritik / planIdler.size).toFixed(1);
  }, [bulgular]);

  const onayliDagilim = useMemo(() => {
    const m = new Map<string, number>();
    for (const k of kazanimlar) m.set(k.atolye_alani, m.get(k.atolye_alani) ?? 0);
    for (const p of aktif) {
      if (p.durum !== "onayli") continue;
      const alan = (p.kazanim_id ? harita.get(p.kazanim_id)?.atolye_alani : null) ?? "Tanımsız";
      m.set(alan, (m.get(alan) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr"));
  }, [aktif, harita, kazanimlar]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Raporlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan üretimi, denetim ve onay sürecine dair özet göstergeler (arşivlenenler hariç).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Sayac etiket="Toplam plan" deger={String(aktif.length)} />
        <Sayac etiket="Denetimde" deger={String(denetimde)} />
        <Sayac etiket="Onaylı" deger={String(onayli)} />
        <Sayac etiket="Ortalama kritik bulgu" deger={ortalamaKritik} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Sayac etiket="Sahada uygulama" deger={String(sahaOzeti.uygulamaSayisi)} />
        <Sayac etiket="Toplam geri bildirim" deger={String(sahaOzeti.toplam)} />
        <Sayac
          etiket="En çok zorlanılan aşama"
          deger={
            sahaOzeti.enZorAsama
              ? `${sahaOzeti.enZorAsama.asama} (${sahaOzeti.enZorAsama.adet})`
              : "—"
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sahada zorlanılan aşamalar</CardTitle>
        </CardHeader>
        <CardContent>
          {sahaOzeti.asamaDagilimi.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Henüz aşama bazlı geri bildirim yok.
            </p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {sahaOzeti.asamaDagilimi.map((a) => (
                <li key={a.asama} className="flex items-center justify-between py-2">
                  <span>{a.asama}</span>
                  <span className="font-medium">{a.adet}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atölye alanına göre onaylı plan dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor…</p>
          ) : onayliDagilim.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz plan üretilmedi.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {onayliDagilim.map(([alan, adet]) => (
                <li key={alan} className="flex items-center justify-between py-2">
                  <span>{alan}</span>
                  <span
                    className={
                      adet === 0 ? "font-medium text-destructive" : "font-medium"
                    }
                  >
                    {adet === 0 ? "içerik eksik" : adet}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Sayac({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{etiket}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">{deger}</p>
      </CardContent>
    </Card>
  );
}
