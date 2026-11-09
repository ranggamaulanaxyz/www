import {
  getFormProps,
  useForm,
  type FieldMetadata,
  type FormMetadata,
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
import type { AccountMove, AccountMoveStatus } from "../schemas/account-move";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const itemSchema = z.object({
  /** Existing item id, used to update only changed rows. */
  id: z.string().nullable().optional(),
  productId: z.string("Produk tidak valid.").nullable().optional(),
  name: z.string("Deskripsi tidak valid."),
  accountId: z.string("Akun tidak valid."),
  debit: z.coerce
    .number("Debit tidak valid.")
    .nonnegative("Debit harus sama atau lebih besar dari 0.")
    .default(0),
  credit: z.coerce
    .number("Kredit tidak valid.")
    .nonnegative("Kredit harus sama atau lebih besar dari 0.")
    .default(0),
});

export const schema = z.object({
  number: z.string("Nomor tidak valid.").optional().nullable(),
  date: z.iso.date("Tanggal tidak valid."),
  journalId: z.string("Jurnal tidak valid."),
  partnerId: z.string("Kontak tidak valid.").nullable(),
  items: z.array(itemSchema).optional(),
});

type AccountMoveItemDefaultValue = Partial<z.input<typeof itemSchema>> & {
  /** Current product, used to show its label in the combobox. */
  product?: { id: string; name: string } | null;
  /** Current account, used to show its label in the combobox. */
  account?: { id: string; name: string } | null;
};

type AccountMoveFormProps = {
  defaultValue?: Omit<Partial<z.input<typeof schema>>, "items"> & {
    /** Current journal, used to show its label in the combobox. */
    journal?: { id: string; name: string } | null;
    /** Current partner, used to show its label in the combobox. */
    partner?: { id: string; name: string } | null;
    items?: AccountMoveItemDefaultValue[];
  };
};

export function AccountMoveForm({ defaultValue }: AccountMoveFormProps) {
  const {
    journal,
    partner,
    items: defaultItems,
    ...formDefaultValue
  } = defaultValue ?? {};
  const [form, fields] = useForm<
    z.input<typeof schema>,
    z.output<typeof schema>,
    string[]
  >({
    defaultValue: {
      ...formDefaultValue,
      items: defaultItems?.map(({ product, account, ...item }) => item) ?? [
        { debit: "0", credit: "0" },
      ],
    } as never,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseForm(formData, { schema }) as never;
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
                journal ? { label: journal.name, value: journal.id } : undefined
              }
            />
            <FieldDate field={fields.date} label="Tanggal" />
          </FieldGroup>
          <FieldGroup>
            <FieldCombobox
              {...partnerField}
              label="Kontak"
              defaultValue={
                partner ? { label: partner.name, value: partner.id } : undefined
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
                      defaultItems={defaultItems}
                    />
                  );
                })}
                <TableRow>
                  <TableCell colSpan={6} className="py-0">
                    <Button
                      size="sm"
                      variant="link"
                      type="button"
                      className="w-full justify-start px-0"
                      onClick={() =>
                        form.insert({
                          name: fields.items.name,
                          defaultValue: { debit: "0", credit: "0" },
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
  defaultItems,
}: {
  form: FormMetadata<z.input<typeof schema>>;
  item: FieldMetadata<z.input<typeof itemSchema>>;
  index: number;
  defaultItems?: AccountMoveItemDefaultValue[];
}) {
  const fields = form.getFieldset();
  const itemFields = item.getFieldset();
  const accountField = useAccountField(itemFields.accountId);
  const productField = useProductField(itemFields.productId);

  const defaultProduct = defaultItems?.find(
    (defaultItem) =>
      (defaultItem.productId ?? null) ===
      (itemFields.productId.initialValue ?? null),
  )?.product;
  const defaultAccount = defaultItems?.find(
    (defaultItem) =>
      defaultItem.accountId === itemFields.accountId.initialValue,
  )?.account;

  return (
    <TableRow key={item.key}>
      <TableCell className="align-top">
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
