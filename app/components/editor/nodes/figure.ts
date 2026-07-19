import {
  $create,
  type EditorConfig,
  ElementNode,
  type LexicalNode,
} from "lexical";

export class FigureNode extends ElementNode {
  $config() {
    return this.config("figure", { extends: ElementNode });
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("figure");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }
}

export function $createFigureNode(): FigureNode {
  return $create(FigureNode);
}

export function $isFigureNode(
  node: LexicalNode | null | undefined,
): node is FigureNode {
  return node instanceof FigureNode;
}

export class FigcaptionNode extends ElementNode {
  $config() {
    return this.config("figcaption", { extends: ElementNode });
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("figcaption");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }
}

export function $createFigcaptionNode(): FigcaptionNode {
  return $create(FigcaptionNode);
}

export function $isFigcaptionNode(
  node: LexicalNode | null | undefined,
): node is FigcaptionNode {
  return node instanceof FigcaptionNode;
}


