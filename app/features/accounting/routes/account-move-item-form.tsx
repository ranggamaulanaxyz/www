import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { data, Form } from "react-router";
import { FieldCombobox } from "~/components/form/fields/combobox";
import { FieldText } from "~/components/form/fields/input";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { supabaseClientContext } from "~/context";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import type { Handle } from "~/features/desk/types/route";
import { usePartnerField } from "~/features/partner/hooks/use-partner";
import { useProductField } from "~/features/product/hooks/use-product";
import { formatDate } from "~/utils/tools";
import { useAccountMoveField } from "../hooks/use-account-move";
import { useAccountField } from "../hooks/use-account";
import {
  getAccountMoveItemById,
  updateAccountMoveItem,
} from "../services/account-move-item";
import { accountMoveItemFormSchema } from "../schemas/account-move-item";
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

  return data({ accountMoveItem });
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

function formatDateTime(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const time = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formatDate(date)} ${time}`;
}

export default function AccountMoveItemForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { accountMoveItem } = loaderData;
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

  const moveField = useAccountMoveField(fields.moveId);
  const accountField = useAccountField(fields.accountId);
  const partnerField = usePartnerField(fields.partnerId);
  const productField = useProductField(fields.productId);

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
          <FieldText field={fields.name} label="Deskripsi" />
          <FieldCombobox
            {...moveField}
            label="Entri Jurnal"
            defaultValue={
              accountMoveItem.move
                ? {
                    label:
                      accountMoveItem.move.number || accountMoveItem.move.date,
                    value: accountMoveItem.move.id,
                  }
                : undefined
            }
          />
          <FieldCombobox
            {...accountField}
            label="Akun"
            defaultValue={
              accountMoveItem.account
                ? {
                    label: accountMoveItem.account.name,
                    value: accountMoveItem.account.id,
                  }
                : undefined
            }
          />
          <FieldCombobox
            {...partnerField}
            label="Kontak"
            defaultValue={
              accountMoveItem.partner
                ? {
                    label: accountMoveItem.partner.name,
                    value: accountMoveItem.partnerId,
                  }
                : undefined
            }
          />
          <FieldCombobox
            {...productField}
            label="Produk"
            defaultValue={
              accountMoveItem.product
                ? {
                    label: accountMoveItem.product.name,
                    value: accountMoveItem.product.id,
                  }
                : undefined
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <FieldText
              field={fields.debit}
              label="Debit"
              type="number"
              min={0}
              step="any"
              align="right"
            />
            <FieldText
              field={fields.credit}
              label="Kredit"
              type="number"
              min={0}
              step="any"
              align="right"
            />
          </div>
          <Field>
            <FieldLabel htmlFor="createdAt">Tanggal Dibuat</FieldLabel>
            <Input
              id="createdAt"
              value={formatDateTime(accountMoveItem.createdAt)}
              readOnly
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={formatDateTime(accountMoveItem.updatedAt)}
              readOnly
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
