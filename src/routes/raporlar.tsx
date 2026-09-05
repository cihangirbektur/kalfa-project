import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Iskelet } from "@/components/Iskelet";

import { PROGRAM_GRUP_ETIKET, PROGRAM_SIRASI } from "@/lib/tipler";
import type { AtolyeAlani, DenetimBulgusu, GeriBildirim, Kazanim, Plan } from "@/lib/tipler";
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

  const [acikGrup, setAcikGrup] = useState<Record<string, boolean>>({});

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

  const { data: alanlar = [] } = useQuery({
    queryKey: ["atolye_alanlari"],
    queryFn: async () => {
      const { data, error } = await supabase.from("atolye_alanlari").select("*").order("ad");
      if (error) throw error;
      return data as unknown as AtolyeAlani[];
    },
  });

  const programGruplari = useMemo(() => {
    const sayac = new Map<string, number>();
    for (const a of alanlar) sayac.set(a.ad, 0);
    for (const p of aktif) {
      if (p.durum !== "onayli") continue;
      const alanAdi =
        (p.atolye_alani_id ? alanlar.find((a) => a.id === p.atolye_alani_id)?.ad : null) ??
        (p.kazanim_id ? harita.get(p.kazanim_id)?.atolye_alani : null) ??
        "Tanımsız";
      sayac.set(alanAdi, (sayac.get(alanAdi) ?? 0) + 1);
    }
    const programAl = (ad: string) =>
      alanlar.find((a) => a.ad === ad)?.program ?? "DENEYAP Teknoloji Atölyesi";
    return PROGRAM_SIRASI.map((prog) => {
      const kayitlar = [...sayac.entries()].filter(([ad]) => programAl(ad) === prog);
      const dolu = kayitlar
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "tr"));
      const bos = kayitlar
        .filter(([, n]) => n === 0)
        .map(([ad]) => ad)
        .sort((a, b) => a.localeCompare(b, "tr"));
      return {
        program: prog,
        toplam: dolu.reduce((t, [, n]) => t + n, 0),
        dolu,
        bos,
      };
    })
      .map((g) => (g.toplam === 0 ? { ...g, dolu: [], bos: [] } : g))
      .filter((g) => g.toplam > 0);
  }, [aktif, harita, alanlar]);


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
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-2">
              <Iskelet className="h-4 w-2/3" />
              <Iskelet className="h-4 w-1/2" />
              <Iskelet className="h-4 w-3/5" />
            </div>
          ) : programGruplari.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Henüz plan üretilmedi; ilk plan üretildiğinde dağılım burada görünür.
            </p>

          ) : (
            programGruplari.map((g) => (
              <div key={g.program}>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-sm font-semibold">
                    {PROGRAM_GRUP_ETIKET[g.program] ?? g.program}
                  </h3>
                  <span className="text-sm text-muted-foreground">{g.toplam} onaylı plan</span>
                </div>
                <ul className="divide-y divide-border text-sm">
                  {g.dolu.map(([alan, adet]) => (
                    <li key={alan} className="flex items-center justify-between py-2">
                      <span>{alan}</span>
                      <span className="font-medium">{adet}</span>
                    </li>
                  ))}
                  {g.bos.length > 0 && (
                    <li className="py-2">
                      <button
                        type="button"
                        onClick={() =>
                          setAcikGrup((s) => ({ ...s, [g.program]: !s[g.program] }))
                        }
                        className="flex w-full items-center justify-between text-left text-muted-foreground hover:text-foreground"
                      >
                        <span>Henüz içerik üretilmemiş {g.bos.length} alan</span>
                        <span className="text-xs">{acikGrup[g.program] ? "Kapat" : "Aç"}</span>
                      </button>
                      {acikGrup[g.program] && (
                        <ul className="mt-2 space-y-1 pl-3 text-muted-foreground">
                          {g.bos.map((ad) => (
                            <li key={ad} className="flex items-center justify-between">
                              <span>{ad}</span>
                              <span>0 onaylı plan</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )}
                </ul>
              </div>
            ))
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
