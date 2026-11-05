import type { Handle } from "~/features/desk/types/route";
import { AccountMoveForm } from "../components/account-move-form";
import type { Route } from "./+types/account-move-create";

export const handle = {
  breadcrumb: { label: "Jurnal Umum Baru" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Tambah Jurnal Umum" }];
}

export default function CreateAccountMove() {
  return <AccountMoveForm />;
}
