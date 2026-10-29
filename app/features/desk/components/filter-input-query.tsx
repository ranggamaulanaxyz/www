import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { useSearchParams } from "react-router";
import { Field } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";

export function useInputQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const skipBlurRef = useRef(false);

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
  }, [searchParams.get("query")]);

  const queryOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const queryOnKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const queryOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }
    const newSearchParams = new URLSearchParams(searchParams);
    if (e.target.value !== "") {
      newSearchParams.set("query", e.target.value);
    } else {
      newSearchParams.delete("query");
    }
    if(searchParams.get("from")) {
      newSearchParams.set("from", "1")
    }

    const size = searchParams.get("size")
    if(size) {
      newSearchParams.set("to", size)
    }
    
    setSearchParams(newSearchParams, { replace: true });
  };

  const clearQuery = () => {
    skipBlurRef.current = false;
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("query");
    setSearchParams(newSearchParams, { replace: true });
    setQuery("");
  };

  const clearQueryOnMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    skipBlurRef.current = true;
  };

  return {
    query,
    queryOnChange,
    queryOnBlur,
    queryOnKeydown,
    querySearchParams: searchParams.get("query"),
    clearQuery,
    clearQueryOnMouseDown,
  };
}

export default function FilterInputQuery() {
  const {
    query,
    querySearchParams,
    queryOnChange,
    queryOnBlur,
    queryOnKeydown,
    clearQuery,
    clearQueryOnMouseDown,
  } = useInputQuery();
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex-1">
      <Field orientation="horizontal">
        <InputGroup>
          <InputGroupInput
            id="query"
            type="text"
            value={query}
            placeholder="Cari..."
            onChange={queryOnChange}
            onBlur={queryOnBlur}
            onKeyDown={queryOnKeydown}
          />
          <InputGroupAddon align="inline-start">
            {querySearchParams ? (
              <InputGroupButton
                variant="destructive"
                onClick={clearQuery}
                onMouseDown={clearQueryOnMouseDown}
              >
                <XIcon />
              </InputGroupButton>
            ) : (
              <SearchIcon />
            )}
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton>
              <FilterIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </form>
  );
}
