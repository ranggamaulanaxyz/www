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
import { Form, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { BlogEmptyView } from "./empty";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

function BlogFilter() {
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

interface BlogPaginationProps {
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

function BlogPagination({ page }): BlogPaginationProps {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious to={"?"} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext to={"?"} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
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
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <div className="flex">
        <BlogFilter />
      </div>
      {posts.length ? <BlogItemView posts={posts} /> : <BlogEmptyView />}
    </div>
  );
}
