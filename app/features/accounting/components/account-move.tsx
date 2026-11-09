import {
  getFormProps,
  getInputProps,
  useForm,
  type FieldMetadata,
  type FormMetadata,
  type SubmissionResult,
} from "@conform-to/react";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  XCircleIcon,
} from "lucide-react";
import { Form, Link, useSearchParams } from "react-router";
import { z } from "zod";
import { FieldCombobox } from "~/components/form/fields/combobox";
import { FieldDate, FieldText } from "~/components/form/fields/input";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DeskTopBar } from "~/features/desk/components/bar";
import { parseForm } from "~/utils/request";
import { useJournalField } from "../hooks/use-journal";
import { usePartnerField } from "~/features/partner/hooks/use-partner";
import { useAccountField } from "../hooks/use-account";
import { useProductField } from "~/features/product/hooks/use-product";
import {
  accountMoveFormSchema,
  type AccountMove,
  type AccountMoveStatus,
} from "../schemas/account-move";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { AccountMoveItems } from "../schemas/account-move-item";

type AccountMoveFormProps = {
  move?: AccountMove;
  lastResult?: SubmissionResult<string[]> | null;
};

export function AccountMoveForm({ move, lastResult }: AccountMoveFormProps) {
  const [form, fields] = useForm({
    lastResult: lastResult ?? null,
    defaultValue: move
      ? {
          journalId: move.journalId || "",
          partnerId: move.partnerId || "",
          date: move.date || "",
          number: move.number || "",
          items: move.items?.map((item) => ({
            id: item.id || "",
            productId: item.productId || "",
            name: item.name || "",
            accountId: item.accountId || "",
            debit: item.debit.toString() || "0",
            credit: item.credit.toString() || "0",
          })),
        }
      : { items: [{ id: "", debit: "0", credit: "0" }] },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseForm(formData, { schema: accountMoveFormSchema });
    },
  });
  const items = fields.items.getFieldList();

  const journalField = useJournalField(fields.journalId);
  const partnerField = usePartnerField(fields.partnerId);

  return (
    <Form {...getFormProps(form)} method="post">
      <DeskTopBar>
        {form.dirty && (
          <ButtonGroup className="gap-1">
            <Button type="submit">
              <SaveIcon /> <span>Simpan</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => form.reset()}
            >
              <XCircleIcon />
              <span>Batalkan</span>
            </Button>
          </ButtonGroup>
        )}
      </DeskTopBar>
      <div className="flex flex-col gap-5 p-4">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <FieldGroup>
            <FieldCombobox
              {...journalField}
              label="Jurnal"
              defaultValue={
                move?.journal
                  ? { label: move.journal.name, value: move.journal.id }
                  : undefined
              }
            />
            <FieldDate field={fields.date} label="Tanggal" />
          </FieldGroup>
          <FieldGroup>
            <FieldCombobox
              {...partnerField}
              label="Kontak"
              defaultValue={
                move?.partner
                  ? { label: move?.partner.name, value: move?.partner.id }
                  : undefined
              }
            />
            <FieldText field={fields.number} label="Nomor" exclude={true} />
          </FieldGroup>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel>Baris</FieldLabel>
            <Table containerClassName="border">
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Akun</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Kredit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  return (
                    <AccountMoveItemTableRow
                      key={item.key}
                      form={form}
                      item={item}
                      index={index}
                      moveItems={move?.items}
                    />
                  );
                })}
                <TableRow>
                  <TableCell colSpan={6}>
                    <Button
                      size="sm"
                      variant="link"
                      type="button"
                      className="w-full px-0"
                      onClick={() =>
                        form.insert({
                          name: fields.items.name,
                          defaultValue: { id: "", debit: "0", credit: "0" },
                        })
                      }
                    >
                      <PlusIcon />
                      Tambah
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableHead colSpan={3}>Total</TableHead>
                  <TableCell className="px-4 text-right">0</TableCell>
                  <TableCell className="px-4 text-right">0</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}

export function AccountMoveItemTableRow({
  form,
  item,
  index,
  moveItems,
}: {
  form: FormMetadata<z.input<typeof accountMoveFormSchema>>;
  item: FieldMetadata<z.input<typeof accountMoveFormSchema>["items"][number]>;
  index: number;
  moveItems?: AccountMoveItems;
}) {
  const fields = form.getFieldset();
  const itemFields = item.getFieldset();
  const accountField = useAccountField(itemFields.accountId);
  const productField = useProductField(itemFields.productId);

  const defaultProduct = moveItems?.find(
    (item) =>
      (item.productId ?? null) === (itemFields.productId.initialValue ?? null),
  )?.product;
  const defaultAccount = moveItems?.find(
    (item) => item.accountId === itemFields.accountId.initialValue,
  )?.account;

  return (
    <TableRow key={item.key}>
      <TableCell className="align-top">
        <input {...getInputProps(itemFields.id, { type: "hidden" })} />
        <FieldCombobox
          {...productField}
          defaultValue={
            defaultProduct
              ? { label: defaultProduct.name, value: defaultProduct.id }
              : undefined
          }
        />
      </TableCell>
      <TableCell className="align-top">
        <FieldText field={itemFields.name} />
      </TableCell>
      <TableCell className="align-top">
        <FieldCombobox
          {...accountField}
          defaultValue={
            defaultAccount
              ? { label: defaultAccount.name, value: defaultAccount.id }
              : undefined
          }
        />
      </TableCell>
      <TableCell className="align-top">
        <FieldText field={itemFields.debit} align="right" />
      </TableCell>
      <TableCell className="align-top">
        <FieldText field={itemFields.credit} align="right" />
      </TableCell>
      <TableCell className="text-right align-top">
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={() =>
            form.remove({
              name: fields.items.name,
              index,
            })
          }
        >
          <TrashIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function AccountMoveStatus({ value }: { value: AccountMoveStatus }) {
  switch (value) {
    case "posted":
      return <Badge variant="default">Dibukukan</Badge>;
    case "draft":
      return <Badge variant="secondary">Rancangan</Badge>;
  }
}

export function AccountMoveActions({ move }: { move: AccountMove }) {
  const [searchParams] = useSearchParams();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link
                to={{
                  pathname: `/desk/accounting/moves/${move.id}`,
                  search: searchParams.toString(),
                }}
              >
                <EyeIcon /> <span>Buka</span>
              </Link>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
