import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { DurumEtiketi } from "@/components/DurumEtiketi";
import { arsivleyebilirMi, kaliciSilebilirMi, useRol } from "@/lib/rol";
import {
  DURUM_ETIKET,
  BILIMTR_YAS_GRUPLARI,
  SINIF_DUZEYLERI,
  SINIF_ETIKET,
  type Kazanim,
  type Plan,
} from "@/lib/tipler";

export const Route = createFileRoute("/havuz")({
  head: () => ({
    meta: [
      { title: "İçerik Havuzu — KALFA" },
      {
        name: "description",
        content:
          "Üretilen atölye planlarını alan, seviye ve duruma göre filtreleyin; arşivleyerek havuzu düzenli tutun.",
      },
      { property: "og:title", content: "İçerik Havuzu — KALFA" },
      {
        property: "og:description",
        content: "Atölye planlarının listesi, durum takibi, arşivleme ve toplu işlemler.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Havuz,
});

const TUMU = "hepsi";
const DURUM_SIRA: Record<string, number> = {
  revizyon_istendi: 0,
  taslak: 1,
  denetimde: 2,
  onayli: 3,
};

function bosUretim(p: Plan) {
  const i = p.icerik ?? {};
  return Object.keys(i).length === 0 || (i.asamalar ?? []).length === 0;
}

function Havuz() {
  const navigate = useNavigate();
  const { rol } = useRol();
  const qc = useQueryClient();
  const yonetici = rol === "Eğitim Yöneticisi";

  const [sekme, setSekme] = useState<"aktif" | "arsiv">("aktif");
  const [alan, setAlan] = useState(TUMU);
  const [yas, setYas] = useState(TUMU);
  const [durum, setDurum] = useState(TUMU);
  const [secili, setSecili] = useState<string[]>([]);
  const [silOnayi, setSilOnayi] = useState(false);
  const [islemde, setIslemde] = useState(false);

  const { data: kazanimlar = [] } = useQuery({
    queryKey: ["kazanimlar"],
    queryFn: async () => {
      const { data, error } = await supabase.from("kazanimlar").select("*").order("kod");
      if (error) throw error;
      return data as Kazanim[];
    },
  });

  const { data: planlar = [], isLoading } = useQuery({
    queryKey: ["planlar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planlar")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Plan[];
    },
  });

  const kazanimHarita = useMemo(() => new Map(kazanimlar.map((k) => [k.id, k])), [kazanimlar]);
  const alanlar = useMemo(
    () => Array.from(new Set(kazanimlar.map((k) => k.atolye_alani))),
    [kazanimlar],
  );

  const arsivde = sekme === "arsiv";

  const satirlar = useMemo(() => {
    const liste = planlar.filter((p) => {
      if (Boolean(p.arsivlendi) !== arsivde) return false;
      const k = p.kazanim_id ? kazanimHarita.get(p.kazanim_id) : undefined;
      if (alan !== TUMU && k?.atolye_alani !== alan) return false;
      if (yas !== TUMU && p.yas_grubu !== yas) return false;
      if (durum !== TUMU && p.durum !== durum) return false;
      return true;
    });
    if (!yonetici && !arsivde) {
      liste.sort((a, b) => (DURUM_SIRA[a.durum] ?? 9) - (DURUM_SIRA[b.durum] ?? 9));
    }
    return liste;
  }, [planlar, arsivde, alan, yas, durum, kazanimHarita, yonetici, sekme]);

  const secilebilir = satirlar.filter((p) => arsivleyebilirMi(rol, p.durum));
  const seciliListe = secili.filter((id) => satirlar.some((p) => p.id === id));

  const sekmeDegistir = (v: string) => {
    setSekme(v === "arsiv" ? "arsiv" : "aktif");
    setSecili([]);
  };

  const yenile = () => qc.invalidateQueries({ queryKey: ["planlar"] });

  const arsivle = async (idler: string[]) => {
    if (idler.length === 0) return;
    setIslemde(true);
    const { error } = await supabase
      .from("planlar")
      .update({ arsivlendi: true, arsivlenme_tarihi: new Date().toISOString() })
      .in("id", idler);
    setIslemde(false);
    if (error) {
      toast.error("Arşivlenemedi: " + error.message);
      return;
    }
    toast.success(`${idler.length} plan arşivlendi.`);
    setSecili([]);
    yenile();
  };

  const geriAl = async (id: string) => {
    const { error } = await supabase
      .from("planlar")
      .update({ arsivlendi: false, arsivlenme_tarihi: null })
      .eq("id", id);
    if (error) {
      toast.error("Geri alınamadı: " + error.message);
      return;
    }
    toast.success("Plan arşivden geri alındı.");
    yenile();
  };

  const basarisizTemizle = async () => {
    const hedef = planlar.filter(
      (p) => !p.arsivlendi && bosUretim(p) && arsivleyebilirMi(rol, p.durum),
    );
    if (hedef.length === 0) {
      toast.info("Arşivlenecek başarısız üretim bulunamadı.");
      return;
    }
    setIslemde(true);
    const { error } = await supabase
      .from("planlar")
      .update({ arsivlendi: true, arsivlenme_tarihi: new Date().toISOString() })
      .in(
        "id",
        hedef.map((p) => p.id),
      );
    setIslemde(false);
    if (error) {
      toast.error("Temizlenemedi: " + error.message);
      return;
    }
    toast.success(`${hedef.length} başarısız üretim arşivlendi.`);
    yenile();
  };

  const kaliciSil = async () => {
    setIslemde(true);
    const { error } = await supabase.from("planlar").delete().in("id", seciliListe);
    setIslemde(false);
    setSilOnayi(false);
    if (error) {
      toast.error("Silinemedi: " + error.message);
      return;
    }
    toast.success(`${seciliListe.length} plan kalıcı olarak silindi.`);
    setSecili([]);
    yenile();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {yonetici ? "Yönetici Havuzu" : "İçerik Havuzu"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {yonetici
              ? "Tüm planlar, durum rozetleriyle birlikte. Arşivleme ve kalıcı silme yetkisi sizde."
              : "Kendi taslaklarınız ve revizyon istenen planlar üstte listelenir."}
          </p>
        </div>
        {!arsivde && arsivleyebilirMi(rol, "taslak") && (
          <Button variant="outline" onClick={basarisizTemizle} disabled={islemde}>
            Başarısız üretimleri temizle
          </Button>
        )}
      </div>

      <Tabs value={sekme} onValueChange={sekmeDegistir}>
        <TabsList>
          <TabsTrigger value="aktif">Aktif</TabsTrigger>
          <TabsTrigger value="arsiv">Arşiv</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <Filtre deger={alan} degistir={setAlan} etiket="Atölye alanı" secenekler={alanlar} />
        <Filtre
          deger={yas}
          degistir={setYas}
          etiket="Seviye"
          secenekler={[...SINIF_DUZEYLERI, ...BILIMTR_YAS_GRUPLARI].map((s) => s.deger)}
          etiketle={(v) => SINIF_ETIKET[v] ?? v}
        />
        {yonetici && (
          <Filtre
            deger={durum}
            degistir={setDurum}
            etiket="Durum"
            secenekler={["taslak", "denetimde", "revizyon_istendi", "onayli"]}
            etiketle={(v) => DURUM_ETIKET[v] ?? v}
          />
        )}
      </div>

      {seciliListe.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
          <span className="font-medium">{seciliListe.length} plan seçildi</span>
          <span className="text-muted-foreground">·</span>
          {arsivde ? (
            kaliciSilebilirMi(rol) && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setSilOnayi(true)}
                disabled={islemde}
              >
                Kalıcı olarak sil
              </Button>
            )
          ) : (
            <Button size="sm" onClick={() => arsivle(seciliListe)} disabled={islemde}>
              Arşivle
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setSecili([])}>
            Seçimi temizle
          </Button>
        </div>
      )}

      {secilebilir.length > 0 && (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox
            checked={seciliListe.length === secilebilir.length && secilebilir.length > 0}
            onCheckedChange={(v) => setSecili(v ? secilebilir.map((p) => p.id) : [])}
          />
          Tümünü seç
        </label>
      )}

      {isLoading ? (
        <ListeIskeleti />
      ) : satirlar.length === 0 ? (
        <BosDurum
          simge="◎"
          baslik={arsivde ? "Arşivde plan yok" : "Kayıt bulunamadı"}
          aciklama={
            arsivde
              ? "Arşivlediğiniz planlar bu sekmede saklanır ve istediğinizde geri alınabilir."
              : "Seçili filtrelere uyan plan yok; filtreleri gevşetin ya da yeni bir plan üretin."
          }
          eylem={
            !arsivde ? (
              <Button variant="outline" onClick={() => navigate({ to: "/" })}>
                Yeni plan üret
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {satirlar.map((p) => {
            const k = p.kazanim_id ? kazanimHarita.get(p.kazanim_id) : undefined;
            const alanAdi =
              k?.atolye_alani ??
              (p.atolye_alani_id ? alanHarita.get(p.atolye_alani_id)?.ad : undefined);
            const yetki = arsivleyebilirMi(rol, p.durum);
            const isaretli = seciliListe.includes(p.id);
            return (
              <Card
                key={p.id}
                className={`kart-etkilesim ${arsivde ? "opacity-60" : ""}`}
              >
                <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-3">
                  {yetki && (
                    <Checkbox
                      className="mt-1"
                      checked={isaretli}
                      onCheckedChange={(v) =>
                        setSecili((o) => (v ? [...o, p.id] : o.filter((x) => x !== p.id)))
                      }
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <button
                      className="cursor-pointer text-left"
                      onClick={() => navigate({ to: "/plan/$id", params: { id: p.id } })}
                    >
                      <CardTitle className="text-base hover:underline">
                        {p.icerik?.plan_basligi ?? "Adsız plan"}
                      </CardTitle>
                    </button>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <DurumEtiketi durum={p.durum} />
                      {alanAdi && <Badge variant="secondary">{alanAdi}</Badge>}
                      {k ? (
                        <Badge variant="secondary">{k.kod}</Badge>
                      ) : (
                        p.konu_basligi && <Badge variant="secondary">{p.konu_basligi}</Badge>
                      )}
                      <Badge variant="secondary">{SINIF_ETIKET[p.yas_grubu] ?? p.yas_grubu}</Badge>
                      <Badge variant="secondary">v{p.versiyon}</Badge>

                      <span className="text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("tr-TR")}
                      </span>
                      {bosUretim(p) && (
                        <span className="text-destructive">içerik boş / başarısız üretim</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {arsivde ? (
                      yetki && (
                        <Button size="sm" variant="outline" onClick={() => geriAl(p.id)}>
                          Geri Al
                        </Button>
                      )
                    ) : (
                      yetki && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => arsivle([p.id])}
                          disabled={islemde}
                        >
                          Arşivle
                        </Button>
                      )
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={silOnayi} onOpenChange={setSilOnayi}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kalıcı silme</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. {seciliListe.length} plan kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={kaliciSil}>Kalıcı olarak sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Filtre({
  deger,
  degistir,
  etiket,
  secenekler,
  etiketle,
}: {
  deger: string;
  degistir: (v: string) => void;
  etiket: string;
  secenekler: string[];
  etiketle?: (v: string) => string;
}) {
  return (
    <Select value={deger} onValueChange={degistir}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={etiket} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TUMU}>{etiket}: Tümü</SelectItem>
        {secenekler.map((s) => (
          <SelectItem key={s} value={s}>
            {etiketle ? etiketle(s) : s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
