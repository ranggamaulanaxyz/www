import DeskHeader from "~/components/desk/header";
import Loading from "~/components/ui/loading";
import { useIsMounted } from "~/hooks/use-mounted";
import BlogListView from "~/modules/blog/components/desk/list";
import type { Route } from "./+types/blog-list";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { deletePost, findAll } from "~/modules/blog/services";
import { useCallback } from "react";
import { useFetcher } from "react-router";

export async function clientAction({
  context,
  request,
}: Route.ClientActionArgs) {
  switch (request.method) {
    case "DELETE":
      const supabase = context.get(SupabaseClientContext);
      const formData = await request.formData();
      const id = formData.get("id") as string;
      const { success } = await deletePost(supabase, id);
      return { success, message: "Post deleted successfully!" };
  }
}

export async function clientLoader({ context }: Route.ClientActionArgs) {
  const supabase = context.get(SupabaseClientContext);
  const posts = await findAll(supabase);

  return { posts };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <Loading />;
}

export default function BlogList({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const isMounted = useIsMounted();

  return (
    <Loading loaded={isMounted}>
      <DeskHeader></DeskHeader>
      <BlogListView posts={posts} />
    </Loading>
  );
}
