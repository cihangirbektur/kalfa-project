import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/** Gri iskelet blok — yükleme sırasında içeriğin yerini tutar, layout kaymaz. */
export function Iskelet({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

/** Liste kartlarının yerini tutan iskelet. */
export function ListeIskeleti({ adet = 4 }: { adet?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Yükleniyor">
      {Array.from({ length: adet }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-3 pb-4">
            <Iskelet className="h-5 w-2/3" />
            <div className="flex flex-wrap gap-2">
              <Iskelet className="h-5 w-20" />
              <Iskelet className="h-5 w-28" />
              <Iskelet className="h-5 w-16" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

/** Plan detayının yerini tutan iskelet. */
export function DetayIskeleti() {
  return (
    <div className="mx-auto max-w-5xl space-y-6" aria-busy="true" aria-label="Yükleniyor">
      <div className="space-y-3">
        <Iskelet className="h-8 w-2/3" />
        <Iskelet className="h-4 w-full max-w-xl" />
        <div className="flex flex-wrap gap-2">
          <Iskelet className="h-5 w-24" />
          <Iskelet className="h-5 w-20" />
          <Iskelet className="h-5 w-16" />
        </div>
      </div>
      <Iskelet className="h-10 w-full max-w-md" />
      {[0, 1].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Iskelet className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Iskelet className="h-4 w-full" />
            <Iskelet className="h-4 w-11/12" />
            <Iskelet className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/** Tasarlanmış boş durum: simge, tek cümle açıklama, isteğe bağlı eylem. */
export function BosDurum({
  simge = "◎",
  baslik,
  aciklama,
  eylem,
}: {
  simge?: ReactNode;
  baslik: string;
  aciklama?: string;
  eylem?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl text-muted-foreground"
        >
          {simge}
        </span>
        <p className="text-base font-medium">{baslik}</p>
        {aciklama && (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{aciklama}</p>
        )}
        {eylem}
      </CardContent>
    </Card>
  );
}
