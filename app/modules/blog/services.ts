import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostSchema } from "./schemas";
import * as postRepository from "./repositories";

export async function createPost(supabase: SupabaseClient, data: PostSchema) {
  const { post, error } = await postRepository.createPost(supabase, data);
  if (error) {
    switch (error.code) {
      case "42501":
        throw Response.json({ message: "Unauthorized" }, { status: 403 });
      case "23505":
        throw Response.json(
          { message: "Data already exists" },
          { status: 409 },
        );
      default:
        throw error;
    }
  }
  return post;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
