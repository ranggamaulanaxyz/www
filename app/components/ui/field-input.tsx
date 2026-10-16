import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { Field, FieldError, FieldLabel } from "./field";
import { Input } from "./input";

export function FieldTextInput(props: {
  field: FieldMetadata;
  type?: "text" | "email";
  label: string;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={props.field.id}>{props.label}</FieldLabel>
      <Input {...getInputProps(props.field, { type: props.type ?? "text" })} />
      <FieldError errors={props.field.errors} />
    </Field>
  );
}
