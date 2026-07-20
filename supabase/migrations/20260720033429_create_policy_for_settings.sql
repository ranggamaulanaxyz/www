-- Allow anyone to read settings where is_public is true
CREATE POLICY "Allow public read access to public settings"
ON public.settings
FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- If you also need authenticated users to read private settings, you can add:
CREATE POLICY "Allow authenticated read access to all settings"
ON public.settings
FOR SELECT
TO authenticated
USING (true);
