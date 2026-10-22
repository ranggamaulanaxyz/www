import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/account";

export const handle = { breadcrumb: { label: "Akun" } } satisfies Handle<
  Route.ComponentProps["loaderData"]
>;

export function meta() {
  return [{ title: "Akun" }];
}

export default function Account() {
  return (
    <div className="flex-1">
      <AccountTopBar />
    </div>
  );
}

function AccountTopBar() {
  return (
    <TopBar>
      <DeskHeader></DeskHeader>
    </TopBar>
  );
}
