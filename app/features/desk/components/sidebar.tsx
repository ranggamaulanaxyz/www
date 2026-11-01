import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "cn";
import { ChevronRightIcon, CommandIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  matchPath,
  useLocation,
  useMatch,
  useMatches,
} from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import type { Match, SidebarItem } from "../types/route";

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

function DeskSidebarMenuItem(props: SidebarItem) {
  if (props.children?.length) {
    return <DeskSidebarMenuSubMenu {...props} />;
  }

  return <DeskSidebarMenuLink {...props} />;
}

function DeskSidebarMenuLink({ pathname, ...props }: SidebarItem) {
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

function DeskSidebarMenuSubMenu({
  icon: Icon,
  label,
  pathname,
  matchPattern,
  children = [],
}: SidebarItem) {
  const location = useLocation();
  const isActive =
    isSidebarItemActive({ pathname, matchPattern }, location.pathname) ||
    children.some((child) => isSidebarItemActive(child, location.pathname));
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive]);

  return (
    <SidebarMenuItem>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          render={
            <SidebarMenuButton isActive={isActive}>
              {Icon && <Icon />}
              <span className="truncate">{label}</span>
              <ChevronRightIcon
                className={cn(
                  "ml-auto transition-transform duration-200",
                  open && "rotate-90",
                )}
              />
            </SidebarMenuButton>
          }
        />
        <Collapsible.Panel>
          <SidebarMenuSub>
            {children.map((child, index) => (
              <DeskSidebarSubMenuItem key={index} {...child} />
            ))}
          </SidebarMenuSub>
        </Collapsible.Panel>
      </Collapsible.Root>
    </SidebarMenuItem>
  );
}

function DeskSidebarSubMenuItem({ pathname, ...props }: SidebarItem) {
  const match = useMatch(`${props.matchPattern || pathname}`);
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        isActive={!!match}
        render={
          <Link to={{ pathname }}>
            {props.icon && <props.icon />}
            <span>{props.label}</span>
          </Link>
        }
      />
    </SidebarMenuSubItem>
  );
}

function isSidebarItemActive(
  item: Pick<SidebarItem, "pathname" | "matchPattern">,
  pathname: string,
) {
  const pattern = item.matchPattern || item.pathname;
  if (!pattern) return false;

  return !!matchPath(pattern, pathname);
}
