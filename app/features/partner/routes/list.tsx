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
} from "react-router";
import type { Route } from "./+types/list";
import { supabaseClientContext } from "~/context";
import { createPartner, getPartners } from "../services/partner";
import {
  authMiddleware,
  userOnlyMiddleware,
} from "~/features/auth/middlewares.server";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { BookOpenIcon, EllipsisVerticalIcon, PlusIcon } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "cn";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useScrollDirection } from "~/hooks/use-scroll-direction";
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
import { parseWithZod } from "@conform-to/zod/v4";
import { getFormProps, useForm } from "@conform-to/react";
import { FieldTextInput } from "~/components/ui/field-input";

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
  breadcrumb: (match: any) => ({
    to: `${match.pathname}?${match?.loaderData?.searchParams}`,
    label: "Daftar Kontak",
  }),
};

export function meta() {
  return [{ title: "Kontak" }];
}

export async function loader({ url, context }: Route.ActionArgs) {
  const filterOptions = parseFilter(url.searchParams);

  const supabase = context.get(supabaseClientContext);
  const partnerResults = getPartners(supabase, filterOptions);

  return data({
    partnerResults,
    searchParams: url.searchParams.toString(),
    filterOptions,
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
  const { partnerResults, filterOptions } = loaderData;
  const outlet = useOutlet();
  const isVisible = useScrollDirection();

  const [searchParams] = useSearchParams();
  const [paginationState, setPaginationState] = useState({
    from: filterOptions.from,
    to: filterOptions.to,
    count: 0,
  });

  const [form, fields] = useForm({
    lastResult: actionData?.lastResult ?? null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  useEffect(() => {
    const updatePaginationState = async () => {
      const { filterData, count } = await partnerResults;
      setPaginationState({
        count: count || 0,
        from: filterData.from,
        to: filterData.to,
      });
    };
    updatePaginationState();
  }, [searchParams]);

  if (outlet) return <Outlet />;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "bg-background sticky top-0 z-50 flex justify-between gap-4 px-4 py-2 transition-[top]",
          isVisible ? "top-0" : "-top-14",
        )}
      >
        <FilterInputQuery />
        <div className={cn("flex items-center justify-end gap-1")}>
          <DeskPagination
            from={paginationState.from}
            to={paginationState.to}
            count={paginationState.count}
          />
          <div className="flex">
            <ButtonGroup>
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
                        <FieldTextInput
                          field={fields.email}
                          label="Alamat Email"
                        />
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
              <Button variant="default" size="icon">
                <EllipsisVerticalIcon />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
      <div
        className={cn([
          "grid gap-2 px-4",
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
                      <AvatarImage src="https://github.com/evilrabbit.png" />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{partner.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Link
                      to={{
                        pathname: `/desk/partners/${partner.id}`,
                        search: searchParams.toString(),
                      }}
                      className={buttonVariants({ variant: "link" })}
                    >
                      <BookOpenIcon />
                    </Link>
                  </ItemActions>
                </Item>
              ))
            }
          </Await>
        </Suspense>
      </div>
    </div>
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
