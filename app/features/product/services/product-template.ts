import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  productTemplateSchema,
  productTemplateWithRelationsListSchema,
} from "../schemas/product-template";
import type { CreateProductTemplateValues } from "../types/product-template";

const relationsSelect =
  "*, category:product_categories(name), brand:product_brands(name), default_income_account:accounts!product_templates_default_income_account_id_fkey(name), default_expense_account:accounts!product_templates_default_expense_account_id_fkey(name)";

export async function getProductTemplates(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("product_templates")
    .select(relationsSelect, { count: "exact" });
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
  const productTemplates =
    await productTemplateWithRelationsListSchema.parseAsync(camelcasedData);

  return {
    productTemplates,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getProductTemplateById(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("product_templates")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const productTemplate =
    await productTemplateSchema.parseAsync(camelcasedData);

  return productTemplate;
}

export async function createProductTemplate(
  supabase: SupabaseClient,
  values: CreateProductTemplateValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("product_templates")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const productTemplate =
    await productTemplateSchema.parseAsync(camelcasedData);

  return productTemplate;
}

export async function updateProductTemplate(
  supabase: SupabaseClient,
  id: string,
  values: CreateProductTemplateValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { error } = await supabase
    .from("product_templates")
    .update(snakecasedValues)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
