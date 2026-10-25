import DeskTable, {
  type DeskTableColumns,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProducts } from "../services/product";
import { data, type ShouldRevalidateFunctionArgs } from "react-router";
import type { Product } from "../types/product";
import { Skeleton } from "~/components/ui/skeleton";
import { Item, ItemContent, ItemTitle } from "~/components/ui/item";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  // Return a pending promise instead of awaiting it so the table can render
  // its skeleton while the products stream in.
  const productResult = getProducts(supabase).then((result) => result.products);
  return data({ productResult });
}

// Switching between table/grid only changes `?view=`, so skip the refetch and
// keep the current rows on screen.
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

const columns: DeskTableColumns<Product> = [
  { accessorKey: "code", header: "Kode" },
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "costPrice", header: "Harga Beli" },
  { accessorKey: "salePrice", header: "Harga Jual" },
];

function ProductItemSkeleton({ rows = 8 }: { rows?: number }) {
  return Array.from({ length: rows }).map((_, index) => (
    <Item key={index} variant="outline">
      <ItemContent>
        <ItemTitle>
          <Skeleton className="h-4 w-2/3" />
        </ItemTitle>
        <Skeleton className="h-3 w-1/2" />
      </ItemContent>
    </Item>
  ));
}

function ProductItem({ product }: { product: Product }) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{product.name}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export default function RouteProduct({ loaderData }: Route.ComponentProps) {
  const { productResult } = loaderData;
  return (
    <DeskTable
      data={productResult}
      columns={columns}
      showCreateButton={true}
      renderGridItem={(item) => <ProductItem product={item} />}
      renderGridFallback={(rows) => <ProductItemSkeleton rows={rows} />}
    />
  );
}
