import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProducts } from "../services/product";
import {
  data,
  Link,
  Outlet,
  useOutlet,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
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
import { useList } from "~/features/desk/hooks/use-list";
import {
  DeskList,
  DeskListBottomBar,
  DeskListContent,
  DeskListGrid,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { DeskFilter } from "~/features/desk/components/filter";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { DeskProductActionDropdown } from "../components/desk";

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
  sidebarRegistry: () => {
    return [
      {
        items: [
          {
            icon: BookMarkedIcon,
            label: "Jurnal Umum",
            pathname: "/desk/accounting/moves",
            matchPattern: "/desk/accounting/moves/*",
          },
        ],
      },
    ];
  },
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

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  if (currentUrl.pathname === nextUrl.pathname) {
    const currentParams = new URLSearchParams(currentUrl.search);
    const nextParams = new URLSearchParams(nextUrl.search);
    currentParams.delete("view");
    nextParams.delete("view");
    if (currentParams.toString() === nextParams.toString()) return false;
  }
  return defaultShouldRevalidate;
}

export default function ProductList({ loaderData }: Route.ComponentProps) {
  const { data, metadata } = loaderData;
  const { table, rows, state, view, setView } = useList({
    table: "products",
    columns,
    data,
    metadata,
  });
  const outlet = useOutlet();

  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList view={view} setView={setView}>
      <DeskListTopBar metadata={metadata}>
        <div className="hidden items-center md:flex">
          <DeskFilter />
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
      <DeskListBottomBar />
    </DeskList>
  );
}
