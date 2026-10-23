import { supabaseClientContext } from "~/context";
import type { Route } from "./+types/account-move-form";
import {
  getAccountMoveById,
  updateAccountMove,
} from "../services/account-move";
import { getAccountJournals } from "../services/account-journal";
import { getAccounts } from "../services/account";
import { getPartners } from "~/features/partner/services/partner";
import { data, Form } from "react-router";
import { parseWithZod } from "@conform-to/zod/v4";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { Input } from "~/components/ui/input";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Handle } from "~/features/desk/types/route";
import { accountMoveFormSchema } from "../schemas/account-move";
import type { AccountMoveItem } from "../types/account-move";
import { AccountJournalCombobox } from "../components/account-journal-combobox";
import type { AccountJournalOption } from "../components/account-journal-combobox";
import { PartnerCombobox } from "../components/partner-combobox";
import type { PartnerOption } from "../components/partner-combobox";
import {
  accountMoveStatusOptions,
  formatAccountMoveDate,
} from "./account-move";

export const handle = {
  breadcrumb: (match) => {
    const accountMove = match.loaderData?.accountMove;
    return {
      label: accountMove
        ? accountMove.number || formatAccountMoveDate(accountMove.date)
        : "Jurnal Umum",
    };
  },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta({ loaderData }: Route.MetaArgs) {
  const accountMove = loaderData?.accountMove;
  return [
    {
      title: accountMove?.number || "Jurnal Umum",
    },
  ];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const accountMove = await getAccountMoveById(supabase, params.accountMoveId);
  const [{ accountJournals }, { partners }, { accounts }] = await Promise.all([
    getAccountJournals(supabase, { from: 1, to: 1000 }),
    getPartners(supabase, { from: 1, to: 1000 }),
    getAccounts(supabase, { from: 1, to: 1000 }),
  ]);

  const journalOptions: AccountJournalOption[] = accountJournals.map(
    (accountJournal) => ({
      value: accountJournal.id,
      label: accountJournal.name,
    }),
  );
  const partnerOptions: PartnerOption[] = partners.map((partner) => ({
    value: partner.id,
    label: partner.email ? `${partner.name} · ${partner.email}` : partner.name,
  }));
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: `${account.code} · ${account.name}`,
  }));

  return data({
    accountMove,
    journalOptions,
    partnerOptions,
    accountOptions,
  });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: accountMoveFormSchema,
  });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateAccountMove(
    supabase,
    params.accountMoveId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function AccountMoveForm({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { accountMove, journalOptions, partnerOptions, accountOptions } =
    loaderData;
  const [form, fields] = useForm({
    defaultValue: {
      number: accountMove.number,
      date: accountMove.date,
      journalId: accountMove.journalId,
      partnerId: accountMove.partnerId,
      status: accountMove.status,
    },
    lastResult: actionData?.lastResult || null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: accountMoveFormSchema });
    },
  });

  const accountNames = new Map(
    accountOptions.map((option) => [option.value, option.label]),
  );
  const partnerNames = new Map(
    partnerOptions.map((option) => [option.value, option.label]),
  );

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
          <FieldTextInput field={fields.number} label="Nomor" />
          <Field data-invalid={!fields.date.valid}>
            <FieldLabel htmlFor={fields.date.id}>Tanggal</FieldLabel>
            <Input {...getInputProps(fields.date, { type: "date" })} />
            <FieldError errors={fields.date.errors} />
          </Field>
          <Field data-invalid={!fields.journalId.valid}>
            <FieldLabel htmlFor={fields.journalId.id}>Jurnal</FieldLabel>
            <AccountJournalCombobox
              id={fields.journalId.id}
              name={fields.journalId.name}
              items={journalOptions}
              defaultValue={accountMove.journalId}
              invalid={!fields.journalId.valid}
            />
            <FieldError errors={fields.journalId.errors} />
          </Field>
          <Field data-invalid={!fields.partnerId.valid}>
            <FieldLabel htmlFor={fields.partnerId.id}>Kontak</FieldLabel>
            <PartnerCombobox
              id={fields.partnerId.id}
              name={fields.partnerId.name}
              items={partnerOptions}
              defaultValue={accountMove.partnerId}
              invalid={!fields.partnerId.valid}
            />
            <FieldError errors={fields.partnerId.errors} />
          </Field>
          <Field data-invalid={!fields.status.valid}>
            <FieldLabel htmlFor={fields.status.id}>Status</FieldLabel>
            <Select
              id={fields.status.id}
              name={fields.status.name}
              items={accountMoveStatusOptions}
              defaultValue={fields.status.defaultValue}
            >
              <SelectTrigger
                className="w-full"
                aria-invalid={!fields.status.valid}
              >
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {accountMoveStatusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError errors={fields.status.errors} />
          </Field>
          <Field>
            <FieldLabel htmlFor="createdAt">Tanggal Dibuat</FieldLabel>
            <Input
              id="createdAt"
              value={accountMove.createdAt}
              readOnly={true}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={accountMove.updatedAt || ""}
              readOnly={true}
            />
          </Field>
        </FieldGroup>
      </div>
      <div className="p-4">
        <AccountMoveItems
          items={accountMove.items || []}
          accountNames={accountNames}
          partnerNames={partnerNames}
        />
      </div>
    </Form>
  );
}

function AccountMoveItems({
  items,
  accountNames,
  partnerNames,
}: {
  items: AccountMoveItem[];
  accountNames: Map<string, string>;
  partnerNames: Map<string, string>;
}) {
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  });
  const totals = items.reduce(
    (result, item) => ({
      debit: result.debit + item.debit,
      credit: result.credit + item.credit,
    }),
    { debit: 0, credit: 0 },
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium">Baris Jurnal</h2>
      <div className="border">
        {items.length === 0 ? (
          <p className="text-muted-foreground p-3 text-xs">
            Belum ada baris jurnal.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 border-b p-3 last:border-b-0 md:grid-cols-[1fr_8rem_8rem]"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium">{item.name}</span>
                <span className="text-muted-foreground text-xs">
                  {accountNames.get(item.accountId) || "-"} ·{" "}
                  {partnerNames.get(item.partnerId) || "-"}
                </span>
              </div>
              <span className="text-right text-xs tabular-nums">
                {currencyFormatter.format(item.debit)}
              </span>
              <span className="text-right text-xs tabular-nums">
                {currencyFormatter.format(item.credit)}
              </span>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <div className="grid gap-2 md:grid-cols-[1fr_8rem_8rem]">
          <span className="text-xs font-medium md:col-start-2">
            Total Debit
          </span>
          <span className="text-right text-xs font-medium tabular-nums">
            {currencyFormatter.format(totals.debit)}
          </span>
          <span className="text-xs font-medium md:col-start-2">
            Total Kredit
          </span>
          <span className="text-right text-xs font-medium tabular-nums">
            {currencyFormatter.format(totals.credit)}
          </span>
        </div>
      )}
    </div>
  );
}
