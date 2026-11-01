import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProducts } from "../services/product";
import { data, Link, Outlet, useOutlet } from "react-router";
import { createShouldRevalidate } from "~/utils/revalidate";
import type { Product } from "../types/product";
import { parseFilter } from "~/features/desk/services/filter";
import { formatCurrency, sleep } from "~/utils/tools";
import type { Handle } from "~/features/desk/types/route";
import { BookMarkedIcon, EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useDeskList } from "~/features/desk/hooks/use-list";
import {
  DeskList,
  DeskListActions,
  DeskListBottomBar,
  DeskListContent,
  DeskListGrid,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { DeskFilter, useDeskFilter } from "~/features/desk/components/filter";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { DeskProductActionDropdown } from "../components/desk";
import { productSidebarRegistry } from "../sidebar";
import { DeskBottomBarItem } from "~/features/desk/components/bar";

const title = "Produk";

const columnBuilder = deskColumnBuilder<Product>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("code", { header: "Kode", size: 100 }),
  columnBuilder.accessor("name", { header: "Nama" }),
  columnBuilder.accessor("costPrice", {
    header: "Harga Beli",
    cell: ({ getValue }) => formatCurrency(getValue()),
    meta: { align: "right" },
  }),
  columnBuilder.accessor("salePrice", {
    header: "Harga Jual",
    cell: ({ getValue }) => formatCurrency(getValue()),
    meta: { align: "right" },
  }),
  columnBuilder.display({
    id: "actions",
    cell: ({ row: { original: product } }) => {
      return <DeskProductActionDropdown product={product} />;
    },
    enableResizing: false,
    size: 50,
  }),
]);

export const handle = {
  breadcrumb: { label: title },
  sidebarRegistry: productSidebarRegistry,
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);
  const supabase = context.get(supabaseClientContext);

  const promiseGetProducts = getProducts(supabase, filterOptions);
  const products = promiseGetProducts.then((result) => result.products);
  const metadata = promiseGetProducts.then((result) => result.metadata);

  return data({ data: products, metadata });
}

export const shouldRevalidate = createShouldRevalidate();

export default function ProductList({ loaderData }: Route.ComponentProps) {
  const { data, metadata } = loaderData;
  const { table, rows, state, ...listProps } = useDeskList({
    resource: "products",
    columns,
    data,
    metadata,
  });
  const filter = useDeskFilter();
  const outlet = useOutlet();

  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList
      filter={filter}
      onClickCreate={() => console.log("Create")}
      {...listProps}
    >
      <DeskListTopBar metadata={metadata}>
        <div className="hidden items-center md:flex">
          <DeskFilter {...filter} />
        </div>
      </DeskListTopBar>
      <DeskListContent view="table">
        <DeskTable table={table} isLoading={state === "loading"} />
      </DeskListContent>
      <DeskListContent view="grid">
        <DeskListGrid isLoading={state === "loading"}>
          {rows.map(({ original: product, ...row }) => (
            <Item key={row.id} variant="outline">
              <ItemContent>
                <ItemTitle>{product.name}</ItemTitle>
                <ItemDescription>
                  {formatCurrency(product.costPrice)}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DeskProductActionDropdown product={product} />
              </ItemActions>
            </Item>
          ))}
        </DeskListGrid>
      </DeskListContent>
      <DeskListBottomBar>
        <DeskBottomBarItem>
          <DeskListActions variant="ghost" iconClassName="size-6" />
        </DeskBottomBarItem>
      </DeskListBottomBar>
    </DeskList>
  );
}
