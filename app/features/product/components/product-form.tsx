import type { SubmissionResult } from "@conform-to/react";
import { getFormProps } from "@conform-to/react";
import { SaveIcon } from "lucide-react";
import { Form } from "react-router";
import z from "zod";
import { FieldCombobox } from "~/components/form/fields/combobox";
import { FieldCheckbox, FieldText } from "~/components/form/fields/input";
import { Button } from "~/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import { DeskTopBar } from "~/features/desk/components/bar";
import { useDeskForm } from "~/features/desk/hooks/use-form";
import { createProductTemplateSchema } from "../schemas/product-template";

type ProductFormOption = { value: string; label: string };

type ProductFormProps = {
  /** Schema used to validate the form on the client. */
  schema?: typeof createProductTemplateSchema;
  /** Initial values of the form. */
  defaultValue?: Partial<z.input<typeof createProductTemplateSchema>>;
  /** The result of the last submission, used to show server side errors. */
  lastResult?: SubmissionResult<string[]> | null;
  categoryOptions: ProductFormOption[];
  brandOptions: ProductFormOption[];
  accountOptions: ProductFormOption[];
};

export function ProductForm({
  schema = createProductTemplateSchema,
  defaultValue,
  lastResult,
  categoryOptions,
  brandOptions,
  accountOptions,
}: ProductFormProps) {
  const { form, fields } = useDeskForm({
    schema,
    defaultValue,
    lastResult,
  });

  return (
    <Form {...getFormProps(form)} method="post">
      <DeskTopBar>
        <Button type="submit">
          <SaveIcon />
          <span>Simpan</span>
        </Button>
      </DeskTopBar>
      <div className="flex flex-col gap-8 p-4">
        <FieldSet>
          <FieldLegend className="flex items-center">
            Informasi Produk <FieldSeparator className="flex-1" />
          </FieldLegend>
          <FieldDescription>
            Informasi utama produk seperti nama, kategori dan harga.
          </FieldDescription>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FieldGroup>
              <FieldText field={fields.name} label="Nama" />
              <FieldText field={fields.code} label="Kode" />
              <FieldCombobox
                field={fields.categoryId}
                label="Kategori"
                items={categoryOptions}
                placeholder="Pilih Kategori"
              />
              <FieldCombobox
                field={fields.brandId}
                label="Merek"
                items={brandOptions}
                placeholder="Pilih Merek"
              />
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
              <FieldText field={fields.barcode} label="Kode Batang" />
            </FieldGroup>
          </div>
        </FieldSet>
        <FieldSet>
          <FieldLegend>Penjualan &amp; Pembelian</FieldLegend>
          <FieldDescription>
            Aktifkan penjualan dan pembelian produk.
          </FieldDescription>
          <FieldGroup className="lg:max-w-1/2">
            <FieldCheckbox
              field={fields.isSale}
              label="Izinkan penjualan produk"
            >
              <FieldDescription>
                Produk akan ditampilkan di module penjualan.
              </FieldDescription>
            </FieldCheckbox>
            <FieldCheckbox
              field={fields.isPurchase}
              label="Izinkan pembelian produk"
            >
              <FieldDescription>
                Produk akan ditampilkan di module pembelian.
              </FieldDescription>
            </FieldCheckbox>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend>Akuntansi</FieldLegend>
          <FieldDescription>
            Pengaturan akun pendapatan dan pengeluaran.
          </FieldDescription>
          <FieldGroup className="lg:max-w-1/2">
            <FieldCombobox
              field={fields.defaultIncomeAccountId}
              label="Akun Pendapatan"
              items={accountOptions}
              placeholder="Pilih Akun Pendapatan"
            />
            <FieldCombobox
              field={fields.defaultExpenseAccountId}
              label="Akun Beban"
              items={accountOptions}
              placeholder="Pilih Akun Beban"
            />
          </FieldGroup>
        </FieldSet>
      </div>
    </Form>
  );
}
