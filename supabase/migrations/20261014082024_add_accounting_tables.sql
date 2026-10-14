-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

CREATE TYPE public.account_move_status AS ENUM (
  'draft',
  'posted'
);

COMMENT ON TYPE public.account_move_status IS 'Account Move Status';

CREATE TYPE public.account_types AS ENUM (
  'asset',
  'liability',
  'equity',
  'income',
  'expense'
);

COMMENT ON TYPE public.account_types IS 'Account Types';

CREATE TABLE public.account_journals (
  id                        uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at                timestamp with time zone DEFAULT now() NOT NULL,
  updated_at                timestamp with time zone,
  name                      text                     NOT NULL,
  default_debit_account_id  uuid,
  default_credit_account_id uuid
);

COMMENT ON TABLE public.account_journals IS 'Account Journals';

ALTER TABLE public.account_journals
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.account_journals
  ADD CONSTRAINT account_journals_name_key UNIQUE (name);

ALTER TABLE public.account_journals
  ADD CONSTRAINT account_journals_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_journals TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_journals TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_journals TO service_role;

CREATE TRIGGER update_account_journals_updated_at
  BEFORE UPDATE ON public.account_journals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.account_move_items (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone,
  name       text                     NOT NULL,
  product_id uuid,
  partner_id uuid                     NOT NULL,
  account_id uuid                     NOT NULL,
  debit      double precision         DEFAULT '0'::double precision NOT NULL,
  credit     double precision         DEFAULT '0'::double precision NOT NULL,
  move_id    uuid
);

ALTER TABLE public.account_move_items
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.account_move_items
  ADD CONSTRAINT account_move_items_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.account_move_items
  ADD CONSTRAINT account_move_items_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_move_items TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_move_items TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_move_items TO service_role;

CREATE TABLE public.account_moves (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone   DEFAULT now() NOT NULL,
  updated_at timestamp with time zone,
  number     text,
  date       date                       NOT NULL,
  journal_id uuid                       NOT NULL,
  partner_id uuid                       NOT NULL,
  status     public.account_move_status DEFAULT 'draft'::public.account_move_status NOT NULL
);

COMMENT ON TABLE public.account_moves IS 'Account Moves';

ALTER TABLE public.account_moves
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.account_moves
  ADD CONSTRAINT account_moves_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.account_journals(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.account_moves
  ADD CONSTRAINT account_moves_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.account_moves
  ADD CONSTRAINT account_moves_pkey PRIMARY KEY (id);

ALTER TABLE public.account_move_items
  ADD CONSTRAINT account_move_items_move_id_fkey FOREIGN KEY (move_id) REFERENCES public.account_moves(id) ON UPDATE CASCADE ON DELETE CASCADE;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_moves TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_moves TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_moves TO service_role;

CREATE TRIGGER update_account_moves_updated_at
  BEFORE UPDATE ON public.account_moves
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.account_subtypes (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone,
  name       text                     NOT NULL,
  type       public.account_types     NOT NULL
);

COMMENT ON TABLE public.account_subtypes IS 'Account Subtypes';

ALTER TABLE public.account_subtypes
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.account_subtypes
  ADD CONSTRAINT account_subtypes_name_key UNIQUE (name);

ALTER TABLE public.account_subtypes
  ADD CONSTRAINT account_subtypes_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_subtypes TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_subtypes TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.account_subtypes TO service_role;

CREATE TRIGGER update_account_subtypes_updated_at
  BEFORE UPDATE ON public.account_subtypes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.accounts (
  id                 uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at         timestamp with time zone DEFAULT now() NOT NULL,
  updated_at         timestamp with time zone,
  code               text                     NOT NULL,
  name               text                     NOT NULL,
  account_subtype_id uuid                     NOT NULL
);

COMMENT ON TABLE public.accounts IS 'Chart of Accounts';

ALTER TABLE public.accounts
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_account_subtype_id_fkey FOREIGN KEY (account_subtype_id) REFERENCES public.account_subtypes(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_code_key UNIQUE (code);

ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);

ALTER TABLE public.account_journals
  ADD CONSTRAINT account_journals_default_credit_account_id_fkey FOREIGN KEY (default_credit_account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE public.account_journals
  ADD CONSTRAINT account_journals_default_debit_account_id_fkey FOREIGN KEY (default_debit_account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE public.account_move_items
  ADD CONSTRAINT account_move_items_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.accounts TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.accounts TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.accounts TO service_role;

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.product_brands (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone,
  name       text                     NOT NULL
);

COMMENT ON TABLE public.product_brands IS 'Product Brands';

ALTER TABLE public.product_brands
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_brands
  ADD CONSTRAINT product_brands_name_key UNIQUE (name);

ALTER TABLE public.product_brands
  ADD CONSTRAINT product_brands_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_brands TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_brands TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_brands TO service_role;

CREATE TRIGGER update_product_brands_updated_at
  BEFORE UPDATE ON public.product_brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.product_categories (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone,
  name       text                     NOT NULL,
  parent_id  uuid
);

COMMENT ON TABLE public.product_categories IS 'Product Categories';

ALTER TABLE public.product_categories
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_categories
  ADD CONSTRAINT product_categories_name_key UNIQUE (name);

ALTER TABLE public.product_categories
  ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);

ALTER TABLE public.product_categories
  ADD CONSTRAINT product_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_categories TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_categories TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_categories TO service_role;

CREATE TRIGGER update_product_categories_updated_at
  BEFORE UPDATE ON public.product_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.product_templates (
  id                         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at                 timestamp with time zone DEFAULT now() NOT NULL,
  updated_at                 timestamp with time zone,
  name                       text                     NOT NULL,
  code                       text,
  barcode                    text,
  cost_price                 double precision         DEFAULT '0'::double precision NOT NULL,
  sale_price                 double precision         DEFAULT '0'::double precision NOT NULL,
  is_sale                    boolean                  DEFAULT false NOT NULL,
  is_purchase                boolean                  DEFAULT false NOT NULL,
  category_id                uuid,
  brand_id                   uuid,
  default_income_account_id  uuid,
  default_expense_account_id uuid
);

COMMENT ON TABLE public.product_templates IS 'Product Templates';

ALTER TABLE public.product_templates
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.product_templates
  ADD CONSTRAINT product_templates_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.product_brands(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.product_templates
  ADD CONSTRAINT product_templates_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.product_templates
  ADD CONSTRAINT product_templates_default_expense_account_id_fkey FOREIGN KEY (default_expense_account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE public.product_templates
  ADD CONSTRAINT product_templates_default_income_account_id_fkey FOREIGN KEY (default_income_account_id) REFERENCES public.accounts(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE public.product_templates
  ADD CONSTRAINT product_templates_pkey PRIMARY KEY (id);

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_templates TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_templates TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.product_templates TO service_role;

CREATE TRIGGER update_product_templates_updated_at
  BEFORE UPDATE ON public.product_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.products (
  id          uuid                     DEFAULT gen_random_uuid() NOT NULL,
  created_at  timestamp with time zone DEFAULT now() NOT NULL,
  updated_at  timestamp with time zone,
  name        text                     NOT NULL,
  code        text,
  barcode     text,
  cost_price  double precision         DEFAULT '0'::double precision NOT NULL,
  sale_price  double precision         DEFAULT '0'::double precision NOT NULL,
  is_sale     boolean                  DEFAULT false NOT NULL,
  is_purchase boolean                  DEFAULT false NOT NULL,
  template_id uuid
);

COMMENT ON TABLE public.products IS 'Products';

ALTER TABLE public.products
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.products
  ADD CONSTRAINT products_pkey PRIMARY KEY (id);

ALTER TABLE public.account_move_items
  ADD CONSTRAINT account_move_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE public.products
  ADD CONSTRAINT products_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.product_templates(id) ON UPDATE CASCADE ON DELETE CASCADE;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.products TO anon;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.products TO authenticated;

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON public.products TO service_role;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();