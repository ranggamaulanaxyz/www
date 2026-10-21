import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import { accountSubtypeListSchema } from "../schemas/account-subtype";

export async function getAccountSubtypes(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("account_subtypes")
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
  const accountSubtypes =
    await accountSubtypeListSchema.parseAsync(camelcasedData);
  return {
    accountSubtypes,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}
