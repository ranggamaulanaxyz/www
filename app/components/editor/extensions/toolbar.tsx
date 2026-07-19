import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { defineExtension } from "lexical";
import { useCallback, useEffect, useState } from "react";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import type { TextFormatType, ElementFormatType, LexicalNode } from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  $createQuoteNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import type { HeadingTagType } from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code-core";
import { $createFigureNode, $isFigureNode } from "../nodes/figure";
import { $setBlocksType } from "@lexical/selection";

import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  UndoIcon,
  RedoIcon,
  SaveIcon,
  ShareIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeIcon,
  StrikethroughIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  CaseSensitive,
  HighlighterIcon,
  CaseUpperIcon,
  CaseLowerIcon,
  SuperscriptIcon,
  SubscriptIcon,
  Code2Icon,
  SquareCodeIcon,
} from "lucide-react";
import { Field, FieldGroup } from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function useToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isRangeSelection, setIsRangeSelection] = useState(false);
  const [textFormat, setTextFormat] = useState<Record<TextFormatType, boolean>>(
    {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      code: false,
      subscript: false,
      superscript: false,
      lowercase: false,
      uppercase: false,
      capitalize: false,
      highlight: false,
    },
  );
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [isInsideFigure, setIsInsideFigure] = useState(false);

  const isTextFormatActive = (type: TextFormatType) => textFormat[type];

  const toggleTextFormat = (type: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    editor.focus();
  };

  const alignElement = (type: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type);
    editor.focus();
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
    editor.focus();
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
    editor.focus();
  };

  const formatBlockType = (type: string) => {
    if (blockType !== type) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (type === "paragraph") {
            $setBlocksType(selection, () => $createParagraphNode());
          } else if (type === "quote") {
            $setBlocksType(selection, () => $createQuoteNode());
          } else if (type === "code") {
            $setBlocksType(selection, () => $createCodeNode());
          } else if (type === "figure") {
            $setBlocksType(selection, () => $createFigureNode());
          } else if (/^h[1-6]$/.test(type)) {
            $setBlocksType(selection, () =>
              $createHeadingNode(type as HeadingTagType),
            );
          }
        }
      });
    }
  };

  const insertCodeBlockInFigure = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        let figureNode: LexicalNode | null = null;
        let parent: LexicalNode | null = anchorNode;
        while (parent !== null && parent.getKey() !== "root") {
          if ($isFigureNode(parent)) {
            figureNode = parent;
            break;
          }
          parent = parent.getParent();
        }
        if (figureNode !== null && $isElementNode(figureNode)) {
          const codeNode = $createCodeNode();
          let child: LexicalNode | null = anchorNode;
          while (child !== null && child.getParent() !== figureNode) {
            child = child.getParent();
          }
          if (child !== null) {
            child.insertAfter(codeNode);
          } else {
            figureNode.append(codeNode);
          }
          codeNode.select();
        }
      }
    });
  };

  const [history, setHistory] = useState({
    canUndo: false,
    canRedo: false,
    undo: undo,
    redo: redo,
  });

  const toolbarCallback = useCallback(() => {
    const selection = $getSelection();
    setIsRangeSelection($isRangeSelection(selection));
    if ($isRangeSelection(selection)) {
      setTextFormat({
        bold: selection.hasFormat("bold"),
        italic: selection.hasFormat("italic"),
        underline: selection.hasFormat("underline"),
        strikethrough: selection.hasFormat("strikethrough"),
        code: selection.hasFormat("code"),
        subscript: selection.hasFormat("subscript"),
        superscript: selection.hasFormat("superscript"),
        lowercase: selection.hasFormat("lowercase"),
        uppercase: selection.hasFormat("uppercase"),
        capitalize: selection.hasFormat("capitalize"),
        highlight: selection.hasFormat("highlight"),
      });

      const anchorNode = selection.anchor.getNode();
      let parent: LexicalNode | null = anchorNode;
      let isCode = false;
      let insideFigure = false;
      while (parent !== null && parent.getKey() !== "root") {
        if ($isCodeNode(parent)) {
          isCode = true;
        }
        if ($isFigureNode(parent)) {
          insideFigure = true;
        }
        parent = parent.getParent();
      }
      setIsInsideFigure(insideFigure);

      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElement();
      if ($isElementNode(element)) {
        setElementFormat(element.getFormatType() || "left");

        if (isCode) {
          setBlockType("code");
        } else if ($isHeadingNode(element)) {
          setBlockType(element.getTag());
        } else if ($isQuoteNode(element)) {
          setBlockType("quote");
        } else if ($isCodeNode(element)) {
          setBlockType("code");
        } else if ($isFigureNode(element)) {
          setBlockType("figure");
        } else {
          setBlockType("paragraph");
        }
      }
    }
  }, []);

  useEffect(() => {
    editor.getEditorState().read(() => {
      toolbarCallback();
    });
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        toolbarCallback();
      });
    });
  }, [editor, toolbarCallback]);

  useEffect(() => {
    const unregisterSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        toolbarCallback();
        return false;
      },
      1,
    );
    return () => {
      unregisterSelection();
    };
  }, [editor, toolbarCallback]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        setHistory((prev) => ({ ...prev, canUndo: payload }));
        return false;
      },
      1,
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        setHistory((prev) => ({ ...prev, canRedo: payload }));
        return false;
      },
      1,
    );
  }, [editor]);

  return {
    editor,
    isRangeSelection,
    isTextFormatActive,
    toggleTextFormat,
    elementFormat,
    alignElement,
    history,
    blockType,
    formatBlockType,
    isInsideFigure,
    insertCodeBlockInFigure,
  };
}

export function ToolbarComponent() {
  const {
    editor,
    isRangeSelection,
    isTextFormatActive,
    toggleTextFormat,
    elementFormat,
    alignElement,
    history,
    blockType,
    formatBlockType,
    isInsideFigure,
    insertCodeBlockInFigure,
  } = useToolbar();
  return (
    <Card>
      <CardContent>
        <FieldGroup>
          <Field orientation="horizontal">
            <Button
              variant="outline"
              disabled={!history.canUndo}
              onClick={history.undo}
              title="Undo"
            >
              <UndoIcon />
            </Button>
            <Button
              variant="outline"
              disabled={!history.canRedo}
              onClick={history.redo}
              title="Redo"
            >
              <RedoIcon />
            </Button>
            <Button variant="outline">
              <SaveIcon />
            </Button>
            <Button variant="outline">
              <ShareIcon />
            </Button>
          </Field>
          <Field>
            <Select
              value={blockType}
              onValueChange={formatBlockType}
              disabled={!isRangeSelection}
            >
              <SelectTrigger className="w-37.5">
                <SelectValue placeholder="Paragraph" />
              </SelectTrigger>
              <SelectContent
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                  editor.focus();
                }}
              >
                <SelectGroup>
                  <SelectLabel>BLOCK</SelectLabel>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="quote">Quote</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="figure">Figure</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Heading</SelectLabel>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="h4">Heading 4</SelectItem>
                  <SelectItem value="h5">Heading 5</SelectItem>
                  <SelectItem value="h6">Heading 6</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal" className="flex-wrap">
            <Button
              variant={isTextFormatActive("bold") ? "default" : "outline"}
              onClick={() => toggleTextFormat("bold")}
              disabled={!isRangeSelection}
              title="Bold"
            >
              <BoldIcon />
            </Button>
            <Button
              variant={isTextFormatActive("italic") ? "default" : "outline"}
              onClick={() => toggleTextFormat("italic")}
              disabled={!isRangeSelection}
              title="Italic"
            >
              <ItalicIcon />
            </Button>
            <Button
              variant={isTextFormatActive("underline") ? "default" : "outline"}
              onClick={() => toggleTextFormat("underline")}
              disabled={!isRangeSelection}
              title="Underline"
            >
              <UnderlineIcon />
            </Button>
            <Button
              variant={isTextFormatActive("code") ? "default" : "outline"}
              onClick={() => toggleTextFormat("code")}
              disabled={!isRangeSelection}
              title="Code"
            >
              <CodeIcon />
            </Button>
            <Button
              variant={
                isTextFormatActive("strikethrough") ? "default" : "outline"
              }
              onClick={() => toggleTextFormat("strikethrough")}
              disabled={!isRangeSelection}
              title="Strikethrough"
            >
              <StrikethroughIcon />
            </Button>
            <Button
              variant={isTextFormatActive("subscript") ? "default" : "outline"}
              onClick={() => toggleTextFormat("subscript")}
              disabled={!isRangeSelection}
              title="Subscript"
            >
              <SubscriptIcon />
            </Button>
            <Button
              variant={
                isTextFormatActive("superscript") ? "default" : "outline"
              }
              onClick={() => toggleTextFormat("superscript")}
              disabled={!isRangeSelection}
              title="Superscript"
            >
              <SuperscriptIcon />
            </Button>
            <Button
              variant={isTextFormatActive("lowercase") ? "default" : "outline"}
              onClick={() => toggleTextFormat("lowercase")}
              disabled={!isRangeSelection}
              title="Lowercase"
            >
              <CaseLowerIcon />
            </Button>
            <Button
              variant={isTextFormatActive("uppercase") ? "default" : "outline"}
              onClick={() => toggleTextFormat("uppercase")}
              disabled={!isRangeSelection}
              title="Uppercase"
            >
              <CaseUpperIcon />
            </Button>
            <Button
              variant={isTextFormatActive("capitalize") ? "default" : "outline"}
              onClick={() => toggleTextFormat("capitalize")}
              disabled={!isRangeSelection}
              title="Capitalize"
            >
              <CaseSensitive className="size-4" />
            </Button>
            <Button
              variant={isTextFormatActive("highlight") ? "default" : "outline"}
              onClick={() => toggleTextFormat("highlight")}
              disabled={!isRangeSelection}
              title="Highlight"
            >
              <HighlighterIcon />
            </Button>
          </Field>
          <Field orientation="horizontal">
            <Button
              variant={elementFormat === "left" ? "default" : "outline"}
              onClick={() => alignElement("left")}
              disabled={!isRangeSelection}
              title="Align Left"
            >
              <AlignLeftIcon />
            </Button>
            <Button
              variant={elementFormat === "center" ? "default" : "outline"}
              onClick={() => alignElement("center")}
              disabled={!isRangeSelection}
              title="Align Center"
            >
              <AlignCenterIcon />
            </Button>
            <Button
              variant={elementFormat === "right" ? "default" : "outline"}
              onClick={() => alignElement("right")}
              disabled={!isRangeSelection}
              title="Align Right"
            >
              <AlignRightIcon />
            </Button>
            <Button
              variant={elementFormat === "justify" ? "default" : "outline"}
              onClick={() => alignElement("justify")}
              disabled={!isRangeSelection}
              title="Align Justify"
            >
              <AlignJustifyIcon />
            </Button>
          </Field>
          <Field orientation="horizontal">
            {isInsideFigure && (
              <Button
                variant="outline"
                onClick={insertCodeBlockInFigure}
                disabled={!isRangeSelection}
                title="Insert Code Block"
              >
                <SquareCodeIcon />
              </Button>
            )}
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

export const ToolbarExtension = defineExtension({
  name: "desk/editor/toolbar",
  dependencies: [ReactExtension],
  build: () => ({ Component: ToolbarComponent }),
  // register: (editor)
});
