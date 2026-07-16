import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import type { AnyLexicalExtensionArgument } from "lexical";
import { cn } from "~/lib/utils";

export function EditorContent({
  className,
  placeholder = "Enter some text",
}: {
  className?: string;
  placeholder?: string;
}) {
  const placeholderElement = (
    <div
      className={cn(
        "text-muted-foreground pointer-events-none absolute top-0 left-0",
        className,
      )}
    >
      {placeholder}
    </div>
  );

  return (
    <div className="relative">
      <ContentEditable
        className={cn("outline-none", className)}
        aria-placeholder={placeholder}
        placeholder={placeholderElement}
      />
    </div>
  );
}

export default function EditorComposer({
  children,
  extension,
}: {
  children: React.ReactNode;
  extension: AnyLexicalExtensionArgument;
}) {
  return (
    <LexicalExtensionComposer extension={extension}>
      {children}
    </LexicalExtensionComposer>
  );
}
