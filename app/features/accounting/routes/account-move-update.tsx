import { data, redirect } from "react-router";
import { AccountMoveForm, schema } from "../components/account-move";
import type { Route } from "./+types/account-move-update";
import { supabaseClientContext } from "~/context";
import {
  getAccountMoveById,
  updateAccountMoveWithItems,
} from "../services/account-move";
import type { Handle } from "~/features/desk/types/route";
import { parseForm } from "~/utils/request";

export const handle = {
  breadcrumb: ({ loaderData }) => {
    return {
      label:
        loaderData?.move.number ||
        `${loaderData?.move.journal.name} (${loaderData?.move.date})`,
    };
  },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const move = await getAccountMoveById(supabase, params.accountMoveId);
  return data({ move });
}

export async function clientAction({
  request,
  params,
  url,
  context,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const { success, message, id } = await updateAccountMoveWithItems(
    supabase,
    params.accountMoveId,
    submission.value as never,
  );
  if (success) {
    throw redirect(
      `/desk/accounting/moves/${id}?${url.searchParams.toString()}`,
    );
  }

  return data({ lastResult: submission.reply({ formErrors: [message] }) });
}

export default function AccountMoveUpdate({
  loaderData,
}: Route.ComponentProps) {
  const { move } = loaderData;
  return (
    <AccountMoveForm
      defaultValue={{
        journalId: move.journalId,
        journal: move.journal,
        partnerId: move.partnerId,
        partner: move.partner,
        date: move.date,
        number: move.number,
        items: move.items?.map(
          ({
            id,
            productId,
            name,
            accountId,
            debit,
            credit,
            product,
            account,
          }) => ({
            id,
            productId,
            name,
            accountId,
            debit,
            credit,
            product,
            account,
          }),
        ),
      }}
    />
  );
}
