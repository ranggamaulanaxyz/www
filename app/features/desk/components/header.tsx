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
import { useBreadcrumbs } from "~/hooks/use-breadcrumbs";

export default function DeskHeader({ children }: { children?: ReactNode }) {
  const breadcrumbs = useBreadcrumbs();
  return (
    <header className="bg-background flex h-12 shrink-0 items-center justify-between gap-2 border-b">
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
      <div className="flex">{children}</div>
    </header>
  );
}
