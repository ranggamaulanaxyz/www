import { blogExtension } from "~/components/editor/extensions";
import EditorComposer from "~/components/editor/composer";
import BlogEditor from "~/modules/blog/components/editor";

export default function BlogCreate() {
  return (
    <EditorComposer extension={blogExtension}>
      <BlogEditor />
    </EditorComposer>
  );
}
