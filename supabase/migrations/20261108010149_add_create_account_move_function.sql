CREATE OR REPLACE FUNCTION public.create_account_move(p_values jsonb)
    RETURNS JSONB
    LANGUAGE plpgsql
    AS $function$DECLARE
        v_move_id UUID;
        v_item JSONB;
BEGIN
    INSERT INTO public.account_moves (
        date,
        journal_id,
        partner_id
    )
    VALUES (
        (p_values->>'date')::DATE,
        (p_values->>'journal_id')::UUID,
        (p_values->>'partner_id')::UUID
    )
    RETURNING id INTO v_move_id;

    FOR v_item IN
        SELECT (jsonb_array_elements((p_values->'items')::JSONB))
    LOOP
        INSERT INTO public.account_move_items (
            name,
            product_id,
            partner_id,
            account_id,
            debit,
            credit,
            move_id
        )
        VALUES (
            (v_item->>'name')::TEXT,
            (v_item->>'product_id')::UUID,
            (p_values->>'partner_id')::UUID,
            (v_item->>'account_id')::UUID,
            (v_item->>'debit')::DOUBLE PRECISION,
            (v_item->>'credit')::DOUBLE PRECISION,
            (v_item->>'move_id')::UUID
        );
    END LOOP;
    RETURN jsonb_build_object('success', TRUE, 'message', 'Jurnal umum dibuat', 'id', v_move_id);
END;$function$;

GRANT EXECUTE ON FUNCTION "public"."create_account_move"(jsonb) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."create_account_move"(jsonb) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_account_move"(jsonb) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_account_move"(jsonb) TO "service_role";
