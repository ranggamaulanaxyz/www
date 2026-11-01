import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  productBrandListSchema,
  productBrandSchema,
} from "../schemas/product-brand";

export async function getProductBrands(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("product_brands")
    .select("*", { count: "exact" });
  if (options?.query) {
    statement.ilike("name", `%${options.query}%`);
  }
  statement.order("name", { ascending: true });
  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data, { deep: true });
  const productBrands = await productBrandListSchema.parseAsync(camelcasedData);

  return {
    productBrands,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getProductBrandById(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("product_brands")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const productBrand = await productBrandSchema.parseAsync(camelcasedData);

  return productBrand;
}

export async function createProductBrand(
  supabase: SupabaseClient,
  values: { name: string },
) {
  const { data, error } = await supabase
    .from("product_brands")
    .insert(values)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const productBrand = await productBrandSchema.parseAsync(camelcasedData);

  return productBrand;
}

export async function updateProductBrand(
  supabase: SupabaseClient,
  id: string,
  values: { name: string },
) {
  const { error } = await supabase
    .from("product_brands")
    .update(values)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
