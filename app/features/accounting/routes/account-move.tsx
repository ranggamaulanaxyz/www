import { getInputProps, useForm } from "@conform-to/react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { TopBar } from "~/features/desk/components/bar";
import { DeskCreateDialog } from "~/features/desk/components/create-dialog";
import DeskHeader from "~/features/desk/components/header";
import { parseWithZod } from "@conform-to/zod/v4";
import { FieldTextInput } from "~/components/ui/field-input";
import type { Route } from "./+types/account-move";
import type { Handle } from "~/features/desk/types/route";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { AccountMoveStatus } from "../types/account-move";
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
import { createAccountMove, getAccountMoves } from "../services/account-move";
import { getAccountJournals } from "../services/account-journal";
import { getPartners } from "~/features/partner/services/partner";
import { hasAccess } from "~/features/desk/services/access";
import { accountMoveFormSchema } from "../schemas/account-move";
import type { AccountJournalOption } from "../components/account-journal-combobox";
import type { PartnerOption } from "../components/partner-combobox";
import { AccountJournalCombobox } from "../components/account-journal-combobox";
import { PartnerCombobox } from "../components/partner-combobox";
import { cn } from "cn";
import { Suspense, useEffect, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { useIsMobile } from "~/hooks/use-mobile";
import DeskPagination from "~/features/desk/components/pagination";
import FilterInputQuery from "~/features/desk/components/filter-input-query";

export const accountMoveStatuses: Record<AccountMoveStatus, string> = {
  draft: "Draf",
  posted: "Diposting",
};

export const accountMoveStatusOptions = Object.entries(accountMoveStatuses).map(
  ([key, label]) => ({
    value: key as AccountMoveStatus,
    label: label,
  }),
);

export const handle = {
  breadcrumb: { label: "Jurnal Umum" },
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: "Jurnal Umum" }];
}

export function formatAccountMoveDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export async function loader({ url, context }: Route.LoaderArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const accountMoveResults = getAccountMoves(supabase, filterOptions);
  const [{ accountJournals }, { partners }, canCreate] = await Promise.all([
    getAccountJournals(supabase, { from: 1, to: 1000 }),
    getPartners(supabase, { from: 1, to: 1000 }),
    hasAccess(supabase, "insert", "account_moves"),
  ]);

  const journalOptions: AccountJournalOption[] = accountJournals.map(
    (accountJournal) => ({
      value: accountJournal.id,
      label: accountJournal.name,
    }),
  );
  const partnerOptions: PartnerOption[] = partners.map((partner) => ({
    value: partner.id,
    label: partner.email ? `${partner.name} · ${partner.email}` : partner.name,
  }));

  return data({
    accountMoveResults,
    searchParams: url.searchParams.toString(),
    filterOptions,
    journalOptions,
    partnerOptions,
    canCreate,
    today: new Date().toISOString().slice(0, 10),
  });
}

export async function action({ request, url, context }: Route.ActionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: accountMoveFormSchema,
  });
  if (submission.status !== "success") {
    return data({ lastResult: submission.reply() }, { status: 422 });
  }

  const supabase = context.get(supabaseClientContext);
  const accountMove = await createAccountMove(supabase, submission.value);

  return redirect(
    `/desk/accounting/moves/${accountMove.id}?${url.searchParams.toString()}`,
  );
}

export default function AccountMove({ loaderData }: Route.ComponentProps) {
  const {
    accountMoveResults,
    canCreate,
    filterOptions,
    journalOptions,
    partnerOptions,
    today,
  } = loaderData;
  const [searchParams] = useSearchParams();
  const [paginationData, setPaginationData] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });

  useEffect(() => {
    const resolveAccountMoves = async () => {
      const {
        metadata: { from, to, count },
      } = await accountMoveResults;
      setPaginationData({ from, to, count });
    };
    resolveAccountMoves();
  }, [filterOptions]);

  const journalNames = new Map(
    journalOptions.map((option) => [option.value, option.label]),
  );
  const partnerNames = new Map(
    partnerOptions.map((option) => [option.value, option.label]),
  );

  const outlet = useOutlet();
  if (outlet) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AccountMoveTopBar
        data={{ pagination: paginationData }}
        options={{
          showCreateButton: canCreate,
          journalOptions,
          partnerOptions,
          today,
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
          <Suspense fallback={<AccountMoveSkeleton />}>
            <Await resolve={accountMoveResults}>
              {({ accountMoves }) =>
                accountMoves.map((accountMove) => (
                  <Item key={accountMove.id} variant="outline">
                    <ItemContent>
                      <ItemTitle>
                        {accountMove.number ||
                          formatAccountMoveDate(accountMove.date)}
                      </ItemTitle>
                      <ItemDescription>
                        {accountMove.number
                          ? `${formatAccountMoveDate(accountMove.date)} · `
                          : ""}
                        {journalNames.get(accountMove.journalId) || "-"} ·{" "}
                        {partnerNames.get(accountMove.partnerId) || "-"}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge
                        variant={
                          accountMove.status === "posted"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {accountMoveStatuses[accountMove.status]}
                      </Badge>
                      <Button
                        variant="link"
                        nativeButton={false}
                        render={
                          <Link
                            to={{
                              pathname: `/desk/accounting/moves/${accountMove.id}`,
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

function AccountMoveTopBar({
  data,
  options,
}: {
  data: { pagination: { from: number; to: number; count: number } };
  options: {
    showCreateButton?: boolean | null;
    journalOptions: AccountJournalOption[];
    partnerOptions: PartnerOption[];
    today: string;
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
                <AccountMoveCreateDialog
                  journalOptions={options.journalOptions}
                  partnerOptions={options.partnerOptions}
                  defaultDate={options.today}
                />
              )}
            </div>
          </div>
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function AccountMoveCreateDialog({
  journalOptions,
  partnerOptions,
  defaultDate,
}: {
  journalOptions: AccountJournalOption[];
  partnerOptions: PartnerOption[];
  defaultDate: string;
}) {
  const [form, fields] = useForm({
    defaultValue: { date: defaultDate, status: "draft" as AccountMoveStatus },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: accountMoveFormSchema });
    },
  });

  return (
    <DeskCreateDialog form={form} title="Tambah Jurnal Umum">
      <FieldTextInput field={fields.number} label="Nomor" />
      <Field data-invalid={!fields.date.valid}>
        <FieldLabel htmlFor={fields.date.id}>Tanggal</FieldLabel>
        <Input {...getInputProps(fields.date, { type: "date" })} />
        <FieldError errors={fields.date.errors} />
      </Field>
      <Field data-invalid={!fields.journalId.valid}>
        <FieldLabel htmlFor={fields.journalId.id}>Jurnal</FieldLabel>
        <AccountJournalCombobox
          id={fields.journalId.id}
          name={fields.journalId.name}
          items={journalOptions}
          invalid={!fields.journalId.valid}
        />
        <FieldError errors={fields.journalId.errors} />
      </Field>
      <Field data-invalid={!fields.partnerId.valid}>
        <FieldLabel htmlFor={fields.partnerId.id}>Kontak</FieldLabel>
        <PartnerCombobox
          id={fields.partnerId.id}
          name={fields.partnerId.name}
          items={partnerOptions}
          invalid={!fields.partnerId.valid}
        />
        <FieldError errors={fields.partnerId.errors} />
      </Field>
      <Field data-invalid={!fields.status.valid}>
        <FieldLabel htmlFor={fields.status.id}>Status</FieldLabel>
        <Select
          id={fields.status.id}
          name={fields.status.name}
          items={accountMoveStatusOptions}
          defaultValue={fields.status.defaultValue ?? "draft"}
        >
          <SelectTrigger className="w-full" aria-invalid={!fields.status.valid}>
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {accountMoveStatusOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldError errors={fields.status.errors} />
      </Field>
    </DeskCreateDialog>
  );
}

function AccountMoveSkeleton() {
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
