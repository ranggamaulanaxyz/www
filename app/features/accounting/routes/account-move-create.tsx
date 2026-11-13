import type { Handle } from "~/features/desk/types/route";
import { AccountMoveForm } from "../components/account-move";
import type { Route } from "./+types/account-move-create";
import { parseForm } from "~/utils/request";
import { data, redirect } from "react-router";
import { supabaseClientContext } from "~/context";
import { createAccountMoveWithItems } from "../services/account-move";
import { ur } from "zod/v4/locales";
import { accountMoveFormSchema } from "../schemas/account-move";

export const handle = {
  breadcrumb: { label: "Entri Jurnal Baru" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Tambah Entri Jurnal" }];
}

export async function clientAction({
  request,
  url,
  context,
}: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema: accountMoveFormSchema });
  console.log(submission);
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const { success, message, id } = await createAccountMoveWithItems(
    supabase,
    submission.value as any,
  );
  if (success) {
    throw redirect(
      `/desk/accounting/moves/${id}?${url.searchParams.toString()}`,
    );
  }

  return data({ lastResult: submission.reply({ formErrors: [message] }) });
}

export default function CreateAccountMove() {
  return <AccountMoveForm />;
}
