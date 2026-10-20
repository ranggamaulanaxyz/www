import {
  Await,
  data,
  Form,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useOutlet,
  useSearchParams,
  type UIMatch,
} from "react-router";
import type { Route } from "./+types/list";
import { createPartner, getPartners } from "../services/partner";
import {
  authMiddleware,
  userOnlyMiddleware,
} from "~/features/auth/middlewares.server";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { BookOpenIcon, EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "cn";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { FieldGroup } from "~/components/ui/field";
import { ButtonGroup } from "~/components/ui/button-group";
import FilterInputQuery from "../../desk/components/filter-input-query";
import { parseFilter } from "~/features/desk/services/filter";
import DeskPagination from "~/features/desk/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import z from "zod";
import { parseWithZod, type SubmissionResult } from "@conform-to/zod/v4";
import { getFormProps, useForm } from "@conform-to/react";
import { FieldTextInput } from "~/components/ui/field-input";
import { hasAccess } from "~/features/desk/services/access";
import DeskHeader from "~/features/desk/components/header";
import { BottomBar, TopBar } from "~/features/desk/components/bar";
import { useIsMobile } from "~/hooks/use-mobile";
import { getInitials } from "~/utils/tools";
import { supabaseClientContext } from "~/context";
import type { Handle } from "~/features/desk/types/route";

const schema = z.object({
  name: z
    .string("Nama tidak valid.")
    .min(3, "Nama minimal 3 karakter.")
    .max(64, "Nama maksimal 64 karakter."),
  email: z.email("Alamat email tidak valid.").optional(),
});

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  userOnlyMiddleware,
];

export const handle = {
  title: "Kontak",
  breadcrumb: (match) => ({
    to: `${match.pathname}?${match?.loaderData?.searchParams}`,
    label: "Kontak",
  }),
  showInSidebar: true,
} satisfies Handle<Route.ComponentProps["loaderData"]>;

export function meta() {
  return [{ title: handle.title }];
}

export async function loader({ url, context }: Route.ActionArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const partnerResults = getPartners(supabase, filterOptions);
  const canCreate = await hasAccess(supabase, "insert", "partners");

  return data({
    partnerResults,
    searchParams: url.searchParams.toString(),
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
  const partner = await createPartner(supabase, submission.value);

  throw redirect(`/desk/partners/${partner.id}?${url.searchParams.toString()}`);
}

export default function PartnerList({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { partnerResults, filterOptions, canCreate } = loaderData;
  const outlet = useOutlet();

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
      } = await partnerResults;
      setPaginationData({ from, to, count });
    };
    resolvePartner();
  }, [filterOptions]);

  if (outlet) return <Outlet />;

  return (
    <div className="flex min-h-dvh flex-col">
      <PartnerTopBar
        options={{ showCreateButton: canCreate!! }}
        data={{ pagination: paginationData }}
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
          <Suspense fallback={<PartnerSkeleton />}>
            <Await resolve={partnerResults}>
              {({ partners }) =>
                partners.map((partner) => (
                  <Item key={partner.email} variant="outline">
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src={partner.image || undefined} />
                        <AvatarFallback>
                          {getInitials(partner.name, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{partner.name}</ItemTitle>
                      <ItemDescription>{partner.email}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="link"
                        nativeButton={false}
                        render={
                          <Link
                            to={{
                              pathname: `/desk/partners/${partner.id}`,
                              search: searchParams.toString(),
                            }}
                          >
                            <BookOpenIcon />
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
      <PartnerBottomBar data={{ pagination: paginationData }} />
    </div>
  );
}

function PartnerCreateDialog({
  lastResult,
}: {
  lastResult?: SubmissionResult;
}) {
  const [form, fields] = useForm({
    lastResult: lastResult ?? null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            <span className="hidden md:inline">Tambah Kontak</span>
          </Button>
        }
      />
      <DialogContent
        render={
          <Form {...getFormProps(form)} method="post">
            <DialogHeader>
              <DialogTitle>Tambah Kontak</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <FieldTextInput field={fields.name} label="Nama" />
              <FieldTextInput field={fields.email} label="Alamat Email" />
            </FieldGroup>
            <DialogFooter>
              <DialogClose
                render={<Button variant="outline">Batalkan</Button>}
              />
              <Button type="submit">Tambah</Button>
            </DialogFooter>
          </Form>
        }
      />
    </Dialog>
  );
}

function PartnerTopBar({
  data,
  options,
}: {
  data: { pagination: { from: number; to: number; count: number } };
  options: { showCreateButton?: boolean };
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
              <ButtonGroup>
                {options.showCreateButton && <PartnerCreateDialog />}
                <Button variant="default" size="icon">
                  <EllipsisVerticalIcon />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </DeskHeader>
    </TopBar>
  );
}

function PartnerBottomBar({
  data,
}: {
  data: { pagination: { from: number; to: number; count: number } };
}) {
  return (
    <BottomBar>
      <div className="bg-background flex justify-between rounded-t-xl border-t p-4">
        <FilterInputQuery />
        <DeskPagination {...data.pagination} />
      </div>
    </BottomBar>
  );
}

function PartnerSkeleton() {
  const widths = ["w-20", "w-24", "w-28", "w-32", "w-36", "w-24"];
  return Array.from({ length: 12 }).map((_, index) => {
    const randomWidth = widths[index % widths.length];
    return (
      <Item key={index} variant="outline">
        <ItemMedia>
          <Skeleton className="size-8 rounded-full" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <Skeleton className={cn(randomWidth)}>&nbsp;</Skeleton>
          </ItemTitle>
        </ItemContent>
        <ItemActions>
          <Skeleton className="size-4 rounded-full" />
        </ItemActions>
      </Item>
    );
  });
}
