CREATE POLICY "Enable update for authenticated users only" ON public.settings FOR UPDATE TO authenticated USING (true);
