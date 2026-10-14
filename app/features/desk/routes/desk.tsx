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
import { useMatches, type UIMatch } from "react-router";
import type { Route } from "./+types/desk";
import { Fragment } from "react/jsx-runtime";

type RouteHandle = {
  breadcrumb?: string | ((match: UIMatch<unknown, unknown>) => string);
};

type Breadcrumb = {
  to: string;
  label: string;
  current: boolean;
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
    typeof handle.breadcrumb === "string" ||
    typeof handle.breadcrumb === "function"
  );
}

function useBreadcrumbs(): Breadcrumb[] {
  const matches = useMatches();

  const breadcrumbMatches = matches.filter(hasBreadcrumb);

  return breadcrumbMatches.map((match, index) => {
    const breadcrumb = match.handle.breadcrumb;

    return {
      to: match.pathname,
      label: typeof breadcrumb === "function" ? breadcrumb(match) : breadcrumb,
      current: index === breadcrumbMatches.length - 1,
    };
  });
}

export default function Desk() {
  const breadcrumbs = useBreadcrumbs();

  return (
    <div>
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
                      <BreadcrumbItem className="hidden md:block">
                        {breadcrumb.current ? (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={breadcrumb.to}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
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
        </SidebarInset>
      </SidebarProvider>
      <BottomNavbar />
    </div>
  );
}
