import snakeCaseKeys from "snakecase-keys";
import camelCaseKeys from "camelcase-keys";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PostSchema } from "./schemas";

export async function createPost(supabase: SupabaseClient, post: PostSchema) {
  const { data, error } = await supabase
    .from("posts")
    .insert(snakeCaseKeys(post, { deep: true }))
    .select()
    .single();

  return {
    post: data
      ? PostSchema.parseAsync(camelCaseKeys(data, { deep: true }))
      : null,
    error: error,
  };
}

export async function findById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select()
    .eq("id", id)
    .single();

  return {
    post: data
      ? PostSchema.parseAsync(camelCaseKeys(data, { deep: true }))
      : null,
    error: error,
  };
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  post: Partial<PostSchema>,
) {
  console.log(snakeCaseKeys(post, { deep: false }));
  const { data, error } = await supabase
    .from("posts")
    .update(snakeCaseKeys(post, { deep: false }))
    .eq("id", id)
    .select()
    .single();

  return {
    post: data
      ? PostSchema.parseAsync(camelCaseKeys(data, { deep: true }))
      : null,
    error: error,
  };
}
