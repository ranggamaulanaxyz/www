import { blogExtension } from "~/components/editor/extensions";
import EditorComposer from "~/components/editor/composer";
import BlogEditor from "~/modules/blog/components/desk/editor";
import { useIsMounted } from "~/hooks/use-mounted";
import Loading from "~/components/ui/loading";

export default function BlogCreate() {
  const isMounted = useIsMounted();

  return (
    <Loading loaded={isMounted}>
      <EditorComposer extension={blogExtension}>
        <BlogEditor />
      </EditorComposer>
    </Loading>
  );
}
