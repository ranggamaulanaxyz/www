import { useCallback, useEffect, useState } from "react";
import {
  useComboboxField,
  type FieldComboboxItem,
} from "~/components/form/fields/combobox";
import type { FieldMetadata } from "@conform-to/react";
import { getPartners } from "../services/partner";
import type { SupabaseClient } from "@supabase/supabase-js";

export function usePartnerField(field: FieldMetadata) {
  return useComboboxField({
    field,
    fetch: async (
      supabase: SupabaseClient,
      query?: string,
      selectedId?: string,
    ) => {
      const { partners, metadata } = await getPartners(supabase, {
        query,
        from: 1,
        to: 3,
        excludeIds: [selectedId],
      });
      const data = partners.map((partner) => ({
        label: partner.name,
        value: partner.id,
      })) satisfies FieldComboboxItem[];
      return { data, metadata };
    },
  });
}
