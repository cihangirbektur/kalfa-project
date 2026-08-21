import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/egitmen")({
  head: () => ({
    meta: [
      { title: "Eğitmen Görünümü — KALFA" },
      {
        name: "description",
        content: "Eğitmenin atölyeyi sınıfta uygularken kullanacağı sadeleştirilmiş görünüm.",
      },
      { property: "og:title", content: "Eğitmen Görünümü — KALFA" },
      {
        property: "og:description",
        content: "Onaylı atölye planlarının uygulama görünümü sonraki adımda eklenecek.",
      },
    ],
  }),
  component: Egitmen,
});

function Egitmen() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Eğitmen Görünümü</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Bu ekran sonraki adımda kurulacak: aşama aşama uygulama akışı, süre sayacı ve malzeme
          kontrol listesi.
        </CardContent>
      </Card>
    </div>
  );
}
