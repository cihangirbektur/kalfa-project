import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/yas-uyarlama")({
  head: () => ({
    meta: [
      { title: "Yaş Uyarlama Karşılaştırması — KALFA" },
      {
        name: "description",
        content: "Bir atölye planının farklı yaş gruplarına uyarlanmış sürümlerini karşılaştırın.",
      },
      { property: "og:title", content: "Yaş Uyarlama Karşılaştırması — KALFA" },
      {
        property: "og:description",
        content: "Yaş gruplarına göre uyarlanan plan sürümlerinin yan yana karşılaştırması.",
      },
    ],
  }),
  component: YasUyarlama,
});

function YasUyarlama() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Yaş Uyarlama Karşılaştırması</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Bu ekran sonraki adımda kurulacak: kaynak plan ile uyarlanmış sürümün aşama aşama yan yana
          karşılaştırması.
        </CardContent>
      </Card>
    </div>
  );
}
