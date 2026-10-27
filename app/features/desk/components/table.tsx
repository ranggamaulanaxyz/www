import {
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
  createColumnHelper,
  type RowData,
  useTable,
  type ColumnDef,
  type HeaderGroup,
  type Header,
  type Row,
  type Cell_Core,
  type ColumnSizingState,
  type Table as TableInstance,
} from "@tanstack/react-table";
import {
  Fragment,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
});

export type DeskTableFeatures = typeof features;

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

/**
 * Keeps the column size CSS variables in sync with the table state and fits
 * the columns to their container. Shared by the real table and its skeleton
 * so both distribute their widths the same way.
 */
function useColumnSizing<T extends RowData>(
  table: TableInstance<DeskTableFeatures, T>,
  tableRef: RefObject<HTMLTableElement | null>,
) {
  // Stable string that changes only when the set of columns changes, unlike
  // the `columns` array itself.
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

    const writeColumnSizeVars = () => {
      const nextVars = new Set<string>();
      for (const header of table.getFlatHeaders()) {
        const headerVar = `--header-${header.id}-size`;
        tableEl.style.setProperty(headerVar, String(header.getSize()));
        nextVars.add(headerVar);
        tableEl.style.setProperty(
          `--col-${header.column.id}-size`,
          String(header.column.getSize()),
        );
      }
      // Drop vars for columns that no longer exist.
      for (const name of writtenVars) {
        if (!nextVars.has(name)) tableEl.style.removeProperty(name);
      }
      writtenVars = nextVars;
    };

    // Distribute the container width across the columns, keeping the current
    // size of each column as its share. This runs when the table is mounted
    // (after the data has loaded), when the columns change, and whenever the
    // container resizes.
    const fitToContainer = (force = false) => {
      const width = container.clientWidth;
      if (width <= 0 || (!force && width === lastWidth)) return;
      lastWidth = width;

      const visibleColumns = table.getAllLeafColumns();
      if (!visibleColumns.length) return;

      const currentTotal = visibleColumns.reduce(
        (sum, column) => sum + column.getSize(),
        0,
      );
      if (currentTotal <= 0) return;

      const next: ColumnSizingState = {};
      let assigned = 0;
      visibleColumns.forEach((column, index) => {
        const minSize = column.columnDef.minSize ?? 20;
        const maxSize = column.columnDef.maxSize ?? Number.POSITIVE_INFINITY;
        const isLast = index === visibleColumns.length - 1;
        const raw = isLast
          ? // Absorb rounding drift so the widths sum to the container width.
            width - assigned
          : (column.getSize() / currentTotal) * width;
        const size = Math.min(maxSize, Math.max(minSize, Math.round(raw)));
        next[column.id] = size;
        assigned += size;
      });

      table.setColumnSizing(next);
    };

    fitToContainer();
    writeColumnSizeVars(); // paint before the atom subscription fires

    const { unsubscribe } =
      table.atoms.columnSizing.subscribe(writeColumnSizeVars);

    // Defer the refit so we never write layout inside the observer callback
    // (avoids "ResizeObserver loop completed with undelivered notifications").
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fitToContainer());
    });
    observer.observe(container);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
    };
    // `table` is intentionally omitted: `useTable()` returns a new wrapper
    // object on every render, so depending on it would re-run this effect on
    // every render, including while dragging. `columnKey` covers column
    // definition changes and the component mounts after the data has loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnKey]);
}

export function DeskTable<T extends RowData>({
  data,
  columns,
  columnOptions,
}: DeskTableProps<T>) {
  const { FlexRender, Subscribe, ...table } = useTable({
    features,
    data,
    columns,
    columnResizeMode: "onChange",
    defaultColumn: columnOptions,
  });
  const tableRef = useRef<HTMLTableElement>(null);

  useColumnSizing(table, tableRef);

  return (
    <Table
      ref={tableRef}
      className="w-full table-fixed"
      style={{ minWidth: table.getTotalSize() }}
    >
      <DeskTableHeader
        groups={table.getHeaderGroups()}
        render={(header) => (
          <Fragment>
            <FlexRender header={header} />
            <Subscribe
              selector={(state) =>
                state.columnResizing.isResizingColumn === header.column.id
              }
            >
              {(isResizing) => (
                <button
                  onDoubleClick={() => header.column.resetSize()}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`hover:bg-border absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none bg-transparent select-none ${
                    isResizing ? "bg-border" : ""
                  }`}
                />
              )}
            </Subscribe>
          </Fragment>
        )}
      />
      <DeskTableBody
        rows={table.getRowModel().rows}
        renderCell={(cell) => <FlexRender cell={cell} />}
      />
    </Table>
  );
}

export function DeskTableHeader<T extends RowData>({
  groups,
  render,
}: DeskTableHeaderProps<T>) {
  return (
    <TableHeader className="bg-background shadow-border sticky top-0 shadow-[0_1px_0_0]">
      {groups.map((group) => (
        <TableRow key={group.id}>
          {group.headers.map((header) => (
            <TableHead
              key={header.id}
              className="relative overflow-hidden text-ellipsis first:pl-4 last:pr-4"
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
            <DeskTableCell key={cell.id} columnId={cell.id}>
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
}: {
  children: ReactNode;
  columnId: string;
}) {
  return (
    <TableCell
      className="overflow-hidden text-ellipsis first:pl-4 last:pr-4"
      style={{ width: `calc(var(--col-${columnId}-size) * 1px)` }}
    >
      {children}
    </TableCell>
  );
}

const SKELETON_WIDTHS = ["w-16", "w-24", "w-20", "w-32", "w-28", "w-24"];

export function DeskTableFallback<T extends RowData>({
  columns,
  rowNumber = 10,
}: {
  columns: DeskTableColumns<T>;
  rowNumber?: number;
}) {
  const { FlexRender, ...table } = useTable({ features, data: [], columns });
  const tableRef = useRef<HTMLTableElement>(null);
  // Leaf columns carry the same ids as the header/cell ids used by DeskTable,
  // so `column.id` is the `colId` the skeleton cells need.
  const leafColumns = table.getAllLeafColumns();

  // Distribute the skeleton columns exactly like the loaded table so the
  // layout does not shift when the rows arrive.
  useColumnSizing(table, tableRef);

  return (
    <Table
      ref={tableRef}
      className="w-full table-fixed"
      style={{ minWidth: table.getTotalSize() }}
    >
      <DeskTableHeader
        groups={table.getHeaderGroups()}
        render={(header) => <FlexRender header={header} />}
      />
      <TableBody>
        {Array.from({ length: rowNumber }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {leafColumns.map((column, columnIndex) => (
              <DeskTableCell key={column.id} columnId={column.id}>
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
    </Table>
  );
}
