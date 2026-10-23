import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

export type AccountJournalOption = {
  value: string;
  label: string;
};

export function AccountJournalCombobox({
  id,
  name,
  items,
  defaultValue,
  placeholder = "Pilih Jurnal",
  invalid,
  disabled,
}: {
  id?: string;
  name?: string;
  items: AccountJournalOption[];
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
        <ComboboxEmpty>Jurnal tidak ditemukan.</ComboboxEmpty>
        <ComboboxList>
          {(item: AccountJournalOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
