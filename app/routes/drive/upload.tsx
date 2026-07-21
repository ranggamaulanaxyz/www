import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { CloudflareContext } from "../../../workers/app";
import type { Route } from "./+types/upload";

export async function action({ request, context }: Route.ActionArgs) {
  const cloudflare = context.get(CloudflareContext);
  // Support Vite Cloudflare plugin context fallback
  const env = cloudflare?.env || (context as any).cloudflare?.env || (context as any).env;
  const bucket = env?.PUBLIC_BUCKET;

  if (!bucket) {
    return Response.json(
      { success: false, error: "R2 Bucket binding (PUBLIC_BUCKET) not found." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const postId = formData.get("postId") as string | null;

    if (!file || typeof file === "string") {
      return Response.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const fileExtension = file.name?.split(".").pop() || "jpg";
    const objectKey = `covers/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();

    await bucket.put(objectKey, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || "image/jpeg",
      },
    });

    // Public URL atau R2 key path
    const publicUrl = env?.PUBLIC_APP_URL
      ? `${env.PUBLIC_APP_URL}/drive/${objectKey}`
      : objectKey;

    // Jika postId dikirim, simpan URL/Key ke database Supabase
    if (postId) {
      const supabase = context.get(SupabaseClientContext);
      if (supabase) {
        const { error: dbError } = await supabase
          .from("posts")
          .update({ cover_image_url: publicUrl })
          .eq("id", postId);

        if (dbError) {
          console.error("Supabase update error:", dbError);
          return Response.json(
            { success: false, error: "Failed to update cover_image_url in database" },
            { status: 500 }
          );
        }
      }
    }

    return Response.json({
      success: true,
      key: objectKey,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { success: false, error: "Failed to upload file to R2" },
      { status: 500 }
    );
  }
}



