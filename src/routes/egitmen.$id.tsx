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
import {
  ETKINLIK_TIP_ETIKET,
  OGRETIM_SECENEK_ETIKET,
  SINIF_ROZET,
  type GeriBildirim,
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
        content: "Eğitmenler için salt okunur plan görünümü, yazdırılabilir kartlar ve geri bildirim.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EgitmenPlan,
});

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
      return (plan as unknown as Plan | null) ?? null;
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
          <p>Bu plan onaylı değil veya kaldırılmış. Eğitmen görünümünde yalnızca onaylı planlar açılır.</p>
          <Link to="/egitmen" className="font-medium text-primary underline">
            Onaylı içeriklere dön
          </Link>
        </CardContent>
      </Card>
    );
  }

  const plan = data;
  const icerik: PlanIcerik = plan.icerik ?? {};
  const asamalar = icerik.asamalar ?? [];
  const malzemeler = icerik.malzemeler ?? [];
  const kartlar = icerik.merak_tetikleyicileri?.soru_kartlari ?? [];
  const model =
    plan.kural_profili === "GIPSCI"
      ? "GiPSci"
      : (OGRETIM_SECENEK_ETIKET[plan.asama_sablonu ?? ""] ?? "—");

  const gonder = async () => {
    const metin = [
      uygulandi ? "Sınıfta uyguladım." : "Henüz uygulamadım.",
      zorAsama ? `Zorlanılan aşama: ${zorAsama}` : "",
      not.trim(),
    ]
      .filter(Boolean)
      .join(" ");
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

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6 print:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
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
              <Badge variant="secondary">{SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}</Badge>
              <Badge variant="secondary">{plan.toplam_sure} dk</Badge>
              <Badge variant="secondary">Model: {model}</Badge>
              <Badge variant="secondary">Salt okunur</Badge>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.print()}>
            Yazdırılabilir görünüm
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aşamalar</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <p>
                        <span className="font-medium">Öğretmen:</span> {a.ogretmen_eylemi}
                      </p>
                      <p>
                        <span className="font-medium">Öğrenci:</span> {a.ogrenci_eylemi}
                      </p>
                      {(a.tetikleyici_sorular ?? []).length > 0 && (
                        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                          {a.tetikleyici_sorular.map((s, j) => (
                            <li key={j}>{s}</li>
                          ))}
                        </ul>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {(icerik.etkinlikler ?? []).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Etkinlikler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {(icerik.etkinlikler ?? []).map((e, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <p className="font-medium">
                    {e.ad}{" "}
                    <span className="text-xs text-muted-foreground">
                      ({ETKINLIK_TIP_ETIKET[e.tip] ?? e.tip} · {e.sure_dk} dk)
                    </span>
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                    {(e.adimlar ?? []).map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {malzemeler.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Malzemeler</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Malzeme</TableHead>
                    <TableHead>Adet</TableHead>
                    <TableHead>Güvenlik notu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {malzemeler.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell>{m.ad}</TableCell>
                      <TableCell>{m.adet}</TableCell>
                      <TableCell className="text-muted-foreground">{m.guvenlik_notu}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

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
                  <td className="border-b py-1">{m.adet}</td>
                  <td className="border-b py-1">{m.guvenlik_notu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  );
}
