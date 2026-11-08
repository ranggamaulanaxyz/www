import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    __SUPABASE_CONFIG__?: {
      url: string;
      key: string;
    };
  }
}

let client: SupabaseClient | null = null;

export function createClient(supabaseUrl: string, supabaseKey: string) {
  // On the server each request should get its own client. In the browser we
  // keep a reference so client middleware can reuse the same instance.
  if (typeof document === "undefined") {
    return createBrowserClient(supabaseUrl, supabaseKey);
  }

  client ??= createBrowserClient(supabaseUrl, supabaseKey);

  return client;
}

export function getClient() {
  if (!client && typeof window !== "undefined" && window.__SUPABASE_CONFIG__) {
    const { url, key } = window.__SUPABASE_CONFIG__;
    client = createBrowserClient(url, key);
  }

  if (!client) {
    throw new Error(
      "Supabase client is not initialized. Make sure the root SupabaseProvider has rendered.",
    );
  }

  return client;
}
