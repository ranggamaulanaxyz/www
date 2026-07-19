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
  return settings?.[key];
}
