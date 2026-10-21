import { useForm } from "@conform-to/react";
import { ArrowRightIcon, PencilIcon, PlusIcon } from "lucide-react";
import z, { keyof } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { TopBar } from "~/features/desk/components/bar";
import { DeskCreateDialog } from "~/features/desk/components/create-dialog";
import DeskHeader from "~/features/desk/components/header";
import { accountTypeSchema } from "../schemas/account-subtype";
import { parseWithZod } from "@conform-to/zod/v4";
import { FieldTextInput } from "~/components/ui/field-input";
import type { Route } from "./+types/account-subtype";
import type { Handle } from "~/features/desk/types/route";
import { Field, FieldLabel } from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { AccountType } from "../types/account-subtype";
import { Await, data, Link, useSearchParams } from "react-router";
import { supabaseClientContext } from "~/context";
import { parseFilter } from "~/features/desk/services/filter";
import { getAccountSubtypes } from "../services/account-subtype";
import { hasAccess } from "~/features/desk/services/access";
import { cn } from "cn";
import { Suspense, useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Skeleton } from "~/components/ui/skeleton";
import { useIsMobile } from "~/hooks/use-mobile";
import DeskPagination from "~/features/desk/components/pagination";
import FilterInputQuery from "~/features/desk/components/filter-input-query";

const schema = z.object({
  name: z.string("Nama subtipe tidak valid."),
  type: accountTypeSchema,
});

const accountTypes: Record<AccountType, string> = {
  asset: "Aset",
  liability: "Kewajiban",
  equity: "Kewajiban",
  income: "Pendapatan",
  expense: "Beban",
};

export const handle = {
  breadcrumb: { label: "Subtipe Akun" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Subtipe Akun" }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const accountSubtypeResults = getAccountSubtypes(supabase, filterOptions);
  const canCreate = await hasAccess(supabase, "insert", "account_subtypes");
  return data({
    accountSubtypeResults,
    searchParams: url.searchParams.toString(),
    filterOptions,
    canCreate,
  });
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
}

export default function AccountSubtype({ loaderData }: Route.ComponentProps) {
  const { accountSubtypeResults, canCreate, filterOptions } = loaderData;
  const [searchParams] = useSearchParams();
  const [paginationData, setPaginationData] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });
  useEffect(() => {
    const resolvePartner = async () => {
      const {
        metadata: { from, to, count },
      } = await accountSubtypeResults;
      setPaginationData({ from, to, count });
    };
    resolvePartner();
  }, [filterOptions]);

  return (
    <div className="flex min-h-dvh flex-col">
      <AccountSubtypeTopBar
        data={{ pagination: paginationData }}
        options={{ showCreateButton: canCreate }}
      />
      <div className="flex-1">
        <div
          className={cn([
            "grid gap-2 p-4",
            "md:grid-cols-2 md:gap-3",
            "lg:grid-cols-3",
            "xl:grid-cols-4",
          ])}
        >
          <Suspense fallback={<AccountSubtypeSkeleton />}>
            <Await resolve={accountSubtypeResults}>
              {({ accountSubtypes }) =>
                accountSubtypes.map((accountSubtype) => (
                  <Item key={accountSubtype.id} variant="outline">
                    <ItemContent>
                      <ItemTitle>{accountSubtype.name}</ItemTitle>
                      <ItemDescription>
                        {accountTypes?.[accountSubtype.type]}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="link"
                        nativeButton={false}
                        render={
                          <Link
                            to={{
                              pathname: `/desk/accounting/subtypes/${accountSubtype.id}`,
                              search: searchParams.toString(),
                            }}
                          >
                            <ArrowRightIcon />
                          </Link>
                        }
                      />
                    </ItemActions>
                  </Item>
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function AccountSubtypeTopBar({
  data,
  options,
}: {
  data: { pagination: { from: number; to: number; count: number } };
  options: { showCreateButton?: boolean | null };
}) {
  const isMobile = useIsMobile();
  return (
    <TopBar>
      <DeskHeader>
        <div className="flex justify-between gap-4 p-4">
          {!isMobile && <FilterInputQuery />}
          <div className={cn("flex items-center justify-end gap-1")}>
            {!isMobile && <DeskPagination {...data.pagination} />}
            <div className="flex">
              {options.showCreateButton && <AccountSubtypeCreateDialog />}
            </div>
          </div>
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function AccountSubtypeCreateDialog() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  const accountTypeOptions = Object.entries(accountTypes).map(
    ([key, label]) => ({
      value: key as AccountType,
      label: label,
    }),
  );

  return (
    <DeskCreateDialog form={form} title="Tambah Subtipe">
      <FieldTextInput field={fields.name} label="Nama" />
      <Field>
        <FieldLabel>Tipe</FieldLabel>
        <Select items={accountTypeOptions}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {accountTypeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </DeskCreateDialog>
  );
}

function AccountSubtypeSkeleton() {
  const widths = ["w-20", "w-24", "w-28", "w-32", "w-36", "w-24"];
  return Array.from({ length: 12 }).map((_, index) => {
    const randomWidth = widths[index % widths.length];
    return (
      <Item key={index} variant="outline">
        <ItemContent>
          <ItemTitle>
            <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
          </ItemTitle>
          <ItemDescription>
            <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Skeleton className="size-4 rounded-full" />
        </ItemActions>
      </Item>
    );
  });
}
