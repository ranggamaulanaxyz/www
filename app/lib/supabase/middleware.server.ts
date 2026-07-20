import type { RouterContextProvider } from "react-router";
import { createClient } from "./supabase.server";
import {
  SupabaseClientContext,
  SupabaseHeadersContext,
} from "./supabase.context";

export async function supabaseMiddleware(
  {
    request,
    context,
  }: {
    request: Request;
    context: Readonly<RouterContextProvider>;
  },
  next: () => Promise<Response>,
) {
  const { supabase, headers } = createClient(request);
  context.set(SupabaseClientContext, supabase);
  context.set(SupabaseHeadersContext, headers);

  const response = await next();

  headers.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
}
