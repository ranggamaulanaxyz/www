import type { RouterContextProvider } from "react-router";
import { createAdminClient, createClient } from "./utils/supabase.server";
import { supabaseAdminClientContext, supabaseClientContext } from "./context";

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
  context.set(supabaseClientContext, supabase);

  const supabaseAdmin = createAdminClient();
  context.set(supabaseAdminClientContext, supabaseAdmin);

  const response = await next();

  headers.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
}
