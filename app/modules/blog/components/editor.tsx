import {
  LexicalComposer,
  type InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import { toast } from "sonner";

const theme = {};

function onError(error: Error) {
  console.error(error);
  toast.error(error.message);
}

interface BlogEditorProps {
  placeholder?: string;
}

export default function BlogEditor({
  placeholder = "Enter some text",
}: BlogEditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "BlogEditor",
    theme: theme,
    onError: onError,
  };

  const placeHolder = () => {
    return (
      <p className="text-muted-foreground pointer-events-none absolute top-0 left-0 z-10 select-none">
        {placeholder}
      </p>
    );
  };

  const contentEditable = () => {
    return (
      <ContentEditable
        className="outline-none"
        aria-placeholder={placeholder}
        placeholder={placeHolder()}
      />
    );
  };

  return (
    <div className="relative overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={contentEditable()}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    </div>
  );
}
