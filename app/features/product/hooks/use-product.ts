import { useCallback, useEffect, useState } from "react";
import {
  useComboboxField,
  type FieldComboboxItem,
} from "~/components/form/fields/combobox";
import { useSupabase } from "~/contexts/supabase";
import type { FieldMetadata } from "@conform-to/react";
import { getProducts } from "../services/product";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useProductField(field: FieldMetadata) {
  return useComboboxField({
    field,
    fetch: async (
      supabase: SupabaseClient,
      query?: string,
      selectedId?: string,
    ) => {
      const { products, metadata } = await getProducts(supabase, {
        query,
        from: 1,
        to: 3,
        excludeIds: [selectedId],
      });
      const data = products.map((product) => ({
        label: product.name,
        value: product.id,
      })) satisfies FieldComboboxItem[];
      return { data, metadata };
    },
  });
}
