import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  accountMoveItemSchema,
  accountMoveItemWithRelationsListSchema,
  accountMoveItemWithRelationsSchema,
} from "../schemas/account-move-item";
import type { AccountMoveItemFormValues } from "../types/account-move-item";

const relationsSelect =
  "*, move:account_moves(number, date), account:accounts(code, name), partner:partners(name)";

export async function getAccountMoveItems(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("account_move_items")
    .select(relationsSelect, { count: "exact" });

  if (options?.query) {
    statement.ilike("name", `%${options.query}%`);
  }

  statement.order("created_at", { ascending: false });
  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accountMoveItems =
    await accountMoveItemWithRelationsListSchema.parseAsync(camelcasedData);

  return {
    accountMoveItems,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getAccountMoveItemById(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("account_move_items")
    .select(relationsSelect)
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accountMoveItem =
    await accountMoveItemWithRelationsSchema.parseAsync(camelcasedData);

  return accountMoveItem;
}

export async function createAccountMoveItem(
  supabase: SupabaseClient,
  values: AccountMoveItemFormValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("account_move_items")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accountMoveItem =
    await accountMoveItemSchema.parseAsync(camelcasedData);

  return accountMoveItem;
}

export async function updateAccountMoveItem(
  supabase: SupabaseClient,
  id: string,
  values: AccountMoveItemFormValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { error } = await supabase
    .from("account_move_items")
    .update(snakecasedValues)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
