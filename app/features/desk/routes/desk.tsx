import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import DeskSidebar from "../components/sidebar";
import BottomNavbar from "../components/bottom-navbar";
import { Outlet, useOutlet } from "react-router";
import { Fragment } from "react/jsx-runtime";
import Home from "../components/home";
import type { Route } from "./+types/dashboard";
import {
  authMiddleware,
  userOnlyMiddleware,
} from "~/features/auth/middlewares.server";

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  userOnlyMiddleware,
];

export default function Desk() {
  const outlet = useOutlet();

  if (!outlet) {
    return <Home />;
  }

  return (
    <Fragment>
      <SidebarProvider>
        <DeskSidebar />
        <SidebarInset className="min-w-0 flex min-h-0 flex-col">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </Fragment>
  );
}
