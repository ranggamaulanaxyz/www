import { configExtension, defineExtension } from "lexical";

import { RichTextExtension, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HistoryExtension } from "@lexical/history";
import {
  CodeExtension,
  CodeIndentExtension,
  CodeHighlightNode,
  CodeNode,
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

import theme from "../theme";
import { toast } from "sonner";

export const BlogExtension = defineExtension({
  name: "@desk/blog/editor",
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
    configExtension(ReactExtension, { contentEditable: null }),
  ],
  nodes: [
    CodeHighlightNode,
    CodeNode,
    ListNode,
    LinkNode,
    HeadingNode,
    QuoteNode,
  ],
  theme: theme,
  onError: (error: Error) => {
    toast.error(error.message);
  },
});
