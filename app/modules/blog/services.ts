import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { PostSchema } from "./schemas";
import * as postRepository from "./repositories";
import {
  PostAlreadyExists,
  PostNotFound,
  PostPermissionDenied,
} from "./exceptions";
import type { PostFilterOptions } from "./types";

function handlePostError(error: PostgrestError) {
  switch (error.code) {
    case "42501":
      throw new PostPermissionDenied();
    case "23505":
      throw new PostAlreadyExists();
    case "PGRST116":
    case "22P02":
      throw new PostNotFound();
    default:
      throw error;
  }
}

export async function createPost(supabase: SupabaseClient, data: PostSchema) {
  const { post, error } = await postRepository.createPost(supabase, data);
  if (error) {
    handlePostError(error);
  }
  return post;
}

export async function findById(supabase: SupabaseClient, id: string) {
  const { post, error } = await postRepository.findById(supabase, id);
  if (error) {
    handlePostError(error);
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
    handlePostError(error);
  }
  return post;
}

export async function findPosts(
  supabase: SupabaseClient,
  options?: PostFilterOptions,
) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 10;

  const { posts, count, error } = await postRepository.findPosts(
    supabase,
    options,
  );
  if (error) {
    handlePostError(error);
  }

  const total = count ?? 0;

  return {
    posts,
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

export async function deletePost(supabase: SupabaseClient, id: string) {
  const { error } = await postRepository.deletePost(supabase, id);
  if (error) {
    handlePostError(error);
  }

  return { success: true };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
