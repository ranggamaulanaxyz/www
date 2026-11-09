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
    .select("*, journal:account_journals (*), partner:partners (*)", {
      count: "exact",
    });

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
    .select(
      "*, journal:account_journals (*), partner:partners (*), items:account_move_items(*, product:products(id, name), account:accounts(id, name))",
    )
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

export async function createAccountMoveWithItems(
  supabase: SupabaseClient,
  values: any,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase.rpc("create_account_move", {
    p_values: snakecasedValues,
  });

  if (error) {
    throw error;
  }

  return data as { success: boolean; message: string; id: string };
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

export type AccountMovePostResult = {
  success: boolean;
  message: string;
  id: string;
};

/**
 * Posts an account move, moving it from `draft` to `posted`.
 *
 * The database function rejects moves without items so an empty journal can
 * never be posted.
 */
export async function postAccountMove(
  supabase: SupabaseClient,
  id: string,
): Promise<AccountMovePostResult> {
  const { data, error } = await supabase.rpc("post_account_move", {
    p_id: id,
  });

  if (error) {
    throw error;
  }

  return data as AccountMovePostResult;
}

export type AccountMoveItemInput = {
  /** Existing item id. `null`/absent means a new item. */
  id?: string | null;
  name: string;
  accountId: string;
  productId?: string | null;
  debit?: number | null;
  credit?: number | null;
};

export type AccountMoveWithItemsValues = AccountMoveFormValues & {
  items?: AccountMoveItemInput[];
};

export type AccountMoveWithItemsResult = {
  success: boolean;
  message: string;
  id: string;
};

/**
 * Updates an account move and its items atomically in a single round-trip.
 *
 * Only changed item rows are written: existing rows are matched by `id`,
 * new rows are inserted, and rows missing from `values.items` are deleted.
 * This avoids the delete-all/re-insert pattern and its extra write churn.
 */
export async function updateAccountMoveWithItems(
  supabase: SupabaseClient,
  id: string,
  values: AccountMoveWithItemsValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase.rpc("update_account_move", {
    p_id: id,
    p_values: snakecasedValues,
  });

  if (error) {
    throw error;
  }

  return data as AccountMoveWithItemsResult;
}
