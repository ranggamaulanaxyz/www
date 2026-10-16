import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import DeskSidebar from "../components/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import BottomNavbar from "../components/bottom-navbar";
import {
  Link,
  Outlet,
  useMatches,
  useOutlet,
  type UIMatch,
} from "react-router";
import type { Route } from "./+types/desk";
import { Fragment } from "react/jsx-runtime";
import Home from "../components/home";
import { cn } from "cn";

type Breadcrumb = {
  to: string;
  label: string;
  current: boolean;
};

type RouteHandle = {
  breadcrumb?: Breadcrumb | ((match: UIMatch<unknown, unknown>) => Breadcrumb);
};

function hasBreadcrumb(match: UIMatch<unknown, unknown>): match is UIMatch<
  unknown,
  RouteHandle
> & {
  handle: Required<Pick<RouteHandle, "breadcrumb">>;
} {
  const handle = match.handle;

  if (
    typeof handle !== "object" ||
    handle === null ||
    !("breadcrumb" in handle)
  ) {
    return false;
  }

  return (
    typeof handle.breadcrumb === "object" ||
    typeof handle.breadcrumb === "function"
  );
}

function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches();

  const breadcrumbMatches = matches.filter(hasBreadcrumb);

  return breadcrumbMatches.map((match, index) => {
    const breadcrumb =
      typeof match.handle.breadcrumb === "function"
        ? match.handle.breadcrumb(match)
        : match.handle.breadcrumb;

    return {
      to: breadcrumb.to ?? match.pathname,
      label: breadcrumb.label,
      current:
        breadcrumb !== undefined
          ? index === breadcrumbMatches.length - 1
          : false,
    };
  });
}

export default function Desk() {
  const outlet = useOutlet();
  const breadcrumbs = useBreadcrumbs();

  if (!outlet) {
    return <Home />;
  }

  return (
    <Fragment>
      <SidebarProvider>
        <DeskSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger variant="outline" className="rounded" />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb) => (
                    <Fragment key={breadcrumb.to}>
                      <BreadcrumbItem
                        className={cn(!breadcrumb.current && "hidden md:block")}
                      >
                        {breadcrumb.current ? (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={breadcrumb.to}
                            render={
                              <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
                            }
                          />
                        )}
                      </BreadcrumbItem>

                      {!breadcrumb.current && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <BottomNavbar />
    </Fragment>
  );
}
