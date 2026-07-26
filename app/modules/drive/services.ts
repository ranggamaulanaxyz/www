import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import * as driveRepository from "./repositories";
import {
  DriveItemNotFound,
  DriveItemPermissionDenied,
  DriveNotFound,
  DrivePermissionDenied,
  R2BucketNotBound,
  R2ObjectNotFound,
} from "./exceptions";
import type { DriveItemSchema, DriveSchema } from "./schemas";
import { setDateTimeZone } from "~/lib/utils";
import type { AppError } from "~/exceptions";

function handleDriveError(error: PostgrestError) {
  switch (error.code) {
    case "42501":
      throw new DrivePermissionDenied();
    case "22P02":
      throw new DriveNotFound();
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

function handleDriveItemError(error: PostgrestError) {
  switch (error.code) {
    case "42501":
      throw new DriveItemPermissionDenied();
    case "22P02":
      throw new DriveItemNotFound();
    default:
      throw error;
  }
}

export async function createItem(
  supabase: SupabaseClient,
  payload: DriveItemSchema,
) {
  const { data, error } = await driveRepository.createItem(supabase, payload);
  if (error) {
    handleDriveItemError(error);
  }
  return data;
}

export async function findItemById(supabase: SupabaseClient, id: string) {
  const { data, error } = await driveRepository.findItemById(supabase, id);
  if (error) {
    handleDriveItemError(error);
  }
  return data;
}

export async function getItemObjectById(
  supabase: SupabaseClient,
  id: string,
  bucket: R2Bucket | undefined,
): Promise<R2ObjectBody> {
  if (!bucket) {
    throw new R2BucketNotBound();
  }

  const data = await findItemById(supabase, id);
  if (!data?.id) {
    throw new DriveItemNotFound();
  }

  const object = await bucket.get(data.id);
  if (!object) {
    throw new R2ObjectNotFound();
  }
  return object;
}
