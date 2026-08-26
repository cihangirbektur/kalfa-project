import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DurumEtiketi } from "@/components/DurumEtiketi";
import { GeriBildirimListesi } from "@/components/GeriBildirimListesi";
import { BosDurum, ListeIskeleti } from "@/components/Iskelet";

import { kararEtiketi, turSurumleri } from "@/lib/surum";
import {
  KURAL_KAYNAKLARI,
  KURAL_METINLERI,

  SEVIYE_ETIKET,
  SINIF_ROZET,
  OGRETIM_SECENEK_ETIKET,
} from "@/lib/tipler";
import type { DenetimBulgusu, DenetimTuru, Plan, PlanIcerik } from "@/lib/tipler";

export const Route = createFileRoute("/denetim")({
  validateSearch: z.object({ plan: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Denetim Paneli — KALFA" },
      {
        name: "description",
        content: "Pedagojik uzmanın atölye planlarını 12 kurala karşı denetlediği panel.",
      },
      { property: "og:title", content: "Denetim Paneli — KALFA" },
      {
        property: "og:description",
        content: "Kritik, uyarı ve bilgi düzeyinde pedagojik denetim bulguları ve onay akışı.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Denetim,
});

const SEVIYE_STIL: Record<string, string> = {
  kritik: "bg-destructive/10 text-destructive border-destructive/30",
  uyari: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  bilgi: "bg-muted text-muted-foreground border-border",
};

const SEVIYE_SIRA: Record<string, number> = { kritik: 0, uyari: 1, bilgi: 2 };

function Denetim() {
  const { plan: planId } = Route.useSearch();
  const navigate = useNavigate();
  const [not, setNot] = useState("");
  const [sekme, setSekme] = useState<"bekleyen" | "gecmis">("bekleyen");

  const bekleyenQ = useQuery({
    queryKey: ["denetim-bekleyen"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planlar")
        .select("*")
        .eq("durum", "denetimde")
        .eq("arsivlendi", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Plan[];
    },
  });

  const onayliQ = useQuery({
    queryKey: ["denetim-onayli"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planlar")
        .select("*")
        .eq("durum", "onayli")
        .eq("arsivlendi", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Plan[];
    },
  });

  const bekleyen = bekleyenQ.data ?? [];
  const onaylananlar = onayliQ.data ?? [];
  const liste = sekme === "bekleyen" ? bekleyen : onaylananlar;
  const seciliId = liste.some((p) => p.id === planId) ? planId : liste[0]?.id;

  const detayQ = useQuery({
    queryKey: ["denetim-detay", seciliId],
    enabled: Boolean(seciliId),
    queryFn: async () => {
      const { data: plan, error } = await supabase
        .from("planlar")
        .select("*")
        .eq("id", seciliId!)
        .single();
      if (error) throw error;
      const { data: turlar, error: tHata } = await supabase
        .from("denetim_turlari")
        .select("*")
        .eq("plan_id", seciliId!)
        .order("tur_no", { ascending: false });
      if (tHata) throw tHata;
      const sonTur = ((turlar ?? []) as unknown as DenetimTuru[])[0] ?? null;
      let bulgular: DenetimBulgusu[] = [];
      if (sonTur) {
        const { data: b, error: bHata } = await supabase
          .from("denetim_bulgulari")
          .select("*")
          .eq("tur_id", sonTur.id)
          .order("kural_no");
        if (bHata) throw bHata;
        bulgular = (b ?? []) as unknown as DenetimBulgusu[];
      }
      if (bulgular.length === 0) {
        const { data: b } = await supabase
          .from("denetim_bulgulari")
          .select("*")
          .eq("plan_id", seciliId!)
          .is("tur_id", null)
          .order("kural_no");
        bulgular = (b ?? []) as unknown as DenetimBulgusu[];
      }
      return {
        plan: plan as unknown as Plan,
        turlar: (turlar ?? []) as unknown as DenetimTuru[],
        sonTur,
        bulgular,
      };
    },
  });

  if (bekleyenQ.isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <ListeIskeleti adet={3} />
      </div>
    );
  }


  const plan = detayQ.data?.plan;
  const sonTur = detayQ.data?.sonTur ?? null;
  const bulgular = detayQ.data?.bulgular ?? [];
  const icerik: PlanIcerik = (plan?.icerik ?? {}) as PlanIcerik;
  const kalanlar = bulgular.filter((b) => !b.gecti);
  const gecenler = bulgular.filter((b) => b.gecti);
  const kritikSayisi = kalanlar.filter((b) => b.seviye === "kritik").length;
  const uyariSayisi = kalanlar.filter((b) => b.seviye === "uyari").length;
  const bilgiSayisi = kalanlar.filter((b) => b.seviye === "bilgi").length;
  const kararVerilebilir = sekme === "bekleyen" && Boolean(plan) && plan?.durum === "denetimde";

  const durumGuncelle = async (durum: string) => {
    if (!plan) return;
    const simdi = new Date().toISOString();
    const { error } = await supabase
      .from("planlar")
      .update(durum === "onayli" ? { durum, onay_tarihi: simdi } : { durum })
      .eq("id", plan.id);
    if (error) {
      toast.error("Güncellenemedi: " + error.message);
      return;
    }
    if (sonTur) {
      await supabase
        .from("denetim_turlari")
        .update({
          denetci_notu: not.trim() || null,
          karar: durum,
          karar_tarihi: new Date().toISOString(),
          kritik_sayisi: kritikSayisi,
          uyari_sayisi: uyariSayisi,
          bilgi_sayisi: bilgiSayisi,
        })
        .eq("id", sonTur.id);
    }
    setNot("");
    toast.success(durum === "onayli" ? "Plan onaylandı." : "Revizyon istendi.");
    detayQ.refetch();
    bekleyenQ.refetch();
    onayliQ.refetch();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Denetim Paneli</h1>
          <p className="text-sm text-muted-foreground">
            Bulgular, planı üreten modelden bağımsız bir denetçi tarafından üretilir.
          </p>
          <p className="mt-2 text-sm font-medium">Beklemede: {bekleyen.length} plan</p>
        </div>
        {liste.length > 0 && (
          <Select
            value={seciliId ?? ""}
            onValueChange={(v) => navigate({ to: "/denetim", search: { plan: v } })}
          >
            <SelectTrigger className="w-full sm:w-80">
              <SelectValue placeholder="Plan seçin" />
            </SelectTrigger>
            <SelectContent>
              {liste.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {((p.icerik as PlanIcerik)?.plan_basligi ?? "Adsız plan").slice(0, 60)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs
        value={sekme}
        onValueChange={(v) => {
          setSekme(v === "gecmis" ? "gecmis" : "bekleyen");
          navigate({ to: "/denetim", search: {} });
        }}
      >
        <TabsList>
          <TabsTrigger value="bekleyen">Denetim bekleyenler ({bekleyen.length})</TabsTrigger>
          <TabsTrigger value="gecmis">Onayladıklarım ({onaylananlar.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {liste.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            {sekme === "bekleyen"
              ? "Denetim bekleyen plan yok. İçerik uzmanı bir planı denetime gönderdiğinde bulgular burada listelenir."
              : "Henüz onayladığınız plan yok."}
          </CardContent>
        </Card>
      ) : (
        <>
          {bulgular.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm">
              <span className="font-medium">
                {kritikSayisi} kritik · {uyariSayisi} uyarı · {bilgiSayisi} bilgi
              </span>
              <span className="text-muted-foreground">
                {gecenler.length}/{bulgular.length} kural geçti
              </span>
              {sonTur && (
                <span className="text-muted-foreground">{sonTur.tur_no}. denetim turu</span>
              )}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base">Plan Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="font-medium">{icerik.plan_basligi ?? "Adsız plan"}</p>
                {icerik.kazanim && (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{icerik.kazanim.kod}</span> —{" "}
                    {icerik.kazanim.metin}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-xs">
                  {plan && (
                    <>
                      <Badge variant="secondary">
                        {SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}
                      </Badge>
                      <Badge variant="secondary">
                        Model:{" "}
                        {plan.kural_profili === "GIPSCI"
                          ? "GiPSci"
                          : (OGRETIM_SECENEK_ETIKET[plan.asama_sablonu ?? ""] ?? "—")}
                      </Badge>
                      <Badge variant="secondary">{plan.toplam_sure} dk</Badge>
                      <Badge variant="secondary">v{plan.versiyon}</Badge>
                      <DurumEtiketi durum={plan.durum} />
                    </>
                  )}
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {(icerik.asamalar ?? []).map((a, i) => (
                    <li key={i}>
                      {a.asama} — {a.sure_dk} dk
                    </li>
                  ))}
                </ul>
                {plan && (
                  <Link
                    to="/plan/$id"
                    params={{ id: plan.id }}
                    className="inline-block text-xs font-medium text-primary underline"
                  >
                    Planı aç
                  </Link>
                )}

                {kararVerilebilir ? (
                  <div className="space-y-2 border-t pt-3">
                    <Textarea
                      placeholder="Denetçi notu (içerik uzmanı bu notu görecek)"
                      value={not}
                      onChange={(e) => setNot(e.target.value)}
                      rows={3}
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => durumGuncelle("onayli")}
                        disabled={bulgular.length === 0 || kritikSayisi > 0}
                      >
                        Onayla
                      </Button>
                      {kritikSayisi > 0 && (
                        <p className="text-xs text-destructive">
                          Kritik bulgular giderilmeden onaylanamaz
                        </p>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => durumGuncelle("revizyon_istendi")}
                      >
                        Revizyon İste
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="border-t pt-3 text-xs text-muted-foreground">
                    Bu plan onaylandı; geçmiş kaydı olarak görüntülüyorsunuz.
                  </p>
                )}

                {(detayQ.data?.turlar ?? []).length > 0 && (
                  <div className="space-y-1 border-t pt-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">Denetim geçmişi</p>
                    {(() => {
                      const turlar = detayQ.data?.turlar ?? [];
                      const surumler = turSurumleri(turlar);
                      return turlar.map((t) => (
                        <p key={t.id}>
                          {t.tur_no}. tur · v{surumler.get(t.id) ?? 1} ·{" "}
                          {new Date(t.created_at).toLocaleDateString("tr-TR")} · {t.kritik_sayisi}{" "}
                          kritik / {t.uyari_sayisi} uyarı ·{" "}
                          {kararEtiketi(t.karar ?? null).toLocaleLowerCase("tr")}
                        </p>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>

            {seciliId && (
              <GeriBildirimListesi
                planId={seciliId}
                baslik="Saha geri bildirimleri (uygulayan eğitmenler)"
              />
            )}


            <div className="space-y-4">
              {detayQ.isLoading && (
                <p className="text-sm text-muted-foreground">Bulgular yükleniyor…</p>
              )}
              {!detayQ.isLoading && bulgular.length === 0 && (
                <Card>
                  <CardContent className="py-6 text-sm text-muted-foreground">
                    Bu plan için denetim bulgusu yok.
                  </CardContent>
                </Card>
              )}
              {[...bulgular]
                .sort(
                  (a, b) =>
                    Number(a.gecti) - Number(b.gecti) ||
                    (SEVIYE_SIRA[a.seviye] ?? 9) - (SEVIYE_SIRA[b.seviye] ?? 9) ||
                    a.kural_no - b.kural_no,
                )
                .map((b) => (
                  <Card key={b.id} className={b.gecti ? "opacity-70" : undefined}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${SEVIYE_STIL[b.seviye] ?? ""}`}
                        >
                          {SEVIYE_ETIKET[b.seviye] ?? b.seviye}
                        </span>
                        <span className="text-xs text-muted-foreground">Kural {b.kural_no}</span>
                        <span
                          className={`text-xs font-medium ${b.gecti ? "text-primary" : "text-destructive"}`}
                        >
                          {b.gecti ? "geçti" : "geçmedi"}
                        </span>
                      </div>
                      <CardTitle className="text-sm font-medium">
                        {KURAL_METINLERI[b.kural_no] ?? "—"}
                      </CardTitle>
                      {KURAL_KAYNAKLARI[b.kural_no] && (
                        <p className="text-xs italic text-muted-foreground">
                          {KURAL_KAYNAKLARI[b.kural_no]}
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      {b.mesaj && <p>{b.mesaj}</p>}
                      {b.kanit_alintisi && (
                        <p className="rounded-md bg-muted p-2 text-xs italic text-muted-foreground">
                          “{b.kanit_alintisi}”
                        </p>
                      )}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {b.ilgili_asama && <span>Aşama: {b.ilgili_asama}</span>}
                      </div>
                      {b.oneri && !b.gecti && (
                        <p className="text-xs">
                          <span className="font-medium">Öneri: </span>
                          {b.oneri}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
