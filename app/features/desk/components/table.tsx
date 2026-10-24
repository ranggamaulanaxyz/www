import {
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
  useTable,
  type ColumnDef,
  type ColumnSizingState,
  type RowData,
} from "@tanstack/react-table";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { TopBar } from "./bar";
import DeskHeader from "./header";
import { Button } from "~/components/ui/button";
import { Await, Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import FilterInputQuery from "./filter-input-query";

export const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
});

// `useLayoutEffect` logs a warning while rendering on the server.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type DeskTableColumn<TData extends RowData> = ColumnDef<
  typeof features,
  TData
>;

export type DeskTableColumns<TData extends RowData> = Array<
  DeskTableColumn<TData>
>;

type DeskTableProps<TData extends RowData> = {
  /** Resolved rows, or a pending loader promise (streamed with `<Await>`). */
  data: TData[] | Promise<TData[]>;
  columns: DeskTableColumns<TData>;
  /** Optional footer content, rendered in a sticky row below the table. */
  footer?: ReactNode;
  /** Shown when there are no rows. */
  emptyMessage?: ReactNode;
  /** Number of skeleton rows rendered while the data is pending. */
  skeletonRows?: number;
  showCreateButton?: boolean;
};

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | null)?.then === "function";
}

export default function DeskTable<TData extends RowData>({
  data,
  columns,
  footer,
  emptyMessage,
  skeletonRows = 10,
  showCreateButton,
}: DeskTableProps<TData>) {
  return (
    <DeskTableLayout showCreateButton={showCreateButton}>
      <Suspense
        fallback={<DeskTableSkeleton columns={columns} rows={skeletonRows} />}
      >
        {isPromiseLike(data) ? (
          <Await resolve={data}>
            {(resolved) => (
              <DeskTableContent
                data={resolved}
                columns={columns}
                footer={footer}
                emptyMessage={emptyMessage}
                skeletonRows={skeletonRows}
              />
            )}
          </Await>
        ) : (
          <DeskTableContent
            data={data}
            columns={columns}
            footer={footer}
            emptyMessage={emptyMessage}
            skeletonRows={skeletonRows}
          />
        )}
      </Suspense>
    </DeskTableLayout>
  );
}

type DeskTableContentProps<TData extends RowData> = {
  data: TData[];
  columns: DeskTableColumns<TData>;
  footer?: ReactNode;
  emptyMessage?: ReactNode;
  skeletonRows?: number;
};

function DeskTableContent<TData extends RowData>({
  data,
  columns,
  footer,
  emptyMessage = "Tidak ada data",
  skeletonRows = 10,
}: DeskTableContentProps<TData>) {
  const { FlexRender, ...table } = useTable({
    features,
    columns,
    data,
    columnResizeMode: "onChange",
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const fitToContainerRef = useRef<(force?: boolean) => void>(() => {});

  // Re-run the sizing effect whenever the set of columns changes (e.g. a role
  // switch renders different columns at the same container width). The string
  // is stable across renders, unlike the `columns` array itself.
  const columnKey = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .join("|");

  useIsomorphicLayoutEffect(() => {
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
      }
      // Drop vars for columns that no longer exist.
      for (const name of writtenVars) {
        if (!nextVars.has(name)) tableEl.style.removeProperty(name);
      }
      writtenVars = nextVars;
      // Only fall back to the sum of the columns when they are wider than the
      // container (horizontal scroll); otherwise the table spans 100%.
      tableEl.style.minWidth = `${table.getTotalSize()}px`;
    };

    // Distribute the container width across all visible columns, keeping each
    // column's current size as its share.
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
          ? // Absorb rounding drift so the widths sum to the container width
            width - assigned
          : (column.getSize() / currentTotal) * width;
        const size = Math.min(maxSize, Math.max(minSize, Math.round(raw)));
        next[column.id] = size;
        assigned += size;
      });

      table.setColumnSizing(next);
    };

    fitToContainerRef.current = fitToContainer;

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
      fitToContainerRef.current = () => {};
    };
    // `table` is intentionally omitted: `useTable()` returns a new wrapper
    // object on every render, so depending on it would re-run this effect
    // (and reset the column sizes) on every render, including while dragging.
    // The underlying table instance and its methods are stable, and
    // `columnKey` covers column definition changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnKey]);

  const visibleColumnCount = table.getAllLeafColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <Table ref={tableRef} className="table-fixed">
      <TableHeader className="bg-background sticky top-0 z-10 shadow">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const isResizing = header.column.getIsResizing();

              return (
                <TableHead
                  key={header.id}
                  className="relative overflow-hidden text-ellipsis first:pl-4 last:pr-4"
                  colSpan={header.colSpan}
                  style={{
                    width: `calc(var(--header-${header.id}-size) * 1px)`,
                  }}
                >
                  {header.isPlaceholder ? null : <FlexRender header={header} />}
                  {!header.isPlaceholder && header.column.getCanResize() && (
                    <button
                      type="button"
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Ubah lebar kolom ${header.column.id}`}
                      tabIndex={-1}
                      className={`hover:bg-border absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none bg-transparent select-none ${
                        isResizing ? "bg-border" : ""
                      }`}
                      onDoubleClick={(event) => {
                        event.stopPropagation();
                        header.column.resetSize();
                        fitToContainerRef.current(true);
                      }}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                    />
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={visibleColumnCount}
              className="text-muted-foreground h-24 text-center"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="overflow-hidden text-ellipsis first:pl-4 last:pr-4"
                >
                  <FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
      {footer ? (
        <TableFooter className="sticky bottom-0 z-10">
          <TableRow>
            <TableCell
              colSpan={visibleColumnCount}
              className="first:pl-4 last:pr-4"
            >
              {footer}
            </TableCell>
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
}

const SKELETON_WIDTHS = ["w-16", "w-24", "w-20", "w-32", "w-28", "w-24"];

function SkeletonRows({
  columnCount,
  rows,
}: {
  columnCount: number;
  rows: number;
}) {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <TableRow key={rowIndex}>
      {Array.from({ length: columnCount }).map((_, columnIndex) => (
        <TableCell key={columnIndex} className="first:pl-4 last:pr-4">
          <Skeleton
            className={`h-4 ${
              SKELETON_WIDTHS[columnIndex % SKELETON_WIDTHS.length]
            }`}
          />
        </TableCell>
      ))}
    </TableRow>
  ));
}

type DeskTableSkeletonProps<TData extends RowData> = {
  columns: DeskTableColumns<TData>;
  rows?: number;
};

/**
 * Table-shaped loading state. Used as the Suspense fallback inside
 * `DeskTable`, and available directly for route-level suspense boundaries.
 */
export function DeskTableSkeleton<TData extends RowData>({
  columns,
  rows = 10,
}: DeskTableSkeletonProps<TData>) {
  return (
    <Table className="table-fixed">
      <TableHeader className="bg-background sticky top-0 z-10 shadow">
        <TableRow>
          {columns.map((column, index) => (
            <TableHead
              key={index}
              className="overflow-hidden text-ellipsis first:pl-4 last:pr-4"
            >
              {typeof column.header === "string" ? column.header : null}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <SkeletonRows columnCount={columns.length} rows={rows} />
      </TableBody>
    </Table>
  );
}

type DeskTableLayoutProps = {
  children: ReactNode;
  showCreateButton?: boolean;
  createTo?: string;
};

export function DeskTableLayout({
  children,
  showCreateButton = true,
  createTo = "new",
}: DeskTableLayoutProps) {
  const isMobile = useIsMobile();
  const topBarRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const [topBarHidden, setTopBarHidden] = useState(false);

  useIsomorphicLayoutEffect(() => {
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

  // The table scrolls inside its own container instead of the window, so the
  // topbar has to follow that container rather than `useTopBarHidden`.
  useIsomorphicLayoutEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;

    let lastScrollTop = 0;
    let lastTarget: EventTarget | null = null;

    const onScroll = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('[data-slot="table-container"]')) return;

      const nextScrollTop = target.scrollTop;
      if (target !== lastTarget) {
        lastTarget = target;
        lastScrollTop = nextScrollTop;
        setTopBarHidden(nextScrollTop > 0);
        return;
      }

      // Hide while scrolling down past the top, reveal when scrolling up.
      setTopBarHidden(nextScrollTop > 0 && nextScrollTop > lastScrollTop);
      lastScrollTop = nextScrollTop;
    };

    // Scroll does not bubble, but it does go through the capture phase, so
    // this keeps working when the loading skeleton is swapped for the table.
    layout.addEventListener("scroll", onScroll, true);
    return () => layout.removeEventListener("scroll", onScroll, true);
  }, []);

  return (
    <div ref={layoutRef} className="flex min-w-0 flex-col">
      <div
        ref={topBarRef}
        className={`grid shrink-0 transition-[grid-template-rows] duration-200 ease-linear ${
          topBarHidden ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <TopBar hidden={topBarHidden}>
            <DeskHeader>
              <div className="flex items-center gap-4 px-4">
                {!isMobile && <FilterInputQuery />}
                {showCreateButton && (
                  <Button
                    nativeButton={false}
                    render={
                      <Link to={createTo}>
                        <PlusIcon /> Tambah
                      </Link>
                    }
                  />
                )}
              </div>
            </DeskHeader>
          </TopBar>
        </div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
