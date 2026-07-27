import { Outlet } from "react-router";
import type { DeskHandle } from "./desk";

export const handle: DeskHandle = {
  breadcrumb: () => {
    return "Settings";
  },
};

export default function Setting() {
  return <Outlet />;
}
