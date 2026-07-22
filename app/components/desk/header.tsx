import React, { type ReactNode } from "react";
import { Link, useMatches } from "react-router";
import type { DeskHandle } from "~/routes/desk/desk";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export interface DeskHeaderProps {
  children?: ReactNode;
}

export default function DeskHeader({ children }: DeskHeaderProps) {
  const matches = useMatches();

  const breadcrumbs = matches
    .filter((match) => {
      const handle = match.handle as DeskHandle | undefined;
      return Boolean(handle?.breadcrumb);
    })
    .map((match) => {
      const handle = match.handle as DeskHandle;
      return {
        id: match.id,
        pathname: match.pathname,
        content: handle?.breadcrumb ? handle.breadcrumb(match) : null,
      };
    });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 [orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.id}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.content}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={item.pathname}>{item.content}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </header>
  );
}
