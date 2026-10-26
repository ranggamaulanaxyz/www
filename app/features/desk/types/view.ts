import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { features } from "../components/table";
import type { ReactNode } from "react";
import type { Pagination } from "@supabase/supabase-js";
import type { PaginationData } from "~/hooks/use-pagination";

export type DeskListView = "table" | "grid";

export type DeskListColumn<DeskListData extends RowData> = ColumnDef<
  typeof features,
  DeskListData
>;

export type DeskListColumns<DeskListData extends RowData> = Array<
  DeskListColumn<DeskListData>
>;

export type DeskListMetadata = { from: number; to: number; count: number };

export type DeskListProps<DeskListData extends RowData> = {
  data: DeskListData[] | Promise<DeskListData[]>;
  columns: DeskListColumns<DeskListData>;
  children?: ReactNode;
  metadata: DeskListMetadata | Promise<DeskListMetadata>;
};
