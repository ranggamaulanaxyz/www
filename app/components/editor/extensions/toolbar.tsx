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
  $createTextNode,
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
import {
  $createFigureNode,
  $isFigureNode,
  $createFigcaptionNode,
  $isFigcaptionNode,
} from "../node/figure";
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
} from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
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
            const nodes = selection.getNodes();
            nodes.forEach((node) => {
              const element =
                node.getKey() === "root"
                  ? node
                  : node.getTopLevelElement();
              if ($isFigureNode(element)) {
                const children = element.getChildren();
                const hasCaption = children.some((child) =>
                  $isFigcaptionNode(child),
                );
                if (!hasCaption) {
                  const caption = $createFigcaptionNode();
                  const textNode = $createTextNode("Caption...");
                  caption.append(textNode);
                  element.append(caption);
                }
              }
            });
          } else if (/^h[1-6]$/.test(type)) {
            $setBlocksType(selection, () =>
              $createHeadingNode(type as HeadingTagType),
            );
          }
        }
      });
      editor.focus();
    }
  };

  const [history, setHistory] = useState({
    canUndo: false,
    canRedo: false,
    undo: undo,
    redo: redo,
  });

  const toolbarCallback = useCallback(() => {
    const selection = $getSelection();
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
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElement();
      if ($isElementNode(element)) {
        setElementFormat(element.getFormatType() || "left");

        let isFigure = false;
        let parent: LexicalNode | null = anchorNode;
        while (parent !== null) {
          if ($isFigureNode(parent) || $isFigcaptionNode(parent)) {
            isFigure = true;
            break;
          }
          parent = parent.getParent();
        }

        if ($isHeadingNode(element)) {
          setBlockType(element.getTag());
        } else if ($isQuoteNode(element)) {
          setBlockType("quote");
        } else if ($isCodeNode(element)) {
          setBlockType("code");
        } else if (isFigure) {
          setBlockType("figure");
        } else {
          setBlockType("paragraph");
        }
      }
    }
  }, []);

  useEffect(() => {
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
    isTextFormatActive,
    toggleTextFormat,
    elementFormat,
    alignElement,
    history,
    blockType,
    formatBlockType,
  };
}

export function ToolbarComponent() {
  const {
    isTextFormatActive,
    toggleTextFormat,
    elementFormat,
    alignElement,
    history,
    blockType,
    formatBlockType,
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
            <Select value={blockType} onValueChange={formatBlockType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Paragraph" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Text</SelectLabel>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <SelectItem value="quote">Quote</SelectItem>
                  <SelectItem value="code">Code Block</SelectItem>
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
              title="Bold"
            >
              <BoldIcon />
            </Button>
            <Button
              variant={isTextFormatActive("italic") ? "default" : "outline"}
              onClick={() => toggleTextFormat("italic")}
              title="Italic"
            >
              <ItalicIcon />
            </Button>
            <Button
              variant={isTextFormatActive("underline") ? "default" : "outline"}
              onClick={() => toggleTextFormat("underline")}
              title="Underline"
            >
              <UnderlineIcon />
            </Button>
            <Button
              variant={isTextFormatActive("code") ? "default" : "outline"}
              onClick={() => toggleTextFormat("code")}
              title="Code"
            >
              <CodeIcon />
            </Button>
            <Button
              variant={
                isTextFormatActive("strikethrough") ? "default" : "outline"
              }
              onClick={() => toggleTextFormat("strikethrough")}
              title="Strikethrough"
            >
              <StrikethroughIcon />
            </Button>
            <Button
              variant={isTextFormatActive("subscript") ? "default" : "outline"}
              onClick={() => toggleTextFormat("subscript")}
              title="Subscript"
            >
              <SubscriptIcon />
            </Button>
            <Button
              variant={
                isTextFormatActive("superscript") ? "default" : "outline"
              }
              onClick={() => toggleTextFormat("superscript")}
              title="Superscript"
            >
              <SuperscriptIcon />
            </Button>
            <Button
              variant={isTextFormatActive("lowercase") ? "default" : "outline"}
              onClick={() => toggleTextFormat("lowercase")}
              title="Lowercase"
            >
              <CaseLowerIcon />
            </Button>
            <Button
              variant={isTextFormatActive("uppercase") ? "default" : "outline"}
              onClick={() => toggleTextFormat("uppercase")}
              title="Uppercase"
            >
              <CaseUpperIcon />
            </Button>
            <Button
              variant={isTextFormatActive("capitalize") ? "default" : "outline"}
              onClick={() => toggleTextFormat("capitalize")}
              title="Capitalize"
            >
              <CaseSensitive className="size-4" />
            </Button>
            <Button
              variant={isTextFormatActive("highlight") ? "default" : "outline"}
              onClick={() => toggleTextFormat("highlight")}
              title="Highlight"
            >
              <HighlighterIcon />
            </Button>
          </Field>
          <Field orientation="horizontal">
            <Button
              variant={elementFormat === "left" ? "default" : "outline"}
              onClick={() => alignElement("left")}
              title="Align Left"
            >
              <AlignLeftIcon />
            </Button>
            <Button
              variant={elementFormat === "center" ? "default" : "outline"}
              onClick={() => alignElement("center")}
              title="Align Center"
            >
              <AlignCenterIcon />
            </Button>
            <Button
              variant={elementFormat === "right" ? "default" : "outline"}
              onClick={() => alignElement("right")}
              title="Align Right"
            >
              <AlignRightIcon />
            </Button>
            <Button
              variant={elementFormat === "justify" ? "default" : "outline"}
              onClick={() => alignElement("justify")}
              title="Align Justify"
            >
              <AlignJustifyIcon />
            </Button>
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
