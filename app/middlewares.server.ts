import type { RouterContextProvider } from "react-router";
import { createClient } from "./utils/supabase.server";
import { supabaseClientContext } from "./context";

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

  const response = await next();

  headers.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
}
