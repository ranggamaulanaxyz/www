CREATE OR REPLACE FUNCTION public.post_account_move(p_id UUID)
    RETURNS JSONB
    LANGUAGE plpgsql
    SET search_path = ''
    AS $function$DECLARE
        v_status public.account_move_status;
BEGIN
    SELECT status
    INTO v_status
    FROM public.account_moves
    WHERE id = p_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Entri jurnal tidak ditemukan',
            'id', p_id
        );
    END IF;

    IF v_status = 'posted' THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Entri jurnal sudah dibukukan',
            'id', p_id
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.account_move_items
        WHERE move_id = p_id
    ) THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Entri jurnal harus memiliki minimal satu baris',
            'id', p_id
        );
    END IF;

    UPDATE public.account_moves
    SET status = 'posted'
    WHERE id = p_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Entri jurnal dibukukan',
        'id', p_id
    );
END;$function$;

GRANT EXECUTE ON FUNCTION "public"."post_account_move"(uuid) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."post_account_move"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."post_account_move"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."post_account_move"(uuid) TO "service_role";
