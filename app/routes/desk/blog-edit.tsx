import EditorComposer from "~/components/editor/composer";
import { useIsMounted } from "~/hooks/use-mounted";
import Loading from "~/components/ui/loading";
import { BlogExtension } from "~/modules/blog/editor/extensions/editor";
import { Editor } from "~/modules/blog/components/editor";
import type { Route } from "./+types/blog-edit";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findById, updatePost } from "~/modules/blog/services";
import { data } from "react-router";
import { PostSchema } from "~/modules/blog/schemas";
import { validate } from "~/lib/utils";

export async function clientAction({
  request,
  context,
  params,
}: Route.ClientActionArgs) {
  if (!params.id) {
    throw data({ message: "Post id is empty" }, { status: 404 });
  }

  const dataPayload = await request.json();
  const validation = await validate(PostSchema, dataPayload);
  if (!validation.success) {
    return { success: false, errors: { fieldErrors: validation.errors } };
  }

  const supabase = context.get(SupabaseClientContext);

  const post = await updatePost(supabase, params.id, validation.data);
  if (!post) {
    return {
      success: false,
      errors: { formErrors: [{ message: "Unable to save the post" }] },
    };
  }
  return { success: true, post };
}

export async function clientLoader({
  context,
  params,
}: Route.ClientActionArgs) {
  if (!params.id) {
    throw data({ message: "Post id is empty" }, { status: 404 });
  }
  const supabase = context.get(SupabaseClientContext);
  const post = await findById(supabase, params.id);

  if (!post) {
    throw data(
      { message: `Post with ${params.id} not found` },
      { status: 404 },
    );
  }

  return { post };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <Loading />;
}

export default function BlogEdit({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const isMounted = useIsMounted();

  return (
    <Loading loaded={isMounted}>
      <EditorComposer extension={BlogExtension}>
        <Editor initialPost={post} />
      </EditorComposer>
    </Loading>
  );
}
