import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

export type AccountSubtypeOption = {
  value: string;
  label: string;
};

export function AccountSubtypeCombobox({
  id,
  name,
  items,
  defaultValue,
  placeholder = "Pilih Subtipe",
  invalid,
  disabled,
}: {
  id?: string;
  name?: string;
  items: AccountSubtypeOption[];
  defaultValue?: string | null;
  placeholder?: string;
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
        <ComboboxEmpty>Subtipe tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: AccountSubtypeOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
