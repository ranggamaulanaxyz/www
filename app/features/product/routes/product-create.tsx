import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/product-create";
import { DeskTopBar } from "~/features/desk/components/bar";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseForm } from "~/utils/request";
import { createProductSchema } from "../schemas/product";
import { data, Form, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "lucide-react";
import { FieldDescription, FieldGroup } from "~/components/ui/field";
import { FieldCheckbox, FieldText } from "~/components/form/fields/input";
import { supabaseClientContext } from "~/context";
import { createProduct } from "../services/product";

const title = "Tambah Produk";

export const handle = {
  breadcrumb: { label: title },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema: createProductSchema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const product = await createProduct(supabase, submission.value);

  if (product) {
    throw redirect(`/desk/products/${product.id}`);
  }

  return data({ lastResult: submission.reply() });
}

export default function ProductCreate() {
  const [form, fields] = useForm({
    defaultValue: {
      costPrice: "0",
      salePrice: "0",
    },
    onValidate({ formData }) {
      return parseForm(formData, { schema: createProductSchema });
    },
  });
  return (
    <Form {...getFormProps(form)} method="post">
      <DeskTopBar>
        <Button type="submit">
          <SaveIcon />
          <span>Simpan</span>
        </Button>
      </DeskTopBar>
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        <FieldGroup>
          <FieldText field={fields.name} label="Nama" />
          <FieldText field={fields.code} label="Kode" />
          <FieldText field={fields.barcode} label="Kode Batang" />
        </FieldGroup>
        <FieldGroup>
          <FieldText
            field={fields.costPrice}
            label="Harga Beli"
            type="number"
          />
          <FieldText
            field={fields.salePrice}
            label="Harga Jual"
            type="number"
          />
        </FieldGroup>
        <FieldGroup>
          <FieldCheckbox field={fields.isSale} label="Izinkan penjualan produk">
            <FieldDescription>
              Produk akan ditampilkan di module penjualan
            </FieldDescription>
          </FieldCheckbox>
          <FieldCheckbox
            field={fields.isPurchase}
            label="Izinkan pembelian produk"
          >
            <FieldDescription>
              Produk akan ditampilkan di module pembelian
            </FieldDescription>
          </FieldCheckbox>
        </FieldGroup>
      </div>
    </Form>
  );
}
