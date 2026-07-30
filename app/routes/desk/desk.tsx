import {
  CirclePlusIcon,
  CogIcon,
  HardDriveIcon,
  LayoutIcon,
  NewspaperIcon,
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
                <SidebarMenuButton render={<Link to="/desk" />}>
                  <LayoutIcon /> Dashboard
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/desk/drive" />}>
                  <HardDriveIcon /> Drives
                </SidebarMenuButton>
                <SidebarMenuAction render={<Link to="/desk/drive/new" />}>
                  <PlusIcon />
                  <span className="sr-only">New drive</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/desk/blog" />}>
                  <NewspaperIcon /> Posts
                </SidebarMenuButton>
                <SidebarMenuAction render={<Link to="/desk/blog/new" />}>
                  <PlusIcon />
                  <span className="sr-only">New post</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/desk/settings" />}>
                  <CogIcon /> Settings
                </SidebarMenuButton>
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
