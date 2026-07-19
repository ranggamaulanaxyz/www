import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  type NodeKey,
} from "lexical";
import { defineExtension } from "lexical";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  DragDropProvider,
  DragOverlay,
  useDragDropMonitor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { GripVerticalIcon, PlusIcon } from "lucide-react";
import { cn } from "~/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface BlockRect {
  key: NodeKey;
  height: number;
  /** Distance from the top of BlockDndWrapper's containerRef */
  top: number;
}

interface DragState {
  sourceId: NodeKey | null;
  targetId: NodeKey | null;
}

// ─────────────────────────────────────────────
// DragMonitor
// Must be a child of DragDropProvider.
// Tracks which block is the current drag source/target.
// ─────────────────────────────────────────────

function DragMonitor({
  onDragChange,
  onDragClear,
}: {
  onDragChange: (state: DragState) => void;
  onDragClear: () => void;
}) {
  useDragDropMonitor({
    onDragOver: (event) => {
      const { source, target } = event.operation;
      if (!isSortable(source) || !isSortable(target)) {
        onDragClear();
        return;
      }
      onDragChange({
        sourceId: source.id as NodeKey,
        targetId: target.id as NodeKey,
      });
    },
    onDragEnd: () => onDragClear(),
  });
  return null;
}

// ─────────────────────────────────────────────
// SortableGutterRow
// One row in the gutter flex-column.
// `height` + `marginTop` align it exactly with its Lexical block.
// ─────────────────────────────────────────────

interface SortableGutterRowProps {
  id: NodeKey;
  index: number;
  height: number;
  /** Space above this row to match inter-block gaps / initial offset */
  marginTop: number;
  isActive: boolean;
  onAdd: (key: NodeKey) => void;
  onHoverChange: (hovered: boolean) => void;
}

function SortableGutterRow({
  id,
  index,
  height,
  marginTop,
  isActive,
  onAdd,
  onHoverChange,
}: SortableGutterRowProps) {
  const handleRef = useRef<HTMLButtonElement | null>(null);

  const { isDragging, ref } = useSortable({
    id,
    index,
    handle: handleRef,
  });

  return (
    <div
      ref={ref}
      style={{ height, marginTop }}
      className={cn(
        "flex items-start pt-0.5 transition-opacity duration-150",
        isDragging && "opacity-0",
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div
        className={cn(
          "flex items-center gap-0.5 transition-opacity duration-150",
          isActive ? "opacity-100" : "opacity-0",
        )}
        // Prevent editor blur when clicking gutter controls
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Add block button */}
        <button
          type="button"
          className="flex h-6 w-5 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none"
          title="Add block below"
          onClick={() => onAdd(id)}
          tabIndex={-1}
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </button>

        {/* Drag handle */}
        <button
          ref={handleRef}
          type="button"
          className="flex h-6 w-5 cursor-grab items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none active:cursor-grabbing"
          title="Drag to reorder"
          tabIndex={-1}
        >
          <GripVerticalIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BlockDndWrapper – the main wrapper
// ─────────────────────────────────────────────

export function BlockDndWrapper({ children }: { children: ReactNode }) {
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [blocks, setBlocks] = useState<BlockRect[]>([]);
  const [hoveredKey, setHoveredKey] = useState<NodeKey | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    sourceId: null,
    targetId: null,
  });
  const isDraggingRef = useRef(false);

  // ── Measure all top-level Lexical block positions ──────
  const measureBlocks = useCallback(() => {
    if (isDraggingRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    editor.getEditorState().read(() => {
      const root = $getRoot();
      const items: BlockRect[] = [];

      for (const node of root.getChildren()) {
        const dom = editor.getElementByKey(node.getKey());
        if (!dom) continue;
        const rect = dom.getBoundingClientRect();
        items.push({
          key: node.getKey(),
          height: rect.height,
          top: rect.top - containerRect.top,
        });
      }

      setBlocks(items);
    });
  }, [editor]);

  useEffect(() => {
    measureBlocks();
    return editor.registerUpdateListener(() => measureBlocks());
  }, [editor, measureBlocks]);

  // Re-measure when editor content resizes (images, code blocks, etc.)
  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;
    const observer = new ResizeObserver(() => measureBlocks());
    observer.observe(root);
    return () => observer.disconnect();
  }, [editor, measureBlocks]);

  // ── Hover listeners on actual Lexical block DOM elements ──
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    editor.getEditorState().read(() => {
      const root = $getRoot();
      for (const node of root.getChildren()) {
        const dom = editor.getElementByKey(node.getKey());
        if (!dom) continue;
        const key = node.getKey();
        const onEnter = () => setHoveredKey(key);
        const onLeave = () =>
          setHoveredKey((prev) => (prev === key ? null : prev));
        dom.addEventListener("mouseenter", onEnter);
        dom.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          dom.removeEventListener("mouseenter", onEnter);
          dom.removeEventListener("mouseleave", onLeave);
        });
      }
    });

    return () => cleanups.forEach((c) => c());
  }, [editor, blocks]);

  // ── Drag effect: dim source block DOM element ──────────
  useEffect(() => {
    if (!dragState.sourceId) return;
    const dom = editor.getElementByKey(dragState.sourceId);
    if (!dom) return;
    dom.style.opacity = "0.25";
    dom.style.transition = "opacity 150ms ease";
    return () => {
      dom.style.opacity = "";
      dom.style.transition = "";
    };
  }, [editor, dragState.sourceId]);

  // ── Drag/drop handlers ─────────────────────────────────

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    isDraggingRef.current = true;
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      isDraggingRef.current = false;
      setDragState({ sourceId: null, targetId: null });

      if (event.canceled) return;
      const { source } = event.operation;
      if (!isSortable(source)) return;
      const { initialIndex, index } = source;
      if (initialIndex === index) return;

      editor.update(() => {
        const root = $getRoot();
        const children = root.getChildren();
        if (
          initialIndex < 0 ||
          index < 0 ||
          initialIndex >= children.length ||
          index >= children.length
        )
          return;

        const nodeToMove = children[initialIndex];
        const targetNode = children[index];

        if (initialIndex < index) {
          targetNode.insertAfter(nodeToMove);
        } else {
          targetNode.insertBefore(nodeToMove);
        }
      });
    },
    [editor],
  );

  const handleAddBlock = useCallback(
    (key: NodeKey) => {
      editor.update(() => {
        const node = $getNodeByKey(key);
        if (!node) return;
        const paragraph = $createParagraphNode();
        node.insertAfter(paragraph);
        paragraph.select();
      });
      editor.focus();
    },
    [editor],
  );

  // ── Derived visual state ───────────────────────────────

  const isActiveDrag = dragState.sourceId !== null;

  // Hover border: only visible when not dragging
  const hoveredBlock =
    !isActiveDrag && hoveredKey
      ? blocks.find((b) => b.key === hoveredKey)
      : null;

  // Source block: used by DragOverlay and gutter dim
  const sourceBlock = isActiveDrag
    ? blocks.find((b) => b.key === dragState.sourceId)
    : null;

  // Drop indicator line
  let dropLine: { top: number } | null = null;
  if (isActiveDrag && dragState.sourceId && dragState.targetId) {
    const sourceIdx = blocks.findIndex((b) => b.key === dragState.sourceId);
    const targetIdx = blocks.findIndex((b) => b.key === dragState.targetId);
    const targetBlock = blocks[targetIdx];

    if (
      targetBlock &&
      sourceIdx !== -1 &&
      targetIdx !== -1 &&
      sourceIdx !== targetIdx
    ) {
      const isMovingDown = sourceIdx < targetIdx;
      dropLine = {
        top: isMovingDown
          ? targetBlock.top + targetBlock.height
          : targetBlock.top,
      };
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <DragDropProvider
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Monitor drag-over events to compute drop indicator */}
        <DragMonitor
          onDragChange={setDragState}
          onDragClear={() => setDragState({ sourceId: null, targetId: null })}
        />

        {/* ── Gutter column ─────────────────────────────────────
            Absolutely positioned to the left of the editor.
            Each row gets `marginTop` to account for the gap
            between blocks (initial offset + inter-block margins). */}
        <div className="absolute top-0 right-full pr-1" aria-hidden="true">
          <div className="flex flex-col">
            {blocks.map((block, index) => {
              const prevBlock = blocks[index - 1];
              // For the first block: marginTop = block.top (initial offset from container top)
              // For subsequent blocks: marginTop = gap between prevBlock's bottom and this block's top
              const marginTop =
                index === 0
                  ? block.top
                  : Math.max(
                      0,
                      block.top - (prevBlock.top + prevBlock.height),
                    );

              return (
                <SortableGutterRow
                  key={block.key}
                  id={block.key}
                  index={index}
                  height={block.height}
                  marginTop={marginTop}
                  isActive={hoveredKey === block.key}
                  onAdd={handleAddBlock}
                  onHoverChange={(hovered) =>
                    setHoveredKey(hovered ? block.key : null)
                  }
                />
              );
            })}
          </div>
        </div>

        {/* ── Hover border ──────────────────────────────────────
            Subtle ring around the block under the cursor.
            Hidden while dragging.                             */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 rounded-sm ring-1 ring-foreground/10 transition-all duration-200",
            hoveredBlock ? "opacity-100" : "opacity-0",
          )}
          style={
            hoveredBlock
              ? { top: hoveredBlock.top, height: hoveredBlock.height }
              : { top: 0, height: 0 }
          }
        />

        {/* ── Drop indicator line ────────────────────────────────
            Blue horizontal line + left dot showing where the
            dragged block will land.                           */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 z-20 transition-[top,opacity] duration-100",
            dropLine ? "opacity-100" : "opacity-0",
          )}
          style={{ top: dropLine?.top ?? 0 }}
        >
          <div className="absolute -left-1.5 -top-1 h-2 w-2 rounded-full bg-primary" />
          <div className="h-0.5 w-full rounded-full bg-primary" />
        </div>

        {/* ── DragOverlay ────────────────────────────────────────
            Floats next to the cursor during drag, showing a
            ghost matching the dragged block's height.         */}
        <DragOverlay dropAnimation={null}>
          {sourceBlock ? (
            <div
              className="rounded-md border border-primary/30 bg-background/60 shadow-xl ring-1 ring-primary/20 backdrop-blur-sm"
              style={{ height: sourceBlock.height, width: "100%" }}
            />
          ) : null}
        </DragOverlay>

        {children}
      </DragDropProvider>
    </div>
  );
}

// ─────────────────────────────────────────────
// Extension definition
// ─────────────────────────────────────────────

export const BlockDndExtension = defineExtension({
  name: "desk/editor/block-dnd",
  dependencies: [ReactExtension],
  build: () => ({ Component: BlockDndWrapper }),
});
