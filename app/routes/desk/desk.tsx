import {
  CirclePlusIcon,
  HardDriveIcon,
  LayoutIcon,
  PlusIcon,
} from "lucide-react";
import { Link, Outlet, type UIMatch } from "react-router";
import { Logo } from "~/components/brand/logo";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";
import type { Route } from "./+types/desk";
import { authMiddleware, onlyUserMiddleware } from "~/modules/auth/middleware";

export interface DeskHandle<Data = any> {
  breadcrumb?: (match: UIMatch<Data, unknown>) => React.ReactNode;
}

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  onlyUserMiddleware,
];

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  authMiddleware,
];

export default function Layout() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <Link
              to="/desk/account"
              className="flex shrink-0 items-center gap-1"
            >
              <Logo square={true} />
              <span className="font-semibold">Desk</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                >
                  <Link to="/desk">
                    <LayoutIcon /> Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/desk/drive">
                    <HardDriveIcon /> Drives
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction asChild>
                  <Link to="/desk/drive/new">
                    <PlusIcon />
                    <span className="sr-only">New drive</span>
                  </Link>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
