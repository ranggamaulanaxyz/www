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
import { useHasAccess } from "./use-has-access";

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
  resource: string;
  data: T[] | Promise<T[]>;
  columns: ListColumns<T>;
  metadata: any;
};
export function useList<T extends RowData & { id: string }>({
  resource,
  data,
  columns,
}: ListOptions<T>) {
  const isMobile = useIsMobile();
  const { data: resolvedData, state } = useResolveData(data);
  const [searchParams, setSearchParams] = useSearchParams();
  const canCreate = useHasAccess("insert", resource);

  const table = useTable({
    features,
    data: resolvedData ?? [],
    columns,
    getRowId: (row) => row.id,
    defaultColumn: {
      minSize: 60,
    },
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
    canCreate,
  };
}
