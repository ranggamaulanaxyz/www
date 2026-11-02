import {
  createColumnHelper,
  type RowData,
  type ColumnDef,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell_Core,
  type ColumnSizingState,
  type ReactTable,
} from "@tanstack/react-table";
import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { ListFeatures } from "../hooks/use-list";
import type { DeskTableColumnMeta, DeskTableFeatures } from "../types/table";
import { ArrowRightLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export type { DeskTableColumnMeta, DeskTableFeatures } from "../types/table";

const alignClasses: Record<
  NonNullable<DeskTableColumnMeta["align"]>,
  string
> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function getAlignClass(align: DeskTableColumnMeta["align"]) {
  return align ? alignClasses[align] : undefined;
}

export type DeskTableColumn<T extends RowData = any> = ColumnDef<
  DeskTableFeatures,
  T
>;

export type DeskTableColumns<T extends RowData = any> = Array<
  DeskTableColumn<T>
>;

export type DeskTableProps<T extends RowData = any> = {
  data: T[];
  columns: DeskTableColumns<T>;
  columnOptions?: Partial<DeskTableColumn<T>>;
};

export type DeskTableHeaderProps<T extends RowData = any> = {
  groups: HeaderGroup<DeskTableFeatures, T>[];
  render: (header: Header<DeskTableFeatures, T>) => ReactNode;
  lastHeader?: Header<DeskTableFeatures, T>;
  sizingState?: Record<string, number>;
};

export function deskColumnBuilder<T extends RowData>() {
  const helper = createColumnHelper<DeskTableFeatures, T>();
  return helper;
}

const columnBuilder = deskColumnBuilder<any>();

export const selectionColumn = columnBuilder.display({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={
        table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Pilih semua"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Pilih"
    />
  ),
  size: 20,
});

function useColumnSizing<TData extends RowData, TSelected>(
  table: ReactTable<ListFeatures, TData, TSelected>,
  tableRef: RefObject<HTMLTableElement | null>,
  onSynced: () => void,
) {
  const columnKey = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .join("|");

  useLayoutEffect(() => {
    const tableEl = tableRef.current;
    const container = tableEl?.parentElement;

    if (!tableEl || !container) return;

    let lastWidth = -1;
    let writtenVars = new Set<string>();
    let isSynced = false;

    const writeColumnSizeVars = () => {
      const nextVars = new Set<string>();

      for (const header of table.getFlatHeaders()) {
        const headerVar = `--header-${header.id}-size`;
        const columnVar = `--col-${header.column.id}-size`;

        tableEl.style.setProperty(headerVar, String(header.getSize()));

        tableEl.style.setProperty(columnVar, String(header.column.getSize()));

        nextVars.add(headerVar);
        nextVars.add(columnVar);
      }

      for (const name of writtenVars) {
        if (!nextVars.has(name)) {
          tableEl.style.removeProperty(name);
        }
      }

      writtenVars = nextVars;
    };

    const fitToContainer = (force = false) => {
      const width = container.clientWidth;

      if (width <= 0 || (!force && width === lastWidth)) return;

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
        const maxSize = column.columnDef.maxSize ?? Number.POSITIVE_INFINITY;

        const raw =
          index === columns.length - 1
            ? width - assigned
            : (column.getSize() / currentTotal) * width;

        const size = Math.min(maxSize, Math.max(minSize, Math.round(raw)));

        next[column.id] = size;
        assigned += size;
      });

      table.setColumnSizing(next);
      writeColumnSizeVars();

      if (!isSynced) {
        isSynced = true;
        onSynced();
      }
    };

    fitToContainer();

    const { unsubscribe } =
      table.atoms.columnSizing.subscribe(writeColumnSizeVars);

    let frame = 0;

    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        fitToContainer();
      });
    });

    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnKey]);
}

export function DeskTable<TData extends RowData>({
  table,
  isLoading,
}: {
  table: ReactTable<ListFeatures, TData>;
  isLoading?: boolean;
}) {
  const tableRef = useRef<HTMLTableElement>(null);

  const [isColumnSynced, setIsColumnSynced] = useState(false);

  useColumnSizing(table, tableRef, () => {
    setIsColumnSynced(true);
  });

  return (
    <Table
      ref={tableRef}
      className={`w-full table-fixed ${isColumnSynced ? "visible" : "invisible"}`}
      style={{ minWidth: table.getTotalSize() }}
    >
      <DeskTableHeader
        groups={table.getHeaderGroups()}
        render={(header) => (
          <Fragment>
            <table.FlexRender header={header} />
            {header.column.getCanResize() && (
              <table.Subscribe
                selector={(state) =>
                  state.columnResizing.isResizingColumn === header.column.id
                }
              >
                {(isResizing) => (
                  <div className="absolute inset-y-0 right-0 z-10 flex h-full items-center">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`bg-background cursor-col-resize touch-none select-none ${
                        isResizing ? "bg-border" : ""
                      }`}
                    >
                      <ArrowRightLeftIcon className="size-3" />
                    </Button>
                  </div>
                )}
              </table.Subscribe>
            )}
          </Fragment>
        )}
      />
      {isLoading ? (
        <DeskTableBodyFallback table={table} />
      ) : (
        <DeskTableBody
          rows={table.getRowModel().rows}
          renderCell={(cell) => <table.FlexRender cell={cell} />}
        />
      )}
    </Table>
  );
}

export function DeskTableHeader<T extends RowData>({
  groups,
  render,
}: DeskTableHeaderProps<T>) {
  return (
    <TableHeader className="bg-background shadow-border sticky top-0 z-40 shadow-[0_1px_0_0]">
      {groups.map((group) => (
        <TableRow key={group.id}>
          {group.headers.map((header) => (
            <TableHead
              key={header.id}
              className={`relative overflow-hidden text-ellipsis first:pl-4 last:pr-4 ${getAlignClass(
                header.column.columnDef.meta?.align,
              )}`}
              style={{ width: `calc(var(--header-${header.id}-size) * 1px)` }}
            >
              {render(header)}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export type DeskTableBodyProps<T extends RowData> = {
  rows: Row<DeskTableFeatures, T>[];
  renderCell: (cell: Cell_Core<DeskTableFeatures, T>) => ReactNode;
};

export function DeskTableBody<T extends RowData>({
  rows,
  renderCell,
}: DeskTableBodyProps<T>) {
  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.id}>
          {row.getAllCells().map((cell) => (
            <DeskTableCell
              key={cell.id}
              columnId={cell.id}
              align={cell.column.columnDef.meta?.align}
            >
              {renderCell(cell)}
            </DeskTableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

export function DeskTableCell({
  children,
  columnId,
  align,
}: {
  children: ReactNode;
  columnId: string;
  align?: DeskTableColumnMeta["align"];
}) {
  return (
    <TableCell
      className={`overflow-hidden text-ellipsis first:pl-4 last:pr-4 ${getAlignClass(
        align,
      )}`}
      style={{ width: `calc(var(--col-${columnId}-size) * 1px)` }}
    >
      {children}
    </TableCell>
  );
}

const SKELETON_WIDTHS = ["w-16", "w-24", "w-20", "w-32", "w-28", "w-24"];

export function DeskTableBodyFallback<TData extends RowData>({
  table,
  rowNumber = 10,
}: {
  table: ReactTable<ListFeatures, TData>;
  rowNumber?: number;
}) {
  const columns = table.getAllLeafColumns();

  return (
    <TableBody>
      {Array.from({ length: rowNumber }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {columns.map((column, columnIndex) => (
            <DeskTableCell
              key={column.id}
              columnId={column.id}
              align={column.columnDef.meta?.align}
            >
              <Skeleton
                className={`h-4 ${
                  SKELETON_WIDTHS[columnIndex % SKELETON_WIDTHS.length]
                }`}
              />
            </DeskTableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
