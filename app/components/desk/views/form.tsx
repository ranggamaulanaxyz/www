import {
  ValidatedForm,
  type ValidatedFormProps,
  Field as ValidatedField,
  type FieldPropsWithName,
  type FieldPropsWithScope,
  type FieldValues,
} from "@rvf/react-router";

export function Form<
  SchemaInput extends FieldValues = any,
  SchemaOutput = unknown,
  DefaultValues extends FieldValues = SchemaInput,
  FormInputData extends FieldValues = SchemaInput & DefaultValues,
>(
  props: React.ComponentProps<
    typeof ValidatedForm<
      SchemaInput,
      SchemaOutput,
      DefaultValues,
      FormInputData
    >
  >,
) {
  return <ValidatedForm {...props} />;
}

export function FieldProvider<FormInputData = unknown>({
  children,
  ...props
}: FieldPropsWithName<FormInputData> | FieldPropsWithScope<FormInputData>) {
  return <ValidatedField {...props}>{children}</ValidatedField>;
}
