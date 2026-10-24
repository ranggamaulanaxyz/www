import { getInputProps, useForm } from "@conform-to/react";
import { ArrowRightIcon } from "lucide-react";
import { cn } from "cn";
import { Suspense, useEffect, useState } from "react";
import {
  Await,
  data,
  Link,
  Outlet,
  redirect,
  useOutlet,
  useSearchParams,
} from "react-router";
import { parseWithZod } from "@conform-to/zod/v4";
import { Button } from "~/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { Input } from "~/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { Skeleton } from "~/components/ui/skeleton";
import { supabaseClientContext } from "~/context";
import { TopBar } from "~/features/desk/components/bar";
import { DeskCreateDialog } from "~/features/desk/components/create-dialog";
import DeskHeader from "~/features/desk/components/header";
import DeskPagination from "~/features/desk/components/pagination";
import FilterInputQuery from "~/features/desk/components/filter-input-query";
import { hasAccess } from "~/features/desk/services/access";
import { parseFilter } from "~/features/desk/services/filter";
import type { Handle } from "~/features/desk/types/route";
import { getPartners } from "~/features/partner/services/partner";
import { useIsMobile } from "~/hooks/use-mobile";
import { AccountCombobox } from "../components/account-combobox";
import type { AccountOption } from "../components/account-combobox";
import { AccountMoveCombobox } from "../components/account-move-combobox";
import type { AccountMoveOption } from "../components/account-move-combobox";
import { PartnerCombobox } from "../components/partner-combobox";
import type { PartnerOption } from "../components/partner-combobox";
import { accountMoveItemFormSchema } from "../schemas/account-move-item";
import {
  createAccountMoveItem,
  getAccountMoveItems,
} from "../services/account-move-item";
import { getAccountMoves } from "../services/account-move";
import { getAccounts } from "../services/account";
import { formatAccountMoveDate } from "./account-move";
import type { Route } from "./+types/account-move-item";

export const handle = {
  breadcrumb: { label: "Baris Jurnal" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Baris Jurnal" }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const accountMoveItemResults = getAccountMoveItems(supabase, filterOptions);
  const [{ accountMoves }, { accounts }, { partners }, canCreate] =
    await Promise.all([
      getAccountMoves(supabase, { from: 1, to: 1000 }),
      getAccounts(supabase, { from: 1, to: 1000 }),
      getPartners(supabase, { from: 1, to: 1000 }),
      hasAccess(supabase, "insert", "account_move_items"),
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
    accountMoveItemResults,
    searchParams: url.searchParams.toString(),
    filterOptions,
    moveOptions,
    accountOptions,
    partnerOptions,
    canCreate,
  });
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: accountMoveItemFormSchema,
  });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const accountMoveItem = await createAccountMoveItem(
    supabase,
    submission.value,
  );

  return redirect(
    `/desk/accounting/move-items/${accountMoveItem.id}?${url.searchParams.toString()}`,
  );
}

export default function AccountMoveItem({ loaderData }: Route.ComponentProps) {
  const {
    accountMoveItemResults,
    canCreate,
    filterOptions,
    moveOptions,
    accountOptions,
    partnerOptions,
  } = loaderData;
  const [searchParams] = useSearchParams();
  const [paginationData, setPaginationData] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });

  useEffect(() => {
    const resolveAccountMoveItems = async () => {
      const {
        metadata: { from, to, count },
      } = await accountMoveItemResults;
      setPaginationData({ from, to, count });
    };
    resolveAccountMoveItems();
  }, [filterOptions]);

  const moveLabels = new Map(
    moveOptions.map((option) => [option.value, option.label]),
  );
  const accountLabels = new Map(
    accountOptions.map((option) => [option.value, option.label]),
  );
  const partnerLabels = new Map(
    partnerOptions.map((option) => [option.value, option.label]),
  );

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AccountMoveItemTopBar
        data={{ pagination: paginationData }}
        options={{
          showCreateButton: canCreate,
          moveOptions,
          accountOptions,
          partnerOptions,
        }}
      />
      <div className="flex-1">
        <div
          className={cn([
            "grid gap-2 p-4",
            "md:grid-cols-2 md:gap-3",
            "lg:grid-cols-3",
            "xl:grid-cols-4",
          ])}
        >
          <Suspense fallback={<AccountMoveItemSkeleton />}>
            <Await resolve={accountMoveItemResults}>
              {({ accountMoveItems }) =>
                accountMoveItems.map((accountMoveItem) => {
                  const moveLabel = accountMoveItem.move
                    ? accountMoveItem.move.number ||
                      formatAccountMoveDate(accountMoveItem.move.date)
                    : moveLabels.get(accountMoveItem.moveId || "") || "-";
                  const accountLabel = accountMoveItem.account
                    ? `${accountMoveItem.account.code} · ${accountMoveItem.account.name}`
                    : accountLabels.get(accountMoveItem.accountId) || "-";
                  const partnerLabel =
                    accountMoveItem.partner?.name ||
                    partnerLabels.get(accountMoveItem.partnerId) ||
                    "-";

                  return (
                    <Item key={accountMoveItem.id} variant="outline">
                      <ItemContent>
                        <ItemTitle>{accountMoveItem.name}</ItemTitle>
                        <ItemDescription>
                          {moveLabel} · {accountLabel} · {partnerLabel}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <div className="flex flex-col items-end text-xs tabular-nums">
                          <span>D: {formatAmount(accountMoveItem.debit)}</span>
                          <span>K: {formatAmount(accountMoveItem.credit)}</span>
                        </div>
                        <Button
                          variant="link"
                          nativeButton={false}
                          render={
                            <Link
                              to={{
                                pathname: `/desk/accounting/move-items/${accountMoveItem.id}`,
                                search: searchParams.toString(),
                              }}
                            >
                              <ArrowRightIcon />
                            </Link>
                          }
                        />
                      </ItemActions>
                    </Item>
                  );
                })
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function AccountMoveItemTopBar({
  data,
  options,
}: {
  data: { pagination: { from: number; to: number; count: number } };
  options: {
    showCreateButton?: boolean | null;
    moveOptions: AccountMoveOption[];
    accountOptions: AccountOption[];
    partnerOptions: PartnerOption[];
  };
}) {
  const isMobile = useIsMobile();
  return (
    <TopBar>
      <DeskHeader>
        <div className="flex justify-between gap-4 p-4">
          {!isMobile && <FilterInputQuery />}
          <div className={cn("flex items-center justify-end gap-1")}>
            {!isMobile && <DeskPagination {...data.pagination} />}
            <div className="flex">
              {options.showCreateButton && (
                <AccountMoveItemCreateDialog
                  moveOptions={options.moveOptions}
                  accountOptions={options.accountOptions}
                  partnerOptions={options.partnerOptions}
                />
              )}
            </div>
          </div>
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function AccountMoveItemCreateDialog({
  moveOptions,
  accountOptions,
  partnerOptions,
}: {
  moveOptions: AccountMoveOption[];
  accountOptions: AccountOption[];
  partnerOptions: PartnerOption[];
}) {
  const [form, fields] = useForm({
    defaultValue: {
      name: "",
      moveId: "",
      accountId: "",
      partnerId: "",
      productId: "",
      debit: "0",
      credit: "0",
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: accountMoveItemFormSchema });
    },
  });

  return (
    <DeskCreateDialog form={form} title="Tambah Baris Jurnal">
      <FieldTextInput field={fields.name} label="Deskripsi" />
      <Field data-invalid={!fields.moveId.valid}>
        <FieldLabel htmlFor={fields.moveId.id}>Jurnal Umum</FieldLabel>
        <AccountMoveCombobox
          id={fields.moveId.id}
          name={fields.moveId.name}
          items={moveOptions}
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
    </DeskCreateDialog>
  );
}

function AccountMoveItemSkeleton() {
  const widths = ["w-20", "w-24", "w-28", "w-32", "w-36", "w-24"];
  return Array.from({ length: 12 }).map((_, index) => {
    const randomWidth = widths[index % widths.length];
    return (
      <Item key={index} variant="outline">
        <ItemContent>
          <ItemTitle>
            <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
          </ItemTitle>
          <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
        </ItemContent>
        <ItemActions>
          <Skeleton className="h-4 w-16" />
        </ItemActions>
      </Item>
    );
  });
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(value);
}
