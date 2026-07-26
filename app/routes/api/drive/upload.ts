import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { CloudflareContext } from "../../../../workers/app";
import type { Route } from "./+types/upload";
import { createItem } from "~/modules/drive/services";

export async function action({ request, context }: Route.ActionArgs) {
  const cloudflare = context.get(CloudflareContext);
  const bucket = cloudflare?.env.PUBLIC_BUCKET;
  if (!bucket) {
    return Response.json(
      { success: false, error: "R2 Bucket binding (PUBLIC_BUCKET) not found." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || typeof file === "string") {
    return Response.json(
      { success: false, error: "No file provided" },
      { status: 400 },
    );
  }

  const supabase = context.get(SupabaseClientContext);
  const driveItem = await createItem(supabase, {
    name: file.name,
    driveId: "8b12a006-ec4d-42df-882b-3d7c6bfda3bc",
  });

  if (!driveItem?.id) {
    return Response.json(
      { success: false, error: "Failed to create drive item" },
      { status: 500 },
    );
  }

  const objectKey = `${driveItem.id}`;
  const arrayBuffer = await file.arrayBuffer();

  await bucket.put(objectKey, arrayBuffer, {
    httpMetadata: {
      contentType: file.type || "image/jpeg",
    },
  });

  const publicUrl = cloudflare?.env?.PUBLIC_APP_URL
    ? `${cloudflare.env.PUBLIC_APP_URL}/drive/item/${driveItem.id}/${driveItem.name}`
    : `/drive/item/${driveItem.id}/${driveItem.name}`;

  return Response.json({
    success: true,
    key: objectKey,
    public_url: publicUrl,
  });
}
