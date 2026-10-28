import { Fragment, Suspense, type ReactNode } from "react";
import { DeskBottomBar, DeskTopBar } from "./bar";
import { useIsMobile } from "~/hooks/use-mobile";
import DeskPagination from "./pagination";
import { Await } from "react-router";
import type { RowData } from "@tanstack/react-table";
import { DeskTable, type DeskTableColumns } from "./table";
import { useListView, type DeskListView } from "../hooks/use-list-view";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
  GridIcon,
  HomeIcon,
  TableIcon,
} from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import type { ListView } from "../hooks/use-list";
import { cn } from "cn";
import { Skeleton } from "~/components/ui/skeleton";
import { useNavigate } from "~/hooks/use-navigate";

type DeskListMetadata = {
  from: number;
  to: number;
  count: number;
  size: number;
};

type DeskListProps = {
  view: ListView;
  setView: (view: ListView) => void;
  children: ReactNode;
};

export function DeskList({ view, children, setView }: DeskListProps) {
  return (
    <Tabs
      className="flex h-dvh min-w-0 flex-col gap-0 overflow-hidden pb-12 md:pb-0"
      value={view}
      onValueChange={setView}
    >
      {children}
    </Tabs>
  );
}

type DeskListTopBarProps = {
  metadata: DeskListMetadata | Promise<DeskListMetadata>;
  children?: ReactNode;
};

export function DeskListTopBar({ metadata, children }: DeskListTopBarProps) {
  return (
    <DeskTopBar>
      <div className="flex items-center">
        <div className="items-center gap-2">
          <Suspense fallback={<DeskPagination />}>
            <Await
              resolve={metadata}
              children={(metadata) => <DeskPagination {...metadata} />}
            />
          </Suspense>
        </div>
        {children}
      </div>
    </DeskTopBar>
  );
}

type DeskListBottomBarProps = {
  children?: ReactNode;
};

export function DeskListBottomBar({ children }: DeskListBottomBarProps) {
  const { navigateBack, navigateNext, canGoBack, canGoNext } = useNavigate({
    homeUrl: "/desk",
  });
  return (
    <DeskBottomBar>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={() => navigateBack()}
        >
          {canGoBack ? (
            <ArrowLeftIcon className="size-6" />
          ) : (
            <HomeIcon className="size-6" />
          )}
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={() => navigateNext()}
          disabled={!canGoNext}
        >
          <ArrowRightIcon className="size-6" />
        </Button>
      </div>
    </DeskBottomBar>
  );
}

type DeskListContentProps = {
  view: ListView;
  children: ReactNode;
};

export function DeskListContent({ view, children }: DeskListContentProps) {
  return <TabsContent value={view}>{children}</TabsContent>;
}

export function DeskListActions({
  variant,
}: {
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  const { view, setView } = useListView(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={variant} size="icon">
            <EllipsisVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {view == "table" ? <TableIcon /> : <GridIcon />}
              <span>Tampilan</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Pilih Tampilan</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={view}
                    onValueChange={(value) => setView(value)}
                  >
                    <DropdownMenuRadioItem value="table">
                      <TableIcon /> Tabel
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="grid">
                      <GridIcon /> Kanban
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DeskListGridProps = {
  children: ReactNode;
  isLoading?: boolean;
};

export function DeskListGrid({ children, isLoading }: DeskListGridProps) {
  return (
    <div
      className={cn([
        "grid gap-2 p-4",
        "md:grid-cols-2 md:gap-3",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
      ])}
    >
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="h-10" />
          ))
        : children}
    </div>
  );
}
