import type { SupabaseClient } from "@supabase/supabase-js";
import type { SettingSchema } from "./schemas";
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
  return settings?.[key];
}

export async function findSettings(
  supabase: SupabaseClient,
  options?: settingRepository.SettingFilterOptions,
) {
  return await settingRepository.findSettings(supabase, options);
}

export async function findSettingById(supabase: SupabaseClient, id: string) {
  return await settingRepository.findSettingById(supabase, id);
}

export async function updateSetting(
  supabase: SupabaseClient,
  id: string,
  setting: Partial<SettingSchema>,
) {
  return await settingRepository.updateSetting(supabase, id, setting);
}

export const update = updateSetting;
