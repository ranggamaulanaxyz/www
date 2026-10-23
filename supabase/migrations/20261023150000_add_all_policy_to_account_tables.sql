-- Grant the Administrator group full access to all account-related tables.

GRANT DELETE, INSERT, SELECT, UPDATE ON public.accounts TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.account_subtypes TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.account_journals TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.account_moves TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON public.account_move_items TO authenticated;

-- accounts
DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.accounts;
DROP POLICY IF EXISTS "Enable all access for administrator" ON public.accounts;

CREATE POLICY "Enable all access for Administrator" ON public.accounts
  TO authenticated
  USING (public.has_group('Administrator'::text));

-- account_subtypes
DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.account_subtypes;
DROP POLICY IF EXISTS "Enable all access for administrator" ON public.account_subtypes;

CREATE POLICY "Enable all access for Administrator" ON public.account_subtypes
  TO authenticated
  USING (public.has_group('Administrator'::text));

-- account_journals
DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.account_journals;
DROP POLICY IF EXISTS "Enable all access for administrator" ON public.account_journals;

CREATE POLICY "Enable all access for Administrator" ON public.account_journals
  TO authenticated
  USING (public.has_group('Administrator'::text));

-- account_moves
DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.account_moves;
DROP POLICY IF EXISTS "Enable all access for administrator" ON public.account_moves;

CREATE POLICY "Enable all access for Administrator" ON public.account_moves
  TO authenticated
  USING (public.has_group('Administrator'::text));

-- account_move_items
DROP POLICY IF EXISTS "Enable all access for Administrator" ON public.account_move_items;
DROP POLICY IF EXISTS "Enable all access for administrator" ON public.account_move_items;

CREATE POLICY "Enable all access for Administrator" ON public.account_move_items
  TO authenticated
  USING (public.has_group('Administrator'::text));
