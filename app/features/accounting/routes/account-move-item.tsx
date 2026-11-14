import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { ArrowRightIcon } from "lucide-react";
import { data, Outlet, redirect, useOutlet } from "react-router";
import { FieldCombobox } from "~/components/form/fields/combobox";
import { FieldText } from "~/components/form/fields/input";
import { Button } from "~/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { supabaseClientContext } from "~/context";
import { DeskCreateDialog } from "~/features/desk/components/create-dialog";
import { DeskFilter, getFilterProps } from "~/features/desk/components/filter";
import { getDeskListProps, useDeskList } from "~/features/desk/hooks/use-list";
import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import {
  DeskList,
  DeskListContent,
  DeskListGrid,
  DeskListLink,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { hasAccess } from "~/features/desk/services/access";
import { parseFilter } from "~/features/desk/services/filter";
import type { Handle } from "~/features/desk/types/route";
import { usePartnerField } from "~/features/partner/hooks/use-partner";
import { useProductField } from "~/features/product/hooks/use-product";
import { formatCurrency } from "~/utils/tools";
import { useAccountMoveField } from "../hooks/use-account-move";
import { useAccountField } from "../hooks/use-account";
import {
  createAccountMoveItem,
  getAccountMoveItems,
} from "../services/account-move-item";
import { accountMoveItemFormSchema } from "../schemas/account-move-item";
import type { AccountMoveItemWithRelations } from "../types/account-move-item";
import type { Route } from "./+types/account-move-item";

const columnBuilder = deskColumnBuilder<AccountMoveItemWithRelations>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("name", {
    header: "Deskripsi",
    cell: ({ row: { original } }) => (
      <DeskListLink to={`/desk/accounting/move-items/${original.id}`}>
        {original.name}
      </DeskListLink>
    ),
  }),
  columnBuilder.display({
    id: "move",
    header: "Entri Jurnal",
    cell: ({ row: { original } }) => original.move?.number || "-",
  }),
  columnBuilder.display({
    id: "account",
    header: "Akun",
    cell: ({ row: { original } }) =>
      original.account
        ? `${original.account.code} · ${original.account.name}`
        : "-",
  }),
  columnBuilder.display({
    id: "partner",
    header: "Kontak",
    cell: ({ row: { original } }) => original.partner?.name || "-",
  }),
  columnBuilder.accessor("debit", {
    header: "Debit",
    meta: { align: "right" },
    cell: ({ getValue }) => formatAmount(getValue()),
  }),
  columnBuilder.accessor("credit", {
    header: "Kredit",
    meta: { align: "right" },
    cell: ({ getValue }) => formatAmount(getValue()),
  }),
  columnBuilder.display({
    id: "actions",
    cell: ({ row: { original } }) => (
      <Button
        variant="link"
        nativeButton={false}
        render={
          <DeskListLink to={`/desk/accounting/move-items/${original.id}`}>
            <ArrowRightIcon />
          </DeskListLink>
        }
      />
    ),
    size: 50,
    meta: { align: "right" },
  }),
]);

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
  const accountMoveItems = accountMoveItemResults.then(
    (result) => result.accountMoveItems,
  );
  const metadata = accountMoveItemResults.then((result) => result.metadata);
  const canCreate = await hasAccess(supabase, "insert", "account_move_items");

  return data({
    accountMoveItems,
    metadata,
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
  const { accountMoveItems, metadata, canCreate } = loaderData;

  const list = useDeskList({
    resource: "account_move_items",
    columns,
    data: accountMoveItems,
    metadata,
  });

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList {...getDeskListProps(list)}>
      <DeskListTopBar metadata={metadata}>
        <DeskFilter {...getFilterProps(list.filter)} />
        {canCreate && <AccountMoveItemCreateDialog />}
      </DeskListTopBar>
      <DeskListContent view="table">
        <DeskTable table={list.table} isLoading={list.state === "loading"} />
      </DeskListContent>
      <DeskListContent view="grid">
        <DeskListGrid isLoading={list.state === "loading"}>
          {list.rows.map(({ original: accountMoveItem }) => (
            <Item key={accountMoveItem.id} variant="outline">
              <ItemContent>
                <ItemTitle>
                  <DeskListLink
                    to={`/desk/accounting/move-items/${accountMoveItem.id}`}
                  >
                    {accountMoveItem.name}
                  </DeskListLink>
                </ItemTitle>
                <ItemDescription>
                  {accountMoveItem.move?.number || "-"} ·{" "}
                  {accountMoveItem.account
                    ? `${accountMoveItem.account.code} · ${accountMoveItem.account.name}`
                    : "-"}{" "}
                  · {accountMoveItem.partner?.name || "-"}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <div className="flex flex-col items-end text-xs tabular-nums">
                  <span>D: {formatAmount(accountMoveItem.debit)}</span>
                  <span>K: {formatAmount(accountMoveItem.credit)}</span>
                </div>
              </ItemActions>
            </Item>
          ))}
        </DeskListGrid>
      </DeskListContent>
    </DeskList>
  );
}

function AccountMoveItemCreateDialog() {
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

  const moveField = useAccountMoveField(fields.moveId);
  const accountField = useAccountField(fields.accountId);
  const partnerField = usePartnerField(fields.partnerId);
  const productField = useProductField(fields.productId);

  return (
    <DeskCreateDialog form={form} title="Tambah Baris Jurnal">
      <FieldText field={fields.name} label="Deskripsi" />
      <FieldCombobox {...moveField} label="Entri Jurnal" />
      <FieldCombobox {...accountField} label="Akun" />
      <FieldCombobox {...partnerField} label="Kontak" />
      <FieldCombobox {...productField} label="Produk" />
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
    </DeskCreateDialog>
  );
}

function formatAmount(value: number) {
  return formatCurrency(value, "IDR", "id-ID", 2);
}
