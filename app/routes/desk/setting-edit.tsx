import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/setting-edit";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findSettingById, updateSetting } from "~/modules/setting/services";

import { SettingSchema } from "~/modules/setting/schemas";
import { Form, FieldProvider } from "~/components/desk/views/form";
import { parseFormData, validationError } from "@rvf/react-router";
import { actionResponse } from "~/lib/utils";

export async function clientAction({
  context,
  request,
  params,
}: Route.ClientActionArgs) {
  const result = await parseFormData(request, SettingSchema);

  if (result) {
    return {};
  }

  const supabase = context.get(SupabaseClientContext);
  await updateSetting(supabase, params.id, result.data);
}

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const supabase = context.get(SupabaseClientContext);
  const setting = await findSettingById(supabase, params.id);

  return { id: params.id, setting };
}

export default function SettingEdit({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const id = loaderData?.id || "new";
  const setting = loaderData?.setting;
  const x = actionData.return(
    <Fragment>
      <DialogHeader>
        <DialogTitle>Edit Setting</DialogTitle>
      </DialogHeader>
      <Form
        id={id}
        schema={SettingSchema}
        defaultValues={setting}
        method="post"
      >
        {(form) => (
          <FieldGroup>
            <FieldProvider scope={form.scope("key")}>
              {(field) => (
                <Field data-invalid={!!field.error()}>
                  <FieldLabel htmlFor={field.name()}>Key</FieldLabel>
                  <Input
                    aria-invalid={!!field.error()}
                    {...field.getInputProps()}
                  />
                  <FieldError>{field.error()}</FieldError>
                </Field>
              )}
            </FieldProvider>
            <FieldProvider scope={form.scope("value")}>
              {(field) => (
                <Field data-invalid={!!field.error()}>
                  <FieldLabel htmlFor={field.name()}>Value</FieldLabel>
                  <Input
                    aria-invalid={!!field.error()}
                    {...field.getInputProps()}
                  />
                  <FieldError>{field.error()}</FieldError>
                </Field>
              )}
            </FieldProvider>
          </FieldGroup>
        )}
      </Form>

      <DialogFooter>
        <Button type="submit" form={id}>
          Save
        </Button>
      </DialogFooter>
    </Fragment>,
  );
}
