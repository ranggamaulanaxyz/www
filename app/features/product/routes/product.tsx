import DeskTable, {
  type DeskTableColumns,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProducts } from "../services/product";
import { data } from "react-router";
import type { Product } from "../types/product";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  // Return a pending promise instead of awaiting it so the table can render
  // its skeleton while the products stream in.
  const productResult = getProducts(supabase).then((result) => result.products);
  return data({ productResult });
}

const columns: DeskTableColumns<Product> = [
  { accessorKey: "code", header: "Kode" },
  { accessorKey: "name", header: "Nama" },
  { accessorKey: "costPrice", header: "Harga Beli" },
  { accessorKey: "salePrice", header: "Harga Jual" },
];

export default function RouteProduct({ loaderData }: Route.ComponentProps) {
  const { productResult } = loaderData;
  return (
    <DeskTable data={productResult} columns={columns} showCreateButton={true} />
  );
}
