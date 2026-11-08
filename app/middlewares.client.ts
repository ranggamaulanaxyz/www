import type { DataStrategyResult, RouterContextProvider } from "react-router";
import { supabaseClientContext } from "./context";
import { createClient } from "./utils/supabase.client";

export async function supabaseClientMiddleware(
  {
    context,
  }: {
    context: Readonly<RouterContextProvider>;
  },
  next: () => Promise<Record<string, DataStrategyResult>>,
) {
  context.set(supabaseClientContext, createClient());
  return next();
}
