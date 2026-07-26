import { findById, getItemObjectById } from "~/modules/drive/services";
import { CloudflareContext } from "../../../workers/app";
import type { Route } from "./+types/show";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";

export async function loader({ params, context }: Route.LoaderArgs) {
  const cloudflare = context.get(CloudflareContext);
  const bucket = cloudflare?.env.PUBLIC_BUCKET;

  const key = `${params.id}`;

  if (!bucket || !key) {
    return new Response("Not Found", { status: 404 });
  }

  const supabase = context.get(SupabaseClientContext);
  const object = await getItemObjectById(supabase, params.id, bucket);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000");

  return new Response(object.body, {
    headers,
  });
}
