ALTER TABLE public.planlar ADD COLUMN IF NOT EXISTS onay_tarihi timestamptz;

UPDATE public.planlar p
SET onay_tarihi = COALESCE(
  (SELECT MAX(COALESCE(t.karar_tarihi, t.created_at)) FROM public.denetim_turlari t
    WHERE t.plan_id = p.id AND t.karar = 'onayli'),
  (SELECT MAX(t.created_at) FROM public.denetim_turlari t WHERE t.plan_id = p.id),
  p.created_at
)
WHERE p.durum = 'onayli' AND p.onay_tarihi IS NULL;