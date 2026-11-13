import { parseFilter } from "~/features/desk/services/filter";
import type { Route } from "./+types/account-move";
import { supabaseClientContext } from "~/context";
import { getAccountMoves } from "../services/account-move";
import {
  data,
  Outlet,
  useNavigate,
  useOutlet,
  useSearchParams,
} from "react-router";
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
  DeskListGrid,
  DeskListLink,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { DeskFilter, getFilterProps } from "~/features/desk/components/filter";
import type { Handle } from "~/features/desk/types/route";
import {
  AccountMoveActions,
  AccountMoveStatus,
} from "../components/account-move";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";

const columnBuilder = deskColumnBuilder<AccountMove>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("number", {
    header: "Nomor",
    cell: ({ row: { original } }) => (
      <DeskListLink to={`/desk/accounting/moves/${original.id}`}>
        {original.number || "#"}
      </DeskListLink>
    ),
  }),
  columnBuilder.accessor("date", { header: "Tanggal" }),
  columnBuilder.accessor("journal.name", { header: "Jurnal" }),
  columnBuilder.accessor("partner.name", { header: "Kontak" }),
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
  breadcrumb: ({ loaderData }) => {
    return {
      label: "Entri Jurnal",
      to: `/desk/accounting/moves?${loaderData?.searchParams}`,
    };
  },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Entri Jurnal" }];
}

export async function clientLoader({ url, context }: Route.ClientActionArgs) {
  const supabase = context.get(supabaseClientContext);
  const filterOptions = parseFilter(url.searchParams);
  const promiseGetAccountMoves = getAccountMoves(supabase, filterOptions);
  const moves = promiseGetAccountMoves.then((result) => result.accountMoves);
  const metadata = promiseGetAccountMoves.then((result) => result.metadata);

  return data({ moves, metadata, searchParams: url.searchParams.toString() });
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
      <DeskListContent view="grid">
        <DeskListGrid isLoading={list.state === "loading"}>
          {list.rows.map(({ original: move, ...row }) => (
            <Item key={row.id} variant="outline">
              <ItemContent>
                <ItemTitle>
                  <DeskListLink to={`/desk/accounting/moves/${move.id}`}>
                    {move.journal.name} ({move.date})
                  </DeskListLink>
                </ItemTitle>
                <ItemDescription>{move.number}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <AccountMoveActions move={move} />
              </ItemActions>
            </Item>
          ))}
        </DeskListGrid>
      </DeskListContent>
    </DeskList>
  );
}
