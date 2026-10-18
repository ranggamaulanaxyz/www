import { cn } from "cn";
import type { ReactNode } from "react";
import { Link, useMatches, type UIMatch } from "react-router";
import { Fragment } from "react/jsx-runtime";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { SidebarTrigger } from "~/components/ui/sidebar";

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

export default function DeskHeader({children}: {children?: ReactNode}) {
  const breadcrumbs = useBreadcrumbs();
  return (
    <header className="flex justify-between h-12 shrink-0 items-center gap-2 bg-background border-b">
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
      <div className="flex">
        {children}
      </div>
    </header>
  );
}
