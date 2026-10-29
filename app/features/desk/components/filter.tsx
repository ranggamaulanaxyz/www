import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";

export function useFilterQuery() {
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
    if (searchParams.get("from")) {
      newSearchParams.set("from", "1");
    }

    const size = searchParams.get("size");
    if (size) {
      newSearchParams.set("to", size);
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

export function DeskFilter({
  children,
  mode,
  renderTrigger,
}: {
  children?: ReactNode;
  mode?: "default" | "dialog";
  renderTrigger?: ReactElement;
}) {
  const {
    query,
    querySearchParams,
    queryOnChange,
    queryOnBlur,
    queryOnKeydown,
    clearQuery,
    clearQueryOnMouseDown,
  } = useFilterQuery();

  if (mode === "dialog") {
    return (
      <Dialog>
        <DialogTrigger render={renderTrigger} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pencarian</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full flex-1 md:w-60 lg:w-80"
    >
      <Field orientation="horizontal">
        <InputGroup>
          <InputGroupInput
            id="query"
            type="text"
            value={query}
            placeholder="Ketik dan enter untuk mencari..."
            onChange={queryOnChange}
            onBlur={queryOnBlur}
            onKeyDown={queryOnKeydown}
          />
          <InputGroupAddon align="inline-start">
            {children ? (
              <Dialog>
                <DialogTrigger
                  render={
                    <InputGroupButton size="icon-sm">
                      <FilterIcon />
                    </InputGroupButton>
                  }
                />
                <DialogContent className="sm:max-w-lg">
                  {children}
                </DialogContent>
              </Dialog>
            ) : (
              <SearchIcon />
            )}
          </InputGroupAddon>
          {query && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="destructive"
                size="icon-sm"
                onClick={clearQuery}
                onMouseDown={clearQueryOnMouseDown}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>
    </form>
  );
}
