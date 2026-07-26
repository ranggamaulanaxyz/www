import snakeCaseKeys from "snakecase-keys";
import camelCaseKeys from "camelcase-keys";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PostSchema } from "./schemas";
import type { PostFilterOptions } from "./types";

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
  const { data, error } = await supabase
    .from("posts")
    .update(snakeCaseKeys(post, { deep: false }))
    .eq("id", id)
    .select()
    .single();

  return {
    post: data
      ? await PostSchema.parseAsync(camelCaseKeys(data, { deep: true }))
      : null,
    error: error,
  };
}

export async function findPosts(
  supabase: SupabaseClient,
  options?: PostFilterOptions,
) {
  let query = supabase.from("posts").select("*", { count: "exact" });

  if (options?.query) {
    const q = options.query;
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  }

  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  return {
    posts: data
      ? await Promise.all(
          data.map((item) =>
            PostSchema.parseAsync(camelCaseKeys(item, { deep: true })),
          ),
        )
      : [],
    count,
    error: error,
  };
}

export async function deletePost(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  return {
    error: error,
  };
}
