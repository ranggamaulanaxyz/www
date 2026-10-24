import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

export type AccountMoveOption = {
  value: string;
  label: string;
};

export function AccountMoveCombobox({
  id,
  name,
  items,
  defaultValue,
  placeholder = "Pilih Jurnal Umum",
  invalid,
  disabled,
}: {
  id?: string;
  name?: string;
  items: AccountMoveOption[];
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
        <ComboboxEmpty>Jurnal umum tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: AccountMoveOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
