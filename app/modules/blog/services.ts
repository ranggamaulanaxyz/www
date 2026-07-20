import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostSchema } from "./schemas";
import * as postRepository from "./repositories";
import snakecaseKeys from "snakecase-keys";

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

export async function findById(supabase: SupabaseClient, id: string) {
  const { post, error } = await postRepository.findById(supabase, id);
  if (error) {
    switch (error.code) {
      case "PGRST116": // Postgrest single row not found error code
        return null;
      default:
        throw error;
    }
  }
  return post;
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  data: Partial<PostSchema>,
) {
  const { post, error } = await postRepository.updatePost(supabase, id, data);
  if (error) {
    console.error("updatePost database error:", error);
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
