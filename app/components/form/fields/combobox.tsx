import type { FieldMetadata } from "@conform-to/react";
import { useEffect, useRef, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";

type Item = { label: string; value: string };

type FieldComboboxProps = {
  field: FieldMetadata;
  label: string;
  items: Item[];
  placeholder?: string;
};

export function FieldCombobox({
  field,
  label,
  items,
  placeholder,
}: FieldComboboxProps) {
  const initialValue =
    typeof field.initialValue === "string" ? field.initialValue : null;

  const [selected, setSelected] = useState<Item | null>(
    () => items.find((item) => item.value === initialValue) ?? null,
  );
  const hydrated = useRef(false);

  // Items can arrive after the first render (async fetch). Resolve the initial
  // value once the matching item exists instead of mutating `defaultValue`,
  // which Base UI doesn't allow on an uncontrolled Combobox.
  useEffect(() => {
    if (hydrated.current) return;

    if (selected) {
      hydrated.current = true;
      return;
    }

    if (initialValue === null) return;

    const match = items.find((item) => item.value === initialValue);
    if (!match) return;

    hydrated.current = true;
    setSelected(match);
  }, [initialValue, items, selected]);

  return (
    <Field data-invalid={!field.valid}>
      <FieldLabel htmlFor={field.id}>{label}</FieldLabel>
      <Combobox
        items={items}
        name={field.name}
        value={selected}
        onValueChange={setSelected}
        isItemEqualToValue={(item, value) => item.value === value.value}
      >
        <ComboboxInput
          id={field.id}
          placeholder={placeholder}
          aria-invalid={!field.valid}
        />
        <ComboboxContent>
          <ComboboxEmpty>Tidak ada data.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={field.errors} />
    </Field>
  );
}
