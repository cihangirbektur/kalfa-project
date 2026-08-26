import { DURUM_ETIKET } from "@/lib/tipler";

export function DurumEtiketi({ durum }: { durum: string }) {
  const stil =
    durum === "onayli"
      ? "bg-primary/10 text-primary"
      : durum === "denetimde"
        ? "bg-accent/15 text-accent"
        : durum === "revizyon_istendi"
          ? "bg-amber-500/15 text-amber-700"
          : "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${stil}`}>
      {DURUM_ETIKET[durum] ?? durum}
    </span>
  );
}
