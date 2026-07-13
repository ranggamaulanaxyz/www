import { createBrowserClient } from "@supabase/ssr";

// Singleton instance agar tidak membuat client baru setiap kali di-import
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      import.meta.env.PUBLIC_SUPABASE_URL!,
      import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
  }
  return supabaseClient;
}
