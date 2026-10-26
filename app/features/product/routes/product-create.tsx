import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/product-create";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";

const title = "Tambah Produk";

export const handle = {
  breadcrumb: { label: title },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export default function ProductCreate() {
  return (
    <TopBar>
      <DeskHeader />
    </TopBar>
  );
}
