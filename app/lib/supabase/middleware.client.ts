import type { RouterContextProvider } from "react-router";
import { SupabaseClientContext } from "./supabase.context";
import { getSupabaseBrowserClient } from "./supabase.client";

export async function supabaseClientMiddleware({
  request,
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const supabase = getSupabaseBrowserClient();
  context.set(SupabaseClientContext, supabase);
}
