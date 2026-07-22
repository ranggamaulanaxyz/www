import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import * as driveRepository from "./repositories";
import { DrivePermissionDenied } from "./exceptions";
import type { DriveSchema } from "./schemas";

function handleDriveError(error: PostgrestError) {
  switch (error.code) {
    case "42501":
      throw new DrivePermissionDenied();
    default:
      throw error;
  }
}

export async function findAll(supabase: SupabaseClient) {
  const { data, error } = await driveRepository.findAll(supabase);
  if (error) {
    handleDriveError(error);
  }
  return data;
}

export async function findById(supabase: SupabaseClient, id: string) {
  const { data, error } = await driveRepository.findById(supabase, id);
  if (error) {
    handleDriveError(error);
  }

  console.log(data);
  return data;
}

export async function update(
  supabase: SupabaseClient,
  id: string,
  payload: DriveSchema,
) {
  const { data, error } = await driveRepository.update(supabase, id, payload);
  if (error) {
    handleDriveError(error);
  }
  return data;
}

export async function create(supabase: SupabaseClient, payload: DriveSchema) {
  const { data, error } = await driveRepository.create(supabase, payload);
  if (error) {
    handleDriveError(error);
  }
  return data;
}
