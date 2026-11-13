-- Rename the old general-journal wording to "Entri Jurnal".
-- The original migrations were also updated for fresh installs, but databases
-- that already applied them still carry the previous messages; this migration
-- refreshes the function definitions. Bodies are otherwise identical.

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
            v_move_id::UUID
        );
    END LOOP;
    RETURN jsonb_build_object('success', TRUE, 'message', 'Entri jurnal dibuat', 'id', v_move_id);
END;$function$;

GRANT EXECUTE ON FUNCTION "public"."create_account_move"(jsonb) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."create_account_move"(jsonb) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_account_move"(jsonb) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_account_move"(jsonb) TO "service_role";

CREATE OR REPLACE FUNCTION public.update_account_move(p_id UUID, p_values JSONB)
    RETURNS JSONB
    LANGUAGE plpgsql
    AS $function$DECLARE
        v_partner_id UUID;
        v_items JSONB;
BEGIN
    UPDATE public.account_moves
    SET number = CASE
            WHEN p_values ? 'number'
                THEN NULLIF(p_values->>'number', '')
            ELSE number
        END,
        date = COALESCE((p_values->>'date')::DATE, date),
        journal_id = COALESCE((p_values->>'journal_id')::UUID, journal_id),
        partner_id = COALESCE((p_values->>'partner_id')::UUID, partner_id),
        status = COALESCE((p_values->>'status')::public.account_move_status, status)
    WHERE id = p_id
    RETURNING partner_id INTO v_partner_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', FALSE,
            'message', 'Entri jurnal tidak ditemukan',
            'id', p_id
        );
    END IF;

    IF p_values ? 'items' THEN
        -- Treat empty ids as new rows so they never reach a UUID cast.
        v_items := COALESCE((
            SELECT jsonb_agg(
                CASE
                    WHEN COALESCE(item->>'id', '') = '' THEN item - 'id'
                    ELSE item
                END
            )
            FROM jsonb_array_elements(COALESCE(p_values->'items', '[]'::JSONB)) AS item
        ), '[]'::JSONB);

        -- Delete rows that are no longer present in the payload in one pass.
        DELETE FROM public.account_move_items AS item
        WHERE item.move_id = p_id
          AND NOT EXISTS (
              SELECT 1
              FROM jsonb_to_recordset(v_items) AS incoming(id UUID)
              WHERE incoming.id = item.id
          );

        -- Update only rows whose values actually changed.
        UPDATE public.account_move_items AS item
        SET name = incoming.name,
            product_id = incoming.product_id,
            partner_id = v_partner_id,
            account_id = incoming.account_id,
            debit = COALESCE(incoming.debit, 0),
            credit = COALESCE(incoming.credit, 0)
        FROM jsonb_to_recordset(v_items) AS incoming(
            id UUID,
            name TEXT,
            product_id UUID,
            account_id UUID,
            debit DOUBLE PRECISION,
            credit DOUBLE PRECISION
        )
        WHERE item.id = incoming.id
          AND item.move_id = p_id
          AND (
              item.name,
              item.product_id,
              item.partner_id,
              item.account_id,
              item.debit,
              item.credit
          ) IS DISTINCT FROM (
              incoming.name,
              incoming.product_id,
              v_partner_id,
              incoming.account_id,
              COALESCE(incoming.debit, 0),
              COALESCE(incoming.credit, 0)
          );

        -- Insert new rows in a single set-based statement.
        INSERT INTO public.account_move_items (
            name,
            product_id,
            partner_id,
            account_id,
            debit,
            credit,
            move_id
        )
        SELECT incoming.name,
               incoming.product_id,
               v_partner_id,
               incoming.account_id,
               COALESCE(incoming.debit, 0),
               COALESCE(incoming.credit, 0),
               p_id
        FROM jsonb_to_recordset(v_items) AS incoming(
            id UUID,
            name TEXT,
            product_id UUID,
            account_id UUID,
            debit DOUBLE PRECISION,
            credit DOUBLE PRECISION
        )
        -- Rows with a known id were already updated above. Ids that do not
        -- exist (or belong to another move) are treated as new rows.
        WHERE incoming.id IS NULL
           OR NOT EXISTS (
               SELECT 1
               FROM public.account_move_items AS item
               WHERE item.id = incoming.id
           );
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Entri jurnal diperbarui',
        'id', p_id
    );
END;$function$;

-- Speeds up the item diff (delete/update by move) and ordered item loading.
CREATE INDEX IF NOT EXISTS account_move_items_move_id_created_at_idx
    ON public.account_move_items (move_id, created_at);

GRANT EXECUTE ON FUNCTION "public"."update_account_move"(uuid, jsonb) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_account_move"(uuid, jsonb) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_account_move"(uuid, jsonb) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_account_move"(uuid, jsonb) TO "service_role";

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
