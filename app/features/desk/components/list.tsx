import { Suspense, type ReactNode } from "react";
import { DeskTopBar } from "./bar";
import { useIsMobile } from "~/hooks/use-mobile";
import DeskPagination from "./pagination";
import { Await } from "react-router";
import type { RowData } from "@tanstack/react-table";
import { DeskTable, DeskTableFallback, type DeskTableColumns } from "./table";
import { useListView, type DeskListView } from "../hooks/use-list-view";

type DeskListMetadata = {
  from: number;
  to: number;
  count: number;
  size: number;
};

type DeskListProps = {
  children: ReactNode;
};

export function DeskList({ children }: DeskListProps) {
  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden pb-12 md:pb-0">
      {children}
    </div>
  );
}

type DeskListTopBarProps = {
  metadata: DeskListMetadata | Promise<DeskListMetadata>;
  children?: ReactNode;
};

export function DeskListTopBar({ metadata, children }: DeskListTopBarProps) {
  return (
    <DeskTopBar>
      <div className="flex items-center">
        <div className="hidden items-center md:flex">
          <Suspense fallback={<DeskPagination />}>
            <Await
              resolve={metadata}
              children={(metadata) => <DeskPagination {...metadata} />}
            />
          </Suspense>
        </div>
        {children}
      </div>
    </DeskTopBar>
  );
}

type DeskListContentProps<T extends RowData> =
  | {
      data: T[] | Promise<T[]>;
      columns: DeskTableColumns<T>;
      enableGridView?: false;
      view?: DeskListView;
      children?: ReactNode;
    }
  | {
      data: T[] | Promise<T[]>;
      columns: DeskTableColumns<T>;
      enableGridView: true;
      view: DeskListView;
      children: ReactNode;
    };

export function DeskListContent<T extends RowData>({
  data,
  columns,
  children,
}: DeskListContentProps<T>) {
  const isMobile = useIsMobile();
  const { view } = useListView(!!children);

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
