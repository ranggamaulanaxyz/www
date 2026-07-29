import type { SupabaseClient } from "@supabase/supabase-js";
import { SettingSchema } from "./schemas";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

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
  let query = supabase
    .from("settings")
    .select("*", { count: "exact" })
    .order("key", { ascending: true });

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

  return {
    settings: (data ? camelcaseKeys(data) : []) as SettingSchema[],
    count: count ?? 0,
    error,
  };
}

export async function findSettingById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", id)
    .single();

  if (!data || error) {
    return { data, error };
  }

  const setting = await SettingSchema.parseAsync(camelcaseKeys(data));

  return { data: setting, error };
}

export async function updateSetting(
  supabase: SupabaseClient,
  id: string,
  payload: Partial<SettingSchema>,
) {
  const { data, error } = await supabase
    .from("settings")
    .update(snakecaseKeys(payload))
    .eq("id", id)
    .select()
    .single();

  if (!data || error) {
    return { data, error };
  }

  const setting = await SettingSchema.parseAsync(camelcaseKeys(data));

  return { data: setting, error };
}

export async function createSetting(
  supabase: SupabaseClient,
  payload: Omit<SettingSchema, "id" | "createdAt" | "updatedAt">,
) {
  const { data, error } = await supabase
    .from("settings")
    .insert(snakecaseKeys(payload))
    .select()
    .single();

  if (!data || error) {
    return { data, error };
  }

  const setting = await SettingSchema.parseAsync(camelcaseKeys(data));

  return { data: setting, error };
}

export async function deleteSetting(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("settings").delete().eq("id", id);

  return {
    error,
  };
}

