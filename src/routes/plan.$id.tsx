import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { planDenetle } from "@/lib/denetim.functions";
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
import { MedyaBolumu } from "@/components/MedyaBolumu";
import { GipsciSerit } from "@/components/GipsciSerit";
import { GeriBildirimListesi } from "@/components/GeriBildirimListesi";
import { adetBirimi, adetSayisi, maliyetHesapla, paraBicimi } from "@/lib/hesap";
import { kararEtiketi, onaylananSurum, turSurumleri } from "@/lib/surum";
import { useRol } from "@/lib/rol";
import {
  YazdirBelgesi,
  YAZDIR_KAPSAMLARI,
  type YazdirKapsami,
} from "@/components/YazdirBelgesi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SINIF_ROZET,
  PROGRAM_DONEMI_ETIKET,
  ETKINLIK_TIP_ETIKET,
  OGRETIM_SECENEK_ETIKET,
  OYUN_TIPLERI,
  SEVIYE_ETIKET,
  KURAL_METINLERI,

} from "@/lib/tipler";

import type {
  Asama,
  DenetimBulgusu,
  DenetimTuru,

  Etkinlik,
  Kazanim,
  KavramYanilgisi,
  Malzeme,
  Medya,
  PlanIcerik,
  Plan,
  OgretimModeli,
} from "@/lib/tipler";

export const Route = createFileRoute("/plan/$id")({
  head: () => ({
    meta: [
      { title: "Atölye Planı — KALFA" },
      {
        name: "description",
        content: "Aşamalar, etkinlikler, malzemeler, medya ve ölçme araçlarıyla atölye planı.",
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

const sayi = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0);

function PlanGorunumu() {
  const { id } = Route.useParams();
  const { rol } = useRol();
  const navigate = useNavigate();
  const denetle = useServerFn(planDenetle);
  const [denetleniyor, setDenetleniyor] = useState(false);
  const [denetimHatasi, setDenetimHatasi] = useState<string | null>(null);
  const [yazdirKapsami, setYazdirKapsami] = useState<YazdirKapsami>("tum");


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
      let model: OgretimModeli | null = null;
      if (plan.model_id) {
        const { data: m } = await supabase
          .from("ogretim_modelleri")
          .select("*")
          .eq("id", plan.model_id)
          .single();
        model = (m as unknown as OgretimModeli) ?? null;
      }
      return { plan: plan as unknown as Plan, kazanim, model };
    },
  });

  const denetimQ = useQuery({
    queryKey: ["plan-denetim", id],
    queryFn: async () => {
      const { data: turlar, error } = await supabase
        .from("denetim_turlari")
        .select("*")
        .eq("plan_id", id)
        .order("tur_no", { ascending: false });
      if (error) throw error;
      const liste = (turlar ?? []) as unknown as DenetimTuru[];
      const sonTur = liste[0] ?? null;
      let bulgular: DenetimBulgusu[] = [];
      if (sonTur) {
        const { data: b } = await supabase
          .from("denetim_bulgulari")
          .select("*")
          .eq("tur_id", sonTur.id)
          .order("kural_no");
        bulgular = (b ?? []) as unknown as DenetimBulgusu[];
      }
      return { turlar: liste, sonTur, bulgular };
    },
  });

  const [icerik, setIcerik] = useState<PlanIcerik>({});
  useEffect(() => {
    if (data?.plan) setIcerik(data.plan.icerik ?? {});
  }, [data?.plan]);


  if (isLoading || !data) {
    return <DetayIskeleti />;
  }


  const { plan, kazanim, model } = data;
  const duzenlenebilir = rol === "İçerik Uzmanı";
  const modelAdi =
    plan.kural_profili === "GIPSCI"
      ? "GiPSci"
      : (OGRETIM_SECENEK_ETIKET[plan.asama_sablonu ?? ""] ?? model?.ad ?? "—");


  const kaydet = async () => {
    const { error } = await supabase
      .from("planlar")
      .update({ icerik: icerik as never })
      .eq("id", plan.id);
    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
      return;
    }
    toast.success("Plan kaydedildi.");
    refetch();
  };

  const denetimeGonder = async () => {
    setDenetimHatasi(null);
    setDenetleniyor(true);
    try {
      const { error: kaydetHata } = await supabase
        .from("planlar")
        .update({ icerik: icerik as never })
        .eq("id", plan.id);
      if (kaydetHata) throw new Error(kaydetHata.message);

      const bulgular = await denetle({
        data: {
          plan_id: plan.id,
          kural_profili: plan.kural_profili ?? "KLASIK",
          toplam_sure: icerik.toplam_sure_dk ?? plan.toplam_sure,
          seviye: plan.yas_grubu,
          plan_json: JSON.stringify(icerik),
        },
      });
      if (!bulgular || bulgular.length === 0)
        throw new Error("Denetçi bulgu üretmedi; sonuç kaydedilmedi.");

      const yeniTurNo = ((denetimQ.data?.sonTur?.tur_no ?? 0) as number) + 1;
      const kalanlar = bulgular.filter((b) => !b.gecti);
      const { data: tur, error: turHata } = await supabase
        .from("denetim_turlari")
        .insert({
          plan_id: plan.id,
          tur_no: yeniTurNo,
          kritik_sayisi: kalanlar.filter((b) => b.seviye === "kritik").length,
          uyari_sayisi: kalanlar.filter((b) => b.seviye === "uyari").length,
          bilgi_sayisi: kalanlar.filter((b) => b.seviye === "bilgi").length,
        })
        .select("id")
        .single();
      if (turHata) throw new Error(turHata.message);

      const { error: yazHata } = await supabase
        .from("denetim_bulgulari")
        .insert(bulgular.map((b) => ({ ...b, tur_id: tur.id })) as never);
      if (yazHata) throw new Error(yazHata.message);

      // Sürüm yalnızca revizyon sonrası tekrar gönderimde artar.
      const revizyonSonrasi = plan.durum === "revizyon_istendi";
      const yeniVersiyon = revizyonSonrasi ? (plan.versiyon ?? 1) + 1 : (plan.versiyon ?? 1);
      const { error: durumHata } = await supabase
        .from("planlar")
        .update({ durum: "denetimde", versiyon: yeniVersiyon })
        .eq("id", plan.id);
      if (durumHata) throw new Error(durumHata.message);

      denetimQ.refetch();
      refetch();
      toast.success(
        revizyonSonrasi
          ? `Denetim tamamlandı (${yeniTurNo}. tur) · plan v${yeniVersiyon} olarak gönderildi.`
          : `Denetim tamamlandı (${yeniTurNo}. tur).`,
      );
      navigate({ to: "/denetim", search: { plan: plan.id } });


    } catch (e) {
      const mesaj = e instanceof Error ? e.message : "Denetim başarısız oldu.";
      setDenetimHatasi(mesaj);
      toast.error(mesaj);
    } finally {
      setDenetleniyor(false);
    }
  };


  const asamaGuncelle = (i: number, alan: keyof Asama, deger: unknown) => {
    setIcerik((o) => {
      const asamalar = [...(o.asamalar ?? [])];
      asamalar[i] = { ...asamalar[i], [alan]: deger } as Asama;
      return { ...o, asamalar };
    });
  };

  const etkinlikGuncelle = (i: number, alan: keyof Etkinlik, deger: unknown) => {
    setIcerik((o) => {
      const etkinlikler = [...(o.etkinlikler ?? [])];
      etkinlikler[i] = { ...etkinlikler[i], [alan]: deger } as Etkinlik;
      return { ...o, etkinlikler };
    });
  };

  const malzemeGuncelle = (i: number, alan: keyof Malzeme, deger: unknown) => {
    setIcerik((o) => {
      const malzemeler = [...(o.malzemeler ?? [])];
      malzemeler[i] = { ...malzemeler[i], [alan]: deger } as Malzeme;
      return { ...o, malzemeler };
    });
  };

  const medyaGuncelle = (i: number, alan: keyof Medya, deger: unknown) => {
    setIcerik((o) => {
      const medya_onerileri = [...(o.medya_onerileri ?? [])];
      medya_onerileri[i] = { ...medya_onerileri[i], [alan]: deger } as Medya;
      return { ...o, medya_onerileri };
    });
  };

  const asamalar = icerik.asamalar ?? [];
  const etkinlikler = icerik.etkinlikler ?? [];
  const malzemeler = icerik.malzemeler ?? [];
  const medyalar = icerik.medya_onerileri ?? [];
  const toplamSure = icerik.toplam_sure_dk ?? plan.toplam_sure;
  const asamaToplam = asamalar.reduce((t, a) => t + sayi(a.sure_dk), 0);
  const sureUyumsuz = asamalar.length > 0 && asamaToplam !== toplamSure;
  const maliyet = maliyetHesapla(malzemeler);

  const toplamHazirlik = malzemeler.reduce((t, m) => t + sayi(m.hazirlik_suresi_dk), 0);

  if (typeof document !== "undefined") {
    document.title = `${icerik.plan_basligi ?? "Atölye planı"} · KALFA`;
  }

  const yazdir = (kapsam: YazdirKapsami) => {
    setYazdirKapsami(kapsam);
    setTimeout(() => window.print(), 50);
  };

  return (
    <>
    <div className="kalfa-ekran mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {icerik.plan_basligi ?? "Adsız plan"}
          </h1>
          {kazanim ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{kazanim.kod}</span> — {kazanim.metin}
            </p>
          ) : icerik.kazanim_turetildi ? (
            <div className="max-w-2xl space-y-1">
              <Label className="text-xs text-muted-foreground">
                Kazanım (konu başlığından türetildi, düzenlenebilir)
              </Label>
              <Input
                value={icerik.kazanim?.metin ?? ""}
                readOnly={!duzenlenebilir}
                onChange={(e) =>
                  setIcerik({
                    ...icerik,
                    kazanim: {
                      kod: icerik.kazanim?.kod ?? (plan.konu_basligi ?? ""),
                      bloom_seviyesi: icerik.kazanim?.bloom_seviyesi ?? "",
                      metin: e.target.value,
                    },
                  })
                }
              />
              {plan.konu_basligi && (
                <p className="text-xs text-muted-foreground">
                  Konu başlığı: {plan.konu_basligi}
                </p>
              )}
            </div>
          ) : (
            icerik.kazanim && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{icerik.kazanim.kod}</span> —{" "}
                {icerik.kazanim.metin}
              </p>
            )
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary">{SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}</Badge>
            <Badge variant="secondary">Model: {modelAdi}</Badge>

            {plan.program_donemi && (
              <Badge variant="secondary">
                {PROGRAM_DONEMI_ETIKET[plan.program_donemi] ?? plan.program_donemi}
              </Badge>
            )}
            <Badge variant="secondary">{plan.toplam_sure} dk</Badge>
            <Badge variant="secondary">v{plan.versiyon}</Badge>
            <DurumEtiketi durum={plan.durum} />
            {plan.arsivlendi && <DurumEtiketi durum="arsivlendi" />}
          </div>
          {plan.durum === "onayli" && (
            <p className="text-xs font-medium text-emerald-700">
              v{onaylananSurum(denetimQ.data?.turlar ?? []) ?? plan.versiyon} olarak onaylandı
              {plan.onay_tarihi
                ? ` · ${new Date(plan.onay_tarihi).toLocaleDateString("tr-TR")}`
                : ""}
            </p>
          )}

          {(icerik.iliskili_konu_basliklari ?? []).length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">İlişkili konu başlıkları:</span>
              {(icerik.iliskili_konu_basliklari ?? []).map((k) => (
                <Badge key={k} className="bg-accent text-accent-foreground">
                  {k}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => yazdir("tum")}>
              Yazdır
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Yazdırma kapsamı">
                  ▾
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {YAZDIR_KAPSAMLARI.map((k) => (
                  <DropdownMenuItem key={k.deger} onSelect={() => yazdir(k.deger)}>
                    {k.etiket}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {duzenlenebilir && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={kaydet} disabled={denetleniyor}>
                Kaydet
              </Button>
              <Button
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={denetimeGonder}
                disabled={denetleniyor}
              >
                {denetleniyor
                  ? "Plan denetleniyor…"
                  : plan.durum === "revizyon_istendi"
                    ? "Düzelttim, tekrar denetime gönder"
                    : "Denetime Gönder"}

              </Button>
            </div>
            {denetimHatasi && (
              <div className="max-w-sm rounded-md border border-destructive/40 bg-destructive/5 p-3 text-right text-xs text-destructive">
                <p>{denetimHatasi}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={denetimeGonder}
                  disabled={denetleniyor}
                >
                  Tekrar Dene
                </Button>
              </div>
            )}
          </div>

        )}
      </div>

      <GipsciSerit
        icerik={icerik}
        kuralProfili={plan.kural_profili}
        toplamSure={toplamSure}
      />



      {plan.durum === "revizyon_istendi" && denetimQ.data?.sonTur && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-700">
            Revizyon istendi · {denetimQ.data.sonTur.tur_no}. denetim turu
          </p>
          {denetimQ.data.sonTur.denetci_notu && (
            <p className="mt-2 text-sm">
              <span className="font-medium">Denetçi notu: </span>
              {denetimQ.data.sonTur.denetci_notu}
            </p>
          )}
          {(denetimQ.data.bulgular ?? []).filter((b) => !b.gecti).length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {(denetimQ.data.bulgular ?? [])
                .filter((b) => !b.gecti)
                .map((b) => (
                  <li key={b.id} className="rounded-md bg-background/60 p-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      {SEVIYE_ETIKET[b.seviye] ?? b.seviye} · Kural {b.kural_no}
                    </p>
                    <p>{KURAL_METINLERI[b.kural_no] ?? b.mesaj}</p>
                    {b.oneri && (
                      <p className="text-xs text-muted-foreground">Öneri: {b.oneri}</p>
                    )}
                  </li>
                ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Düzeltmelerini yaptıktan sonra “Düzelttim, tekrar denetime gönder” butonunu kullan.
          </p>
        </div>
      )}

      {(denetimQ.data?.turlar ?? []).length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">Denetim geçmişi</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {(() => {
              const turlar = denetimQ.data?.turlar ?? [];
              const surumler = turSurumleri(turlar);
              return turlar.map((t) => (
                <li key={t.id}>
                  {t.tur_no}. tur · v{surumler.get(t.id) ?? 1} ·{" "}
                  {new Date(t.created_at).toLocaleDateString("tr-TR")} · {t.kritik_sayisi} kritik /{" "}
                  {t.uyari_sayisi} uyarı · {kararEtiketi(t.karar ?? null).toLocaleLowerCase("tr")}
                </li>
              ));
            })()}
          </ul>
        </div>
      )}

      <GeriBildirimListesi
        planId={plan.id}
        baslik="Saha geri bildirimleri (eğitmenlerden)"
      />




      <Tabs defaultValue="asamalar">
        <TabsList>
          <TabsTrigger value="asamalar">Aşamalar</TabsTrigger>
          <TabsTrigger value="etkinlikler">Etkinlikler</TabsTrigger>
          <TabsTrigger value="malzemeler">Malzemeler</TabsTrigger>
          <TabsTrigger value="medya">Medya</TabsTrigger>
          <TabsTrigger value="olcme">Ölçme</TabsTrigger>
          <TabsTrigger value="sorukartlari">Soru Kartları</TabsTrigger>
          <TabsTrigger value="urun">Ürün</TabsTrigger>

        </TabsList>

        <TabsContent value="asamalar" className="mt-4 space-y-3">
          {sureUyumsuz && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              Uyarı: aşama süreleri toplamı {asamaToplam} dk; toplam süre {toplamSure} dk.
            </p>
          )}
          {asamalar.length === 0 ? (
            <Bos metin="Bu planda henüz aşama yok." />
          ) : (
            <Accordion type="multiple" className="space-y-2">
              {asamalar.map((a, i) => {
                const oran = toplamSure ? Math.round((sayi(a.sure_dk) / toplamSure) * 100) : 0;
                return (
                  <AccordionItem
                    key={i}
                    value={`a-${i}`}
                    className="rounded-xl border border-border bg-card px-4"
                  >
                    <AccordionTrigger className="text-left">
                      <span className="font-medium">{a.asama}</span>
                      <span className="ml-auto mr-2 flex items-center gap-2 text-xs text-muted-foreground">
                        {sureUyumsuz && <span className="text-destructive">süre uyumsuz</span>}
                        <span>
                          {sayi(a.sure_dk)} dk · %{oran}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Alan
                          etiket="Aşama adı"
                          deger={a.asama ?? ""}
                          oku={!duzenlenebilir}
                          degistir={(v) => asamaGuncelle(i, "asama", v)}
                        />
                        <Alan
                          etiket="Süre (dk)"
                          deger={String(sayi(a.sure_dk))}
                          oku={!duzenlenebilir}
                          degistir={(v) => asamaGuncelle(i, "sure_dk", Number(v) || 0)}
                        />
                      </div>
                      <UzunAlan
                        etiket="Amaç"
                        deger={a.amac ?? ""}
                        oku={!duzenlenebilir}
                        degistir={(v) => asamaGuncelle(i, "amac", v)}
                      />
                      <UzunAlan
                        etiket="Öğretmen eylemi"
                        deger={a.ogretmen_eylemi ?? ""}
                        oku={!duzenlenebilir}
                        degistir={(v) => asamaGuncelle(i, "ogretmen_eylemi", v)}
                      />
                      <UzunAlan
                        etiket="Öğrenci eylemi"
                        deger={a.ogrenci_eylemi ?? ""}
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
                      <div className="space-y-2">
                        <Label>Kavram yanılgıları (yanılgı → nasıl ele alınacak)</Label>
                        {(a.beklenen_kavram_yanilgilari ?? []).length === 0 && (
                          <p className="text-sm text-muted-foreground">Kayıtlı yanılgı yok.</p>
                        )}
                        {(a.beklenen_kavram_yanilgilari ?? []).map((ky, j) => (
                          <div key={j} className="grid gap-2 rounded-lg bg-muted p-3 md:grid-cols-2">
                            <Textarea
                              rows={2}
                              value={ky.yanilgi ?? ""}
                              readOnly={!duzenlenebilir}
                              onChange={(e) => {
                                const liste = [...(a.beklenen_kavram_yanilgilari ?? [])];
                                liste[j] = { ...liste[j], yanilgi: e.target.value } as KavramYanilgisi;
                                asamaGuncelle(i, "beklenen_kavram_yanilgilari", liste);
                              }}
                            />
                            <Textarea
                              rows={2}
                              value={ky.ele_alinma_bicimi ?? ""}
                              readOnly={!duzenlenebilir}
                              onChange={(e) => {
                                const liste = [...(a.beklenen_kavram_yanilgilari ?? [])];
                                liste[j] = { ...liste[j], ele_alinma_bicimi: e.target.value } as KavramYanilgisi;
                                asamaGuncelle(i, "beklenen_kavram_yanilgilari", liste);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </TabsContent>

        <TabsContent value="etkinlikler" className="mt-4 space-y-4">
          {etkinlikler.length === 0 && <Bos metin="Bu planda henüz etkinlik yok." />}
          {etkinlikler.map((e, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-accent text-accent-foreground">
                    {ETKINLIK_TIP_ETIKET[e.tip] ?? e.tip}
                  </Badge>
                  <CardTitle className="text-base">{e.ad}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">Aşama: {e.bagli_asama}</Badge>
                  <Badge variant="secondary">{sayi(e.sure_dk)} dk</Badge>
                  {e.bloom_seviyesi && <Badge variant="secondary">{e.bloom_seviyesi}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <UzunAlan
                  etiket="Adımlar (her satıra bir adım)"
                  deger={(e.adimlar ?? []).join("\n")}
                  oku={!duzenlenebilir}
                  degistir={(v) => etkinlikGuncelle(i, "adimlar", v.split("\n").filter(Boolean))}
                />
                <UzunAlan
                  etiket="Kazanım hizası"
                  deger={e.kazanim_hizasi ?? ""}
                  oku={!duzenlenebilir}
                  degistir={(v) => etkinlikGuncelle(i, "kazanim_hizasi", v)}
                />
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
                {(OYUN_TIPLERI as readonly string[]).includes(e.tip) && e.oyun_yapisi && (
                  <div className="rounded-xl border border-accent/40 bg-accent/5 p-4">
                    <p className="mb-2 font-medium">Oyun yapısı</p>
                    <dl className="grid gap-2 text-sm md:grid-cols-2">
                      <Satir baslik="Oyuncu sayısı" deger={e.oyun_yapisi.oyuncu_sayisi} />
                      <Satir baslik="Bileşenler" deger={e.oyun_yapisi.bilesenler} />
                      <Satir
                        baslik="Kart / parça tipleri"
                        deger={(e.oyun_yapisi.kart_veya_parca_tipleri ?? []).join(", ")}
                      />
                      <Satir baslik="Kazanma koşulu" deger={e.oyun_yapisi.kazanma_kosulu} />
                    </dl>
                    {(e.oyun_yapisi.tur_akisi ?? []).length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Tur akışı</p>
                        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                          {(e.oyun_yapisi.tur_akisi ?? []).map((t, j) => (
                            <li key={j}>{t}</li>
                          ))}
                        </ol>
                      </div>
                    )}
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
                    <TableRow key={i} className={m.guvenlik_notu ? "bg-destructive/5" : undefined}>
                      <TableCell className="font-medium">
                        <div className="flex flex-wrap items-center gap-2">
                          <Input
                            value={m.ad ?? ""}
                            readOnly={!duzenlenebilir}
                            onChange={(ev) => malzemeGuncelle(i, "ad", ev.target.value)}
                          />
                          {m.basilabilir_mi && <Badge variant="secondary">Basılabilir</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            className="w-16"
                            inputMode="numeric"
                            value={String(adetSayisi(m.adet) ?? "")}
                            readOnly={!duzenlenebilir}
                            onChange={(ev) =>
                              malzemeGuncelle(i, "adet", Number(ev.target.value) || 0)
                            }
                          />
                          <Input
                            className="w-24"
                            placeholder="adet"
                            value={adetBirimi(m)}
                            readOnly={!duzenlenebilir}
                            onChange={(ev) => malzemeGuncelle(i, "birim", ev.target.value)}
                          />
                        </div>
                      </TableCell>

                      <TableCell>
                        <Input
                          className="w-24"
                          value={String(sayi(m.tahmini_birim_maliyet_tl))}
                          readOnly={!duzenlenebilir}
                          onChange={(ev) =>
                            malzemeGuncelle(i, "tahmini_birim_maliyet_tl", Number(ev.target.value) || 0)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="w-20"
                          value={String(sayi(m.hazirlik_suresi_dk))}
                          readOnly={!duzenlenebilir}
                          onChange={(ev) =>
                            malzemeGuncelle(i, "hazirlik_suresi_dk", Number(ev.target.value) || 0)
                          }
                        />
                      </TableCell>
                      <TableCell
                        className={m.guvenlik_notu ? "font-medium text-destructive" : undefined}
                      >
                        <Textarea
                          rows={2}
                          value={m.guvenlik_notu ?? ""}
                          readOnly={!duzenlenebilir}
                          onChange={(ev) => malzemeGuncelle(i, "guvenlik_notu", ev.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          rows={2}
                          value={m.alternatif ?? ""}
                          readOnly={!duzenlenebilir}
                          onChange={(ev) => malzemeGuncelle(i, "alternatif", ev.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <span>
                  <span className="text-muted-foreground">Toplam maliyet: </span>
                  <span className="font-medium">{paraBicimi(maliyet.toplam)} TL</span>
                  {maliyet.hesaplanamayan > 0 && (
                    <span className="ml-2 text-destructive">
                      {maliyet.hesaplanamayan} satır hesaplanamadı
                    </span>
                  )}
                </span>

                <span>
                  <span className="text-muted-foreground">Toplam hazırlık süresi: </span>
                  <span className="font-medium">{toplamHazirlik} dk</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medya" className="mt-4 space-y-4">
          <MedyaBolumu
            planId={plan.id}
            medyalar={medyalar}
            duzenlenebilir={duzenlenebilir}
            kazanimMetni={icerik.kazanim?.metin ?? kazanim?.metin ?? ""}
            seviye={SINIF_ROZET[plan.yas_grubu] ?? plan.yas_grubu}
            atolyeAlani={kazanim?.atolye_alani ?? ""}
            planBasligi={icerik.plan_basligi ?? "Atölye planı"}
            onAciklamaDegis={(i: number, deger: string) => medyaGuncelle(i, "aciklama", deger)}
            onGorsel={async (i: number, yol: string) => {
              const yeni = [...(icerik.medya_onerileri ?? [])];
              yeni[i] = { ...(yeni[i] as Medya), gorsel_yolu: yol };
              const guncel = { ...icerik, medya_onerileri: yeni };
              setIcerik(guncel);
              await supabase
                .from("planlar")
                .update({ icerik: guncel as never })
                .eq("id", plan.id);
            }}
          />
        </TabsContent>


        <TabsContent value="olcme" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Biçimlendirici değerlendirme</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Aşama</TableHead>
                    <TableHead>Soru</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(icerik.degerlendirme?.bicimlendirici ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground">
                        Biçimlendirici soru yok.
                      </TableCell>
                    </TableRow>
                  )}
                  {(icerik.degerlendirme?.bicimlendirici ?? []).map((b, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{b.asama}</TableCell>
                      <TableCell>{b.soru}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Düzey belirleyici performans görevi</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                readOnly={!duzenlenebilir}
                value={icerik.degerlendirme?.duzey_belirleyici?.gorev ?? ""}
                onChange={(e) =>
                  setIcerik((o) => ({
                    ...o,
                    degerlendirme: {
                      bicimlendirici: o.degerlendirme?.bicimlendirici ?? [],
                      duzey_belirleyici: {
                        gorev: e.target.value,
                        rubrik: o.degerlendirme?.duzey_belirleyici?.rubrik ?? [],
                      },
                    },
                  }))
                }
              />
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
                  {(icerik.degerlendirme?.duzey_belirleyici?.rubrik ?? []).map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.kriter}</TableCell>
                      <TableCell>{r["3_puan"]}</TableCell>
                      <TableCell>{r["2_puan"]}</TableCell>
                      <TableCell>{r["1_puan"]}</TableCell>
                    </TableRow>
                  ))}
                  {(icerik.degerlendirme?.duzey_belirleyici?.rubrik ?? []).length === 0 && (
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Süreç odaklı değerlendirme</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ne gözlemlenecek</TableHead>
                    <TableHead>Yansıtıcı araç</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(icerik.degerlendirme?.surec_odakli ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground">
                        Süreç odaklı değerlendirme maddesi yok.
                      </TableCell>
                    </TableRow>
                  )}
                  {(icerik.degerlendirme?.surec_odakli ?? []).map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{s.ne_gozlemlenecek}</TableCell>
                      <TableCell>{s.yansitici_arac}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sorukartlari" className="mt-4 space-y-4">
          {(icerik.merak_tetikleyicileri?.soru_kartlari ?? []).length === 0 ? (
            <Bos metin="Bu planda merak soru kartı yok." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {(icerik.merak_tetikleyicileri?.soru_kartlari ?? []).map((s, i) => (
                <div
                  key={i}
                  className="flex min-h-32 flex-col justify-between rounded-xl border-2 border-dashed border-accent/50 bg-card p-5 print:break-inside-avoid"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Merak kartı {i + 1}
                  </span>
                  <p className="mt-3 text-base font-medium">{s}</p>
                </div>
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
          {!icerik.urun_odakli_cikti ? (
            <Bos metin="Bu planda ürün odaklı çıktı tanımlı değil." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {icerik.urun_odakli_cikti.urun_adi || "Ürün"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex flex-wrap gap-2">
                  {icerik.urun_odakli_cikti.urun_tipi && (
                    <Badge className="bg-accent text-accent-foreground">
                      {icerik.urun_odakli_cikti.urun_tipi}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Öğrenci ne üretecek
                  </p>
                  <p className="mt-1">{icerik.urun_odakli_cikti.ogrenci_ne_uretecek || "—"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Değerlendirme ölçütü
                  </p>
                  <p className="mt-1">{icerik.urun_odakli_cikti.degerlendirme_olcutu || "—"}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

    </div>
    <YazdirBelgesi
      plan={plan}
      icerik={icerik}
      kazanim={kazanim}
      modelAdi={modelAdi}
      alanAdi={kazanim?.atolye_alani ?? plan.konu_basligi ?? null}
      kapsam={yazdirKapsami}
    />
    </>
  );
}

function Satir({ baslik, deger }: { baslik: string; deger?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{baslik}</dt>
      <dd>{deger || "—"}</dd>
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
