import DeskTable, {
  type DeskTableColumns,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProducts } from "../services/product";
import { data } from "react-router";
import type { Product as ProductModel } from "../types/product";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const { products } = await getProducts(supabase);
  return data({ products });
}

// Defined outside the component so the array identity is stable across
// renders and the table does not rebuild its column definitions each time.
const columns: DeskTableColumns<ProductModel> = [
  { accessorKey: "code", header: "Kode" },
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "costPrice", header: "Harga Beli" },
  { accessorKey: "salePrice", header: "Harga Jual" },
];

export default function Product({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  return (
    <DeskTable
      data={products}
      columns={columns}
      options={{ showCreateButton: true }}
    />
  );
}
