-- Keep public.products and public.product_templates in sync on creation:
--   * inserting a product without template_id creates its template
--   * inserting a template creates its product

CREATE OR REPLACE FUNCTION public.create_template_from_product()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
  AS $function$
DECLARE
  v_template_id uuid;
BEGIN
  IF NEW.template_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Tell create_product_from_template() that this template comes from a product,
  -- otherwise it would create a second product for the same template.
  PERFORM set_config('app.product_template_sync', 'from_product', true);

  INSERT INTO public.product_templates (
    name,
    code,
    barcode,
    cost_price,
    sale_price,
    is_sale,
    is_purchase
  )
  VALUES (
    NEW.name,
    NEW.code,
    NEW.barcode,
    NEW.cost_price,
    NEW.sale_price,
    NEW.is_sale,
    NEW.is_purchase
  )
  RETURNING id INTO v_template_id;

  PERFORM set_config('app.product_template_sync', '', true);

  NEW.template_id := v_template_id;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_product_from_template()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
  AS $function$
BEGIN
  IF coalesce(current_setting('app.product_template_sync', true), '') = 'from_product' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.products (
    name,
    code,
    barcode,
    cost_price,
    sale_price,
    is_sale,
    is_purchase,
    template_id
  )
  VALUES (
    NEW.name,
    NEW.code,
    NEW.barcode,
    NEW.cost_price,
    NEW.sale_price,
    NEW.is_sale,
    NEW.is_purchase,
    NEW.id
  );

  RETURN NEW;
END;
$function$;

CREATE TRIGGER create_template_from_product
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.create_template_from_product();

CREATE TRIGGER create_product_from_template
  AFTER INSERT ON public.product_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.create_product_from_template();

-- Grant the Administrator group full access to the product tables.

GRANT DELETE, INSERT, SELECT, UPDATE ON public.products TO authenticated;

GRANT DELETE, INSERT, SELECT, UPDATE ON public.product_templates TO authenticated;

DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.products;
DROP POLICY IF EXISTS "Enable all access to administrator" ON public.products;

CREATE POLICY "Enable all access for Administrator" ON public.products
  TO authenticated
  USING (public.has_group('Administrator'::text));

DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.product_templates;

CREATE POLICY "Enable all access for Administrator" ON public.product_templates
  TO authenticated
  USING (public.has_group('Administrator'::text));
