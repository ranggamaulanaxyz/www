import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProductTemplates } from "../services/product-template";
import { data, Outlet, useOutlet } from "react-router";
import { createShouldRevalidate } from "~/utils/revalidate";
import type { ProductTemplateWithRelations } from "../types/product-template";
import { parseFilter } from "~/features/desk/services/filter";
import { formatCurrency } from "~/utils/tools";
import type { Handle } from "~/features/desk/types/route";
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
import { useNavigate } from "~/hooks/use-navigate";

const title = "Produk";

const columnBuilder = deskColumnBuilder<ProductTemplateWithRelations>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("code", { header: "Kode", size: 100 }),
  columnBuilder.accessor("name", { header: "Nama" }),
  columnBuilder.display({
    id: "categoryId",
    header: "Kategori",
    cell: ({ row: { original } }) =>
      original.category?.name ?? original.categoryId ?? "-",
  }),
  columnBuilder.display({
    id: "brandId",
    header: "Merek",
    cell: ({ row: { original } }) =>
      original.brand?.name ?? original.brandId ?? "-",
  }),
  columnBuilder.display({
    id: "defaultIncomeAccountId",
    header: "Akun Pendapatan",
    cell: ({ row: { original } }) =>
      original.defaultIncomeAccount?.name ??
      original.defaultIncomeAccountId ??
      "-",
  }),
  columnBuilder.display({
    id: "defaultExpenseAccountId",
    header: "Akun Beban",
    cell: ({ row: { original } }) =>
      original.defaultExpenseAccount?.name ??
      original.defaultExpenseAccountId ??
      "-",
  }),
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

  const promiseGetProductTemplates = getProductTemplates(
    supabase,
    filterOptions,
  );
  const products = promiseGetProductTemplates.then(
    (result) => result.productTemplates,
  );
  const metadata = promiseGetProductTemplates.then((result) => result.metadata);

  return data({ data: products, metadata });
}

export const shouldRevalidate = createShouldRevalidate();

export default function ProductList({ loaderData }: Route.ComponentProps) {
  const { data, metadata } = loaderData;
  const { navigate } = useNavigate();
  const { table, rows, state, ...listProps } = useDeskList({
    resource: "product_templates",
    columns,
    data,
    metadata,
  });
  const outlet = useOutlet();

  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList onClickCreate={() => navigate("new")} {...listProps}>
      <DeskListTopBar metadata={metadata}>
        <div className="hidden items-center md:flex">
          <DeskFilter {...listProps.filter} />
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
