import type { DataStrategyResult, RouterContextProvider } from "react-router";
import { supabaseClientContext } from "./context";
import { getClient } from "./utils/supabase.browser";

export async function supabaseClientMiddleware(
  {
    context,
  }: {
    context: Readonly<RouterContextProvider>;
  },
  next: () => Promise<Record<string, DataStrategyResult>>,
) {
  context.set(supabaseClientContext, getClient());
  return next();
}
