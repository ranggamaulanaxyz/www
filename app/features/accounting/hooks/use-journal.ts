import { useCallback, useEffect, useState } from "react";
import {
  useComboboxField,
  type FieldComboboxItem,
} from "~/components/form/fields/combobox";
import { useSupabase } from "~/contexts/supabase";
import { getAccountJournals } from "../services/account-journal";
import type { FieldMetadata } from "@conform-to/react";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useJournalField(field: FieldMetadata) {
  return useComboboxField({
    field,
    fetch: async (
      supabase: SupabaseClient,
      query?: string,
      selectedId?: string,
    ) => {
      const { accountJournals, metadata } = await getAccountJournals(supabase, {
        query,
        from: 1,
        to: 3,
        excludeIds: [selectedId],
      });
      const data = accountJournals.map((accountJournal) => ({
        label: accountJournal.name,
        value: accountJournal.id,
      })) satisfies FieldComboboxItem[];
      return { data, metadata };
    },
  });
}
