import { ReactExtension } from "@lexical/react/ReactExtension";
import { defineExtension } from "lexical";
import { Card } from "~/components/ui/card";

export function Toolbar() {
  return <Card>Test</Card>;
}

export const ToolbarExtension = defineExtension({
  name: "desk/editor/toolbar",
  dependencies: [ReactExtension],
  build: () => ({ Component: Toolbar }),
});
