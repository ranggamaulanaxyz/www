import { Outlet } from "react-router";
import type { DeskHandle } from "./desk";

export const handle: DeskHandle = {
  breadcrumb: () => "Drives",
};

export default function DriveRoute() {
  return <Outlet />;
}
