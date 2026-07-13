import type { RouterContextProvider } from "react-router";
import { supabaseClientContext } from "./supabase.context";
import { getSupabaseBrowserClient } from "./supabase.client";

export async function supabaseClientMiddleware({
  request,
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const supabase = getSupabaseBrowserClient();
  context.set(supabaseClientContext, supabase);
}
