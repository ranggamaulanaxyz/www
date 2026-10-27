import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { features } from "../components/table-old";
import type { ReactNode } from "react";
import type { Pagination } from "@supabase/supabase-js";
import type { PaginationData } from "~/hooks/use-pagination";

export type DeskListView = "table" | "grid";

export type DeskListColumn<T extends RowData> = ColumnDef<typeof features, T>;

export type DeskListColumns<T extends RowData> = Array<DeskListColumn<T>>;

export type DeskListMetadata = { from: number; to: number; count: number };

export type DeskListProps<T extends RowData> = {
  data: T[] | Promise<T[]>;
  columns: DeskListColumns<T>;
  children?: ReactNode;
  metadata: DeskListMetadata | Promise<DeskListMetadata>;
  options?: { showCreateButton: boolean };
};

export type DeskListContentProps<T extends RowData> = {
  view: DeskListView;
  data: T[] | Promise<T[]>;
  columns: DeskListColumns<T>;
  children?: ReactNode;
};
