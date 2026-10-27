import type {
  DeskListContentProps,
  DeskListProps,
  DeskListView,
} from "../types/view";
import { useView } from "../hooks/use-view";
import { useIsMobile } from "~/hooks/use-mobile";
import { TopBar } from "./bar";
import DeskHeader from "./header";
import { usePagination } from "~/hooks/use-pagination";
import DeskPagination from "./pagination";
import type { RowData } from "@tanstack/react-table";
import { DeskTable, DeskTableFallback } from "./table";
import { Children, Suspense, type ReactNode } from "react";
import { Await } from "react-router";

export function DeskList<T extends RowData>({
  data,
  columns,
  children,
  metadata,
}: DeskListProps<T>) {
  const { view } = useView(!!children);
  const [pagination] = usePagination(metadata);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden">
      <TopBar>
        <DeskHeader>
          <DeskPagination {...pagination} />
        </DeskHeader>
      </TopBar>
      <div className="min-h-0 flex-1">
        <DeskListContent view={view} data={data} columns={columns}>
          {children}
        </DeskListContent>
      </div>
    </div>
  );
}

export function DeskListContent<T extends RowData>({
  view,
  data,
  columns,
  children,
}: DeskListContentProps<T>) {
  const isMobile = useIsMobile();
  if (isMobile === undefined) {
    return null;
  }

  if (view === "grid" && children) {
    return children;
  }

  return (
    <Suspense fallback={<DeskTableFallback columns={columns} />}>
      <Await
        resolve={data}
        children={(data) => <DeskTable data={data} columns={columns} />}
      />
    </Suspense>
  );
}
