import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { DurumEtiketi } from "@/components/DurumEtiketi";
import { useRol } from "@/lib/rol";
import type { Asama, Kazanim, PlanIcerik, Plan } from "@/lib/tipler";

export const Route = createFileRoute("/plan/$id")({
  head: () => ({
    meta: [
      { title: "Atölye Planı — KALFA" },
      {
        name: "description",
        content: "5E aşamaları, etkinlikler, malzemeler, medya ve ölçme araçlarıyla atölye planı.",
      },
      { property: "og:title", content: "Atölye Planı — KALFA" },
      {
        property: "og:description",
        content: "Aşama aşama düzenlenebilir DENEYAP atölye planı görünümü.",
      },
    ],
  }),
  component: PlanGorunumu,
});

function PlanGorunumu() {
  const { id } = Route.useParams();
  const { rol } = useRol();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const { data: plan, error } = await supabase
        .from("planlar")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      let kazanim: Kazanim | null = null;
      if (plan.kazanim_id) {
        const { data: k } = await supabase
          .from("kazanimlar")
          .select("*")
          .eq("id", plan.kazanim_id)
          .single();
        kazanim = (k as Kazanim) ?? null;
      }
      return { plan: plan as unknown as Plan, kazanim };
    },
  });

  const [icerik, setIcerik] = useState<PlanIcerik>({});
  useEffect(() => {
    if (data?.plan) setIcerik(data.plan.icerik ?? {});
  }, [data?.plan]);

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;
  }

  const { plan, kazanim } = data;
  const duzenlenebilir = rol === "İçerik Uzmanı";

  const kaydet = async () => {
    const { error } = await supabase.from("planlar").update({ icerik }).eq("id", plan.id);
    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
      return;
    }
    toast.success("Plan kaydedildi.");
    refetch();
  };

  const denetimeGonder = async () => {
    const { error } = await supabase
      .from("planlar")
      .update({ icerik, durum: "denetimde" })
      .eq("id", plan.id);
    if (error) {
      toast.error("Gönderilemedi: " + error.message);
      return;
    }
    toast.success("Plan denetime gönderildi.");
    refetch();
  };

  const asamaGuncelle = (i: number, alan: keyof Asama, deger: unknown) => {
    setIcerik((o) => {
      const asamalar = [...(o.asamalar ?? [])];
      asamalar[i] = { ...asamalar[i], [alan]: deger } as Asama;
      return { ...o, asamalar };
    });
  };

  const malzemeler = icerik.malzemeler ?? [];
  const toplamMaliyet = malzemeler.reduce((t, m) => t + m.adet * m.birim_maliyet, 0);
  const toplamHazirlik = malzemeler.reduce((t, m) => t + m.hazirlik_suresi, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {icerik.baslik ?? "Adsız plan"}
          </h1>
          {kazanim && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{kazanim.kod}</span> — {kazanim.metin}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary">Yaş: {plan.yas_grubu}</Badge>
            <Badge variant="secondary">Model: 5E</Badge>
            <Badge variant="secondary">{plan.toplam_sure} dk</Badge>
            <Badge variant="secondary">v{plan.versiyon}</Badge>
            <DurumEtiketi durum={plan.durum} />
          </div>
        </div>
        {duzenlenebilir && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={kaydet}>
              Kaydet
            </Button>
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={denetimeGonder}
            >
              Denetime Gönder
            </Button>
            <Button variant="outline" onClick={() => toast("Yaş uyarlama sonraki adımda gelecek.")}>
              Yaş Uyarla
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="asamalar">
        <TabsList>
          <TabsTrigger value="asamalar">Aşamalar</TabsTrigger>
          <TabsTrigger value="etkinlikler">Etkinlikler</TabsTrigger>
          <TabsTrigger value="malzemeler">Malzemeler</TabsTrigger>
          <TabsTrigger value="medya">Medya</TabsTrigger>
          <TabsTrigger value="olcme">Ölçme</TabsTrigger>
        </TabsList>

        <TabsContent value="asamalar" className="mt-4">
          {(icerik.asamalar ?? []).length === 0 ? (
            <Bos metin="Bu planda henüz aşama yok." />
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {(icerik.asamalar ?? []).map((a, i) => (
                <AccordionItem
                  key={i}
                  value={`a-${i}`}
                  className="rounded-xl border border-border bg-card px-4"
                >
                  <AccordionTrigger className="text-left">
                    <span className="font-medium">{a.ad}</span>
                    <span className="ml-auto mr-2 text-xs text-muted-foreground">{a.sure} dk</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Alan
                        etiket="Aşama adı"
                        deger={a.ad}
                        oku={!duzenlenebilir}
                        degistir={(v) => asamaGuncelle(i, "ad", v)}
                      />
                      <Alan
                        etiket="Süre (dk)"
                        deger={String(a.sure)}
                        oku={!duzenlenebilir}
                        degistir={(v) => asamaGuncelle(i, "sure", Number(v) || 0)}
                      />
                    </div>
                    <UzunAlan
                      etiket="Amaç"
                      deger={a.amac}
                      oku={!duzenlenebilir}
                      degistir={(v) => asamaGuncelle(i, "amac", v)}
                    />
                    <UzunAlan
                      etiket="Öğretmen eylemi"
                      deger={a.ogretmen_eylemi}
                      oku={!duzenlenebilir}
                      degistir={(v) => asamaGuncelle(i, "ogretmen_eylemi", v)}
                    />
                    <UzunAlan
                      etiket="Öğrenci eylemi"
                      deger={a.ogrenci_eylemi}
                      oku={!duzenlenebilir}
                      degistir={(v) => asamaGuncelle(i, "ogrenci_eylemi", v)}
                    />
                    <UzunAlan
                      etiket="Tetikleyici sorular (her satıra bir soru)"
                      deger={(a.tetikleyici_sorular ?? []).join("\n")}
                      oku={!duzenlenebilir}
                      degistir={(v) =>
                        asamaGuncelle(i, "tetikleyici_sorular", v.split("\n").filter(Boolean))
                      }
                    />
                    <UzunAlan
                      etiket="Beklenen kavram yanılgıları (her satıra bir madde)"
                      deger={(a.kavram_yanilgilari ?? []).join("\n")}
                      oku={!duzenlenebilir}
                      degistir={(v) =>
                        asamaGuncelle(i, "kavram_yanilgilari", v.split("\n").filter(Boolean))
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>

        <TabsContent value="etkinlikler" className="mt-4 space-y-4">
          {(icerik.etkinlikler ?? []).length === 0 ? (
            <Bos metin="Bu planda henüz etkinlik yok." />
          ) : (
            (icerik.etkinlikler ?? []).map((e, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row flex-wrap items-center gap-2 space-y-0">
                  <Badge className="bg-accent text-accent-foreground">{e.tip}</Badge>
                  <CardTitle className="text-base">{e.ad}</CardTitle>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {e.asama} · {e.sure} dk
                  </span>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="mb-1 font-medium">Adımlar</p>
                    <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                      {e.adimlar.map((s, j) => (
                        <li key={j}>{s}</li>
                      ))}
                    </ol>
                  </div>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Kazanım hizası: </span>
                    {e.kazanim_hizasi}
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="font-medium">Destek</p>
                      <p className="text-muted-foreground">{e.farklilastirma?.destek}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="font-medium">Zenginleştirme</p>
                      <p className="text-muted-foreground">{e.farklilastirma?.zenginlestirme}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="malzemeler" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>Adet</TableHead>
                    <TableHead>Birim maliyet (TL)</TableHead>
                    <TableHead>Hazırlık (dk)</TableHead>
                    <TableHead>Güvenlik notu</TableHead>
                    <TableHead>Alternatif</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {malzemeler.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-muted-foreground">
                        Malzeme listesi boş.
                      </TableCell>
                    </TableRow>
                  )}
                  {malzemeler.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{m.ad}</TableCell>
                      <TableCell>{m.adet}</TableCell>
                      <TableCell>{m.birim_maliyet}</TableCell>
                      <TableCell>{m.hazirlik_suresi}</TableCell>
                      <TableCell>{m.guvenlik_notu}</TableCell>
                      <TableCell>{m.alternatif}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <span>
                  <span className="text-muted-foreground">Toplam maliyet: </span>
                  <span className="font-medium">{toplamMaliyet} TL</span>
                </span>
                <span>
                  <span className="text-muted-foreground">Toplam hazırlık süresi: </span>
                  <span className="font-medium">{toplamHazirlik} dk</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medya" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tip</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Arama terimi</TableHead>
                    <TableHead>Kullanılacak aşama</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(icerik.medya ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">
                        Medya önerisi yok.
                      </TableCell>
                    </TableRow>
                  )}
                  {(icerik.medya ?? []).map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{m.tip}</TableCell>
                      <TableCell>{m.aciklama}</TableCell>
                      <TableCell className="text-muted-foreground">{m.arama_terimi}</TableCell>
                      <TableCell>{m.asama}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="olcme" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Biçimlendirici sorular</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {(icerik.olcme?.bicimlendirici_sorular ?? []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
                {!icerik.olcme && <li>Ölçme aracı henüz üretilmedi.</li>}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Düzey belirleyici performans görevi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {icerik.olcme?.performans_gorevi ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rubrik</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kriter</TableHead>
                    <TableHead>3 puan</TableHead>
                    <TableHead>2 puan</TableHead>
                    <TableHead>1 puan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(icerik.olcme?.rubrik ?? []).map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.kriter}</TableCell>
                      <TableCell>{r.puan3}</TableCell>
                      <TableCell>{r.puan2}</TableCell>
                      <TableCell>{r.puan1}</TableCell>
                    </TableRow>
                  ))}
                  {(icerik.olcme?.rubrik ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">
                        Rubrik yok.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Alan({
  etiket,
  deger,
  degistir,
  oku,
}: {
  etiket: string;
  deger: string;
  degistir: (v: string) => void;
  oku?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{etiket}</Label>
      <Input value={deger} readOnly={oku} onChange={(e) => degistir(e.target.value)} />
    </div>
  );
}

function UzunAlan({
  etiket,
  deger,
  degistir,
  oku,
}: {
  etiket: string;
  deger: string;
  degistir: (v: string) => void;
  oku?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{etiket}</Label>
      <Textarea rows={3} value={deger} readOnly={oku} onChange={(e) => degistir(e.target.value)} />
    </div>
  );
}

function Bos({ metin }: { metin: string }) {
  return (
    <Card>
      <CardContent className="py-8 text-center text-sm text-muted-foreground">{metin}</CardContent>
    </Card>
  );
}
