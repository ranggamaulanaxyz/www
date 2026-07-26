import { Outlet } from "react-router";
import type { DeskHandle } from "./desk";

export const handle: DeskHandle = {
  breadcrumb: () => "Blog",
};

export default function BlogRoute() {
  return <Outlet />;
}

