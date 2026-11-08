import { useCallback, useEffect, useState } from "react";
import {
  useComboboxField,
  type FieldComboboxItem,
} from "~/components/form/fields/combobox";
import { useSupabase } from "~/contexts/supabase";
import { getAccountJournals } from "../services/account-journal";
import { useInputControl, type FieldMetadata } from "@conform-to/react";
import { getAccounts } from "../services/account";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useAccountField(field: FieldMetadata) {
  return useComboboxField({
    field,
    fetch: async (
      supabase: SupabaseClient,
      query?: string,
      selectedId?: string,
    ) => {
      const { accounts, metadata } = await getAccounts(supabase, {
        query,
        from: 1,
        to: 3,
        excludeIds: [selectedId],
      });
      const data = accounts.map((account) => ({
        label: account.name,
        value: account.id,
      })) satisfies FieldComboboxItem[];
      return { data, metadata };
    },
  });
}
