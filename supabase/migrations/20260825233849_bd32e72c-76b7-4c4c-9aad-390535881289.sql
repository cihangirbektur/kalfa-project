ALTER TABLE public.denetim_bulgulari ADD COLUMN IF NOT EXISTS oneri text;
CREATE INDEX IF NOT EXISTS denetim_bulgulari_plan_id_idx ON public.denetim_bulgulari (plan_id);