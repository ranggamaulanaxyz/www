CREATE POLICY "Enable delete for authenticated users only" ON public.drive_items FOR DELETE TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.drive_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable read access for authenticated users only" ON public.drive_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable update for authenticated users only" ON public.drive_items FOR UPDATE TO authenticated USING (true);
