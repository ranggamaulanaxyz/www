import { Outlet, useOutlet } from "react-router";
import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/accounting";
import {
  BookCheckIcon,
  BookMarkedIcon,
  BookOpen,
  BookOpenIcon,
  FolderTreeIcon,
  ListTree,
} from "lucide-react";
import { DeskTopBar } from "~/features/desk/components/bar";

export const handle = {
  breadcrumb: { label: "Akuntansi" },
  sidebarRegistry: () => {
    return [
      {
        items: [
          {
            icon: BookMarkedIcon,
            label: "Entri Jurnal",
            pathname: "/desk/accounting/moves",
            matchPattern: "/desk/accounting/moves/*",
          },
          {
            icon: BookCheckIcon,
            label: "Baris Jurnal",
            pathname: "/desk/accounting/move-items",
            matchPattern: "/desk/accounting/move-items/*",
          },
          {
            icon: BookOpen,
            label: "Jurnal",
            pathname: "/desk/accounting/journals",
            matchPattern: "/desk/accounting/journals/*",
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
  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden">
      <DeskTopBar></DeskTopBar>
      <div className="flex-1"></div>
    </div>
  );
}
