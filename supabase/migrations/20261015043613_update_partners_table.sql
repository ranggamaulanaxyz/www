-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

ALTER TABLE public.partners
  DROP COLUMN first_name;

ALTER TABLE public.partners
  DROP COLUMN last_name;

ALTER TABLE public.partners
  DROP COLUMN middle_name;

ALTER TABLE public.partners
  ADD CONSTRAINT partners_user_id_key UNIQUE (user_id);

ALTER TABLE public.partners
  ADD COLUMN name text NOT NULL;

ALTER TABLE public.partners
  ADD COLUMN nickname text;