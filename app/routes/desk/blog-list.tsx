import DeskHeader from "~/components/desk/header";
import Loading from "~/components/ui/loading";
import { useIsMounted } from "~/hooks/use-mounted";
import BlogListView from "~/modules/blog/components/desk/list";
import type { Route } from "./+types/blog-list";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { deletePost, findPosts } from "~/modules/blog/services";

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

export async function clientLoader({ context, url }: Route.ClientActionArgs) {
  const searchParams = url.searchParams;
  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("page_size") || "10");

  const supabase = context.get(SupabaseClientContext);
  const { posts, meta } = await findPosts(supabase, {
    query: query || undefined,
    page: page,
    pageSize: pageSize,
  });

  return { posts, meta };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return <Loading />;
}

export default function BlogList({ loaderData }: Route.ComponentProps) {
  const { posts, meta } = loaderData;
  const isMounted = useIsMounted();

  return (
    <Loading loaded={isMounted}>
      <DeskHeader></DeskHeader>
      <BlogListView posts={posts} meta={meta} />
    </Loading>
  );
}
