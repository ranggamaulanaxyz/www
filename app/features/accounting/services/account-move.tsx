import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import { accountMoveListSchema } from "../schemas/account-move";

export async function getAccountMoves(supabase: SupabaseClient) {
  const statement = supabase
    .from("account_moves")
    .select("*", { count: "exact" });

  const { data, count, error } = await statement;
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data);
  const accountMoves = await accountMoveListSchema.parseAsync(camelcasedData);
  return accountMoves;
}
