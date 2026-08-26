import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { aramaBaglantilari, basiliMi, yazdirilabilirAc } from "@/lib/hesap";
import { gorselBaglantisi, gorselIstemiKur, gorselUretVeYukle } from "@/lib/gorsel";
import { BASILI_TIP_ETIKET, type Medya } from "@/lib/tipler";

type Props = {
  planId: string;
  medyalar: Medya[];
  duzenlenebilir: boolean;
  kazanimMetni: string;
  seviye: string;
  atolyeAlani: string;
  planBasligi: string;
  onAciklamaDegis?: (i: number, deger: string) => void;
  onGorsel: (i: number, yol: string) => Promise<void> | void;
};

export function MedyaBolumu(props: Props) {
  const { medyalar, duzenlenebilir } = props;
  const basililar = medyalar.map((m, i) => ({ m, i })).filter(({ m }) => basiliMi(m));
  const dijitaller = medyalar.map((m, i) => ({ m, i })).filter(({ m }) => !basiliMi(m));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dijital materyaller</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dijitaller.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bu grupta öneri yok.</p>
          ) : (
            dijitaller.map(({ m, i }) => (
              <MedyaKarti key={i} indeks={i} medya={m} {...props} />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basılı materyaller</CardTitle>
        </CardHeader>
        <CardContent>
          {basililar.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Bu planda basılı materyal önerisi yok.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Materyal</TableHead>
                  <TableHead>Ne içerir</TableHead>
                  <TableHead className="w-20">Sayfa</TableHead>
                  <TableHead>Baskı notu</TableHead>
                  <TableHead>Aşama</TableHead>
                  <TableHead className="w-44">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {basililar.map(({ m, i }) => (
                  <TableRow key={i}>
                    <TableCell className="align-top font-medium">
                      <div className="space-y-1">
                        <p>{m.ad || m.aciklama || "Materyal"}</p>
                        <Badge variant="secondary">
                          {BASILI_TIP_ETIKET[m.tip] ?? m.tip}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {m.ne_icerir || m.aciklama || "—"}
                    </TableCell>
                    <TableCell className="align-top">{m.sayfa_sayisi ?? "—"}</TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {m.baski_notu || "—"}
                    </TableCell>
                    <TableCell className="align-top">{m.kullanilacak_asama || "—"}</TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            yazdirilabilirAc(
                              m.ad || "Basılı materyal",
                              `<h1>${m.ad || "Basılı materyal"}</h1>
                               <p>${props.planBasligi}</p>
                               <h2>Tip</h2><p>${BASILI_TIP_ETIKET[m.tip] ?? m.tip}</p>
                               <h2>Ne içerir</h2><div class="kutu">${m.ne_icerir || m.aciklama || "—"}</div>
                               <h2>Baskı notu</h2><p>${m.baski_notu || "—"}</p>
                               <h2>Sayfa sayısı</h2><p>${m.sayfa_sayisi ?? "—"}</p>
                               <h2>Kullanılacak aşama</h2><p>${m.kullanilacak_asama || "—"}</p>`,
                            )
                          }
                        >
                          Yazdır
                        </Button>
                        <GorselAlani indeks={i} medya={m} {...props} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MedyaKarti({ medya, indeks, ...props }: Props & { medya: Medya; indeks: number }) {
  const baglantilar = aramaBaglantilari(medya.arama_terimi ?? medya.aciklama ?? "");
  return (
    <div className="rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium">{medya.ad || medya.tip}</p>
        <Badge variant="secondary">{medya.tip}</Badge>
        {medya.kullanilacak_asama && (
          <Badge variant="secondary">{medya.kullanilacak_asama}</Badge>
        )}
      </div>
      {props.duzenlenebilir && props.onAciklamaDegis ? (
        <Textarea
          className="mt-2"
          rows={2}
          value={medya.aciklama ?? ""}
          onChange={(e) => props.onAciklamaDegis?.(indeks, e.target.value)}
        />
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{medya.aciklama}</p>
      )}
      {medya.onerilen_kaynak && (
        <p className="mt-2 text-sm">
          <span className="text-muted-foreground">Önerilen kaynak: </span>
          {medya.onerilen_kaynak}
        </p>
      )}
      {medya.arama_terimi && (
        <p className="mt-1 text-xs text-muted-foreground">Arama terimi: {medya.arama_terimi}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <a href={baglantilar.youtube} target="_blank" rel="noreferrer">
            YouTube&apos;da Ara
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={baglantilar.gorsel} target="_blank" rel="noreferrer">
            Görsellerde Ara
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={baglantilar.web} target="_blank" rel="noreferrer">
            Web&apos;de Ara
          </a>
        </Button>
      </div>
      <div className="mt-3">
        <GorselAlani indeks={indeks} medya={medya} {...props} />
      </div>
    </div>
  );
}

function GorselAlani({
  medya,
  indeks,
  planId,
  kazanimMetni,
  seviye,
  atolyeAlani,
  onGorsel,
}: Props & { medya: Medya; indeks: number }) {
  const [url, setUrl] = useState<string | null>(null);
  const [uretiliyor, setUretiliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [buyuk, setBuyuk] = useState(false);

  useEffect(() => {
    let iptal = false;
    if (!medya.gorsel_yolu) {
      setUrl(null);
      return;
    }
    gorselBaglantisi(medya.gorsel_yolu).then((u) => {
      if (!iptal) setUrl(u);
    });
    return () => {
      iptal = true;
    };
  }, [medya.gorsel_yolu]);

  const uret = async () => {
    setHata(null);
    setUretiliyor(true);
    try {
      const istem = gorselIstemiKur({
        kazanim: kazanimMetni,
        seviye,
        atolye_alani: atolyeAlani,
        aciklama: medya.ne_icerir || medya.aciklama || medya.ad || medya.tip,
      });
      const yol = await gorselUretVeYukle(planId, indeks, istem);
      await onGorsel(indeks, yol);
      setUrl(await gorselBaglantisi(yol));
      toast.success("Görsel üretildi.");
    } catch (e) {
      const mesaj = e instanceof Error ? e.message : "Görsel üretilemedi.";
      setHata(mesaj);
      toast.error(mesaj);
    } finally {
      setUretiliyor(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={uret} disabled={uretiliyor}>
          {uretiliyor ? "Görsel üretiliyor…" : medya.gorsel_yolu ? "Yeniden Üret" : "Görsel Üret"}
        </Button>
        {url && (
          <Button asChild size="sm" variant="ghost">
            <a href={url} download={`${medya.ad || "gorsel"}.png`} target="_blank" rel="noreferrer">
              İndir
            </a>
          </Button>
        )}
      </div>
      {hata && <p className="text-xs text-destructive">{hata}</p>}
      {url && (
        <>
          <button type="button" onClick={() => setBuyuk(true)}>
            <img
              src={url}
              alt={medya.aciklama || medya.ad || "Üretilen eğitim görseli"}
              className="h-24 w-24 rounded-lg border object-cover"
              loading="lazy"
            />
          </button>
          <Dialog open={buyuk} onOpenChange={setBuyuk}>
            <DialogContent className="max-w-3xl">
              <DialogTitle className="text-base">{medya.ad || "Üretilen görsel"}</DialogTitle>
              <img
                src={url}
                alt={medya.aciklama || medya.ad || "Üretilen eğitim görseli"}
                className="w-full rounded-lg"
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
