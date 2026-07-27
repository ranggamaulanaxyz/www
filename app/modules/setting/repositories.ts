import type { SupabaseClient } from "@supabase/supabase-js";
import type { SettingSchema } from "./schemas";

export interface SettingFilterOptions {
  query?: string;
  page?: number;
  pageSize?: number;
}

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

export async function findSettings(
  supabase: SupabaseClient,
  options?: SettingFilterOptions,
) {
  let query = supabase.from("settings").select("*", { count: "exact" });

  if (options?.query) {
    const q = options.query;
    query = query.or(`key.ilike.%${q}%,value.ilike.%${q}%`);
  }

  if (options?.page && options?.pageSize) {
    const from = (options.page - 1) * options.pageSize;
    const to = from + options.pageSize - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;
  if (error) {
    throw error;
  }

  return {
    settings: (data || []) as {
      key: string;
      value: string;
    }[],
    count: count ?? 0,
  };
}

export async function findSettingById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data as {
    id: string;
    key: string;
    value: string;
  };
}

export async function updateSetting(
  supabase: SupabaseClient,
  id: string,
  setting: Partial<SettingSchema>,
) {
  const { data, error } = await supabase
    .from("settings")
    .update(setting)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as {
    id: string;
    key: string;
    value: string;
  };
}

export const update = updateSetting;
