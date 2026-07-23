ALTER TABLE public.drives ALTER COLUMN updated_at DROP NOT NULL;
CREATE POLICY "Enable insert for authenticated users only" ON public.drives FOR INSERT TO authenticated WITH CHECK (true);
