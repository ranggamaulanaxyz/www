import DeskTable from "~/features/desk/components/table";
import type { Route } from "./+types/product";
import { supabaseClientContext } from "~/context";
import { getProducts } from "../services/product";
import { data } from "react-router";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const { products } = await getProducts(supabase);
  return data({ products });
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  return (
    <DeskTable
      data={products}
      columns={[
        { accessorKey: "code", header: "Kode" },
        { accessorKey: "name", header: "Nama" },
        { accessorKey: "costPrice", header: "Harga Beli" },
        { accessorKey: "salePrice", header: "Harga Jual" },
      ]}
      options={{ showCreateButton: true }}
    />
  );
}
