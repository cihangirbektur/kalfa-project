CREATE TABLE public.denetim_turlari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES public.planlar(id) ON DELETE CASCADE,
  tur_no integer NOT NULL DEFAULT 1,
  denetci_notu text,
  karar text,
  karar_tarihi timestamptz,
  kritik_sayisi integer NOT NULL DEFAULT 0,
  uyari_sayisi integer NOT NULL DEFAULT 0,
  bilgi_sayisi integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.denetim_turlari TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.denetim_turlari TO anon;
GRANT ALL ON public.denetim_turlari TO service_role;

ALTER TABLE public.denetim_turlari ENABLE ROW LEVEL SECURITY;

CREATE POLICY acik_erisim ON public.denetim_turlari FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE INDEX denetim_turlari_plan_id_idx ON public.denetim_turlari(plan_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_denetim_turlari_updated_at BEFORE UPDATE ON public.denetim_turlari
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.denetim_bulgulari ADD COLUMN tur_id uuid REFERENCES public.denetim_turlari(id) ON DELETE CASCADE;
CREATE INDEX denetim_bulgulari_tur_id_idx ON public.denetim_bulgulari(tur_id);

ALTER TABLE public.planlar ADD COLUMN arsivlendi boolean NOT NULL DEFAULT false;
ALTER TABLE public.planlar ADD COLUMN arsivlenme_tarihi timestamptz;
CREATE INDEX planlar_arsivlendi_idx ON public.planlar(arsivlendi);