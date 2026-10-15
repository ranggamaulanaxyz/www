import { Await, data, Link, Outlet, useOutlet } from "react-router";
import type { Route } from "./+types/list";
import { supabaseClientContext } from "~/context";
import { getPartners } from "../services/partner";
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
import {
  BookOpenIcon,
  FilterIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "cn";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { Field } from "~/components/ui/field";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
  userOnlyMiddleware,
];

export const handle = {
  breadcrumb: "Daftar Kontak",
};

export function meta() {
  return [{ title: "Kontak" }];
}

export async function loader({ context }: Route.ActionArgs) {
  const supabase = context.get(supabaseClientContext);
  const partnerResults = getPartners(supabase);

  return data({ partnerResults });
}

export async function action() {}

export default function PartnerList({ loaderData }: Route.ComponentProps) {
  const { partnerResults } = loaderData;
  const outlet = useOutlet();

  if (outlet) return <Outlet />;

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="bg-background sticky top-2 flex justify-between gap-4">
        <div className="flex-1">
          <Field orientation="horizontal">
            <InputGroup>
              <InputGroupInput type="text" />
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton>
                  <FilterIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-1">
          <div className="flex items-center gap-1">
            <Field orientation="horizontal" className="w-15 md:w-25">
              <Input type="number" defaultValue={1} min={1} />
            </Field>
            <Separator className="max-w-2 shrink" />
            <Field orientation="horizontal" className="w-15 md:w-25">
              <Input type="number" defaultValue={84} min={1} />
            </Field>
            <div className="">
              <Pagination className="shrink">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
          <div className="flex">
            <Button>
              <PlusIcon />{" "}
              <span className="hidden md:inline">Tambah Kontak</span>
            </Button>
          </div>
        </div>
      </div>
      <div
        className={cn([
          "grid gap-2",
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
                      to={`/desk/partners/${partner.id}`}
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
