import type { ComboboxRoot } from "@base-ui/react";
import { useInputControl, type FieldMetadata } from "@conform-to/react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { useSupabase } from "~/contexts/supabase";
import { useDebouncedCallback } from "~/hooks/use-debounced-callback";

export type FieldComboboxItem = { label: string; value: string };

type FieldComboboxProps = {
  field: FieldMetadata;
  label?: string;
  placeholder?: string;
  items: FieldComboboxItem[];
  /** Initial option to show even when it's not part of `items` yet. */
  defaultValue?: FieldComboboxItem | null;
  state: "loading" | "loaded" | "error";
  control: {
    value?: string;
    change: Dispatch<SetStateAction<string | undefined>>;
    focus: () => void;
    blur: () => void;
  };
  search: (query: string, selectedId?: string) => void;
  reload: (open: boolean, selectedId?: string) => void;
  onChange?: (
    value: FieldComboboxItem | null,
    details: ComboboxRoot.ChangeEventDetails,
  ) => void;
};

export function FieldCombobox({
  field,
  label,
  items,
  defaultValue,
  state,
  placeholder,
  control,
  search,
  reload,
  onChange,
}: FieldComboboxProps) {
  const [selected, setSelected] = useState<FieldComboboxItem | null>(
    defaultValue && defaultValue.value === control.value ? defaultValue : null,
  );

  // Always expose the default option, even before it shows up in `items`.
  const allItems = useMemo(() => {
    if (!defaultValue) return items;
    if (items.some((item) => item.value === defaultValue.value)) return items;
    return [defaultValue, ...items];
  }, [defaultValue, items]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    search(value, selected?.value);
  }, 300);

  useEffect(() => {
    if (!control.value) {
      setSelected(null);
      return;
    }
    setSelected((current) => {
      if (current?.value === control.value) return current;
      return allItems.find((item) => item.value === control.value) ?? null;
    });
  }, [control.value, allItems]);

  // Keep the selected option in the list when the current query doesn't match it.
  const newItems =
    selected && !allItems.some((item) => item.value === selected.value)
      ? [selected, ...allItems]
      : allItems;

  return (
    <Field data-invalid={!field.valid}>
      {label && <FieldLabel htmlFor={field.id}>{label}</FieldLabel>}
      <Combobox
        name={field.name}
        items={newItems}
        value={selected}
        onValueChange={(value, details) => {
          setSelected(value);
          control.change(value?.value ?? "");
          onChange?.(value, details);
        }}
        onOpenChange={(open) => {
          // A queued search would overwrite the list reloaded below.
          debouncedSearch.cancel();
          reload(open, selected?.value);
        }}
        onInputValueChange={(value, details) => {
          if (
            details.reason === "input-change" ||
            details.reason === "input-clear"
          ) {
            debouncedSearch(value);
            return;
          }
          // Selecting or clearing an item: drop the queued search.
          debouncedSearch.cancel();
        }}
        isItemEqualToValue={(item, value) => item.value === value.value}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        filter={null}
      >
        <ComboboxInput
          id={field.id}
          placeholder={placeholder}
          aria-invalid={!field.valid}
          onFocus={control.focus}
          onBlur={control.blur}
          showClear={true}
        />
        <ComboboxContent>
          {state !== "loading" && (
            <ComboboxEmpty>Tidak ada data.</ComboboxEmpty>
          )}
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          {state === "loading" && (
            <ComboboxItem value="">Memuat...</ComboboxItem>
          )}
        </ComboboxContent>
      </Combobox>
      <FieldError errors={field.errors} />
    </Field>
  );
}

export function useComboboxField({
  field,
  fetch,
}: {
  field: FieldMetadata;
  fetch: (
    supabase: SupabaseClient,
    query?: string,
    selectedId?: string,
  ) => Promise<{ data: FieldComboboxItem[]; metadata: any }>;
}) {
  const supabase = useSupabase();
  const control = useInputControl(field as FieldMetadata<string>);
  const [items, setItems] = useState<FieldComboboxItem[]>([]);
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  const fetchData = useCallback(
    async (query?: string, selectedId?: string) => {
      const { data, metadata } = await fetch(supabase, query, selectedId);
      setItems(data);
      setState("loaded");
      return { data, metadata };
    },
    [supabase],
  );

  useEffect(() => {
    setState("loading");
    fetchData();
  }, [supabase]);

  const reload = (open: boolean, selectedId?: string) => {
    if (open) {
      setItems([]);
      setState("loading");
      fetchData(undefined, selectedId);
    }
  };

  const search = (query: string, selectedId?: string) => {
    setItems([]);
    setState("loading");
    fetchData(query, selectedId);
  };

  return { field, items, state, control, reload, search };
}
