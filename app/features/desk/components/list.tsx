import {
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
  createColumnHelper,
  type RowData,
  useTable,
} from "@tanstack/react-table";
import type { DeskListProps } from "../types/view";
import { useView } from "../hooks/use-view";
import { useIsMobile } from "~/hooks/use-mobile";
import { TopBar } from "./bar";
import DeskHeader from "./header";
import { usePagination } from "~/hooks/use-pagination";
import DeskPagination from "./pagination";

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
});

export function deskColumnBuilder<TData extends RowData>() {
  const helper = createColumnHelper<typeof features, TData>();
  return helper;
}

export function DeskList<DeskListData extends RowData>({
  data,
  columns,
  children,
  metadata,
}: DeskListProps<DeskListData>) {
  const table = useTable({ features, data, columns });
  const isMobile = useIsMobile();
  const { view } = useView(!!children);
  const [pagination] = usePagination(metadata);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden">
      <TopBar>
        <DeskHeader>
          <DeskPagination {...pagination} />
        </DeskHeader>
      </TopBar>
      <div className="min-h-0 flex-1">{isMobile !== undefined && children}</div>
    </div>
  );
}
