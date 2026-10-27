import { deskColumnBuilder } from "~/features/desk/components/table";
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
import { formatCurrency } from "~/utils/tools";
import type { Handle } from "~/features/desk/types/route";
import { BookMarkedIcon, EllipsisVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useHasAccess } from "~/features/desk/hooks/use-has-access";
import {
  DeskList,
  DeskListContent,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { DeskFilter } from "~/features/desk/components/filter";
import { useListView } from "~/features/desk/hooks/use-list-view";

const title = "Produk";

const columnBuilder = deskColumnBuilder<Product>();
const columns = columnBuilder.columns([
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
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon">
                <EllipsisVerticalIcon />
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                render={<Link to={`/desk/products/${product.id}`}>Buka</Link>}
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
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
  const promiseProducts = promiseGetProducts.then((result) => result.products);
  const promiseMetadata = promiseGetProducts.then((result) => result.metadata);

  return data({ promiseProducts, promiseMetadata });
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
  const { promiseProducts, promiseMetadata } = loaderData;
  const showCreateButton = useHasAccess("insert", "products");
  const { view, gridViewEnabled } = useListView(true);

  const outlet = useOutlet();

  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList>
      <DeskListTopBar metadata={promiseMetadata}>
        <DeskFilter />
      </DeskListTopBar>
      <DeskListContent
        data={promiseProducts}
        columns={columns}
        enableGridView={gridViewEnabled}
        view={view}
      >
        d
      </DeskListContent>
    </DeskList>
  );
}
