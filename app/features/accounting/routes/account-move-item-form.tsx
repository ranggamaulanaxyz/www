import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { data, Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { Input } from "~/components/ui/input";
import { supabaseClientContext } from "~/context";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import type { Handle } from "~/features/desk/types/route";
import { getPartners } from "~/features/partner/services/partner";
import { AccountCombobox } from "../components/account-combobox";
import type { AccountOption } from "../components/account-combobox";
import { AccountMoveCombobox } from "../components/account-move-combobox";
import type { AccountMoveOption } from "../components/account-move-combobox";
import { PartnerCombobox } from "../components/partner-combobox";
import type { PartnerOption } from "../components/partner-combobox";
import { accountMoveItemFormSchema } from "../schemas/account-move-item";
import {
  getAccountMoveItemById,
  updateAccountMoveItem,
} from "../services/account-move-item";
import { getAccountMoves } from "../services/account-move";
import { getAccounts } from "../services/account";
import { formatAccountMoveDate } from "./account-move";
import type { Route } from "./+types/account-move-item-form";

export const handle = {
  breadcrumb: (match) => ({
    label: match.loaderData?.accountMoveItem?.name || "Baris Jurnal",
  }),
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData?.accountMoveItem?.name || "Baris Jurnal" }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const accountMoveItem = await getAccountMoveItemById(
    supabase,
    params.accountMoveItemId,
  );
  const [{ accountMoves }, { accounts }, { partners }] = await Promise.all([
    getAccountMoves(supabase, { from: 1, to: 1000 }),
    getAccounts(supabase, { from: 1, to: 1000 }),
    getPartners(supabase, { from: 1, to: 1000 }),
  ]);

  const moveOptions: AccountMoveOption[] = accountMoves.map((accountMove) => ({
    value: accountMove.id,
    label: accountMove.number || formatAccountMoveDate(accountMove.date),
  }));
  const accountOptions: AccountOption[] = accounts.map((account) => ({
    value: account.id,
    label: `${account.code} · ${account.name}`,
  }));
  const partnerOptions: PartnerOption[] = partners.map((partner) => ({
    value: partner.id,
    label: partner.email ? `${partner.name} · ${partner.email}` : partner.name,
  }));

  return data({
    accountMoveItem,
    moveOptions,
    accountOptions,
    partnerOptions,
  });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: accountMoveItemFormSchema,
  });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateAccountMoveItem(
    supabase,
    params.accountMoveItemId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function AccountMoveItemForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { accountMoveItem, moveOptions, accountOptions, partnerOptions } =
    loaderData;
  const [form, fields] = useForm({
    defaultValue: {
      name: accountMoveItem.name,
      moveId: accountMoveItem.moveId ?? "",
      accountId: accountMoveItem.accountId,
      partnerId: accountMoveItem.partnerId,
      productId: accountMoveItem.productId ?? "",
      debit: String(accountMoveItem.debit),
      credit: String(accountMoveItem.credit),
    },
    lastResult: actionData?.lastResult || null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: accountMoveItemFormSchema });
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
          <input {...getInputProps(fields.productId, { type: "hidden" })} />
          <FieldTextInput field={fields.name} label="Deskripsi" />
          <Field data-invalid={!fields.moveId.valid}>
            <FieldLabel htmlFor={fields.moveId.id}>Jurnal Umum</FieldLabel>
            <AccountMoveCombobox
              id={fields.moveId.id}
              name={fields.moveId.name}
              items={moveOptions}
              defaultValue={accountMoveItem.moveId}
              invalid={!fields.moveId.valid}
            />
            <FieldError errors={fields.moveId.errors} />
          </Field>
          <Field data-invalid={!fields.accountId.valid}>
            <FieldLabel htmlFor={fields.accountId.id}>Akun</FieldLabel>
            <AccountCombobox
              id={fields.accountId.id}
              name={fields.accountId.name}
              items={accountOptions}
              defaultValue={accountMoveItem.accountId}
              invalid={!fields.accountId.valid}
            />
            <FieldError errors={fields.accountId.errors} />
          </Field>
          <Field data-invalid={!fields.partnerId.valid}>
            <FieldLabel htmlFor={fields.partnerId.id}>Kontak</FieldLabel>
            <PartnerCombobox
              id={fields.partnerId.id}
              name={fields.partnerId.name}
              items={partnerOptions}
              defaultValue={accountMoveItem.partnerId}
              invalid={!fields.partnerId.valid}
            />
            <FieldError errors={fields.partnerId.errors} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field data-invalid={!fields.debit.valid}>
              <FieldLabel htmlFor={fields.debit.id}>Debit</FieldLabel>
              <Input
                {...getInputProps(fields.debit, { type: "number" })}
                min={0}
                step="0.01"
              />
              <FieldError errors={fields.debit.errors} />
            </Field>
            <Field data-invalid={!fields.credit.valid}>
              <FieldLabel htmlFor={fields.credit.id}>Kredit</FieldLabel>
              <Input
                {...getInputProps(fields.credit, { type: "number" })}
                min={0}
                step="0.01"
              />
              <FieldError errors={fields.credit.errors} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="createdAt">Tanggal Dibuat</FieldLabel>
            <Input id="createdAt" value={accountMoveItem.createdAt} readOnly />
          </Field>
          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={accountMoveItem.updatedAt || ""}
              readOnly
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
