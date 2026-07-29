import { Form } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useForm } from "~/hooks/use-form";
import { SettingSchema } from "~/modules/setting/schemas";
import type { ValidationError } from "~/types";

interface SettingFormViewProps {
  id: string;
  setting?: SettingSchema;
  initialErrors?: ValidationError<SettingSchema> | null;
}

export default function SettingFormView({
  id,
  setting,
  initialErrors,
}: SettingFormViewProps) {
  const form = useForm({
    id: id,
    schema: SettingSchema,
    defaultValues: {
      key: setting?.key ?? "",
      value: setting?.value ?? "",
      isPublic: setting?.isPublic,
    },
    initialErrors: initialErrors,
  });
  return (
    <Form {...form.getProps()}>
      <FieldGroup>
        <Field {...form.getFieldProps("key")}>
          <FieldLabel htmlFor="key">Key</FieldLabel>
          <Input {...form.getInputProps("key")} />
          <FieldError errors={form.getFieldErrors("key")} />
        </Field>
        <Field {...form.getFieldProps("value")}>
          <FieldLabel htmlFor="value">Value</FieldLabel>
          <Input {...form.getInputProps("value")} />
          <FieldError errors={form.getFieldErrors("value")} />
        </Field>
        <Field orientation="horizontal" {...form.getFieldProps("isPublic")}>
          <Checkbox
            id="isPublic"
            name="isPublic"
            defaultChecked={form.fields?.isPublic}
          />
          <FieldContent>
            <FieldLabel htmlFor="isPublic">Public Setting</FieldLabel>
          </FieldContent>
        </Field>
      </FieldGroup>
    </Form>
  );
}
