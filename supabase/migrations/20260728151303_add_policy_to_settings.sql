DROP POLICY "Allow authenticated read access to all settings" ON public.settings;
DROP POLICY "Allow public read access to public settings" ON public.settings;
CREATE POLICY "Enable insert for authenticated users only" ON public.settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable read access for authenticated users only" ON public.settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable read access to public settings for public users" ON public.settings FOR SELECT TO anon, authenticated USING ((is_public = true));
