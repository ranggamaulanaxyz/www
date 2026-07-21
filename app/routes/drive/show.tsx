import { CloudflareContext } from "../../../workers/app";
import type { Route } from "./+types/show";

export async function loader({ params, context }: Route.LoaderArgs) {
  const cloudflare = context.get(CloudflareContext);
  const env =
    cloudflare?.env || (context as any).cloudflare?.env || (context as any).env;
  const bucket = env?.PUBLIC_BUCKET;

  const key = params["*"];

  if (!bucket || !key) {
    return new Response("Not Found", { status: 404 });
  }

  const object = await bucket.get(key);

  if (!object) {
    return new Response("File Not Found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000");

  return new Response(object.body, {
    headers,
  });
}
