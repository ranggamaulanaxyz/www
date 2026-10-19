CREATE POLICY "Enable update access for administrator" ON public.partners
  FOR UPDATE
  TO authenticated
  USING (public.has_group('Administrator'::text));