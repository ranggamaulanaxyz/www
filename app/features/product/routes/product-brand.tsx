import {
  deskColumnBuilder,
  DeskTable,
  selectionColumn,
} from "~/features/desk/components/table";
import type { Route } from "./+types/product-brand";
import { supabaseClientContext } from "~/context";
import {
  getProductBrands,
  createProductBrand,
} from "../services/product-brand";
import {
  data,
  Form,
  Outlet,
  redirect,
  useActionData,
  useOutlet,
} from "react-router";
import { createShouldRevalidate } from "~/utils/revalidate";
import type { ProductBrand } from "../types/product-brand";
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
import { DeskProductBrandActionDropdown } from "../components/desk-brand";
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
import { getFormProps } from "@conform-to/react";
import { parseForm } from "~/utils/request";
import { createProductBrandSchema } from "../schemas/product-brand";
import { productSidebarRegistry } from "../sidebar";
import { useDeskForm } from "~/features/desk/hooks/use-form";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const title = "Merek";

export const handle = {
  breadcrumb: { label: title },
  sidebarRegistry: productSidebarRegistry,
} satisfies Handle<Route.ComponentProps["loaderData"]>;

const columnBuilder = deskColumnBuilder<ProductBrand>();
const columns = columnBuilder.columns([
  selectionColumn,
  columnBuilder.accessor("name", { header: "Nama" }),
  columnBuilder.display({
    id: "actions",
    cell: ({ row: { original: productBrand } }) => {
      return <DeskProductBrandActionDropdown productBrand={productBrand} />;
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

  const promiseGetProductBrands = getProductBrands(supabase, filterOptions);
  const productBrands = promiseGetProductBrands.then(
    (result) => result.productBrands,
  );
  const metadata = promiseGetProductBrands.then((result) => result.metadata);

  return data({ productBrands, metadata });
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseForm(formData, { schema: createProductBrandSchema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const productBrand = await createProductBrand(supabase, submission.value);

  return redirect(
    `/desk/product-brands/${productBrand.id}?${url.searchParams.toString()}`,
  );
}

export const shouldRevalidate = createShouldRevalidate();

export default function ProductBrandList({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { productBrands, metadata } = loaderData;

  const filter = useDeskFilter();
  const { table, rows, state, ...listProps } = useDeskList({
    resource: "product_brands",
    columns,
    data: productBrands,
    metadata,
  });
  const { form, fields } = useDeskForm({
    schema: createProductBrandSchema,
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
          {rows.map(({ original: productBrand, ...row }) => (
            <Item key={row.id} variant="outline">
              <ItemContent>
                <ItemTitle>{productBrand.name}</ItemTitle>
                <ItemDescription>
                  {new Date(productBrand.createdAt).toLocaleDateString(
                    "id-ID",
                    {
                      dateStyle: "long",
                    },
                  )}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <DeskProductBrandActionDropdown productBrand={productBrand} />
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
            <DialogTitle>Tambah Merek</DialogTitle>
          </DialogHeader>
          <FieldTextInput field={fields.name} label="Nama" />
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
