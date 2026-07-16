import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { defineExtension } from "lexical";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  createCommand,
} from "lexical";
import type { LexicalCommand } from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Edit2Icon, ExternalLinkIcon, Trash2Icon } from "lucide-react";

export const TRIGGER_LINK_EDITOR_COMMAND: LexicalCommand<void> = createCommand(
  "TRIGGER_LINK_EDITOR_COMMAND",
);

function FloatingLinkEditor() {
  const [editor] = useLexicalComposerContext();
  const [isMounted, setIsMounted] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [editedUrl, setEditedUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateLinkEditor = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && selection.isCollapsed() === false) {
        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();
        const linkNode = $isLinkNode(anchorNode)
          ? anchorNode
          : $isLinkNode(parent)
            ? parent
            : null;

        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          const domRange = nativeSelection.getRangeAt(0);
          const domRect = domRange.getBoundingClientRect();

          // Only show/update if the rect is valid
          if (domRect.width > 0 && domRect.height > 0) {
            setRect(domRect);
            if (linkNode) {
              setIsLink(true);
              const url = linkNode.getURL();
              setLinkUrl(url);
              setEditedUrl(url);
              setIsOpen(true);
            } else {
              setIsLink(false);
              setLinkUrl("");
              // If not a link, don't auto-open unless triggered
            }
            return;
          }
        }
      }

      // Close if selection is collapsed or empty
      if (!isEditMode) {
        setIsOpen(false);
      }
    });
  }, [editor, isEditMode]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateLinkEditor();
      });
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateLinkEditor();
        return false;
      },
      1,
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    return editor.registerCommand(
      TRIGGER_LINK_EDITOR_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nativeSelection = window.getSelection();
            if (nativeSelection && nativeSelection.rangeCount > 0) {
              const domRange = nativeSelection.getRangeAt(0);
              setRect(domRange.getBoundingClientRect());
              setIsEditMode(true);
              setIsOpen(true);
            }
          }
        });
        return true;
      },
      1,
    );
  }, [editor]);

  const handleApply = () => {
    if (editedUrl === "") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, editedUrl);
    }
    setIsOpen(false);
    setIsEditMode(false);
    editor.focus();
  };

  const handleRemove = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsOpen(false);
    setIsEditMode(false);
    editor.focus();
  };

  if (!isMounted || !isOpen || !rect) return null;

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setIsEditMode(false);
      }}
    >
      <PopoverAnchor asChild>
        <div
          style={{
            position: "fixed",
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            pointerEvents: "none",
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        className="flex w-80 flex-col gap-3 p-3"
        align="center"
        side="bottom"
        sideOffset={8}
      >
        {isEditMode ? (
          <>
            <div className="flex flex-col gap-1.5">
              <span className="text-muted-foreground text-xs font-semibold">
                URL
              </span>
              <Input
                type="text"
                placeholder="Enter URL (e.g. https://example.com)"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApply();
                  } else if (e.key === "Escape") {
                    setIsOpen(false);
                    setIsEditMode(false);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              {isLink && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 px-3"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3"
                onClick={() => {
                  setIsOpen(false);
                  setIsEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" className="h-8 px-3" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 flex flex-1 items-center gap-1 truncate text-sm underline"
            >
              <span className="truncate">{linkUrl}</span>
              <ExternalLinkIcon className="size-3 flex-shrink-0" />
            </a>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => {
                  setEditedUrl(linkUrl);
                  setIsEditMode(true);
                }}
              >
                <Edit2Icon className="size-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={handleRemove}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export const LinkEditorExtension = defineExtension({
  name: "desk/editor/link-editor",
  dependencies: [ReactExtension],
  build: () => ({ Component: FloatingLinkEditor }),
});
