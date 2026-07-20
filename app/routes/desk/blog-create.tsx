import EditorComposer from "~/components/editor/composer";
import { useIsMounted } from "~/hooks/use-mounted";
import Loading from "~/components/ui/loading";
import { BlogExtension } from "~/modules/blog/editor/extensions/editor";
import { Editor } from "~/modules/blog/components/editor";
import type { Route } from "./+types/blog-create";
import { PostSchema } from "~/modules/blog/schemas";
import { sleep, validate } from "~/lib/utils";
import { createPost } from "~/modules/blog/services";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { redirect } from "react-router";

export async function clientAction({
  request,
  context,
}: Route.ClientActionArgs) {
  const data = await request.json();
  const validation = await validate(PostSchema, data);
  if (!validation.success) {
    return { success: false, errors: { fieldErrors: validation.errors } };
  }

  const supabase = context.get(SupabaseClientContext);

  const post = await createPost(supabase, validation.data);
  if (!post) {
    return {
      success: false,
      errors: { formErrors: [{ message: "Unable to save the post" }] },
    };
  }
  return redirect(`/desk/blog/${post.id}`);
}

export default function BlogCreate({ actionData }: Route.ComponentProps) {
  const isMounted = useIsMounted();

  return (
    <Loading loaded={isMounted}>
      <EditorComposer extension={BlogExtension}>
        <Editor />
      </EditorComposer>
    </Loading>
  );
}
