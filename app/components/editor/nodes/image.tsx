import {
  $create,
  type EditorConfig,
  DecoratorNode,
  type LexicalNode,
  createState,
  type LexicalEditor,
  $getState,
  $setState,
} from "lexical";
import type { ReactNode } from "react";

import { ImageBlockComponent } from "../components/image";

const srcState = createState("src", {
  parse: (v) => (typeof v === "string" ? v : ""),
});

const altTextState = createState("altText", {
  parse: (v) => (typeof v === "string" ? v : ""),
});

const captionState = createState("caption", {
  parse: (v) => (typeof v === "string" ? v : ""),
});

export class ImageNode extends DecoratorNode<ReactNode> {
  $config() {
    return this.config("img", {
      extends: DecoratorNode,
      stateConfigs: [
        { flat: true, stateConfig: srcState },
        { flat: true, stateConfig: altTextState },
        { flat: true, stateConfig: captionState },
      ],
    });
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const figure = document.createElement("img");
    return figure;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return (
      <ImageBlockComponent
        nodeKey={this.getKey()}
        src={$getState(this, srcState)}
        altText={$getState(this, altTextState)}
        caption={$getState(this, captionState)}
      />
    );
  }

  setSrc(src: string, altText = ""): void {
    $setState(this, srcState, src);
    $setState(this, altTextState, altText);
  }

  setCaption(caption: string): void {
    $setState(this, captionState, caption);
  }
}

export function $createFigureNode(): ImageNode {
  return $create(ImageNode);
}

export function $isFigureNode(node: LexicalNode | null | undefined) {
  return node instanceof ImageNode;
}
