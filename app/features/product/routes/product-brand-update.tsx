import { getFormProps } from "@conform-to/react";
import { data, Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { Input } from "~/components/ui/input";
import { supabaseClientContext } from "~/context";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import { useDeskForm } from "~/features/desk/hooks/use-form";
import type { Handle } from "~/features/desk/types/route";
import { parseForm } from "~/utils/request";
import { createProductBrandSchema } from "../schemas/product-brand";
import {
  getProductBrandById,
  updateProductBrand,
} from "../services/product-brand";
import type { Route } from "./+types/product-brand-update";
import { ButtonGroup } from "~/components/ui/button-group";
import { SaveIcon } from "lucide-react";

export const handle = {
  breadcrumb: (match) => ({
    label: match.loaderData?.productBrand.name || "Tanpa Nama",
  }),
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.productBrand.name }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const productBrand = await getProductBrandById(
    supabase,
    params.productBrandId,
  );

  return data({ productBrand });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema: createProductBrandSchema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateProductBrand(
    supabase,
    params.productBrandId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function ProductBrandUpdate({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { productBrand } = loaderData;
  const { form, fields } = useDeskForm({
    schema: createProductBrandSchema,
    defaultValue: { name: productBrand.name },
    lastResult: actionData?.lastResult,
  });

  return (
    <Form {...getFormProps(form)} method="post">
      <TopBar>
        <DeskHeader>
          <ButtonGroup>
            <Button type="submit">
              <SaveIcon /> <span className="hidden md:block">Simpan</span>
            </Button>
          </ButtonGroup>
        </DeskHeader>
      </TopBar>
      <div className="max-w-1/2 p-4">
        <FieldGroup>
          <FieldTextInput field={fields.name} label="Nama" />
          <Field>
            <FieldLabel htmlFor="createdAt">Tanggal Dibuat</FieldLabel>
            <Input id="createdAt" value={productBrand.createdAt} readOnly />
          </Field>
          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={productBrand.updatedAt || ""}
              readOnly
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
