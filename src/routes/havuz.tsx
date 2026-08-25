import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DurumEtiketi } from "@/components/DurumEtiketi";
import { DURUMLAR, SINIF_DUZEYLERI, SINIF_ETIKET, type Kazanim, type Plan } from "@/lib/tipler";

export const Route = createFileRoute("/havuz")({
  head: () => ({
    meta: [
      { title: "İçerik Havuzu — KALFA" },
      {
        name: "description",
        content: "Üretilen atölye planlarını alan, yaş grubu ve duruma göre filtreleyerek inceleyin.",
      },
      { property: "og:title", content: "İçerik Havuzu — KALFA" },
      {
        property: "og:description",
        content: "Tüm atölye planlarının listesi, filtreleri ve durum takibi.",
      },
    ],
  }),
  component: Havuz,
});

const TUMU = "hepsi";

function Havuz() {
  const navigate = useNavigate();
  const [alan, setAlan] = useState(TUMU);
  const [yas, setYas] = useState(TUMU);
  const [durum, setDurum] = useState(TUMU);

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

  const kazanimHarita = useMemo(
    () => new Map(kazanimlar.map((k) => [k.id, k])),
    [kazanimlar],
  );
  const alanlar = useMemo(
    () => Array.from(new Set(kazanimlar.map((k) => k.atolye_alani))),
    [kazanimlar],
  );

  const satirlar = planlar.filter((p) => {
    const k = p.kazanim_id ? kazanimHarita.get(p.kazanim_id) : undefined;
    if (alan !== TUMU && k?.atolye_alani !== alan) return false;
    if (yas !== TUMU && p.yas_grubu !== yas) return false;
    if (durum !== TUMU && p.durum !== durum) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">İçerik Havuzu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Üretilmiş tüm atölye planları. Satıra tıklayarak plana gidin.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Planlar</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Filtre deger={alan} degistir={setAlan} etiket="Atölye alanı" secenekler={alanlar} />
            <Filtre
              deger={yas}
              degistir={setYas}
              etiket="Sınıf düzeyi"
              secenekler={SINIF_DUZEYLERI.map((s) => s.deger)}
              etiketle={(v) => SINIF_ETIKET[v] ?? v}
            />
            <Filtre
              deger={durum}
              degistir={setDurum}
              etiket="Durum"
              secenekler={[...DURUMLAR]}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Atölye alanı</TableHead>
                <TableHead>Kazanım</TableHead>
                <TableHead>Sınıf düzeyi</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Versiyon</TableHead>
                <TableHead>Tarih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    Yükleniyor…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && satirlar.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-muted-foreground">
                    Kayıt bulunamadı.
                  </TableCell>
                </TableRow>
              )}
              {satirlar.map((p) => {
                const k = p.kazanim_id ? kazanimHarita.get(p.kazanim_id) : undefined;
                return (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => navigate({ to: "/plan/$id", params: { id: p.id } })}
                  >
                    <TableCell className="font-medium">
                      {p.icerik?.plan_basligi ?? "Adsız plan"}
                    </TableCell>
                    <TableCell>{k?.atolye_alani ?? "—"}</TableCell>
                    <TableCell>{k?.kod ?? "—"}</TableCell>
                    <TableCell>{SINIF_ETIKET[p.yas_grubu] ?? p.yas_grubu}</TableCell>
                    <TableCell>
                      <DurumEtiketi durum={p.durum} />
                    </TableCell>
                    <TableCell>v{p.versiyon}</TableCell>
                    <TableCell>
                      {new Date(p.created_at).toLocaleDateString("tr-TR")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
      <SelectTrigger className="w-[180px]">
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
