import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { updateSchema } from "../schemas/update.schemas";

export async function upsertUpdate(
  supabase: SupabaseClient,
  values: {
    updateId: number;
    messageId?: number;
    telegramUserId?: number;
    chatId?: number;
    messageDate?: string;
  },
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("telegram_updates")
    .upsert(snakecasedValues, { onConflict: "update_id" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data);
  const update = updateSchema.parse(camelcasedData);
  return update;
}
