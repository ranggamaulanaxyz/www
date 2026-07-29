import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { SettingSchema } from "./schemas";
import * as settingRepository from "./repositories";
import {
  SettingAlreadyExists,
  SettingNotFound,
  SettingPermissionDenied,
} from "./exceptions";
import type { SettingMeta } from "./types";

function handleSettingError(error: PostgrestError) {
  switch (error.code) {
    case "42501":
      throw new SettingPermissionDenied();
    case "23505":
      throw new SettingAlreadyExists();
    case "PGRST116":
    case "22P02":
      throw new SettingNotFound();
    default:
      throw error;
  }
}

export async function loadSettingsByKeys(
  supabase: SupabaseClient,
  keys: string[],
) {
  try {
    const settings = await settingRepository.getSettingsByKeys(supabase, keys);
    const settingObject = settings.reduce<Record<string, string>>(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {},
    );

    return settingObject;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      handleSettingError(error as PostgrestError);
    }
    throw error;
  }
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
): Promise<{ settings: SettingSchema[]; meta: SettingMeta }> {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;

  const { settings, count, error } = await settingRepository.findSettings(
    supabase,
    options,
  );
  if (error) {
    handleSettingError(error);
  }

  const total = count ?? 0;

  return {
    settings,
    meta: {
      page,
      pageSize,
      total: total,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrevious: page > 1,
    },
  };
}

export async function findSettingById(supabase: SupabaseClient, id: string) {
  const { data, error } = await settingRepository.findSettingById(supabase, id);
  if (error) {
    handleSettingError(error);
  }
  return data;
}

export async function updateSetting(
  supabase: SupabaseClient,
  id: string,
  setting: Partial<SettingSchema>,
) {
  const { data, error } = await settingRepository.updateSetting(
    supabase,
    id,
    setting,
  );
  if (error) {
    handleSettingError(error);
  }
  return data;
}

export async function createSetting(
  supabase: SupabaseClient,
  setting: Omit<SettingSchema, "id" | "createdAt" | "updatedAt">,
) {
  const { data, error } = await settingRepository.createSetting(
    supabase,
    setting,
  );
  if (error) {
    handleSettingError(error);
  }
  return data;
}

export async function deleteSetting(supabase: SupabaseClient, id: string) {
  const { error } = await settingRepository.deleteSetting(supabase, id);
  if (error) {
    handleSettingError(error);
  }

  return { success: true };
}

