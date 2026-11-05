import { getFormProps, useForm } from "@conform-to/react";
import { PlusIcon, SaveIcon } from "lucide-react";
import { Form } from "react-router";
import { z } from "zod";
import { FieldText } from "~/components/form/fields/input";
import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DeskTopBar } from "~/features/desk/components/bar";
import { parseForm } from "~/utils/request";

const schema = z.object({
  date: z.date().optional(),
  journalId: z.string().optional(),
  partnerId: z.string().optional(),
  items: z.array(
    z
      .object({
        productId: z.string().optional(),
        name: z.string().optional(),
        accountId: z.string().optional(),
        debit: z.coerce.number().positive().optional(),
        credit: z.coerce.number().positive().optional(),
      })
      .optional(),
  ),
});

export function AccountMoveForm() {
  const [form, fields] = useForm({
    defaultValue: {
      items: [{ name: "1" }, { name: "2" }],
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseForm(formData, { schema });
    },
  });

  const items = fields.items.getFieldList();

  console.log(
    items.map((item) => ({
      key: item.key,
      name: item.getFieldset().name.value,
      initialValue: item.getFieldset().name.initialValue,
    })),
  );

  return (
    <Form {...getFormProps(form)} method="post">
      <DeskTopBar>
        <Button type="submit">
          <SaveIcon /> <span>Simpan</span>
        </Button>
      </DeskTopBar>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produk</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Akun</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const itemFields = item.getFieldset();
            return (
              <TableRow key={item.key}>
                <TableCell>
                  <FieldText field={itemFields.productId} />
                </TableCell>
                <TableCell>
                  <FieldText field={itemFields.name} />
                </TableCell>
                <TableCell>
                  <FieldText field={itemFields.accountId} />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      form.remove({
                        name: fields.items.name,
                        index,
                      })
                    }
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button
        type="button"
        onClick={() =>
          form.insert({
            name: fields.items.name,
            defaultValue: { name: (items.length + 1).toString() },
          })
        }
      >
        <PlusIcon />
      </Button>
    </Form>
  );
}
