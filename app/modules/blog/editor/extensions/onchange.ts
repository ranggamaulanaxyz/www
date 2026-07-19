// OnChangeExtension.ts
import {
  defineExtension,
  safeCast,
  type EditorState,
  type LexicalEditor,
} from "lexical";

export interface OnChangeConfig {
  onChange:
    | null
    | ((
        editorState: EditorState,
        editor: LexicalEditor,
        tags: Set<string>,
      ) => void);
  ignoreSelectionChange: boolean;
  ignoreHistoryMergeTagChange: boolean;
}

export const OnChangeExtension = defineExtension({
  name: "@desk/blog/editor/onchange",
  config: safeCast<OnChangeConfig>({
    onChange: null,
    ignoreSelectionChange: false,
    ignoreHistoryMergeTagChange: true,
  }),

  // Fase register: dijalankan setelah editor dibuat
  register: (editor, config) => {
    const { onChange, ignoreSelectionChange, ignoreHistoryMergeTagChange } =
      config;

    if (!onChange) {
      return () => {};
    }

    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, prevEditorState, tags }) => {
        if (
          ignoreSelectionChange &&
          dirtyElements.size === 0 &&
          dirtyLeaves.size === 0
        ) {
          return;
        }

        if (ignoreHistoryMergeTagChange && tags.has("history-merge")) {
          return;
        }

        if (prevEditorState.isEmpty()) {
          return;
        }

        onChange(editorState, editor, tags);
      },
    );
  },
});
