import type { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  root: "typeset typeset-docs",
  code: "block font-mono text-sm bg-muted border border-border p-4 rounded-lg overflow-x-auto whitespace-pre my-4",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
  },
};

export default theme;
