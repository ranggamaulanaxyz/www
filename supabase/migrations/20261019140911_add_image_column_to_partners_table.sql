SET local check_function_bodies = off;

DROP POLICY "Enable update access for administrator" ON "public"."partners";

ALTER TABLE "public"."partners"
  ADD COLUMN "image" text;

CREATE OR REPLACE FUNCTION public.has_access (
  p_table  text,
  p_action text
)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $function$DECLARE
    v_user_id       uuid;
    v_table_oid     oid;
    v_rls_enabled   boolean;
    v_action        text;
    v_command       "char";
    v_has_grant     boolean;
    v_has_policy    boolean;
    v_authenticated oid;
BEGIN
    -- 1. Get the currently authenticated user
    v_user_id := auth.uid();

    IF v_user_id IS NULL THEN
        RETURN false;
    END IF;

    -- 2. Validate action
    v_action := lower(trim(p_action));

    IF v_action NOT IN (
        'select', 'insert', 'update', 'delete'
    ) THEN
        RETURN false;
    END IF;

    IF p_table IS NULL OR trim(p_table) = '' THEN
        RETURN false;
    END IF;

    -- 3. Resolve table name
    v_table_oid := to_regclass(p_table)::oid;

    IF v_table_oid IS NULL THEN
        RETURN false;
    END IF;

    -- Only allow ordinary and partitioned tables
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        WHERE c.oid = v_table_oid
          AND c.relkind IN ('r', 'p')
    ) THEN
        RETURN false;
    END IF;

    -- 4. Check GRANT for authenticated
    v_has_grant := has_table_privilege(
        'authenticated',
        v_table_oid,
        v_action
    );

    IF NOT v_has_grant THEN
        RETURN false;
    END IF;

    -- 5. Check whether RLS is enabled
    SELECT c.relrowsecurity
    INTO v_rls_enabled
    FROM pg_class c
    WHERE c.oid = v_table_oid;

    -- GRANT is sufficient if RLS is disabled
    IF NOT v_rls_enabled THEN
        RETURN true;
    END IF;

    -- 6. Map action to PostgreSQL policy command
    v_command := CASE v_action
        WHEN 'select' THEN 'r'
        WHEN 'insert' THEN 'a'
        WHEN 'update' THEN 'w'
        WHEN 'delete' THEN 'd'
    END;

    SELECT oid
    INTO v_authenticated
    FROM pg_roles
    WHERE rolname = 'authenticated';

    IF v_authenticated IS NULL THEN
        RETURN false;
    END IF;

    -- 7. Find a permissive policy for the action
    -- whose has_group() references a group held
    -- by the current user.
    SELECT EXISTS (
        SELECT 1
        FROM pg_policy pol
        CROSS JOIN LATERAL (
            SELECT CASE v_action
                WHEN 'select' THEN
                    coalesce(
                        pg_get_expr(
                            pol.polqual,
                            pol.polrelid
                        ),
                        ''
                    )
                WHEN 'insert' THEN
                    coalesce(
                        pg_get_expr(
                            pol.polwithcheck,
                            pol.polrelid
                        ),
                        ''
                    )
                WHEN 'update' THEN
                    coalesce(
                        pg_get_expr(
                            pol.polqual,
                            pol.polrelid
                        ),
                        ''
                    )
                    || ' ' ||
                    coalesce(
                        pg_get_expr(
                            pol.polwithcheck,
                            pol.polrelid
                        ),
                        ''
                    )
                WHEN 'delete' THEN
                    coalesce(
                        pg_get_expr(
                            pol.polqual,
                            pol.polrelid
                        ),
                        ''
                    )
            END AS expression
        ) expr
        CROSS JOIN LATERAL regexp_matches(
            expr.expression,
            'has_group\(''([^'']+)''',
            'gi'
        ) AS matches(group_match)
        WHERE pol.polrelid = v_table_oid
          AND pol.polcmd IN (v_command, '*')
          AND pol.polpermissive
          AND (
              pol.polroles @>
                  ARRAY[v_authenticated]::oid[]
              OR pol.polroles @>
                  ARRAY[0::oid]::oid[]
          )
          AND public.has_group(matches.group_match[1])
    )
    INTO v_has_policy;

    RETURN v_has_policy;
END;$function$;
