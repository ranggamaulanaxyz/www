import { Field, FieldGroup } from "~/components/ui/field";
import type { PostSchema } from "../../schemas";
import BlogItemView from "./item";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { handle } from "~/routes/desk/blog";
import { Form, Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { BlogEmptyView } from "./empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { ButtonGroup } from "~/components/ui/button-group";
import { buttonVariants } from "~/components/ui/button";
import type { SettingMeta } from "~/modules/setting/types";

function BlogFilterView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const query = searchParams.get("query") || "";
    setValue(query);
  }, [searchParams]);

  const handleSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setSearchParams({ query: value });
  };

  const handleClear = () => {
    setValue("");
    searchParams.delete("query");
    setSearchParams(searchParams);
  };

  return (
    <Form method="get" onSubmit={handleSearch} className="flex">
      <FieldGroup>
        <Field>
          <InputGroup>
            <InputGroupInput
              type="search"
              enterKeyHint="search"
              value={value}
              placeholder="Search..."
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setSearchParams({ query: value })}
              className="[&::-webkit-search-cancel-button]:appearance-none"
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
            {value && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </Field>
      </FieldGroup>
    </Form>
  );
}

interface BlogPaginationViewProps {
  meta?: SettingMeta;
}
export function BlogPaginationView({ meta }: BlogPaginationViewProps) {
  const [searchParams] = useSearchParams();

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const hasPrevious = meta?.hasPrevious ?? false;
  const hasNext = meta?.hasNext ?? false;
  const page = meta?.page ?? 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to={hasPrevious ? getPageUrl(page - 1) : "#"}
              tabIndex={!hasPrevious ? -1 : undefined}
              className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              to={hasNext ? getPageUrl(page + 1) : "#"}
              tabIndex={!hasNext ? -1 : undefined}
              className={!hasNext ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

interface BlogListProps {
  posts: PostSchema[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export default function BlogListView({ posts, meta }: BlogListProps) {
  const [searchParams] = useSearchParams();
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <div className="flex justify-between gap-2">
        <ButtonGroup>
          <Link
            className={buttonVariants({ variant: "default" })}
            to={`/desk/blog/new?${searchParams.toString()}`}
          >
            New
          </Link>
        </ButtonGroup>
        <div className="grow">
          <BlogFilterView />
        </div>
        <div className="shrink">
          <BlogPaginationView meta={meta} />
        </div>
      </div>
      {posts.length ? <BlogItemView posts={posts} /> : <BlogEmptyView />}
    </div>
  );
}
