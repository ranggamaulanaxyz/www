import { Outlet } from "react-router";
import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/accounting";
import { BookOpenIcon, FolderTreeIcon, ListTree } from "lucide-react";

export const handle = {
  breadcrumb: { label: "Akuntansi" },
  sidebarRegistry: () => {
    return [
      {
        items: [
          {
            icon: BookOpenIcon,
            label: "Jurnal Umum",
            pathname: "/desk/accounting/moves",
            matchPattern: "/desk/accounting/moves/*",
          },
          {
            icon: ListTree,
            label: "Akun",
            pathname: "/desk/accounting/accounts",
            matchPattern: "/desk/accounting/accounts/*",
          },
          {
            icon: FolderTreeIcon,
            label: "Subtipe Akun",
            pathname: "/desk/accounting/subtypes",
            matchPattern: "/desk/accounting/subtypes/*",
          },
        ],
      },
    ];
  },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Akuntansi" }];
}

export default function Accounting() {
  return <Outlet />;
}
