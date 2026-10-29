import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import { Form, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

export interface QueryFilter {
  query: string;
}

export type DeskFilterState<T extends QueryFilter = QueryFilter> = {
  onSubmit: (event: SyntheticEvent) => void;
  getFilter: (key: keyof T) => T[keyof T];
  setFilter: (key: keyof T, value: string | undefined) => void;
  clearFilter: (key: keyof T) => void;
};

export function useDeskFilter<T extends QueryFilter>(): DeskFilterState<T> {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<T>(() => {
    return {
      query: "",
      ...Object.fromEntries(searchParams.entries()),
    } as unknown as T;
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      ...Object.fromEntries(searchParams.entries()),
    }));
  }, [searchParams]);

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(state).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    setSearchParams(newSearchParams);
  };

  const getFilter = useCallback(
    (key: keyof T) => {
      return state[key];
    },
    [state],
  );

  const setFilter = useCallback((key: keyof T, value: string | undefined) => {
    setState(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        }) as T,
    );
  }, []);

  const clearFilter = useCallback(
    (key: keyof T) => {
      setState((prev) => ({ ...prev, [key]: "" }) as T);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete(String(key));
      setSearchParams(newSearchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return {
    onSubmit,
    getFilter,
    setFilter,
    clearFilter,
  };
}

export type DeskFilterProps<T extends QueryFilter> = {
  children?: ReactNode;
  mode?: "default" | "dialog";
  renderTrigger?: ReactElement;
  getFilter: (key: keyof T) => string | undefined;
  setFilter: (key: keyof T, value: string | undefined) => void;
  clearFilter: (key: keyof T) => void;
  onSubmit: (event: SyntheticEvent) => void;
};

export function DeskFilter<T extends QueryFilter>({
  children,
  mode = "default",
  renderTrigger,
  getFilter,
  setFilter,
  clearFilter,
  onSubmit,
}: DeskFilterProps<T>) {
  const skipBlurRef = useRef(false);
  const [open, setOpen] = useState(false);

  const queryOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (skipBlurRef.current) {
      skipBlurRef.current = false;
      return;
    }
    onSubmit(e);
  };

  const dialogOnSubmit = (e: SyntheticEvent) => {
    onSubmit(e);
    setOpen(false);
  };

  const dialogClear = () => {
    clearFilter("query");
    setOpen(false);
  };

  if (mode === "dialog") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={renderTrigger} />
        <DialogContent>
          <Form onSubmit={dialogOnSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Pencarian</DialogTitle>
            </DialogHeader>
            <Field orientation="horizontal">
              <InputGroup>
                <InputGroupInput
                  id="query"
                  type="text"
                  value={getFilter("query")}
                  onChange={(e) => setFilter("query", e.target.value)}
                  placeholder="Ketik dan enter untuk mencari..."
                />
                <InputGroupAddon align="inline-start">
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <DialogFooter className="flex-row justify-end">
              <Button type="button" variant="destructive" onClick={dialogClear}>
                Hapus
              </Button>
              <Button type="submit">Terapkan</Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Form onSubmit={onSubmit} className="w-full flex-1 md:w-60 lg:w-80">
      <Field orientation="horizontal">
        <InputGroup>
          <InputGroupInput
            id="query"
            type="text"
            value={getFilter("query")}
            onChange={(e) => setFilter("query", e.target.value)}
            onBlur={queryOnBlur}
            placeholder="Ketik dan enter untuk mencari..."
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
          {getFilter("query") && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="destructive"
                size="icon-sm"
                onMouseDown={() => {
                  skipBlurRef.current = true;
                }}
                onClick={() => clearFilter("query")}
              >
                <XIcon />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </Field>
    </Form>
  );
}
