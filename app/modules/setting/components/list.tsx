import { Button } from "~/components/ui/button";
import type { SettingSchema } from "../schemas";
import SettingTableView from "./table";
import { ButtonGroup } from "~/components/ui/button-group";
import { Link } from "react-router";

import { Field, FieldGroup } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { Form, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { SettingEmptyView } from "./empty";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

import type { SettingMeta } from "../types";

interface SettingPaginationViewProps {
  meta?: SettingMeta;
}

export function SettingPaginationView({ meta }: SettingPaginationViewProps) {
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

function SettingFilterView() {
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
    <Form method="get" onSubmit={handleSearch} className="flex max-w-md">
      <FieldGroup className="grow">
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

interface SettingListViewProps {
  settings: SettingSchema[];
  meta?: SettingMeta;
}
export default function SettingListView({
  settings,
  meta,
}: SettingListViewProps) {
  const [searchParams] = useSearchParams();
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <div className="flex justify-between gap-2">
        <ButtonGroup>
          <Button asChild>
            <Link to={`/desk/settings/new?${searchParams.toString()}`}>
              New
            </Link>
          </Button>
        </ButtonGroup>
        <div className="grow">
          <SettingFilterView />
        </div>
        <div className="shrink">
          <SettingPaginationView meta={meta} />
        </div>
      </div>
      {settings.length > 0 ? (
        <SettingTableView settings={settings} />
      ) : (
        <SettingEmptyView />
      )}
    </div>
  );
}
