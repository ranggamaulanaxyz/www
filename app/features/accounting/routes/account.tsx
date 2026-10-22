import { useForm } from "@conform-to/react";
import { ArrowRightIcon } from "lucide-react";
import z from "zod";
import { Button } from "~/components/ui/button";
import { TopBar } from "~/features/desk/components/bar";
import { DeskCreateDialog } from "~/features/desk/components/create-dialog";
import DeskHeader from "~/features/desk/components/header";
import { parseWithZod } from "@conform-to/zod/v4";
import { FieldTextInput } from "~/components/ui/field-input";
import type { Route } from "./+types/account";
import type { Handle } from "~/features/desk/types/route";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { AccountSubtypeCombobox } from "../components/account-subtype-combobox";
import type { AccountSubtypeOption } from "../components/account-subtype-combobox";
import {
  Await,
  data,
  Link,
  Outlet,
  redirect,
  useOutlet,
  useSearchParams,
} from "react-router";
import { supabaseClientContext } from "~/context";
import { parseFilter } from "~/features/desk/services/filter";
import { createAccount, getAccounts } from "../services/account";
import { getAccountSubtypes } from "../services/account-subtype";
import { hasAccess } from "~/features/desk/services/access";
import { cn } from "cn";
import { Suspense, useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { Skeleton } from "~/components/ui/skeleton";
import { useIsMobile } from "~/hooks/use-mobile";
import DeskPagination from "~/features/desk/components/pagination";
import FilterInputQuery from "~/features/desk/components/filter-input-query";

const schema = z.object({
  code: z.string("Kode akun tidak valid."),
  name: z.string("Nama akun tidak valid."),
  accountSubtypeId: z.uuid("Subtipe akun tidak valid."),
});

export const handle = { breadcrumb: { label: "Akun" } } satisfies Handle<
  Route.ComponentProps["loaderData"]
>;

export function meta() {
  return [{ title: "Akun" }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const accountResults = getAccounts(supabase, filterOptions);
  const { accountSubtypes } = await getAccountSubtypes(supabase, {
    from: 1,
    to: 1000,
  });
  const accountSubtypeOptions = accountSubtypes.map((accountSubtype) => ({
    value: accountSubtype.id,
    label: accountSubtype.name,
  }));
  const canCreate = await hasAccess(supabase, "insert", "accounts");

  return data({
    accountResults,
    accountSubtypeOptions,
    filterOptions,
    canCreate,
  });
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const account = await createAccount(supabase, submission.value);

  return redirect(
    `/desk/accounting/accounts/${account.id}${url.searchParams.toString()}`,
  );
}

export default function Account({ loaderData }: Route.ComponentProps) {
  const { accountResults, accountSubtypeOptions, canCreate, filterOptions } =
    loaderData;
  const [searchParams] = useSearchParams();
  const [paginationData, setPaginationData] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });

  useEffect(() => {
    const resolveAccounts = async () => {
      const {
        metadata: { from, to, count },
      } = await accountResults;
      setPaginationData({ from, to, count });
    };
    resolveAccounts();
  }, [filterOptions]);

  const accountSubtypeNames = new Map(
    accountSubtypeOptions.map((option) => [option.value, option.label]),
  );

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AccountTopBar
        data={{ pagination: paginationData }}
        options={{
          showCreateButton: canCreate,
          accountSubtypeOptions,
        }}
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
          <Suspense fallback={<AccountSkeleton />}>
            <Await resolve={accountResults}>
              {({ accounts }) =>
                accounts.map((account) => (
                  <Item key={account.id} variant="outline">
                    <ItemContent>
                      <ItemTitle>
                        {account.code} · {account.name}
                      </ItemTitle>
                      <ItemDescription>
                        {accountSubtypeNames.get(account.accountSubtypeId)}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="link"
                        nativeButton={false}
                        render={
                          <Link
                            to={{
                              pathname: `/desk/accounting/accounts/${account.id}`,
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

function AccountTopBar({
  data,
  options,
}: {
  data: { pagination: { from: number; to: number; count: number } };
  options: {
    showCreateButton?: boolean | null;
    accountSubtypeOptions: AccountSubtypeOption[];
  };
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
              {options.showCreateButton && (
                <AccountCreateDialog
                  accountSubtypeOptions={options.accountSubtypeOptions}
                />
              )}
            </div>
          </div>
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function AccountCreateDialog({
  accountSubtypeOptions,
}: {
  accountSubtypeOptions: AccountSubtypeOption[];
}) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <DeskCreateDialog form={form} title="Tambah Akun">
      <FieldTextInput field={fields.code} label="Kode" />
      <FieldTextInput field={fields.name} label="Nama" />
      <Field data-invalid={!fields.accountSubtypeId.valid}>
        <FieldLabel htmlFor={fields.accountSubtypeId.id}>Subtipe</FieldLabel>
        <AccountSubtypeCombobox
          id={fields.accountSubtypeId.id}
          name={fields.accountSubtypeId.name}
          items={accountSubtypeOptions}
          invalid={!fields.accountSubtypeId.valid}
        />
        <FieldError errors={fields.accountSubtypeId.errors} />
      </Field>
    </DeskCreateDialog>
  );
}

function AccountSkeleton() {
  const widths = ["w-20", "w-24", "w-28", "w-32", "w-36", "w-24"];
  return Array.from({ length: 12 }).map((_, index) => {
    const randomWidth = widths[index % widths.length];
    return (
      <Item key={index} variant="outline">
        <ItemContent>
          <ItemTitle>
            <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
          </ItemTitle>
          <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
        </ItemContent>
      </Item>
    );
  });
}
