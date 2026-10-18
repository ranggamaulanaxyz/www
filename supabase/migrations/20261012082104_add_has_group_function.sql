set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.has_group (
  p_name text
)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $function$BEGIN
    RETURN EXISTS (
        WITH RECURSIVE user_groups_tree AS (
            -- Group yang dimiliki langsung oleh user login
            SELECT
                ug.id,
                ug.inherit_id,
                ug.name
            FROM public.user_group_relations AS ugr
            JOIN public.user_groups AS ug
                ON ug.id = ugr.group_id
            WHERE ugr.user_id = (SELECT auth.uid())

            UNION

            -- Telusuri seluruh inherited group
            SELECT
                parent.id,
                parent.inherit_id,
                parent.name
            FROM public.user_groups AS parent
            JOIN user_groups_tree AS child
                ON child.inherit_id = parent.id
        )
        SELECT 1
        FROM user_groups_tree
        WHERE name = p_name
    );
END;$function$;

GRANT ALL ON FUNCTION public.has_group(text) TO authenticated;
