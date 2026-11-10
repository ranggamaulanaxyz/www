import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import {
  telegramBotJobSchema,
  type TelegramUpdate,
} from "../schemas/update.schemas";

export async function upsertJob(
  supabase: SupabaseClient,
  values: {
    updateId: number;
    updateData: TelegramUpdate;
  },
) {
  const snakecasedValues = snakecaseKeys(values);
  const { data, error } = await supabase
    .from("telegram_bot_jobs")
    .upsert(snakecasedValues, { onConflict: "update_id" })
    .select()
    .single();

  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data);
  const job = telegramBotJobSchema.parse(camelcasedData);
  return job;
}
