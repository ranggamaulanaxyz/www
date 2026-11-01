import { getFormProps } from "@conform-to/react";
import { data, Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { FieldTextInput } from "~/components/ui/field-input";
import { Input } from "~/components/ui/input";
import { supabaseClientContext } from "~/context";
import { TopBar } from "~/features/desk/components/bar";
import DeskHeader from "~/features/desk/components/header";
import { useDeskForm } from "~/features/desk/hooks/use-form";
import type { Handle } from "~/features/desk/types/route";
import { parseForm } from "~/utils/request";
import { createProductCategorySchema } from "../schemas/product-category";
import {
  getProductCategories,
  getProductCategoryById,
  updateProductCategory,
} from "../services/product-category";
import type { ProductCategory } from "../types/product-category";
import type { Route } from "./+types/product-category-update";
import { ButtonGroup } from "~/components/ui/button-group";
import { SaveIcon } from "lucide-react";
import { ProductCategoryCombobox } from "../components/product-category-combobox";

export const handle = {
  breadcrumb: (match) => ({
    label: match.loaderData?.productCategory.name || "Tanpa Nama",
  }),
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.productCategory.name }];
}

function getCategoryAndDescendantIds(
  productCategories: ProductCategory[],
  rootId: string,
) {
  const childrenByParentId = new Map<string, ProductCategory[]>();
  for (const productCategory of productCategories) {
    if (!productCategory.parentId) continue;
    const children = childrenByParentId.get(productCategory.parentId) ?? [];
    children.push(productCategory);
    childrenByParentId.set(productCategory.parentId, children);
  }

  const ids = new Set<string>([rootId]);
  const stack = [rootId];
  while (stack.length > 0) {
    const parentId = stack.pop();
    if (!parentId) continue;
    for (const child of childrenByParentId.get(parentId) ?? []) {
      if (ids.has(child.id)) continue;
      ids.add(child.id);
      stack.push(child.id);
    }
  }

  return ids;
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const [productCategory, { productCategories }] = await Promise.all([
    getProductCategoryById(supabase, params.productCategoryId),
    getProductCategories(supabase, { from: 1, to: 1000 }),
  ]);

  const unavailableIds = getCategoryAndDescendantIds(
    productCategories,
    productCategory.id,
  );
  const parentOptions = productCategories
    .filter((category) => !unavailableIds.has(category.id))
    .map((category) => ({ value: category.id, label: category.name }));

  return data({ productCategory, parentOptions });
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, {
    schema: createProductCategorySchema,
  });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateProductCategory(
    supabase,
    params.productCategoryId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function ProductCategoryUpdate({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { productCategory, parentOptions } = loaderData;
  const { form, fields } = useDeskForm({
    schema: createProductCategorySchema,
    defaultValue: {
      name: productCategory.name,
      parentId: productCategory.parentId,
    },
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
          <Field data-invalid={!fields.parentId.valid}>
            <FieldLabel htmlFor={fields.parentId.id}>Kategori Induk</FieldLabel>
            <ProductCategoryCombobox
              id={fields.parentId.id}
              name={fields.parentId.name}
              items={parentOptions}
              defaultValue={productCategory.parentId}
              placeholder="Pilih Kategori Induk"
              invalid={!fields.parentId.valid}
            />
            <FieldError errors={fields.parentId.errors} />
          </Field>
          <Field>
            <FieldLabel htmlFor="createdAt">Tanggal Dibuat</FieldLabel>
            <Input id="createdAt" value={productCategory.createdAt} readOnly />
          </Field>
          <Field>
            <FieldLabel htmlFor="updatedAt">Tanggal Terakhir Diubah</FieldLabel>
            <Input
              id="updatedAt"
              value={productCategory.updatedAt || ""}
              readOnly
            />
          </Field>
        </FieldGroup>
      </div>
    </Form>
  );
}
