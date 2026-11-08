import { parseFilter } from "~/features/desk/services/filter";
import type { Route } from "./+types/account-move";
import { supabaseClientContext } from "~/context";
import { getAccountMoves } from "../services/account-move";
import { data, Outlet, useNavigate, useOutlet } from "react-router";
import { getDeskListProps, useDeskList } from "~/features/desk/hooks/use-list";
import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import type { AccountMove } from "../schemas/account-move";
import {
  DeskList,
  DeskListContent,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { DeskFilter, getFilterProps } from "~/features/desk/components/filter";
import type { Handle } from "~/features/desk/types/route";
import {
  AccountMoveActions,
  AccountMoveStatus,
} from "../components/account-move";

const columnBuilder = deskColumnBuilder<AccountMove>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("number", { header: "Nomor" }),
  columnBuilder.accessor("date", { header: "Tanggal" }),
  columnBuilder.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <AccountMoveStatus value={getValue()} />,
  }),
  columnBuilder.display({
    id: "actions",
    cell: ({ row }) => {
      const move = row.original;
      return <AccountMoveActions move={move} />;
    },
    size: 50,
    meta: { align: "right" },
  }),
]);

export const handle = {
  breadcrumb: { label: "Jurnal Umum" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Jurnal Umum" }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const filterOptions = parseFilter(url.searchParams);
  const promiseGetAccountMoves = getAccountMoves(supabase, filterOptions);
  const moves = promiseGetAccountMoves.then((result) => result.accountMoves);
  const metadata = promiseGetAccountMoves.then((result) => result.metadata);

  return data({ moves, metadata });
}

export default function AccountMoveList({ loaderData }: Route.ComponentProps) {
  const { moves, metadata } = loaderData;
  const navigate = useNavigate();
  const list = useDeskList({
    resource: "account_moves",
    columns,
    data: moves,
    metadata,
    onClickCreate: () => {
      navigate("new");
    },
  });

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList {...getDeskListProps(list)}>
      <DeskListTopBar metadata={metadata}>
        <DeskFilter {...getFilterProps(list.filter)} />
      </DeskListTopBar>
      <DeskListContent view="table">
        <DeskTable table={list.table} isLoading={list.state === "loading"} />
      </DeskListContent>
    </DeskList>
  );
}
