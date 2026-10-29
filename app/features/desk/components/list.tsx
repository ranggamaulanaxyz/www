import {
  createContext,
  Suspense,
  useContext,
  type MouseEvent,
  type ReactNode,
} from "react";
import { DeskBottomBar, DeskBottomBarItem, DeskTopBar } from "./bar";
import DeskPagination from "./pagination";
import { Await } from "react-router";
import { useListView } from "../hooks/use-list-view";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
  CommandIcon,
  EllipsisVerticalIcon,
  GridIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  TableIcon,
} from "lucide-react";
import type { VariantProps } from "class-variance-authority";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import type { ListView } from "../hooks/use-list";
import { cn } from "cn";
import { Skeleton } from "~/components/ui/skeleton";
import { useNavigate } from "~/hooks/use-navigate";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { DeskFilter, type DeskFilterState } from "./filter";

type DeskListMetadata = {
  from: number;
  to: number;
  count: number;
  size: number;
};

type CanCreate =
  | {
      canCreate: true;
      onClickCreate: (event?: MouseEvent<HTMLButtonElement>) => void;
    }
  | {
      canCreate?: false;
      onClickCreate?: (event?: MouseEvent<HTMLButtonElement>) => void;
    };

type DeskListContext = {
  view: ListView;
  setView: (view: ListView) => void;
  filter: DeskFilterState;
} & CanCreate;

type DeskListProps = DeskListContext & {
  children: ReactNode;
};

const DeskListContext = createContext<DeskListContext | null>(null);

function useDeskList() {
  return useContext(DeskListContext) || ({} as DeskListContext);
}

export function DeskList({ children, view, setView, ...props }: DeskListProps) {
  return (
    <DeskListContext.Provider value={{ view, setView, ...props }}>
      <Tabs
        className="flex h-dvh min-w-0 flex-col gap-0 overflow-hidden"
        value={view}
        onValueChange={setView}
      >
        {children}
      </Tabs>
    </DeskListContext.Provider>
  );
}

type DeskListTopBarProps = {
  metadata: DeskListMetadata | Promise<DeskListMetadata>;
  children?: ReactNode;
  actions?: ReactNode;
};

export function DeskListTopBar({
  metadata,
  children,
  actions,
}: DeskListTopBarProps) {
  const { canCreate, onClickCreate } = useDeskList();
  return (
    <DeskTopBar>
      <div className="flex items-center gap-1">
        <div className="items-center gap-2">
          <Suspense fallback={<DeskPagination />}>
            <Await
              resolve={metadata}
              children={(metadata) => <DeskPagination {...metadata} />}
            />
          </Suspense>
        </div>
        {children}

        <ButtonGroup className="hidden md:flex">
          {canCreate && onClickCreate && (
            <Button onClick={onClickCreate}>
              <PlusIcon /> <span>Tambah</span>
            </Button>
          )}
          <DeskListActions>{actions}</DeskListActions>
        </ButtonGroup>
      </div>
    </DeskTopBar>
  );
}

type DeskListBottomBarProps = {
  children?: ReactNode;
};

export function DeskListBottomBar({ children }: DeskListBottomBarProps) {
  const { filter, canCreate, onClickCreate } = useDeskList();
  const { navigateBack, navigateNext, canGoBack, canGoNext } = useNavigate({
    homeUrl: "/desk",
  });

  return (
    <DeskBottomBar>
      <DeskBottomBarItem>
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
      </DeskBottomBarItem>
      <DeskBottomBarItem>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-2xl"
          onClick={() => navigateNext()}
          disabled={!canGoNext}
        >
          <ArrowRightIcon className="size-6" />
        </Button>
      </DeskBottomBarItem>
      <DeskBottomBarItem className="h-8">
        {canCreate && onClickCreate ? (
          <Button
            variant="default"
            size="icon-lg"
            className="size-12 -translate-y-1/2 rounded shadow active:not-aria-[haspopup]:-translate-y-1/3"
            onClick={(e) => onClickCreate(e)}
          >
            <PlusIcon className="size-6" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon-lg"
            className="size-12 -translate-y-1/2 rounded shadow active:not-aria-[haspopup]:-translate-y-1/3"
          >
            <CommandIcon className="size-6" />
          </Button>
        )}
      </DeskBottomBarItem>
      <DeskBottomBarItem>
        <DeskFilter
          mode="dialog"
          renderTrigger={
            <Button variant="ghost" size="icon" className="rounded-2xl">
              <SearchIcon className="size-6" />
            </Button>
          }
          {...filter}
        />
      </DeskBottomBarItem>

      {children}
    </DeskBottomBar>
  );
}

type DeskListContentProps = {
  view: ListView;
  children: ReactNode;
};

export function DeskListContent({ view, children }: DeskListContentProps) {
  return (
    <TabsContent value={view}>
      <ScrollArea className="h-[calc(100dvh-6rem)] md:h-[calc(100dvh-3rem)]">
        {children}
      </ScrollArea>
    </TabsContent>
  );
}

export function DeskListActions({
  iconClassName,
  size,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { iconClassName?: string }) {
  const { view, setView } = useListView(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size={size || "icon"} {...props}>
            <EllipsisVerticalIcon className={iconClassName} />
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
