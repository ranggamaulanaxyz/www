import { CommandIcon } from "lucide-react";
import {
  Link,
  useMatch,
  useMatches,
  type PathPattern,
  type UIMatch,
} from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import type { Handle, Match, SidebarItem } from "../types/route";

export default function DeskSidebar() {
  const matches = useMatches() as Match<unknown>[];
  const sidebarMatch = matches
    .reverse()
    .find((match) => match.handle?.sidebarRegistry);
  const sidebarItems =
    sidebarMatch?.handle.sidebarRegistry?.(sidebarMatch) || [];
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
        {sidebarItems.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarMenu>
              {group.items.map((menu, index) => {
                return <DeskSidebarMenuItem key={index} {...menu} />;
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

function DeskSidebarMenuItem({ pathname, ...props }: SidebarItem) {
  const match = useMatch(`${props.matchPattern || pathname}`);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={!!match}
        render={
          <Link to={{ pathname }}>
            {props.icon && <props.icon />}
            <span>{props.label}</span>
          </Link>
        }
      />
    </SidebarMenuItem>
  );
}
