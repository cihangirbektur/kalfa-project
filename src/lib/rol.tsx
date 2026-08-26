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
  "Pedagojik Uzman": [DENETIM],
  Eğitmen: [EGITMEN],
  "Eğitim Yöneticisi": [{ yol: "/havuz", ad: "Yönetici Havuzu" }, RAPORLAR],
};

/** Plan detayına ve yaş uyarlamasına erişebilen roller. */
const PLAN_ERISIMI: Rol[] = ["İçerik Uzmanı", "Pedagojik Uzman", "Eğitim Yöneticisi"];

export function erisimVarMi(rol: Rol, pathname: string) {
  const menu = ROL_MENULERI[rol];
  if (pathname.startsWith("/plan/") || pathname.startsWith("/yas-uyarlama")) {
    return PLAN_ERISIMI.includes(rol);
  }
  return menu.some((m) => (m.yol === "/" ? pathname === "/" : pathname.startsWith(m.yol)));
}

/** Arşivleme yetkisi: yönetici her durumu, içerik uzmanı yalnızca taslak/revizyon. */
export function arsivleyebilirMi(rol: Rol, durum: string) {
  if (rol === "Eğitim Yöneticisi") return true;
  if (rol === "İçerik Uzmanı") return durum === "taslak" || durum === "revizyon_istendi";
  return false;
}

export function kaliciSilebilirMi(rol: Rol) {
  return rol === "Eğitim Yöneticisi";
}

type RolBaglami = { rol: Rol; setRol: (r: Rol) => void; hazir: boolean };

const Baglam = createContext<RolBaglami>({
  rol: "İçerik Uzmanı",
  setRol: () => {},
  hazir: false,
});

export function RolSaglayici({ children }: { children: ReactNode }) {
  const [rol, setRol] = useState<Rol>("İçerik Uzmanı");
  const [hazir, setHazir] = useState(false);

  useEffect(() => {
    const kayitli = window.localStorage.getItem("kalfa-rol");
    if (kayitli && (ROLLER as readonly string[]).includes(kayitli)) {
      setRol(kayitli as Rol);
    }
    setHazir(true);
  }, []);

  const degistir = (r: Rol) => {
    setRol(r);
    window.localStorage.setItem("kalfa-rol", r);
  };

  return <Baglam.Provider value={{ rol, setRol: degistir, hazir }}>{children}</Baglam.Provider>;
}

export function useRol() {
  return useContext(Baglam);
}
