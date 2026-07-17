import {
  ElementNode,
  $createParagraphNode,
} from "lexical";
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  RangeSelection,
} from "lexical";

export type SerializedFigureNode = SerializedElementNode;

export class FigureNode extends ElementNode {
  static getType(): string {
    return "figure";
  }

  static clone(node: FigureNode): FigureNode {
    return new FigureNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("figure");
    if (config.theme.figure) {
      dom.className = config.theme.figure;
    }
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: (node: HTMLElement) => ({
        conversion: $convertFigureElement,
        priority: 1,
      }),
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement("figure");
    // @ts-ignore
    const theme = editor._config?.theme;
    if (theme && theme.figure) {
      element.className = theme.figure;
    }
    return { element };
  }

  static importJSON(serializedNode: SerializedFigureNode): FigureNode {
    return $createFigureNode().updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedFigureNode {
    return {
      ...super.exportJSON(),
    };
  }
}

function $convertFigureElement(domNode: HTMLElement): DOMConversionOutput | null {
  return {
    node: $createFigureNode(),
  };
}

export function $createFigureNode(): FigureNode {
  return new FigureNode();
}

export function $isFigureNode(
  node: LexicalNode | null | undefined,
): node is FigureNode {
  return node instanceof FigureNode;
}

export type SerializedFigcaptionNode = SerializedElementNode;

export class FigcaptionNode extends ElementNode {
  static getType(): string {
    return "figcaption";
  }

  static clone(node: FigcaptionNode): FigcaptionNode {
    return new FigcaptionNode(node.__key);
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("figcaption");
    if (config.theme.figcaption) {
      dom.className = config.theme.figcaption;
    }
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figcaption: (node: HTMLElement) => ({
        conversion: $convertFigcaptionElement,
        priority: 1,
      }),
    };
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement("figcaption");
    // @ts-ignore
    const theme = editor._config?.theme;
    if (theme && theme.figcaption) {
      element.className = theme.figcaption;
    }
    return { element };
  }

  static importJSON(serializedNode: SerializedFigcaptionNode): FigcaptionNode {
    return $createFigcaptionNode().updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedFigcaptionNode {
    return {
      ...super.exportJSON(),
    };
  }

  insertNewAfter(
    selection: RangeSelection,
    restoreSelection?: boolean,
  ): LexicalNode | null {
    const parent = this.getParent();
    if ($isFigureNode(parent)) {
      const newParagraph = $createParagraphNode();
      parent.insertAfter(newParagraph);
      return newParagraph;
    }
    return null;
  }
}

function $convertFigcaptionElement(domNode: HTMLElement): DOMConversionOutput | null {
  return {
    node: $createFigcaptionNode(),
  };
}

export function $createFigcaptionNode(): FigcaptionNode {
  return new FigcaptionNode();
}

export function $isFigcaptionNode(
  node: LexicalNode | null | undefined,
): node is FigcaptionNode {
  return node instanceof FigcaptionNode;
}
