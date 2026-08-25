import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DurumEtiketi } from "@/components/DurumEtiketi";
import {
  KURAL_METINLERI,
  SEVIYE_ETIKET,
  SINIF_ROZET,
  OGRETIM_SECENEK_ETIKET,
} from "@/lib/tipler";
import type { DenetimBulgusu, Plan, PlanIcerik } from "@/lib/tipler";

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

function Denetim() {
  const { plan: planId } = Route.useSearch();
  const navigate = useNavigate();
  const [not, setNot] = useState("");

  const planlarQ = useQuery({
    queryKey: ["denetim-planlar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planlar")
        .select("*")
        .in("durum", ["denetimde", "revizyon_istendi", "onayli"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Plan[];
    },
  });

  const seciliId = planId ?? planlarQ.data?.[0]?.id;

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
      const { data: bulgular, error: bHata } = await supabase
        .from("denetim_bulgulari")
        .select("*")
        .eq("plan_id", seciliId!)
        .order("kural_no");
      if (bHata) throw bHata;
      return {
        plan: plan as unknown as Plan,
        bulgular: (bulgular ?? []) as unknown as DenetimBulgusu[],
      };
    },
  });

  if (planlarQ.isLoading) {
    return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;
  }

  const planlar = planlarQ.data ?? [];
  if (planlar.length === 0) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Denetim Paneli</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Denetim bekleyen plan yok. Bir planı Plan Görünümü'nden "Denetime Gönder" ile
          gönderdiğinizde bulgular burada listelenir.
        </CardContent>
      </Card>
    );
  }

  const plan = detayQ.data?.plan;
  const bulgular = detayQ.data?.bulgular ?? [];
  const icerik: PlanIcerik = (plan?.icerik ?? {}) as PlanIcerik;
  const kalanlar = bulgular.filter((b) => !b.gecti);
  const gecenler = bulgular.filter((b) => b.gecti);
  const kritikSayisi = kalanlar.filter((b) => b.seviye === "kritik").length;
  const uyariSayisi = kalanlar.filter((b) => b.seviye === "uyari").length;
  const bilgiSayisi = kalanlar.filter((b) => b.seviye === "bilgi").length;

  const durumGuncelle = async (durum: string) => {
    if (!plan) return;
    const { error } = await supabase.from("planlar").update({ durum }).eq("id", plan.id);
    if (error) {
      toast.error("Güncellenemedi: " + error.message);
      return;
    }
    if (not.trim()) {
      await supabase
        .from("geri_bildirimler")
        .insert({ plan_id: plan.id, not_metni: not.trim(), uygulandi_mi: false });
      setNot("");
    }
    toast.success(durum === "onayli" ? "Plan onaylandı." : "Revizyon istendi.");
    detayQ.refetch();
    planlarQ.refetch();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Denetim Paneli</h1>
          <p className="text-sm text-muted-foreground">
            Bulgular, planı üreten modelden bağımsız bir denetçi tarafından üretilir.
          </p>
        </div>
        <Select
          value={seciliId ?? ""}
          onValueChange={(v) => navigate({ to: "/denetim", search: { plan: v } })}
        >
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Plan seçin" />
          </SelectTrigger>
          <SelectContent>
            {planlar.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {((p.icerik as PlanIcerik)?.plan_basligi ?? "Adsız plan").slice(0, 60)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {bulgular.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm">
          <span className="font-medium">
            {kritikSayisi} kritik · {uyariSayisi} uyarı · {bilgiSayisi} bilgi
          </span>
          <span className="text-muted-foreground">
            {gecenler.length}/{bulgular.length} kural geçti
          </span>
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
                  <Badge variant="secondary">{SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}</Badge>
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

            <div className="space-y-2 border-t pt-3">
              <Textarea
                placeholder="Denetçi notu (isteğe bağlı)"
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
                <Button variant="outline" onClick={() => durumGuncelle("revizyon_istendi")}>
                  Revizyon İste
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {detayQ.isLoading && <p className="text-sm text-muted-foreground">Bulgular yükleniyor…</p>}
          {!detayQ.isLoading && bulgular.length === 0 && (
            <Card>
              <CardContent className="py-6 text-sm text-muted-foreground">
                Bu plan için henüz denetim bulgusu yok. Plan Görünümü'nden "Denetime Gönder"
                düğmesini kullanın.
              </CardContent>
            </Card>
          )}

          {kalanlar.map((b) => (
            <Card key={b.id} className={`border ${SEVIYE_STIL[b.seviye] ?? ""}`}>
              <CardContent className="space-y-2 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold">Kural {b.kural_no}</span>
                  <Badge className={`border ${SEVIYE_STIL[b.seviye] ?? ""}`} variant="outline">
                    {SEVIYE_ETIKET[b.seviye] ?? b.seviye}
                  </Badge>
                  {b.ilgili_asama && (
                    <span className="text-xs text-muted-foreground">{b.ilgili_asama}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{KURAL_METINLERI[b.kural_no]}</p>
                <p className="text-sm">{b.mesaj}</p>
                {b.kanit_alintisi && (
                  <p className="text-sm italic text-muted-foreground">“{b.kanit_alintisi}”</p>
                )}
                {b.oneri && (
                  <p className="text-sm">
                    <span className="font-medium">Öneri: </span>
                    {b.oneri}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {gecenler.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Geçen Kurallar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {gecenler.map((b) => (
                  <div key={b.id} className="flex gap-2">
                    <span className="text-primary">✓</span>
                    <span>
                      <span className="font-medium">Kural {b.kural_no}</span> —{" "}
                      {b.mesaj || KURAL_METINLERI[b.kural_no]}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
