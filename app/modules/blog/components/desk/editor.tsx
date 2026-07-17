import { EditorContent } from "~/components/editor/composer";
import { useExtensionComponent } from "@lexical/react/useExtensionComponent";
import { ToolbarExtension } from "~/components/editor/extensions/toolbar";
import CoverUploader from "./cover-uploader";

export default function BlogEditor() {
  const Toolbar = useExtensionComponent(ToolbarExtension);
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
        <div>
          <div className="sticky top-17">
            <CoverUploader />
          </div>
        </div>
        <div className="col-span-2">
          <div className="mx-auto max-w-2xl p-4">
            <div className="typeset typeset-docs mb-4">
              <h1
                className="before:text-muted-foreground/50 outline-none empty:before:content-[attr(data-placeholder)]"
                contentEditable="plaintext-only"
                suppressContentEditableWarning={true}
                data-placeholder="Title"
                onInput={(e) => {
                  if (e.currentTarget.textContent === "") {
                    e.currentTarget.innerHTML = "";
                  }
                }}
              ></h1>
            </div>
            <EditorContent
              className="typeset typeset-docs"
              placeholder="Write your article here..."
            />
          </div>
        </div>
        <div className="">
          <div className="sticky top-17">
            <Toolbar />
          </div>
        </div>
      </div>
    </div>
  );
}
