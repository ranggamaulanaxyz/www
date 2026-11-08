import { data } from "react-router";
import { AccountMoveForm } from "../components/account-move";
import type { Route } from "./+types/account-move-update";
import { supabaseClientContext } from "~/context";
import { getAccountMoveById } from "../services/account-move";

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const move = await getAccountMoveById(supabase, params.accountMoveId);
  return data({ move });
}

export default function AccountMoveUpdate() {
  return <AccountMoveForm />;
}
