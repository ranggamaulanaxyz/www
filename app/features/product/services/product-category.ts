import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  productCategoryListSchema,
  productCategorySchema,
} from "../schemas/product-category";

export type ProductCategoryValues = {
  name: string;
  parentId: string | null;
};

export async function getProductCategories(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("product_categories")
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
  const productCategories =
    await productCategoryListSchema.parseAsync(camelcasedData);

  return {
    productCategories,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getProductCategoryById(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const productCategory =
    await productCategorySchema.parseAsync(camelcasedData);

  return productCategory;
}

export async function createProductCategory(
  supabase: SupabaseClient,
  values: ProductCategoryValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("product_categories")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const productCategory =
    await productCategorySchema.parseAsync(camelcasedData);

  return productCategory;
}

export async function updateProductCategory(
  supabase: SupabaseClient,
  id: string,
  values: ProductCategoryValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { error } = await supabase
    .from("product_categories")
    .update(snakecasedValues)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
