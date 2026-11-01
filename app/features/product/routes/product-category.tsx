import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product-category";
import { supabaseClientContext } from "~/context";
import {
  getProductCategories,
  createProductCategory,
} from "../services/product-category";
import {
  data,
  Form,
  Outlet,
  redirect,
  useActionData,
  useOutlet,
} from "react-router";
import { createShouldRevalidate } from "~/utils/revalidate";
import type { ProductCategory } from "../types/product-category";
import { parseFilter } from "~/features/desk/services/filter";
import type { Handle } from "~/features/desk/types/route";
import { useDeskList } from "~/features/desk/hooks/use-list";
import {
  DeskList,
  DeskListActions,
  DeskListBottomBar,
  DeskListContent,
  DeskListGrid,
  DeskListTopBar,
} from "~/features/desk/components/list";
import { DeskFilter, useDeskFilter } from "~/features/desk/components/filter";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { DeskProductCategoryActionDropdown } from "../components/desk-category";
import { DeskBottomBarItem } from "~/features/desk/components/bar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FieldTextInput } from "~/components/ui/field-input";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { getFormProps } from "@conform-to/react";
import { parseForm } from "~/utils/request";
import { createProductCategorySchema } from "../schemas/product-category";
import { productSidebarRegistry } from "../sidebar";
import { useDeskForm } from "~/features/desk/hooks/use-form";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ProductCategoryCombobox } from "../components/product-category-combobox";

const title = "Kategori";

type ProductCategoryRow = ProductCategory & { parentName: string | null };

export const handle = {
  breadcrumb: { label: title },
  sidebarRegistry: productSidebarRegistry,
} satisfies Handle<Route.ComponentProps["loaderData"]>;

const columnBuilder = deskColumnBuilder<ProductCategoryRow>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("name", { header: "Nama" }),
  columnBuilder.accessor("parentName", {
    header: "Kategori Induk",
    cell: ({ getValue }) => getValue() ?? "-",
  }),
  columnBuilder.display({
    id: "actions",
    cell: ({ row: { original: productCategory } }) => {
      return (
        <DeskProductCategoryActionDropdown productCategory={productCategory} />
      );
    },
    size: 50,
  }),
]);

export function meta() {
  return [{ title }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);
  const supabase = context.get(supabaseClientContext);

  const promiseGetProductCategories = getProductCategories(
    supabase,
    filterOptions,
  );
  const { productCategories: allProductCategories } =
    await getProductCategories(supabase, { from: 1, to: 1000 });
  const parentNames = new Map(
    allProductCategories.map((productCategory) => [
      productCategory.id,
      productCategory.name,
    ]),
  );

  const productCategories = promiseGetProductCategories.then((result) =>
    result.productCategories.map((productCategory) => ({
      ...productCategory,
      parentName: productCategory.parentId
        ? (parentNames.get(productCategory.parentId) ?? null)
        : null,
    })),
  );
  const metadata = promiseGetProductCategories.then(
    (result) => result.metadata,
  );
  const parentOptions = allProductCategories.map((productCategory) => ({
    value: productCategory.id,
    label: productCategory.name,
  }));

  return data({ productCategories, metadata, parentOptions });
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, {
    schema: createProductCategorySchema,
  });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const productCategory = await createProductCategory(
    supabase,
    submission.value,
  );

  return redirect(
    `/desk/product-categories/${productCategory.id}?${url.searchParams.toString()}`,
  );
}

export const shouldRevalidate = createShouldRevalidate();

export default function ProductCategoryList({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { productCategories, metadata, parentOptions } = loaderData;

  const filter = useDeskFilter();
  const { table, rows, state, ...listProps } = useDeskList({
    resource: "product_categories",
    columns,
    data: productCategories,
    metadata,
  });
  const { form, fields } = useDeskForm({
    schema: createProductCategorySchema,
    lastResult: actionData?.lastResult,
  });

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <DeskList
      filter={filter}
      onClickCreate={() => setOpenCreateDialog(true)}
      {...listProps}
    >
      <DeskListTopBar metadata={metadata}>
        <div className="hidden items-center md:flex">
          <DeskFilter {...filter} />
        </div>
      </DeskListTopBar>
      <DeskListContent view="table">
        <DeskTable table={table} isLoading={state === "loading"} />
      </DeskListContent>
      <DeskListContent view="grid">
        <DeskListGrid isLoading={state === "loading"}>
          {rows.map(({ original: productCategory, ...row }) => (
            <Item key={row.id} variant="outline">
              <ItemContent>
                <ItemTitle>{productCategory.name}</ItemTitle>
                <ItemDescription>
                  {productCategory.parentName
                    ? `Induk: ${productCategory.parentName}`
                    : new Date(productCategory.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          dateStyle: "long",
                        },
                      )}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DeskProductCategoryActionDropdown
                  productCategory={productCategory}
                />
              </ItemActions>
            </Item>
          ))}
        </DeskListGrid>
      </DeskListContent>
      <DeskListBottomBar>
        <DeskBottomBarItem>
          <DeskListActions variant="ghost" iconClassName="size-6" />
        </DeskBottomBarItem>
      </DeskListBottomBar>
      <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
        <DialogContent render={<Form {...getFormProps(form)} method="post" />}>
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
          </DialogHeader>
          <FieldTextInput field={fields.name} label="Nama" />
          <Field data-invalid={!fields.parentId.valid}>
            <FieldLabel htmlFor={fields.parentId.id}>Kategori Induk</FieldLabel>
            <ProductCategoryCombobox
              id={fields.parentId.id}
              name={fields.parentId.name}
              items={parentOptions}
              placeholder="Pilih Kategori Induk"
              invalid={!fields.parentId.valid}
            />
            <FieldError errors={fields.parentId.errors} />
          </Field>
          <DialogFooter className="flex-row">
            <DialogClose
              render={<Button variant="secondary">Batalkan</Button>}
            />
            <Button type="submit">Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DeskList>
  );
}
