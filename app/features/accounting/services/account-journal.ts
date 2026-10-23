import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type { FilterOptions } from "~/features/desk/types/filter";
import { parseMetadata, parseRange } from "~/utils/supabase";
import {
  accountJournalListSchema,
  accountJournalSchema,
} from "../schemas/account-journal";

export type AccountJournalValues = {
  name: string;
  defaultDebitAccountId: string | null;
  defaultCreditAccountId: string | null;
};

export async function getAccountJournals(
  supabase: SupabaseClient,
  options?: FilterOptions,
) {
  const { from, to } = parseRange({ from: options?.from, to: options?.to });

  const statement = supabase
    .from("account_journals")
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
  const accountJournals =
    await accountJournalListSchema.parseAsync(camelcasedData);

  return {
    accountJournals,
    metadata: parseMetadata({ count, range: { from, to } }),
  };
}

export async function getAccountJournalById(
  supabase: SupabaseClient,
  id: string,
) {
  const { data, error } = await supabase
    .from("account_journals")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const accountJournal = await accountJournalSchema.parseAsync(camelcasedData);

  return accountJournal;
}

export async function createAccountJournal(
  supabase: SupabaseClient,
  values: AccountJournalValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("account_journals")
    .insert(snakecasedValues)
    .select()
    .single();
  if (error) {
    throw error;
  }
  const camelcasedData = camelcaseKeys(data);
  const accountJournal = await accountJournalSchema.parseAsync(camelcasedData);

  return accountJournal;
}

export async function updateAccountJournal(
  supabase: SupabaseClient,
  id: string,
  values: AccountJournalValues,
) {
  const snakecasedValues = snakecaseKeys(values);
  const { error } = await supabase
    .from("account_journals")
    .update(snakecasedValues)
    .eq("id", id);
  if (error) {
    throw error;
  }

  return true;
}
