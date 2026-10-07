import { env } from "cloudflare:workers";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export function createClient(request: Request) {
  const headers = new Headers();

  const supabaseUrl = env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL ?? "";
  const supabaseKey =
    env.SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.SUPABASE_PUBLISHABLE_KEY ??
    "";

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Your project's URL and Key are required to create a Supabase client. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in wrangler.jsonc or your local env.",
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
