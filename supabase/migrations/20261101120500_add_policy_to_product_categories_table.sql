-- Grant the Administrator group full access to product categories.

GRANT DELETE, INSERT, SELECT, UPDATE ON public.product_categories TO authenticated;

DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.product_categories;

CREATE POLICY "Enable all access for Administrator" ON public.product_categories
  FOR ALL
  TO authenticated
  USING (public.has_group('Administrator'::text));
