import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kazanim, Plan } from "@/lib/tipler";

export const Route = createFileRoute("/raporlar")({
  head: () => ({
    meta: [
      { title: "Raporlar — KALFA" },
      {
        name: "description",
        content: "Üretilen atölye planlarının sayısı, onay durumu ve atölye alanına göre dağılımı.",
      },
      { property: "og:title", content: "Raporlar — KALFA" },
      {
        property: "og:description",
        content: "Eğitim yöneticisi için plan üretim ve onay özeti.",
      },
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

  const harita = useMemo(() => new Map(kazanimlar.map((k) => [k.id, k])), [kazanimlar]);

  const onayli = planlar.filter((p) => p.durum === "onayli").length;
  const denetimde = planlar.filter((p) => p.durum === "denetimde").length;
  const taslak = planlar.filter((p) => p.durum === "taslak").length;

  const dagilim = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of planlar) {
      const alan = (p.kazanim_id ? harita.get(p.kazanim_id)?.atolye_alani : null) ?? "Tanımsız";
      m.set(alan, (m.get(alan) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [planlar, harita]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Raporlar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan üretimi ve onay sürecine dair özet göstergeler.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Sayac etiket="Toplam plan" deger={planlar.length} />
        <Sayac etiket="Onaylı" deger={onayli} />
        <Sayac etiket="Denetimde" deger={denetimde} />
        <Sayac etiket="Taslak" deger={taslak} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atölye alanına göre dağılım</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Yükleniyor…</p>
          ) : dagilim.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz plan üretilmedi.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {dagilim.map(([alan, adet]) => (
                <li key={alan} className="flex items-center justify-between py-2">
                  <span>{alan}</span>
                  <span className="font-medium">{adet}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Sayac({ etiket, deger }: { etiket: string; deger: number }) {
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
