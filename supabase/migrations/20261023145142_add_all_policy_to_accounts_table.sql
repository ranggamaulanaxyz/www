CREATE POLICY "Enable all access for administrator" ON "public"."accounts"
  FOR ALL
  TO PUBLIC
  USING (public.has_group('Administrator'::text));
