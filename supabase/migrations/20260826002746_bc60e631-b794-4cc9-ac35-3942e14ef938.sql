CREATE POLICY "plan gorselleri okuma"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'plan-gorselleri');

CREATE POLICY "plan gorselleri yukleme"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'plan-gorselleri');

CREATE POLICY "plan gorselleri guncelleme"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'plan-gorselleri')
WITH CHECK (bucket_id = 'plan-gorselleri');