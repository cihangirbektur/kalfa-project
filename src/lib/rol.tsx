import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const ROLLER = ["İçerik Uzmanı", "Pedagojik Uzman", "Eğitmen"] as const;
export type Rol = (typeof ROLLER)[number];

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
