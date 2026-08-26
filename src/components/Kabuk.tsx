import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { ROLLER, ROL_MENULERI, erisimVarMi, useRol, type Rol } from "@/lib/rol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Kabuk({ children }: { children: ReactNode }) {
  const { rol, setRol } = useRol();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const gezinme = ROL_MENULERI[rol];

  useEffect(() => {
    if (erisimVarMi(rol, pathname)) return;
    const ilk = gezinme[0];
    if (ilk) navigate({ to: ilk.yol });
  }, [rol, pathname, gezinme, navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 print:!hidden shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="px-6 py-6">
          <div className="text-2xl font-semibold tracking-tight">KALFA</div>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            Kalfa üretir, usta onaylar.
          </p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {gezinme.map((g) => {
            const aktif = g.yol === "/" ? pathname === "/" : pathname.startsWith(g.yol);
            return (
              <Link
                key={g.yol}
                to={g.yol}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  aktif
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                }`}
              >
                {g.ad}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-6 py-3 print:hidden">
          <div className="text-sm text-muted-foreground md:hidden font-semibold text-foreground">
            KALFA
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">
            Bilim Türkiye / DENEYAP atölye içeriği üretim aracı
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rol</span>
            <Select value={rol} onValueChange={(v) => setRol(v as Rol)}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLLER.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex-1 p-6 print:p-0">{children}</main>
      </div>
    </div>
  );
}
