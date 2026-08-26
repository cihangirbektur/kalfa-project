import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bildirimOzeti, bildirimleriCoz, tarihBicimi } from "@/lib/geribildirim";
import type { GeriBildirim } from "@/lib/tipler";

/**
 * Sahadan gelen uygulama geri bildirimleri. Kimlik tutulmaz; yalnızca rol,
 * zorlanılan aşama ve tarih gösterilir.
 */
export function GeriBildirimListesi({
  planId,
  baslik = "Bu planı uygulayan eğitmenler",
}: {
  planId: string;
  baslik?: string;
}) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["plan-geribildirim", planId],
    queryFn: async () => {
      const { data: liste, error } = await supabase
        .from("geri_bildirimler")
        .select("*")
        .eq("plan_id", planId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (liste ?? []) as unknown as GeriBildirim[];
    },
  });

  const cozulmus = bildirimleriCoz(data);
  const ozet = bildirimOzeti(cozulmus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{baslik}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {isLoading ? (
          <p className="text-muted-foreground">Yükleniyor…</p>
        ) : cozulmus.length === 0 ? (
          <p className="text-muted-foreground">
            Bu plan için henüz saha geri bildirimi yok.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">{ozet.uygulamaSayisi} kişi uyguladı</Badge>
              <Badge variant="secondary">{ozet.toplam} geri bildirim</Badge>
              {ozet.enZorAsama && (
                <Badge variant="secondary">
                  En çok zorlanılan aşama: {ozet.enZorAsama.asama} ({ozet.enZorAsama.adet})
                </Badge>
              )}
            </div>

            {ozet.asamaDagilimi.length > 0 && (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {ozet.asamaDagilimi.map((a) => (
                  <li key={a.asama} className="flex justify-between">
                    <span>{a.asama}</span>
                    <span className="font-medium text-foreground">{a.adet}</span>
                  </li>
                ))}
              </ul>
            )}

            <ul className="divide-y border-t pt-2">
              {cozulmus.map((g) => (
                <li key={g.id} className="py-2">
                  <p className="text-xs text-muted-foreground">
                    {g.rol} · {tarihBicimi(g.created_at)}
                    {g.uygulandi_mi ? " · sınıfta uygulandı" : ""}
                    {g.asama ? ` · zorlanılan aşama: ${g.asama}` : ""}
                  </p>
                  <p>{g.metin || "—"}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
