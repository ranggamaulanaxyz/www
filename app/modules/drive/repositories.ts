import type { SupabaseClient } from "@supabase/supabase-js";
import type { DriveItemSchema, DriveSchema } from "./schemas";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

export async function findAll(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("drives").select("*");
  return { data: data ? (camelcaseKeys(data) as DriveSchema[]) : [], error };
}

export async function findById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("drives")
    .select("*")
    .eq("id", id)
    .single();

  return { data: data ? (camelcaseKeys(data) as DriveSchema) : null, error };
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

  return { data: data ? (camelcaseKeys(data) as DriveSchema) : null, error };
}

export async function create(supabase: SupabaseClient, payload: DriveSchema) {
  const { data, error } = await supabase
    .from("drives")
    .insert(snakecaseKeys(payload))
    .select()
    .single();

  return { data: data ? (camelcaseKeys(data) as DriveSchema) : null, error };
}

export async function createItem(
  supabase: SupabaseClient,
  payload: DriveItemSchema,
) {
  const { data, error } = await supabase
    .from("drive_items")
    .insert(snakecaseKeys(payload))
    .select()
    .single();

  return {
    data: data ? (camelcaseKeys(data) as DriveItemSchema) : null,
    error,
  };
}
