import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const ROLLER = [
  "İçerik Uzmanı",
  "Pedagojik Uzman",
  "Eğitmen",
  "Eğitim Yöneticisi",
] as const;
export type Rol = (typeof ROLLER)[number];

export type MenuOgesi = { yol: string; ad: string };

const TUM_EKRANLAR: Record<string, MenuOgesi> = {
  "/": { yol: "/", ad: "Yeni Plan" },
  "/havuz": { yol: "/havuz", ad: "İçerik Havuzu" },
  "/denetim": { yol: "/denetim", ad: "Denetim" },
  "/egitmen": { yol: "/egitmen", ad: "Eğitmen Görünümü" },
  "/raporlar": { yol: "/raporlar", ad: "Raporlar" },
};

export const ROL_MENULERI: Record<Rol, MenuOgesi[]> = {
  "İçerik Uzmanı": [TUM_EKRANLAR["/"], TUM_EKRANLAR["/havuz"]],
  "Pedagojik Uzman": [TUM_EKRANLAR["/denetim"], TUM_EKRANLAR["/havuz"]],
  Eğitmen: [TUM_EKRANLAR["/egitmen"]],
  "Eğitim Yöneticisi": [TUM_EKRANLAR["/havuz"], TUM_EKRANLAR["/raporlar"]],
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
