import { createBrowserClient } from "@supabase/ssr";
import { type Database } from "~/types/supabase.types";

export function createClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
