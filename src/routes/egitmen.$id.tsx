import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { MedyaBolumu } from "@/components/MedyaBolumu";
import { adetGosterim, maliyetHesapla, paraBicimi } from "@/lib/hesap";
import {
  ETKINLIK_TIP_ETIKET,
  OGRETIM_SECENEK_ETIKET,
  SINIF_ROZET,
  type GeriBildirim,
  type Kazanim,
  type Medya,
  type Plan,
  type PlanIcerik,
} from "@/lib/tipler";

export const Route = createFileRoute("/egitmen/$id")({
  head: () => ({
    meta: [
      { title: "Atölye Uygulaması — KALFA" },
      {
        name: "description",
        content: "Onaylı atölye planının salt okunur eğitmen görünümü ve uygulama geri bildirimi.",
      },
      { property: "og:title", content: "Atölye Uygulaması — KALFA" },
      {
        property: "og:description",
        content:
          "Eğitmenler için salt okunur plan görünümü, yazdırılabilir kartlar ve geri bildirim.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EgitmenPlan,
});

function Satir({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{etiket}: </span>
      <span className="text-muted-foreground">{deger || "—"}</span>
    </p>
  );
}

function EgitmenPlan() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const [uygulandi, setUygulandi] = useState(false);
  const [not, setNot] = useState("");
  const [zorAsama, setZorAsama] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["egitmen-plan", id],
    queryFn: async () => {
      const { data: plan, error } = await supabase
        .from("planlar")
        .select("*")
        .eq("id", id)
        .eq("durum", "onayli")
        .maybeSingle();
      if (error) throw error;
      if (!plan) return null;
      let kazanim: Kazanim | null = null;
      if (plan.kazanim_id) {
        const { data: k } = await supabase
          .from("kazanimlar")
          .select("*")
          .eq("id", plan.kazanim_id)
          .maybeSingle();
        kazanim = (k as Kazanim | null) ?? null;
      }
      return { plan: plan as unknown as Plan, kazanim };
    },
  });

  const { data: bildirimler = [] } = useQuery({
    queryKey: ["egitmen-bildirim", id],
    queryFn: async () => {
      const { data: liste, error } = await supabase
        .from("geri_bildirimler")
        .select("*")
        .eq("plan_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (liste ?? []) as unknown as GeriBildirim[];
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;

  if (!data) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Plan görüntülenemiyor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Bu plan onaylı değil veya kaldırılmış. Eğitmen görünümünde yalnızca onaylı planlar
            açılır.
          </p>
          <Link to="/egitmen" className="font-medium text-primary underline">
            Onaylı içeriklere dön
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { plan, kazanim } = data;
  const icerik: PlanIcerik = plan.icerik ?? {};
  const asamalar = icerik.asamalar ?? [];
  const etkinlikler = icerik.etkinlikler ?? [];
  const malzemeler = icerik.malzemeler ?? [];
  const medyalar = icerik.medya_onerileri ?? [];
  const kartlar = icerik.merak_tetikleyicileri?.soru_kartlari ?? [];
  const maliyet = maliyetHesapla(malzemeler);
  const model =
    plan.kural_profili === "GIPSCI"
      ? "GiPSci"
      : (OGRETIM_SECENEK_ETIKET[plan.asama_sablonu ?? ""] ?? "—");
  const onayTarihi = plan.onay_tarihi
    ? new Date(plan.onay_tarihi).toLocaleString("tr-TR")
    : "kayıtlı değil";

  const gonder = async () => {
    const metin = geriBildirimKodla({
      rol: "Eğitmen",
      asama: zorAsama,
      metin: not.trim(),
    });
    setGonderiliyor(true);
    const { error } = await supabase
      .from("geri_bildirimler")
      .insert({ plan_id: plan.id, not_metni: metin, uygulandi_mi: uygulandi });

    setGonderiliyor(false);
    if (error) {
      toast.error("Geri bildirim gönderilemedi: " + error.message);
      return;
    }
    toast.success("Geri bildirim kaydedildi.");
    setNot("");
    setZorAsama("");
    setUygulandi(false);
    qc.invalidateQueries({ queryKey: ["egitmen-bildirim", id] });
  };

  const gorselKaydet = async (i: number, yol: string) => {
    const yeni = [...medyalar];
    yeni[i] = { ...(yeni[i] as Medya), gorsel_yolu: yol };
    const guncel = { ...icerik, medya_onerileri: yeni };
    await supabase
      .from("planlar")
      .update({ icerik: guncel as never })
      .eq("id", plan.id);
    qc.invalidateQueries({ queryKey: ["egitmen-plan", id] });
  };

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-6 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link to="/egitmen" className="text-xs text-muted-foreground underline">
              ← Onaylı içerikler
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              {icerik.plan_basligi ?? "Adsız plan"}
            </h1>
            {icerik.kazanim && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{icerik.kazanim.kod}</span> —{" "}
                {icerik.kazanim.metin}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-xs">
              {kazanim?.atolye_alani && (
                <Badge variant="secondary">{kazanim.atolye_alani}</Badge>
              )}
              <Badge variant="secondary">{SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}</Badge>
              <Badge variant="secondary">{plan.toplam_sure} dk</Badge>
              <Badge variant="secondary">Model: {model}</Badge>
              <Badge variant="secondary">Salt okunur</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Onay tarihi: {onayTarihi}</p>
          </div>
          <Button variant="outline" onClick={() => window.print()}>
            Yazdır
          </Button>
        </div>

        <Tabs defaultValue="asamalar">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="asamalar">Aşamalar</TabsTrigger>
            <TabsTrigger value="etkinlikler">Etkinlikler</TabsTrigger>
            <TabsTrigger value="malzemeler">Malzemeler</TabsTrigger>
            <TabsTrigger value="medya">Medya</TabsTrigger>
            <TabsTrigger value="olcme">Ölçme</TabsTrigger>
            <TabsTrigger value="kartlar">Soru Kartları</TabsTrigger>
            <TabsTrigger value="urun">Ürün</TabsTrigger>
          </TabsList>

          <TabsContent value="asamalar" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                {asamalar.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aşama tanımlı değil.</p>
                ) : (
                  <Accordion type="multiple" className="space-y-2">
                    {asamalar.map((a, i) => (
                      <AccordionItem key={i} value={`a-${i}`} className="rounded-xl border px-4">
                        <AccordionTrigger className="text-left">
                          <span className="font-medium">{a.asama}</span>
                          <span className="ml-auto mr-2 text-xs text-muted-foreground">
                            {a.sure_dk} dk
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2 pb-4 text-sm">
                          <p className="text-muted-foreground">{a.amac}</p>
                          <Satir etiket="Öğretmen" deger={a.ogretmen_eylemi} />
                          <Satir etiket="Öğrenci" deger={a.ogrenci_eylemi} />
                          {(a.tetikleyici_sorular ?? []).length > 0 && (
                            <>
                              <p className="font-medium">Tetikleyici sorular</p>
                              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                                {a.tetikleyici_sorular.map((s, j) => (
                                  <li key={j}>{s}</li>
                                ))}
                              </ul>
                            </>
                          )}
                          {(a.beklenen_kavram_yanilgilari ?? []).length > 0 && (
                            <>
                              <p className="font-medium">Beklenen kavram yanılgıları</p>
                              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                                {a.beklenen_kavram_yanilgilari.map((k, j) => (
                                  <li key={j}>
                                    {k.yanilgi} — {k.ele_alinma_bicimi}
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="etkinlikler" className="mt-4 space-y-3">
            {etkinlikler.length === 0 && (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Etkinlik tanımlı değil.
                </CardContent>
              </Card>
            )}
            {etkinlikler.map((e, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <CardTitle className="text-base">{e.ad}</CardTitle>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">{ETKINLIK_TIP_ETIKET[e.tip] ?? e.tip}</Badge>
                    <Badge variant="secondary">{e.sure_dk} dk</Badge>
                    {e.bagli_asama && <Badge variant="secondary">{e.bagli_asama}</Badge>}
                    {e.bloom_seviyesi && <Badge variant="secondary">{e.bloom_seviyesi}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                    {(e.adimlar ?? []).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                  <Satir etiket="Kazanım hizası" deger={e.kazanim_hizasi} />
                  <Satir etiket="Destek" deger={e.farklilastirma?.destek ?? ""} />
                  <Satir etiket="Zenginleştirme" deger={e.farklilastirma?.zenginlestirme ?? ""} />
                  {e.oyun_yapisi && (
                    <div className="rounded-lg border p-3">
                      <p className="mb-2 font-medium">Oyun yapısı</p>
                      <Satir etiket="Oyuncu sayısı" deger={e.oyun_yapisi.oyuncu_sayisi} />
                      <Satir etiket="Bileşenler" deger={e.oyun_yapisi.bilesenler} />
                      <Satir
                        etiket="Kart/parça tipleri"
                        deger={(e.oyun_yapisi.kart_veya_parca_tipleri ?? []).join(", ")}
                      />
                      <Satir etiket="Tur akışı" deger={(e.oyun_yapisi.tur_akisi ?? []).join(" → ")} />
                      <Satir etiket="Kazanma koşulu" deger={e.oyun_yapisi.kazanma_kosulu} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="malzemeler" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Malzeme</TableHead>
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
                      <TableRow key={i} className={m.guvenlik_notu ? "bg-destructive/5" : undefined}>
                        <TableCell className="font-medium">{m.ad}</TableCell>
                        <TableCell>{adetGosterim(m)}</TableCell>
                        <TableCell>{paraBicimi(Number(m.tahmini_birim_maliyet_tl) || 0)}</TableCell>
                        <TableCell>{m.hazirlik_suresi_dk}</TableCell>
                        <TableCell
                          className={m.guvenlik_notu ? "font-medium text-destructive" : undefined}
                        >
                          {m.guvenlik_notu || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {m.alternatif || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-4 text-sm">
                  <span className="text-muted-foreground">Toplam maliyet: </span>
                  <span className="font-medium">{paraBicimi(maliyet.toplam)} TL</span>
                  {maliyet.hesaplanamayan > 0 && (
                    <span className="ml-2 text-destructive">
                      {maliyet.hesaplanamayan} satır hesaplanamadı
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medya" className="mt-4">
            <MedyaBolumu
              planId={plan.id}
              medyalar={medyalar}
              duzenlenebilir={false}
              kazanimMetni={icerik.kazanim?.metin ?? kazanim?.metin ?? ""}
              seviye={SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}
              atolyeAlani={kazanim?.atolye_alani ?? ""}
              planBasligi={icerik.plan_basligi ?? "Atölye planı"}
              onGorsel={gorselKaydet}
            />
          </TabsContent>

          <TabsContent value="olcme" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Biçimlendirici değerlendirme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {(icerik.degerlendirme?.bicimlendirici ?? []).length === 0 ? (
                  <p className="text-muted-foreground">Tanımlı değil.</p>
                ) : (
                  (icerik.degerlendirme?.bicimlendirici ?? []).map((b, i) => (
                    <Satir key={i} etiket={b.asama} deger={b.soru} />
                  ))
                )}
              </CardContent>
            </Card>
            {(icerik.degerlendirme?.surec_odakli ?? []).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Süreç odaklı değerlendirme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {(icerik.degerlendirme?.surec_odakli ?? []).map((s, i) => (
                    <Satir key={i} etiket={s.ne_gozlemlenecek} deger={s.yansitici_arac} />
                  ))}
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Düzey belirleyici görev</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>{icerik.degerlendirme?.duzey_belirleyici?.gorev || "—"}</p>
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
                    {(icerik.degerlendirme?.duzey_belirleyici?.rubrik ?? []).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.kriter}</TableCell>
                        <TableCell>{r["3_puan"]}</TableCell>
                        <TableCell>{r["2_puan"]}</TableCell>
                        <TableCell>{r["1_puan"]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kartlar" className="mt-4 space-y-4">
            {kartlar.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-sm text-muted-foreground">
                  Soru kartı tanımlı değil.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {kartlar.map((s, i) => (
                  <Card key={i}>
                    <CardContent className="space-y-2 py-5 text-sm">
                      <p className="text-xs text-muted-foreground">Kart {i + 1}</p>
                      <p>{s}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {icerik.merak_tetikleyicileri?.merak_kutusu_notu && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Merak kutusu notu</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {icerik.merak_tetikleyicileri.merak_kutusu_notu}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="urun" className="mt-4">
            <Card>
              <CardContent className="space-y-2 pt-6 text-sm">
                {!icerik.urun_odakli_cikti ? (
                  <p className="text-muted-foreground">Ürün odaklı çıktı tanımlı değil.</p>
                ) : (
                  <>
                    <p className="text-base font-medium">
                      {icerik.urun_odakli_cikti.urun_adi || "Ürün"}
                    </p>
                    <Satir etiket="Ürün tipi" deger={icerik.urun_odakli_cikti.urun_tipi ?? ""} />
                    <Satir
                      etiket="Öğrenci ne üretecek"
                      deger={icerik.urun_odakli_cikti.ogrenci_ne_uretecek ?? ""}
                    />
                    <Satir
                      etiket="Değerlendirme ölçütü"
                      deger={icerik.urun_odakli_cikti.degerlendirme_olcutu ?? ""}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uygulama geri bildirimi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={uygulandi} onCheckedChange={(v) => setUygulandi(Boolean(v))} />
              Sınıfta uyguladım
            </label>
            <div className="space-y-2">
              <Label>Hangi aşamada zorlandın?</Label>
              <Select value={zorAsama} onValueChange={setZorAsama}>
                <SelectTrigger className="w-full sm:w-80">
                  <SelectValue placeholder="Aşama seçin" />
                </SelectTrigger>
                <SelectContent>
                  {asamalar.map((a, i) => (
                    <SelectItem key={i} value={a.asama}>
                      {a.asama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notunuz</Label>
              <Textarea
                rows={3}
                value={not}
                onChange={(e) => setNot(e.target.value)}
                placeholder="Sınıfta ne işe yaradı, nerede takıldınız?"
              />
            </div>
            <Button onClick={gonder} disabled={gonderiliyor}>
              {gonderiliyor ? "Gönderiliyor…" : "Geri bildirimi gönder"}
            </Button>

            <div className="space-y-2 border-t pt-4">
              <p className="text-sm font-medium">Gönderilen geri bildirimler</p>
              {bildirimler.length === 0 ? (
                <p className="text-sm text-muted-foreground">Henüz geri bildirim yok.</p>
              ) : (
                <ul className="divide-y text-sm">
                  {bildirimler.map((g) => (
                    <li key={g.id} className="py-2">
                      <p className="text-xs text-muted-foreground">
                        {new Date(g.created_at).toLocaleString("tr-TR")}
                        {g.uygulandi_mi ? " · uygulandı" : ""}
                      </p>
                      <p>{g.not_metni}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yazdırma sayfaları */}
      <div className="hidden print:block">
        <section className="break-after-page">
          <h2 className="text-xl font-semibold">Merak Soru Kartları — {icerik.plan_basligi}</h2>
          {kartlar.length === 0 ? (
            <p className="mt-4 text-sm">Soru kartı tanımlı değil.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {kartlar.map((s, i) => (
                <div key={i} className="rounded-lg border p-4 text-sm">
                  <p className="mb-2 text-xs">Kart {i + 1}</p>
                  <p>{s}</p>
                </div>
              ))}
            </div>
          )}
          {icerik.merak_tetikleyicileri?.merak_kutusu_notu && (
            <p className="mt-4 text-sm">{icerik.merak_tetikleyicileri.merak_kutusu_notu}</p>
          )}
        </section>
        <section>
          <h2 className="text-xl font-semibold">Malzeme Listesi — {icerik.plan_basligi}</h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr>
                <th className="border-b py-1">Malzeme</th>
                <th className="border-b py-1">Adet</th>
                <th className="border-b py-1">Güvenlik notu</th>
              </tr>
            </thead>
            <tbody>
              {malzemeler.map((m, i) => (
                <tr key={i}>
                  <td className="border-b py-1">{m.ad}</td>
                  <td className="border-b py-1">{adetGosterim(m)}</td>
                  <td className="border-b py-1">{m.guvenlik_notu}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm">Toplam maliyet: {paraBicimi(maliyet.toplam)} TL</p>
        </section>
      </div>
    </>
  );
}
