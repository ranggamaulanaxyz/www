import { parseFilter } from "~/features/desk/services/filter";
import type { Route } from "./+types/account-move";
import { supabaseClientContext } from "~/context";
import { getAccountMoves } from "../services/account-move";
import { data } from "react-router";
import { useDeskList } from "~/features/desk/hooks/use-list";
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
import { DeskFilter, useDeskFilter } from "~/features/desk/components/filter";

const columnBuilder = deskColumnBuilder<AccountMove>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("number", { header: "Nomor" }),
]);

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
  const { table, rows, state, ...listProps } = useDeskList({
    resource: "account_moves",
    columns,
    data: moves,
    metadata,
  });

  return (
    <DeskList {...listProps} onClickCreate={() => console.log("")}>
      <DeskListTopBar metadata={metadata}>
        <DeskFilter {...listProps.filter} />
      </DeskListTopBar>
      <DeskListContent view="table">
        <DeskTable table={table} isLoading={state === "loading"} />
      </DeskListContent>
    </DeskList>
  );
}
