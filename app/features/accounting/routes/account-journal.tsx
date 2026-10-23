import { useForm } from "@conform-to/react";
import { ArrowRightIcon } from "lucide-react";
import z from "zod";
import { Button } from "~/components/ui/button";
import { TopBar } from "~/features/desk/components/bar";
import { DeskCreateDialog } from "~/features/desk/components/create-dialog";
import DeskHeader from "~/features/desk/components/header";
import { parseWithZod } from "@conform-to/zod/v4";
import { FieldTextInput } from "~/components/ui/field-input";
import type { Route } from "./+types/account-journal";
import type { Handle } from "~/features/desk/types/route";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { AccountCombobox } from "../components/account-combobox";
import type { AccountOption } from "../components/account-combobox";
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
import {
  createAccountJournal,
  getAccountJournals,
} from "../services/account-journal";
import { getAccounts } from "../services/account";
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
import { nullableAccountIdSchema } from "../schemas/account-journal";

const schema = z.object({
  name: z.string("Nama jurnal tidak valid."),
  defaultDebitAccountId: nullableAccountIdSchema,
  defaultCreditAccountId: nullableAccountIdSchema,
});

export const handle = {
  breadcrumb: { label: "Jurnal" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Jurnal" }];
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const accountJournalResults = getAccountJournals(supabase, filterOptions);
  const { accounts } = await getAccounts(supabase, { from: 1, to: 1000 });
  const accountOptions: AccountOption[] = accounts.map((account) => ({
    value: account.id,
    label: `${account.code} · ${account.name}`,
  }));
  const canCreate = await hasAccess(supabase, "insert", "account_journals");

  return data({
    accountJournalResults,
    searchParams: url.searchParams.toString(),
    filterOptions,
    accountOptions,
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
  const accountJournal = await createAccountJournal(supabase, submission.value);

  return redirect(
    `/desk/accounting/journals/${accountJournal.id}?${url.searchParams.toString()}`,
  );
}

export default function AccountJournal({ loaderData }: Route.ComponentProps) {
  const { accountJournalResults, accountOptions, canCreate, filterOptions } =
    loaderData;
  const [searchParams] = useSearchParams();
  const [paginationData, setPaginationData] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });

  useEffect(() => {
    const resolveAccountJournals = async () => {
      const {
        metadata: { from, to, count },
      } = await accountJournalResults;
      setPaginationData({ from, to, count });
    };
    resolveAccountJournals();
  }, [filterOptions]);

  const accountNames = new Map(
    accountOptions.map((option) => [option.value, option.label]),
  );

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AccountJournalTopBar
        data={{ pagination: paginationData }}
        options={{ showCreateButton: canCreate, accountOptions }}
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
          <Suspense fallback={<AccountJournalSkeleton />}>
            <Await resolve={accountJournalResults}>
              {({ accountJournals }) =>
                accountJournals.map((accountJournal) => {
                  const debitAccount = accountJournal.defaultDebitAccountId
                    ? accountNames.get(accountJournal.defaultDebitAccountId)
                    : null;
                  const creditAccount = accountJournal.defaultCreditAccountId
                    ? accountNames.get(accountJournal.defaultCreditAccountId)
                    : null;

                  return (
                    <Item key={accountJournal.id} variant="outline">
                      <ItemContent>
                        <ItemTitle>{accountJournal.name}</ItemTitle>
                        <ItemDescription>
                          {debitAccount || "-"} / {creditAccount || "-"}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Button
                          variant="link"
                          nativeButton={false}
                          render={
                            <Link
                              to={{
                                pathname: `/desk/accounting/journals/${accountJournal.id}`,
                                search: searchParams.toString(),
                              }}
                            >
                              <ArrowRightIcon />
                            </Link>
                          }
                        />
                      </ItemActions>
                    </Item>
                  );
                })
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function AccountJournalTopBar({
  data,
  options,
}: {
  data: { pagination: { from: number; to: number; count: number } };
  options: {
    showCreateButton?: boolean | null;
    accountOptions: AccountOption[];
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
                <AccountJournalCreateDialog
                  accountOptions={options.accountOptions}
                />
              )}
            </div>
          </div>
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function AccountJournalCreateDialog({
  accountOptions,
}: {
  accountOptions: AccountOption[];
}) {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  return (
    <DeskCreateDialog form={form} title="Tambah Jurnal">
      <FieldTextInput field={fields.name} label="Nama" />
      <Field data-invalid={!fields.defaultDebitAccountId.valid}>
        <FieldLabel htmlFor={fields.defaultDebitAccountId.id}>
          Akun Debit Default
        </FieldLabel>
        <AccountCombobox
          id={fields.defaultDebitAccountId.id}
          name={fields.defaultDebitAccountId.name}
          items={accountOptions}
          placeholder="Pilih Akun Debit"
          invalid={!fields.defaultDebitAccountId.valid}
        />
        <FieldError errors={fields.defaultDebitAccountId.errors} />
      </Field>
      <Field data-invalid={!fields.defaultCreditAccountId.valid}>
        <FieldLabel htmlFor={fields.defaultCreditAccountId.id}>
          Akun Kredit Default
        </FieldLabel>
        <AccountCombobox
          id={fields.defaultCreditAccountId.id}
          name={fields.defaultCreditAccountId.name}
          items={accountOptions}
          placeholder="Pilih Akun Kredit"
          invalid={!fields.defaultCreditAccountId.valid}
        />
        <FieldError errors={fields.defaultCreditAccountId.errors} />
      </Field>
    </DeskCreateDialog>
  );
}

function AccountJournalSkeleton() {
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
        <ItemActions>
          <Skeleton className="size-4 rounded-full" />
        </ItemActions>
      </Item>
    );
  });
}
