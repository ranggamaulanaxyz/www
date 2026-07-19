import EditorComposer from "~/components/editor/composer";
import { useIsMounted } from "~/hooks/use-mounted";
import Loading from "~/components/ui/loading";
import { BlogExtension } from "~/modules/blog/editor/extensions/editor";
import { Editor } from "~/modules/blog/components/editor";

export default function BlogCreate() {
  const isMounted = useIsMounted();

  return (
    <Loading loaded={isMounted}>
      <EditorComposer extension={BlogExtension}>
        <Editor />
      </EditorComposer>
    </Loading>
  );
}
