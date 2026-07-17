import type { SupabaseClient } from "@supabase/supabase-js";
import * as settingRepository from "./repositories";

export async function loadSettingsByKeys(
  supabase: SupabaseClient,
  keys: string[],
) {
  const settings = await settingRepository.getSettingsByKeys(supabase, keys);
  const settingObject = settings.reduce<Record<string, string>>(
    (acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    },
    {},
  );

  return settingObject;
}

export function getSettingByKey(
  settings: Record<string, string> | undefined | null,
  key: string,
) {
  if (!settings) {
    throw new Error("Settings record is not defined");
  }
  const value = settings[key];
  if (value === undefined) {
    throw new Error(`Setting key "${key}" not found`);
  }
  return value;
}
