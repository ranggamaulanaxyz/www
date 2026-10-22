import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import { accountListSchema, accountSchema } from "../schemas/account";
import snakecaseKeys from "snakecase-keys";

export async function getAccounts(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase.from("accounts").select("*", { count: "exact" });
  if (options?.query) {
    statement.ilike("name", `%${options.query}%`);
  }
  statement.order("code", { ascending: true });
  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accounts = await accountListSchema.parseAsync(camelcasedData);

  return {
    accounts,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getAccountById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const account = await accountSchema.parseAsync(camelcasedData);

  return account;
}

export async function createAccount(
  supabase: SupabaseClient,
  values: { code: string; name: string; accountSubtypeId: string },
) {
  const snakecasedValues = snakecaseKeys(values)
  const { data, error } = await supabase
    .from("accounts")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const account = await accountSchema.parseAsync(camelcasedData);

  return account;
}

export async function updateAccount(
  supabase: SupabaseClient,
  id: string,
  values: { code: string; name: string; accountSubtypeId: string },
) {
  const { error } = await supabase.from("accounts").update(values).eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
