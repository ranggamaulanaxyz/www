-- Grant the Administrator group full access to product brands.

GRANT DELETE, INSERT, SELECT, UPDATE ON public.product_brands TO authenticated;

DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.product_brands;

CREATE POLICY "Enable all access for Administrator" ON public.product_brands
  TO authenticated
  USING (public.has_group('Administrator'::text));
