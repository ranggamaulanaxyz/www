import { useSupabase } from "~/contexts/supabase";
import {
  useComboboxField,
  type FieldComboboxItem,
} from "~/components/form/fields/combobox";
import type { FieldMetadata } from "@conform-to/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAccountMoves, postAccountMove } from "../services/account-move";

export function useAccountMove() {
  const supabase = useSupabase();

  const post = async (id: string) => {
    const result = await postAccountMove(supabase, id);
    console.log(result);
  };

  return { post };
}

export function useAccountMoveField(field: FieldMetadata) {
  return useComboboxField({
    field,
    fetch: async (
      supabase: SupabaseClient,
      query?: string,
      selectedId?: string,
    ) => {
      const { accountMoves, metadata } = await getAccountMoves(supabase, {
        query,
        from: 1,
        to: 3,
        excludeIds: [selectedId],
      });
      const data = accountMoves.map((accountMove) => ({
        label: accountMove.number || accountMove.date,
        value: accountMove.id,
      })) satisfies FieldComboboxItem[];
      return { data, metadata };
    },
  });
}
