import {
  ValidatedForm,
  type ValidatedFormProps,
  Field as ValidatedField,
  type FieldPropsWithName,
  type FieldPropsWithScope,
} from "@rvf/react";

export function Form<
  SchemaInput extends Record<string, any> = any,
  SchemaOutput = any,
  SubmitResponseData = unknown,
>({
  children,
  ...props
}: ValidatedFormProps<SchemaInput, SchemaOutput, SubmitResponseData>) {
  return <ValidatedForm {...(props as any)}>{children}</ValidatedForm>;
}

export function FieldProvider<FormInputData = unknown>({
  children,
  ...props
}: FieldPropsWithName<FormInputData> | FieldPropsWithScope<FormInputData>) {
  return <ValidatedField {...props}>{children}</ValidatedField>;
}
