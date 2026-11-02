import { data } from "react-router";
import type { Route } from "./+types/product-update";
import {
  getProductTemplateById,
  updateProductTemplate,
} from "../services/product-template";
import { supabaseClientContext } from "~/context";
import { parseForm } from "~/utils/request";
import { updateProductTemplateSchema } from "../schemas/product-template";
import { getProductCategories } from "../services/product-category";
import { getProductBrands } from "../services/product-brand";
import { getAccounts } from "~/features/accounting/services/account";
import { ProductForm } from "../components/product-form";

export async function loader({ params, context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseClientContext);
  const [product, { productCategories }, { productBrands }, { accounts }] =
    await Promise.all([
      getProductTemplateById(supabase, params.productId),
      getProductCategories(supabase, { from: 1, to: 1000 }),
      getProductBrands(supabase, { from: 1, to: 1000 }),
      getAccounts(supabase, { from: 1, to: 1000 }),
    ]);

  return data({
    product,
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

export async function action({ request, params, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, {
    schema: updateProductTemplateSchema,
  });
  if (submission.status !== "success") {
    return data(
      { success: false, lastResult: submission.reply() },
      { status: 422 },
    );
  }

  const supabase = context.get(supabaseClientContext);
  const success = await updateProductTemplate(
    supabase,
    params.productId,
    submission.value,
  );

  return data({ success, lastResult: submission.reply() });
}

export default function ProductUpdate({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { product, categoryOptions, brandOptions, accountOptions } = loaderData;

  return (
    <ProductForm
      schema={updateProductTemplateSchema}
      defaultValue={{
        name: product.name,
        code: product.code,
        barcode: product.barcode,
        costPrice: String(product.costPrice),
        salePrice: String(product.salePrice),
        isSale: product.isSale,
        isPurchase: product.isPurchase,
        categoryId: product.categoryId ?? "",
        brandId: product.brandId ?? "",
        defaultIncomeAccountId: product.defaultIncomeAccountId ?? "",
        defaultExpenseAccountId: product.defaultExpenseAccountId ?? "",
      }}
      lastResult={actionData?.lastResult ?? null}
      categoryOptions={categoryOptions}
      brandOptions={brandOptions}
      accountOptions={accountOptions}
    />
  );
}
