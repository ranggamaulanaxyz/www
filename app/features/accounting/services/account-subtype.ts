import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  accountSubtypeListSchema,
  accountSubtypeSchema,
} from "../schemas/account-subtype";
import type { AccountType } from "../types/account-subtype";

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

export async function getAccountSubtypeById(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("account_subtypes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcaedData = camelcaseKeys(data);
  const accountSubtype = await accountSubtypeSchema.parseAsync(camelcaedData);

  return accountSubtype;
}

export async function createAccountSubtype(
  supabase: SupabaseClient,
  values: { name: string; type: string },
) {
  const { data, error } = await supabase
    .from("account_subtypes")
    .insert(values)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const accountSubtype = await accountSubtypeSchema.parseAsync(camelcasedData);

  return accountSubtype;
}

export async function updateAccountSubtype(
  supabase: SupabaseClient,
  id: string,
  values: { name: string; type: AccountType },
) {
  const { error } = await supabase
    .from("account_subtypes")
    .update(values)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
