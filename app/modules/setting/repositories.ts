import type { SupabaseClient } from "@supabase/supabase-js";

export async function getSettingsByKeys(
  supabase: SupabaseClient,
  keys: string[],
) {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .in("key", keys);
  if (error) {
    throw error;
  }
  return data as {
    key: string;
    value: string;
  }[];
}
