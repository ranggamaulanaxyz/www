import { supabaseClientContext } from "~/context";
import type { Route } from "./+types/account-journal-form";
import {
  getAccountJournalById,
  updateAccountJournal,
} from "../services/account-journal";
import { getAccounts } from "../services/account";
import { data, Form } from "react-router";
import z from "zod";
import { parseWithZod } from "@conform-to/zod/v4";
import { getFormProps, useForm } from "@conform-to/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { AccountCombobox } from "../components/account-combobox";
import type { AccountOption } from "../components/account-combobox";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Handle } from "~/features/desk/types/route";
import { nullableAccountIdSchema } from "../schemas/account-journal";

const schema = z.object({
  name: z.string("Nama jurnal tidak valid."),
  defaultDebitAccountId: nullableAccountIdSchema,
  defaultCreditAccountId: nullableAccountIdSchema,
});

export const handle = {
  breadcrumb: (match) => ({
    label: match.loaderData?.accountJournal.name || "Tanpa Nama",
  }),
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const accountJournal = await getAccountJournalById(
    supabase,
    params.accountJournalId,
  );
  const { accounts } = await getAccounts(supabase, { from: 1, to: 1000 });
  const accountOptions: AccountOption[] = accounts.map((account) => ({
    value: account.id,
    label: `${account.code} · ${account.name}`,
  }));

  return data({ accountJournal, accountOptions });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateAccountJournal(
    supabase,
    params.accountJournalId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function AccountJournalForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { accountJournal, accountOptions } = loaderData;
  const [form, fields] = useForm({
    defaultValue: { ...accountJournal },
    lastResult: actionData?.lastResult || null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <Form {...getFormProps(form)} method="post">
      <TopBar>
        <DeskHeader>
          <div className="px-4">
            <Button type="submit">Simpan</Button>
          </div>
        </DeskHeader>
      </TopBar>
      <div className="max-w-1/2 p-4">
        <FieldGroup>
          <FieldTextInput field={fields.name} label="Nama" />
          <Field data-invalid={!fields.defaultDebitAccountId.valid}>
            <FieldLabel htmlFor={fields.defaultDebitAccountId.id}>
              Akun Debit Default
            </FieldLabel>
            <AccountCombobox
              id={fields.defaultDebitAccountId.id}
              name={fields.defaultDebitAccountId.name}
              items={accountOptions}
              defaultValue={accountJournal.defaultDebitAccountId}
              placeholder="Pilih Akun Debit"
              invalid={!fields.defaultDebitAccountId.valid}
            />
            <FieldError errors={fields.defaultDebitAccountId.errors} />
          </Field>
          <Field data-invalid={!fields.defaultCreditAccountId.valid}>
            <FieldLabel htmlFor={fields.defaultCreditAccountId.id}>
              Akun Kredit Default
            </FieldLabel>
            <AccountCombobox
              id={fields.defaultCreditAccountId.id}
              name={fields.defaultCreditAccountId.name}
              items={accountOptions}
              defaultValue={accountJournal.defaultCreditAccountId}
              placeholder="Pilih Akun Kredit"
              invalid={!fields.defaultCreditAccountId.valid}
            />
            <FieldError errors={fields.defaultCreditAccountId.errors} />
          </Field>
          <Field>
            <FieldLabel htmlFor="createdAt">Tanggal Dibuat</FieldLabel>
            <Input
              id="createdAt"
              value={accountJournal.createdAt}
              readOnly={true}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={accountJournal.updatedAt || ""}
              readOnly={true}
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
