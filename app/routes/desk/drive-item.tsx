import DeskHeader from "~/components/desk/header";
import type { DeskHandle } from "./desk";
import type { Route } from "./+types/drive-item";

export const handle: DeskHandle<Route.ComponentProps["loaderData"]> = {
  breadcrumb: (match) => {
    return "Items";
  },
};
export default function DriveItems() {
  return <DeskHeader />;
}
