import type { PostSchema } from "../../schemas";
import BlogItemView from "./item";

interface BlogListProps {
  posts: PostSchema[];
}

export default function BlogListView({ posts }: BlogListProps) {
  return (
    <div className="p-4">
      <BlogItemView posts={posts} />
    </div>
  );
}
