import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const ROLLER = [
  "İçerik Uzmanı",
  "Pedagojik Uzman",
  "Eğitmen",
  "Eğitim Yöneticisi",
] as const;
export type Rol = (typeof ROLLER)[number];

export type MenuOgesi = { yol: string; ad: string };

const YENI_PLAN: MenuOgesi = { yol: "/", ad: "Yeni Plan" };
const HAVUZ: MenuOgesi = { yol: "/havuz", ad: "İçerik Havuzu" };
const DENETIM: MenuOgesi = { yol: "/denetim", ad: "Denetim" };
const EGITMEN: MenuOgesi = { yol: "/egitmen", ad: "Eğitmen Görünümü" };
const RAPORLAR: MenuOgesi = { yol: "/raporlar", ad: "Raporlar" };

export const ROL_MENULERI: Record<Rol, MenuOgesi[]> = {
  "İçerik Uzmanı": [YENI_PLAN, HAVUZ],
  "Pedagojik Uzman": [DENETIM, HAVUZ],
  Eğitmen: [EGITMEN],
  "Eğitim Yöneticisi": [HAVUZ, RAPORLAR],
};

// Plan detayı, ilgili ekranlara erişebilen roller için açıktır.
export function erisimVarMi(rol: Rol, pathname: string) {
  const menu = ROL_MENULERI[rol];
  if (pathname.startsWith("/plan/") || pathname.startsWith("/yas-uyarlama")) {
    return menu.some((m) => m.yol !== "/");
  }
  return menu.some((m) => (m.yol === "/" ? pathname === "/" : pathname.startsWith(m.yol)));
}

type RolBaglami = { rol: Rol; setRol: (r: Rol) => void };

const Baglam = createContext<RolBaglami>({ rol: "İçerik Uzmanı", setRol: () => {} });

export function RolSaglayici({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>("İçerik Uzmanı");

  useEffect(() => {
    const kayitli = window.localStorage.getItem("kalfa-rol");
    if (kayitli && (ROLLER as readonly string[]).includes(kayitli)) {
      setRol(kayitli as Rol);
    }
  }, []);

  const degistir = (r: Rol) => {
    setRol(r);
    window.localStorage.setItem("kalfa-rol", r);
  };

  return <Baglam.Provider value={{ rol, setRol: degistir }}>{children}</Baglam.Provider>;
}

export function useRol() {
  return useContext(Baglam);
}
