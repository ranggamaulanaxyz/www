import type { RouterContextProvider } from "react-router";
import { createClient } from "./supabase.server";
import {
  supabaseClientContext,
  supabaseHeadersContext,
} from "./supabase.context";

export async function supabaseMiddleware({
  request,
  context,
}: {
  request: Request;
  context: Readonly<RouterContextProvider>;
}) {
  const { supabase, headers } = createClient(request);
  context.set(supabaseClientContext, supabase);
  context.set(supabaseHeadersContext, headers);
}
