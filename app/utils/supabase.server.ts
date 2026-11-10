import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { type Database } from "~/types/supabase.types";
import { getEnv } from "~/utils/env.server";

export function createClient(request: Request) {
  const headers = new Headers();

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Your project's URL and Key are required to create a Supabase client. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY in wrangler.jsonc or your local env.",
    );
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "") as {
          name: string;
          value: string;
        }[];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          headers.append(
            "Set-Cookie",
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });

  return { supabase, headers };
}

export function createAdminClient() {
  const supabaseUrl = getEnv("PUBLIC_SUPABASE_URL");
  const supabaseKey = getEnv("SUPABASE_SECRET_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Your project's URL and secret key are required to create a Supabase admin client. Set PUBLIC_SUPABASE_URL in wrangler.jsonc and SUPABASE_SECRET_KEY in .env (local) or with `wrangler secret put SUPABASE_SECRET_KEY`.",
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
