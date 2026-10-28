import {
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
  rowSelectionFeature,
  useTable,
  type RowData,
  type ColumnDef,
} from "@tanstack/react-table";
import { useResolveData } from "./use-resolve-data";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSearchParams } from "react-router";

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  rowSelectionFeature,
});

export type ListFeatures = typeof features;

type ListColumn<T extends RowData> = ColumnDef<ListFeatures, T>;
type ListColumns<T extends RowData> = Array<ListColumn<T>>;

export type ListView = "grid" | "table";

type ListOptions<T extends RowData> = {
  table: string;
  data: T[] | Promise<T[]>;
  columns: ListColumns<T>;
  metadata: any;
};
export function useList<T extends RowData & { id: string }>({
  data,
  columns,
}: ListOptions<T>) {
  const { data: resolvedData, state } = useResolveData(data);

  const isMobile = useIsMobile();

  const [searchParams, setSearchParams] = useSearchParams();

  const table = useTable({
    features,
    data: resolvedData ?? [],
    columns,
    getRowId: (row) => row.id,
    columnResizeMode: "onChange",
  });

  const setView = (view: ListView) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("view", view);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const getView = (): ListView => {
    const view = searchParams.get("view");
    switch (view) {
      case "grid":
      case "table":
        return view;
      default:
        if (isMobile) return "grid";
        return "table";
    }
  };

  return {
    table,
    rows: table.getCoreRowModel().rows,
    selectedRows: table.getSelectedRowModel().rows,
    state,
    view: getView(),
    setView,
  };
}
