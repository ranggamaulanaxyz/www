GRANT DELETE, INSERT, SELECT, UPDATE ON public.account_journals TO authenticated;

CREATE POLICY "Enable all access for Administrator" ON public.account_journals
  TO authenticated
  USING (public.has_group('Administrator'::text));
