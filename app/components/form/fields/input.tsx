import { getInputProps, type FieldMetadata } from "@conform-to/react";
import type { ReactNode } from "react";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function FieldText(props: {
  field: FieldMetadata;
  type?: "text" | "email" | "number";
  label?: string;
}) {
  return (
    <Field data-invalid={!props.field.valid}>
      {props.label && (
        <FieldLabel htmlFor={props.field.id}>{props.label}</FieldLabel>
      )}
      <Input {...getInputProps(props.field, { type: props.type ?? "text" })} />
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
