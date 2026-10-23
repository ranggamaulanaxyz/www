import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  accountMoveListSchema,
  accountMoveSchema,
  type AccountMoveFormValues,
} from "../schemas/account-move";

export async function getAccountMoves(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("account_moves")
    .select("*", { count: "exact" });

  if (options?.query) {
    statement.ilike("number", `%${options.query}%`);
  }

  statement.order("date", { ascending: false });
  statement.order("created_at", { ascending: false });
  statement.range(from - 1, to - 1);

  const { data, count, error } = await statement;
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accountMoves = await accountMoveListSchema.parseAsync(camelcasedData);

  return {
    accountMoves,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getAccountMoveById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("account_moves")
    .select("*, items:account_move_items(*)")
    .eq("id", id)
    .order("created_at", {
      referencedTable: "account_move_items",
      ascending: true,
    })
    .single();
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accountMove = await accountMoveSchema.parseAsync(camelcasedData);

  return accountMove;
}

export async function createAccountMove(
  supabase: SupabaseClient,
  values: AccountMoveFormValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("account_moves")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const accountMove = await accountMoveSchema.parseAsync(camelcasedData);

  return accountMove;
}

export async function updateAccountMove(
  supabase: SupabaseClient,
  id: string,
  values: AccountMoveFormValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { error } = await supabase
    .from("account_moves")
    .update(snakecasedValues)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
