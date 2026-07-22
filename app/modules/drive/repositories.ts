import type { SupabaseClient } from "@supabase/supabase-js";
import type { DriveSchema } from "./schemas";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

export async function findAll(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("drives").select("*");
  return { data, error };
}

export async function findById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("drives")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  payload: DriveSchema,
) {
  const { data, error } = await supabase
    .from("drives")
    .update(snakecaseKeys(payload))
    .eq("id", id)
    .select()
    .single();

  return { data: camelcaseKeys(data) as DriveSchema, error };
}
