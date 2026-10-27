import type {
  DeskListContentProps,
  DeskListProps,
  DeskListView,
} from "../types/view";
import { useView } from "../hooks/use-view";
import { useIsMobile } from "~/hooks/use-mobile";
import { BottomBar, TopBar } from "./bar";
import DeskHeader from "./header";
import { usePagination } from "~/hooks/use-pagination";
import DeskPagination from "./pagination";
import type { RowData } from "@tanstack/react-table";
import { DeskTable, DeskTableFallback } from "./table";
import {
  Suspense,
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Await, Link } from "react-router";
import FilterInputQuery from "./filter-input-query";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  HomeIcon,
  LayoutGridIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
} from "lucide-react";
import { useNavigate } from "~/hooks/use-navigate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const LONG_PRESS_DELAY_MS = 500;

export function DeskList<T extends RowData>({
  data,
  columns,
  children,
  metadata,
  options,
}: DeskListProps<T>) {
  const isMobile = useIsMobile();
  const { view, setView } = useView(!!children);
  const homeUrl = "/desk";
  const { navigate, navigateBack, isBackHome, navigateNext, isLastPage } =
    useNavigate({ homeUrl });

  const [pagination] = usePagination(metadata);

  const [menuOpen, setMenuOpen] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const startLongPress = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      didLongPress.current = false;
      clearLongPressTimer();

      longPressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        setMenuOpen(true);
        navigator.vibrate?.(10);
      }, LONG_PRESS_DELAY_MS);
    },
    [clearLongPressTimer],
  );

  const handleBackClick = useCallback(() => {
    clearLongPressTimer();

    // The click that follows a long press should not also navigate back.
    if (didLongPress.current) {
      didLongPress.current = false;
      return;
    }

    // A short tap while the menu is open just closes the menu.
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }

    navigateBack();
  }, [clearLongPressTimer, menuOpen, navigateBack]);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden pb-12 md:pb-0">
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
      <BottomBar>
        <div className="bg-background grid grid-cols-5 items-center rounded-2xl border-t p-2">
          <div className="flex items-center justify-center">
            <DropdownMenu
              open={menuOpen}
              onOpenChange={(open, details) => {
                // Short presses navigate back, so ignore the menu's default
                // trigger toggle and only react to outside press / item press.
                if (details.reason === "trigger-press") return;
                setMenuOpen(open);
              }}
            >
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="touch-manipulation select-none [-webkit-touch-callout:none]"
                    aria-label={isBackHome ? "Kembali ke beranda" : "Kembali"}
                    onClick={handleBackClick}
                    onPointerDown={startLongPress}
                    onPointerUp={clearLongPressTimer}
                    onPointerLeave={clearLongPressTimer}
                    onPointerCancel={clearLongPressTimer}
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    {isBackHome ? (
                      <HomeIcon className="size-6" />
                    ) : (
                      <ArrowLeftIcon className="size-6" />
                    )}
                  </Button>
                }
              />
              <DropdownMenuContent side="top" align="center" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(homeUrl);
                  }}
                >
                  <HomeIcon />
                  Beranda
                </DropdownMenuItem>
                {!isLastPage && (
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuOpen(false);
                      navigateNext();
                    }}
                  >
                    <ArrowRightIcon />
                    Halaman berikutnya
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center justify-center">
            {view === "grid" ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setView("grid")}
              >
                <LayoutGridIcon className="size-6" />
              </Button>
            ) : (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setView("table")}
                disabled={!children}
              >
                <TableIcon className="size-6" />
              </Button>
            )}
          </div>
          <div className="flex h-6 items-center justify-center">
            <Button
              size="icon-lg"
              className="size-16 -translate-y-2/5 rounded-full"
              nativeButton={false}
              render={
                <Link to="/desk">
                  <PlusIcon className="size-6" />
                </Link>
              }
            />
          </div>
          <div className="flex items-center justify-center">
            <Button variant="ghost" size="icon">
              <SearchIcon className="size-6" />
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              nativeButton={false}
              render={
                <Link to="/desk">
                  <EllipsisVerticalIcon className="size-6" />
                </Link>
              }
            />
          </div>
        </div>
      </BottomBar>
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
