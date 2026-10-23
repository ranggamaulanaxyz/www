import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

export type PartnerOption = {
  value: string;
  label: string;
};

export function PartnerCombobox({
  id,
  name,
  items,
  defaultValue,
  placeholder = "Pilih Kontak",
  invalid,
  disabled,
}: {
  id?: string;
  name?: string;
  items: PartnerOption[];
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
        <ComboboxEmpty>Kontak tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: PartnerOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
