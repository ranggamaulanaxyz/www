import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

export type ProductCategoryOption = {
  value: string;
  label: string;
};

export function ProductCategoryCombobox({
  id,
  name,
  items,
  defaultValue,
  placeholder = "Pilih Kategori",
  emptyMessage = "Kategori tidak ditemukan.",
  invalid,
  disabled,
}: {
  id?: string;
  name?: string;
  items: ProductCategoryOption[];
  defaultValue?: string | null;
  placeholder?: string;
  emptyMessage?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const selected = items.find((item) => item.value === defaultValue) ?? null;

  return (
    <Combobox
      items={items}
      name={name}
      defaultValue={selected}
      isItemEqualToValue={(item, value) => item.value === value.value}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        aria-invalid={invalid}
        disabled={disabled}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: ProductCategoryOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
