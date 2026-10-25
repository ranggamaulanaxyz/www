import type { ColumnDef, ReactTable, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";
import type { features } from "../components/table";
import type { LinkProps } from "react-router";

export type DeskTableColumn<TData extends RowData> = ColumnDef<
  typeof features,
  TData
>;

export type DeskTableColumns<TData extends RowData> = Array<
  DeskTableColumn<TData>
>;

export type DeskTableInstance<TData extends RowData> = ReactTable<
  typeof features,
  TData
>;

export type DeskTableView = "table" | "grid";

export type DeskTableMetadata = { from: number; to: number; count: number };

export type DeskTableProps<TData extends RowData> = {
  /** Resolved rows, or a pending loader promise (streamed with `<Await>`). */
  data: TData[] | Promise<TData[]>;
  columns: DeskTableColumns<TData>;
  metadata: DeskTableMetadata | Promise<DeskTableMetadata>;
  /** Renders the sticky footer with access to the table instance. */
  renderFooter?: (table: DeskTableInstance<TData>) => ReactNode;
  /** Number of skeleton rows rendered while the data is pending. */
  skeletonRows?: number;
  /** Renders each row as a card in grid view. Providing it enables the toggle. */
  renderGridItem?: (item: TData, index: number) => ReactNode;
  /** Custom grid loading state. Return the skeleton items; they are rendered
   * inside the same grid container used by the grid view. */
  renderGridFallback?: (rows: number) => ReactNode;
  /** Shown when there are no rows. */
  renderEmpty?: ReactNode;
  showCreateButton?: boolean;
};

export type DeskTableContentProps<TData extends RowData> = {
  data: TData[];
  columns: DeskTableColumns<TData>;
  renderFooter?: (table: DeskTableInstance<TData>) => ReactNode;
  renderEmpty?: ReactNode;
  skeletonRows?: number;
};

export type DeskTableGridProps<TData extends RowData> = {
  items: TData[];
  renderItem: (item: TData, index: number) => ReactNode;
  renderEmpty?: ReactNode;
};

export type DeskTableSkeletonProps<TData extends RowData> = {
  columns: DeskTableColumns<TData>;
  rows?: number;
};

export type DeskTableLayoutProps = {
  children: ReactNode;
  showCreateButton?: boolean;
  createLink?: LinkProps["to"];
  view?: DeskTableView;
  onViewChange?: (view: DeskTableView) => void;
  pagination: { from: number; to: number; count: number };
};
