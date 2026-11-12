import type { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { telegramBotJobSchema } from "../schemas/update.schemas";

export async function upsertJob(
  supabase: SupabaseClient,
  values: {
    updateId: number;
    updateData: any;
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

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const job = telegramBotJobSchema.parse(camelcasedData);
  return job;
}

export async function getTelegramJobById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("telegram_bot_jobs")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }

  const camelcasedData = camelcaseKeys(data, { deep: true });
  const job = telegramBotJobSchema.parse(camelcasedData);
  return job;
}
