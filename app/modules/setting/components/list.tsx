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

function SettingFilter() {
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
}
export default function SettingListView({ settings }: SettingListViewProps) {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <div className="flex justify-between gap-4">
        <ButtonGroup>
          <Button asChild>
            <Link to="/desk/setting/new">New</Link>
          </Button>
        </ButtonGroup>
        <div className="grow">
          <SettingFilter />
        </div>
      </div>
      <SettingTableView settings={settings} />
    </div>
  );
}
