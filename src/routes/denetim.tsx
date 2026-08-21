import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/denetim")({
  head: () => ({
    meta: [
      { title: "Denetim Paneli — KALFA" },
      {
        name: "description",
        content: "Pedagojik uzmanın atölye planlarını kurallara karşı denetlediği panel.",
      },
      { property: "og:title", content: "Denetim Paneli — KALFA" },
      {
        property: "og:description",
        content: "Pedagojik denetim bulguları ve onay akışı bu panelde toplanacak.",
      },
    ],
  }),
  component: Denetim,
});

function Denetim() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Denetim Paneli</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Bu ekran sonraki adımda kurulacak: denetim bulguları listesi, kural bazlı geçti/kaldı
          göstergesi ve pedagojik uzman onayı.
        </CardContent>
      </Card>
    </div>
  );
}
