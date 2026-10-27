import type {
  DeskListContentProps,
  DeskListProps,
  DeskListView,
} from "../types/view";
import { useView } from "../hooks/use-view";
import { useIsMobile } from "~/hooks/use-mobile";
import { TopBar } from "./bar";
import DeskHeader from "./header";
import { usePagination } from "~/hooks/use-pagination";
import DeskPagination from "./pagination";
import type { RowData } from "@tanstack/react-table";
import { DeskTable, DeskTableFallback } from "./table";
import { Children, Suspense, type ReactNode } from "react";
import { Await, Link } from "react-router";
import FilterInputQuery from "./filter-input-query";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { LayoutGridIcon, TableIcon } from "lucide-react";

export function DeskList<T extends RowData>({
  data,
  columns,
  children,
  metadata,
  options,
}: DeskListProps<T>) {
  const isMobile = useIsMobile();
  const { view, setView } = useView(!!children);
  const [pagination] = usePagination(metadata);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden">
      <TopBar>
        <DeskHeader>
          <div className="flex items-center">
            {isMobile === false && (
              <div className="hidden items-center md:flex">
                <FilterInputQuery /> <DeskPagination {...pagination} />
              </div>
            )}
            <div className="flex items-center">
              {!!children && (
                <ButtonGroup>
                  <Button
                    type="button"
                    size="icon"
                    variant={view === "table" ? "secondary" : "ghost"}
                    aria-pressed={view === "table"}
                    aria-label="Tampilan tabel"
                    title="Tampilan tabel"
                    onClick={() => setView("table")}
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
                    onClick={() => setView("grid")}
                  >
                    <LayoutGridIcon />
                  </Button>
                </ButtonGroup>
              )}
              {options?.showCreateButton && (
                <Button
                  nativeButton={false}
                  render={<Link to="/">Tambah</Link>}
                />
              )}
            </div>
          </div>
        </DeskHeader>
      </TopBar>
      <div className="min-h-0 flex-1">
        <DeskListContent view={view} data={data} columns={columns}>
          {children}
        </DeskListContent>
      </div>
    </div>
  );
}

export function DeskListContent<T extends RowData>({
  view,
  data,
  columns,
  children,
}: DeskListContentProps<T>) {
  const isMobile = useIsMobile();
  if (isMobile === undefined) {
    return null;
  }

  if (view === "grid" && children) {
    return children;
  }

  return (
    <Suspense fallback={<DeskTableFallback columns={columns} />}>
      <Await
        resolve={data}
        children={(data) => <DeskTable data={data} columns={columns} />}
      />
    </Suspense>
  );
}
