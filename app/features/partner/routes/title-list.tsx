import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/title-list";

export const handle = {
  title: "Judul",
  breadcrumb: (match) => ({
    to: match.pathname,
    label: "Judul",
  }),
  showInSidebar: true,
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export default function TitleLiest() {
  return;
}
