import { configExtension, defineExtension } from "lexical";

import { RichTextExtension } from "@lexical/rich-text";
import { HistoryExtension } from "@lexical/history";
import {
  CodeExtension,
  CodeIndentExtension,
  CodeHighlightNode,
} from "@lexical/code-core";
import { CodeShikiExtension } from "@lexical/code-shiki";
import { TableExtension } from "@lexical/table";
import { ListExtension, ListNode, CheckListExtension } from "@lexical/list";
import { LinkExtension, LinkNode } from "@lexical/link";
import {
  TabIndentationExtension,
  HorizontalRuleExtension,
} from "@lexical/extension";

import { ReactExtension } from "@lexical/react/ReactExtension";
import { TailwindExtension } from "@lexical/tailwind";

import theme from "./theme";
import { ToolbarExtension } from "./extensions/toolbar";

export const blogExtension = defineExtension({
  name: "[root]",
  namespace: "Editor",
  dependencies: [
    RichTextExtension,
    HistoryExtension,
    TabIndentationExtension,
    HorizontalRuleExtension,
    ListExtension,
    CheckListExtension,
    LinkExtension,
    CodeExtension,
    CodeIndentExtension,
    CodeShikiExtension,
    TableExtension,
    TailwindExtension,
    configExtension(ReactExtension, { contentEditable: null }),
    ToolbarExtension,
  ],
  nodes: [CodeHighlightNode, ListNode, LinkNode],
  theme: theme,
});
