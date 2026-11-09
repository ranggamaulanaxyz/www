import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import { productListSchema, productSchema } from "../schemas/product";
import type { CreateProductValues } from "../types/product";
import snakecaseKeys from "snakecase-keys";

export async function getProducts(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase.from("products").select("*", { count: "exact" });
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
  const products = await productListSchema.parseAsync(camelcasedData);
  return {
    products,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getProductById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const product = await productSchema.parseAsync(camelcasedData);
  return product;
}

export async function createProduct(
  supabase: SupabaseClient,
  values: CreateProductValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("products")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const product = await productSchema.parseAsync(camelcasedData);

  return product;
}

export async function updateProduct(
  supabase: SupabaseClient,
  id: string,
  values: CreateProductValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { error } = await supabase
    .from("products")
    .update(snakecasedValues)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
