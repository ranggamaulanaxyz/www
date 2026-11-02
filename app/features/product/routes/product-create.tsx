import type { Handle } from "~/features/desk/types/route";
import type { Route } from "./+types/product-create";
import { data, redirect } from "react-router";
import { parseForm } from "~/utils/request";
import { createProductTemplateSchema } from "../schemas/product-template";
import { supabaseClientContext } from "~/context";
import { createProductTemplate } from "../services/product-template";
import { getProductCategories } from "../services/product-category";
import { getProductBrands } from "../services/product-brand";
import { getAccounts } from "~/features/accounting/services/account";
import { ProductForm } from "../components/product-form";

const title = "Tambah Produk";

export const handle = {
  breadcrumb: { label: title },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const [{ productCategories }, { productBrands }, { accounts }] =
    await Promise.all([
      getProductCategories(supabase, { from: 1, to: 1000 }),
      getProductBrands(supabase, { from: 1, to: 1000 }),
      getAccounts(supabase, { from: 1, to: 1000 }),
    ]);

  return data({
    categoryOptions: productCategories.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    brandOptions: productBrands.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    accountOptions: accounts.map(({ id, code, name }) => ({
      value: id,
      label: `${code} · ${name}`,
    })),
  });
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, {
    schema: createProductTemplateSchema,
  });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const product = await createProductTemplate(supabase, submission.value);

  if (product) {
    throw redirect(`/desk/products/${product.id}`);
  }

  return data({ lastResult: submission.reply() });
}

export default function ProductCreate({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { categoryOptions, brandOptions, accountOptions } = loaderData;

  return (
    <ProductForm
      schema={createProductTemplateSchema}
      defaultValue={{
        costPrice: "0",
        salePrice: "0",
      }}
      lastResult={actionData?.lastResult ?? null}
      categoryOptions={categoryOptions}
      brandOptions={brandOptions}
      accountOptions={accountOptions}
    />
  );
}
