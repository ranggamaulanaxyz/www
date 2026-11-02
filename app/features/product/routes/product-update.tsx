import { data, Form } from "react-router";
import type { Route } from "./+types/product-update";
import { getProductById, updateProduct } from "../services/product";
import { supabaseClientContext } from "~/context";
import { getFormProps, useForm } from "@conform-to/react";
import { parseForm } from "~/utils/request";
import { updateProductSchema } from "../schemas/product";
import { DeskTopBar } from "~/features/desk/components/bar";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "lucide-react";
import { FieldDescription, FieldGroup } from "~/components/ui/field";
import { FieldCheckbox, FieldText } from "~/components/form/fields/input";

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const product = await getProductById(supabase, params.productId);

  return data({ product });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema: updateProductSchema });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateProduct(
    supabase,
    params.productId,
    submission.value,
  );

  return data({ success: success });
}

export default function ProductUpdate({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const [form, fields] = useForm({
    defaultValue: {
      name: product.name,
      code: product.code,
      barcode: product.barcode,
      costPrice: String(product.costPrice),
      salePrice: String(product.salePrice),
      isSale: product.isSale,
      isPurchase: product.isPurchase,
    },
    onValidate({ formData }) {
      return parseForm(formData, { schema: updateProductSchema });
    },
  });
  return (
    <Form {...getFormProps(form)} method="post">
      <DeskTopBar>
        <Button type="submit">
          <SaveIcon /> <span>Simpan</span>
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
            field={fields.salePrice}
            label="Harga Jual"
            type="number"
          />
          <FieldText
            field={fields.costPrice}
            label="Harga Beli"
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
