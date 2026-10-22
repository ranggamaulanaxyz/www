import { supabaseClientContext } from "~/context";
import type { Route } from "./+types/account-form";
import { getAccountById, updateAccount } from "../services/account";
import { getAccountSubtypes } from "../services/account-subtype";
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
import { AccountSubtypeCombobox } from "../components/account-subtype-combobox";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Handle } from "~/features/desk/types/route";

const schema = z.object({
  code: z.string("Kode akun tidak valid."),
  name: z.string("Nama akun tidak valid."),
  accountSubtypeId: z.uuid("Subtipe akun tidak valid."),
});

export const handle = {
  breadcrumb: (match) => ({
    label:
      [match.loaderData?.account.code, match.loaderData?.account.name]
        .filter(Boolean)
        .join(" · ") || "Tanpa Nama",
  }),
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const account = await getAccountById(supabase, params.accountId);
  const { accountSubtypes } = await getAccountSubtypes(supabase, {
    from: 1,
    to: 1000,
  });
  const accountSubtypeOptions = accountSubtypes.map((accountSubtype) => ({
    value: accountSubtype.id,
    label: accountSubtype.name,
  }));

  return data({ account, accountSubtypeOptions });
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
  const success = await updateAccount(
    supabase,
    params.accountId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function AccountForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { account, accountSubtypeOptions } = loaderData;
  const [form, fields] = useForm({
    defaultValue: { ...account },
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
          <FieldTextInput field={fields.code} label="Kode" />
          <FieldTextInput field={fields.name} label="Nama" />
          <Field data-invalid={!fields.accountSubtypeId.valid}>
            <FieldLabel htmlFor={fields.accountSubtypeId.id}>
              Subtipe
            </FieldLabel>
            <AccountSubtypeCombobox
              id={fields.accountSubtypeId.id}
              name={fields.accountSubtypeId.name}
              items={accountSubtypeOptions}
              defaultValue={account.accountSubtypeId}
              invalid={!fields.accountSubtypeId.valid}
            />
            <FieldError errors={fields.accountSubtypeId.errors} />
          </Field>
          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Dibuat</FieldLabel>
            <Input id="createdAt" value={account.createdAt} readOnly={true} />
          </Field>

          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={account.updatedAt || ""}
              readOnly={true}
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
