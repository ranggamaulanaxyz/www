GRANT DELETE, INSERT, SELECT, UPDATE ON public.partners TO authenticated;

CREATE POLICY "Enable select access for administrator" ON public.partners
  FOR SELECT
  TO authenticated
  USING (public.has_group('Administrator'::text));