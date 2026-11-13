import {
  getInputProps,
  useInputControl,
  type FieldMetadata,
} from "@conform-to/react";
import { cn } from "cn";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Calendar } from "~/components/ui/calendar";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { formatDate, formatDateISO, parseDateValue } from "~/utils/tools";

export function FieldText(props: {
  field: FieldMetadata;
  type?: "text" | "email" | "number";
  label?: string;
  exclude?: boolean;
  readonly?: boolean;
  align?: "left" | "right";
  min?: number;
  step?: number | "any";
}) {
  return (
    <Field data-invalid={!props.field.valid}>
      {props.label && (
        <FieldLabel htmlFor={props.field.id}>{props.label}</FieldLabel>
      )}
      <Input
        {...getInputProps(props.field, { type: props.type ?? "text" })}
        {...(props.exclude ? { name: undefined } : {})}
        min={props.min}
        step={props.step}
        readOnly={props.exclude || props.readonly}
        className={cn(props.align === "right" ? "text-right" : undefined)}
      />
      <FieldError errors={props.field.errors} />
    </Field>
  );
}

export function FieldCheckbox({
  children,
  ...props
}: {
  field: FieldMetadata;
  label: string;
  children?: ReactNode;
}) {
  return (
    <Field data-invalid={!props.field.valid} orientation="horizontal">
      <Checkbox {...getInputProps(props.field, { type: "checkbox" })} />
      <FieldContent>
        <FieldLabel htmlFor={props.field.id}>{props.label}</FieldLabel>
        {children}
        <FieldError errors={props.field.errors} />
      </FieldContent>
    </Field>
  );
}

type FieldDateProps = { field: FieldMetadata; label?: string };

export function FieldDate({ field, label }: FieldDateProps) {
  const control = useInputControl(field as FieldMetadata<string>);
  const date = parseDateValue(control.value);
  const [inputValue, setInputValue] = useState(() => formatDate(date));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputValue(formatDate(parseDateValue(control.value)));
  }, [control.value]);

  return (
    <Field data-invalid={!field.valid}>
      {label && <FieldLabel htmlFor={field.id}>{label}</FieldLabel>}
      {/* The submitted value is always an ISO date (YYYY-MM-DD). */}
      <input {...getInputProps(field, { type: "hidden" })} id={undefined} />
      <InputGroup>
        <InputGroupInput
          {...getInputProps(field, { type: "text" })}
          name={undefined}
          defaultValue={undefined}
          value={inputValue}
          placeholder="dd/mm/yyyy"
          onChange={(event) => {
            const value = event.target.value;
            const next = parseDateValue(value);

            if (next) {
              setInputValue(formatDate(next));
              control.change(formatDateISO(next));
              return;
            }

            setInputValue(value);
            if (value === "") {
              control.change("");
            }
          }}
          onFocus={control.focus}
          onBlur={() => {
            control.blur();
            setInputValue(formatDate(parseDateValue(control.value)));
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Pilih tanggal"
                >
                  <CalendarIcon />
                  <span className="sr-only">Pilih tanggal</span>
                </InputGroupButton>
              }
            />
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                defaultMonth={date}
                onSelect={(next) => {
                  setOpen(false);
                  control.change(next ? formatDateISO(next) : "");
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      <FieldError errors={field.errors} />
    </Field>
  );
}
