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
