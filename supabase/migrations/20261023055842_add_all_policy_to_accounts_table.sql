GRANT DELETE, INSERT, SELECT, UPDATE ON public.accounts TO authenticated;

CREATE POLICY "Enable all access for administrator" ON public.accounts
  TO authenticated
  USING (public.has_group('Administrator'::text));