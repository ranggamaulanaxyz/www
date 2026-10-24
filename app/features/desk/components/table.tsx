import {
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
  useTable,
  type ColumnDef,
  type ColumnSizingState,
  type RowData,
} from "@tanstack/react-table";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { TopBar } from "./bar";
import DeskHeader from "./header";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import FilterInputQuery from "./filter-input-query";

export const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
});

type DeskTableColumn<TData extends RowData> = ColumnDef<typeof features, TData>;

type DeskTableColumns<TData extends RowData> = Array<DeskTableColumn<TData>>;

type DeskTableProps<TData extends RowData> = {
  data: TData[];
  columns: DeskTableColumns<TData>;
  options?: {
    showCreateButton?: boolean;
  };
};

export default function DeskTable<TData extends RowData>({
  data,
  columns,
  options,
}: DeskTableProps<TData>) {
  const { FlexRender, ...table } = useTable({
    features,
    columns,
    data,
    columnResizeMode: "onChange",
  });

  const tableRef = useRef<HTMLTableElement>(null);

  useLayoutEffect(() => {
    const tableEl = tableRef.current;
    if (!tableEl) return;

    const writeColumnSizeVars = () => {
      for (const header of table.getFlatHeaders()) {
        tableEl.style.setProperty(
          `--header-${header.id}-size`,
          String(header.getSize()),
        );
        tableEl.style.setProperty(
          `--col-${header.column.id}-size`,
          String(header.column.getSize()),
        );
      }
      // Always span the container; only fall back to the sum of the columns
      // when the columns are wider than the container (horizontal scroll).
      tableEl.style.width = "100%";
      tableEl.style.minWidth = `${table.getTotalSize()}px`;
    };

    // Distribute the container width across all visible columns, keeping
    // each column's current size as its share. This makes the table fill
    // the viewport on first paint and whenever the container is resized.
    let lastWidth = -1;
    const fitToContainer = () => {
      const container = tableEl.parentElement;
      if (!container) return;

      const width = container.clientWidth;
      if (width <= 0 || width === lastWidth) return;
      lastWidth = width;

      const columns = table.getAllLeafColumns();
      if (!columns.length) return;

      const currentTotal = columns.reduce(
        (sum, column) => sum + column.getSize(),
        0,
      );
      if (currentTotal <= 0) return;

      const next: ColumnSizingState = {};
      let assigned = 0;
      columns.forEach((column, index) => {
        const minSize = column.columnDef.minSize ?? 20;
        const isLast = index === columns.length - 1;
        const size = isLast
          ? // Absorb rounding drift so the widths sum to the container width
            Math.max(minSize, width - assigned)
          : Math.max(
              minSize,
              Math.round((column.getSize() / currentTotal) * width),
            );
        next[column.id] = size;
        assigned += size;
      });

      table.setColumnSizing(next);
    };

    fitToContainer();
    writeColumnSizeVars(); // initial paint

    const { unsubscribe } =
      table.atoms.columnSizing.subscribe(writeColumnSizeVars);

    const observer = new ResizeObserver(fitToContainer);
    if (tableEl.parentElement) observer.observe(tableEl.parentElement);

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, []);

  return (
    <DeskTableLayout>
      <Table ref={tableRef}>
        <TableHeader className="bg-background sticky top-0 z-10 shadow">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="relative first:pl-4 last:pr-4"
                  colSpan={header.colSpan}
                  style={{
                    width: `calc(var(--header-${header.id}-size) * 1px)`,
                  }}
                >
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                  <table.Subscribe
                    selector={(state) =>
                      state.columnResizing.isResizingColumn === header.column.id
                    }
                  >
                    {(isResizing) => (
                      <button
                        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent select-none"
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                      >
                        &nbsp;
                      </button>
                    )}
                  </table.Subscribe>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="first:pl-4 last:pr-4"
                  style={{
                    width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                  }}
                >
                  <FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="first:pl-4 last:pr-4"
            >
              test
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </DeskTableLayout>
  );
}

type DeskTableLayoutProps = {
  children: ReactNode;
};

export function DeskTableLayout({ children }: DeskTableLayoutProps) {
  const isMobile = useIsMobile();
  const topBarRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      const topBar = topBarRef.current;
      const layout = layoutRef.current;
      if (!topBar || !layout) return;
      // The sticky topbar keeps its space in the flow, so the table
      // container's available height is always viewport minus topbar.
      layout.style.setProperty(
        "--desk-topbar-height",
        `${topBar.getBoundingClientRect().height}px`,
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (topBarRef.current) {
      observer.observe(topBarRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layoutRef} className="flex min-w-0 flex-col">
      <div ref={topBarRef} className="shrink-0">
        <TopBar>
          <DeskHeader>
            <div className="flex items-center gap-4 px-4">
              {!isMobile && <FilterInputQuery />}
              <Button
                nativeButton={false}
                render={
                  <Link to="new">
                    <PlusIcon /> Tambah
                  </Link>
                }
              />
            </div>
          </DeskHeader>
        </TopBar>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
