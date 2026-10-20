import { CommandIcon } from "lucide-react";
import { Link, useMatches, type UIMatch } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { Handle, Match } from "../types/route";

function useSidebarMenuItems() {
  const matches = useMatches() as Match<unknown>[];

  const parentIndex = matches.findIndex((match) => match.handle?.showInSidebar);
  if (parentIndex === -1) {
    return [];
  }

  return matches
    .slice(parentIndex)
    .filter((match) => match.handle?.showInSidebar)
    .map((match) => {
      return {
        label: match.handle?.title || match.id,
        to: match.pathname,
      };
    });
}

export default function DeskSidebar() {
  const sidebarMenuItems = useSidebarMenuItems();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link to="/desk">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded">
                    <CommandIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Desk</span>
                    <span className="truncate text-xs">v1.0.0</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarMenuItems.map((menu) => (
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to={menu.to}>{menu.label}</Link>}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
