import {
  tableFeatures,
  columnSizingFeature,
  columnResizingFeature,
  useTable,
  type ColumnSizingState,
  type RowData,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Fragment,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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
import { Await, Link, useSearchParams } from "react-router";
import { FolderXIcon, LayoutGridIcon, PlusIcon, TableIcon } from "lucide-react";
import { useIsMobile } from "~/hooks/use-mobile";
import FilterInputQuery from "./filter-input-query";
import { ButtonGroup } from "~/components/ui/button-group";
import type {
  DeskTableContentProps,
  DeskTableGridProps,
  DeskTableLayoutProps,
  DeskTableProps,
  DeskTableSkeletonProps,
  DeskTableView,
} from "../types/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import DeskPagination from "./pagination";
import { parseFilter } from "../services/filter";

export type {
  DeskTableColumn,
  DeskTableColumns,
  DeskTableView,
} from "../types/table";

export const features = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
});

export function deskColumnBuilder<TData extends RowData>() {
  const helper = createColumnHelper<typeof features, TData>();
  return helper;
}

// `useLayoutEffect` logs a warning while rendering on the server.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function isPromiseLike<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T> | null)?.then === "function";
}

function useView({ enableGridView }: { enableGridView: boolean }) {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get("view");

  let view: DeskTableView = "table";
  if (
    enableGridView &&
    (requestedView === "grid" || (requestedView !== "table" && isMobile))
  ) {
    view = "grid";
  }

  const setView = (nextView: DeskTableView) => {
    if (!enableGridView) return;
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("view", nextView);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return { view, setView, gridViewEnabled: enableGridView };
}

function usePagination(
  data:
    | { from: number; to: number; count: number }
    | Promise<{ from: number; to: number; count: number }>,
) {
  const [searchParams] = useSearchParams();
  const filterOptions = parseFilter(searchParams);
  const [state, setState] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });

  useEffect(() => {
    const resolveData = async () => {
      const { from, to, count } = await data;
      setState({ from, to, count });
    };
    resolveData();
  }, [searchParams]);

  return [state, setState] as const;
}

export default function DeskTable<TData extends RowData>({
  data,
  metadata,
  columns,
  skeletonRows = 10,
  showCreateButton,
  renderFooter,
  renderGridItem,
  renderGridFallback,
  renderEmpty,
}: DeskTableProps<TData>) {
  const { view, setView, gridViewEnabled } = useView({
    enableGridView: renderGridItem !== null,
  });
  const [pagination] = usePagination(metadata);

  const renderItems = (resolved: TData[]) =>
    view === "grid" && renderGridItem ? (
      <DeskTableGrid
        items={resolved}
        renderItem={renderGridItem}
        renderEmpty={renderEmpty}
      />
    ) : (
      <DeskTableContent
        data={resolved}
        columns={columns}
        renderFooter={renderFooter}
        renderEmpty={renderEmpty}
        skeletonRows={skeletonRows}
      />
    );

  const fallback =
    view === "grid" ? (
      renderGridFallback ? (
        // Custom fallbacks are placed inside the standard grid container so
        // the scroll area and column layout stay identical.
        <div data-desk-scroll className={GRID_CLASSES}>
          {renderGridFallback(skeletonRows)}
        </div>
      ) : (
        <DeskTableGridSkeleton rows={skeletonRows} />
      )
    ) : (
      <DeskTableSkeleton columns={columns} rows={skeletonRows} />
    );

  return (
    <DeskTableLayout
      showCreateButton={showCreateButton}
      pagination={pagination}
      view={gridViewEnabled ? view : undefined}
      onViewChange={gridViewEnabled ? setView : undefined}
    >
      <Suspense fallback={fallback}>
        {isPromiseLike(data) ? (
          <Await resolve={data}>{(resolved) => renderItems(resolved)}</Await>
        ) : (
          renderItems(data)
        )}
      </Suspense>
    </DeskTableLayout>
  );
}

function DeskTableContent<TData extends RowData>({
  data,
  columns,
  renderFooter,
  renderEmpty,
}: DeskTableContentProps<TData>) {
  const table = useTable({
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

  if (rows.length === 0) {
    return renderEmpty ?? <DeskTableEmpty />;
  }

  return (
    <Table
      ref={tableRef}
      className="table-fixed"
      containerClassName="h-full pt-[var(--desk-topbar-height,0px)]"
      containerStyle={{ maxHeight: "none" }}
    >
      <TableHeader className="bg-background sticky top-0 z-10 translate-y-0 shadow transition-transform duration-200 ease-out will-change-transform group-data-[topbar-hidden=true]/desk:-translate-y-(--desk-topbar-height,0px)">
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
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
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
        {rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="overflow-hidden text-ellipsis first:pl-4 last:pr-4"
              >
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {renderFooter ? (
        <TableFooter className="sticky bottom-0 z-10">
          <TableRow>
            <TableCell
              colSpan={visibleColumnCount}
              className="first:pl-4 last:pr-4"
            >
              {renderFooter(table)}
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

const GRID_CLASSES =
  "grid h-full auto-rows-max grid-cols-1 gap-3 overflow-y-auto p-4 pt-[calc(var(--desk-topbar-height,0px)+1rem)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function DeskTableGrid<TData extends RowData>({
  items,
  renderItem,
  renderEmpty,
}: DeskTableGridProps<TData>) {
  if (items.length === 0) {
    return renderEmpty ?? <DeskTableEmpty />;
  }

  return (
    <div data-desk-scroll className={GRID_CLASSES}>
      {items.map((item, index) => (
        <Fragment key={index}>{renderItem(item, index)}</Fragment>
      ))}
    </div>
  );
}

export function DeskTableGridSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div data-desk-scroll className={GRID_CLASSES}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-3 border p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

/**
 * Table-shaped loading state. Used as the Suspense fallback inside
 * `DeskTable`, and available directly for route-level suspense boundaries.
 */
export function DeskTableSkeleton<TData extends RowData>({
  columns,
  rows = 10,
}: DeskTableSkeletonProps<TData>) {
  return (
    <Table
      className="table-fixed"
      containerClassName="h-full pt-[var(--desk-topbar-height,0px)]"
      containerStyle={{ maxHeight: "none" }}
    >
      <TableHeader className="bg-background sticky top-(--desk-topbar-height,0px) z-10 translate-y-0 shadow transition-transform duration-200 ease-out will-change-transform group-data-[topbar-hidden=true]/desk:-translate-y-(--desk-topbar-height,0px)">
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

export function DeskTableEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderXIcon />
        </EmptyMedia>
        <EmptyTitle>Tidak Ada Data</EmptyTitle>
        <EmptyDescription>
          Kamu belum membuat data apapun disini. Mulailah menambahkan data.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function DeskTableLayout({
  children,
  showCreateButton = true,
  createLink,
  view,
  onViewChange,
  pagination,
}: DeskTableLayoutProps) {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  return (
    <div className="group/desk flex h-dvh min-w-0 flex-col overflow-hidden">
      <TopBar>
        <DeskHeader>
          <div className="flex items-center gap-2 px-4">
            {!isMobile && (
              <div className="hidden items-center md:flex">
                <DeskPagination {...pagination} />
              </div>
            )}
            {view && onViewChange && (
              <ButtonGroup>
                <Button
                  type="button"
                  size="icon"
                  variant={view === "table" ? "secondary" : "ghost"}
                  aria-pressed={view === "table"}
                  aria-label="Tampilan tabel"
                  title="Tampilan tabel"
                  onClick={() => onViewChange("table")}
                >
                  <TableIcon />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant={view === "grid" ? "secondary" : "ghost"}
                  aria-pressed={view === "grid"}
                  aria-label="Tampilan kanban"
                  title="Tampilan kanban"
                  onClick={() => onViewChange("grid")}
                >
                  <LayoutGridIcon />
                </Button>
              </ButtonGroup>
            )}

            {!isMobile && (
              <div className="hidden items-center md:flex">
                <FilterInputQuery />
              </div>
            )}
            {showCreateButton && (
              <Button
                nativeButton={false}
                render={
                  <Link
                    to={
                      createLink ?? {
                        pathname: "new",
                        search: searchParams.toString(),
                      }
                    }
                  >
                    <PlusIcon /> Tambah
                  </Link>
                }
              />
            )}
          </div>
        </DeskHeader>
      </TopBar>
      <div className="min-h-0 flex-1">{isMobile !== undefined && children}</div>
    </div>
  );
}
