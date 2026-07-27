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
import { findSettingById } from "~/modules/setting/services";
import { useState } from "react";
import { SettingSchema } from "~/modules/setting/schemas";
import { Form, FieldProvider } from "~/components/desk/views/form";

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const supabase = context.get(SupabaseClientContext);
  const setting = await findSettingById(supabase, params.id);

  return { setting };
}

export default function SettingEdit({ loaderData }: Route.ComponentProps) {
  const setting = loaderData?.setting;

  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>Edit Setting</DialogTitle>
      </DialogHeader>
      <Form schema={SettingSchema} defaultValues={setting} method="post">
        {(form) => (
          <FieldGroup>
            <FieldProvider scope={form.scope("key")}>
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name()}>Key</FieldLabel>
                  <Input {...field.getInputProps()} />
                  <FieldError>{field.error()}</FieldError>
                </Field>
              )}
            </FieldProvider>
            <FieldProvider scope={form.scope("value")}>
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name()}>Value</FieldLabel>
                  <Input {...field.getInputProps()} />
                  <FieldError>{field.error()}</FieldError>
                </Field>
              )}
            </FieldProvider>
          </FieldGroup>
        )}
      </Form>

      <DialogFooter>
        <Button type="submit" form={setting?.id}>
          Save
        </Button>
      </DialogFooter>
    </Fragment>
  );
}
