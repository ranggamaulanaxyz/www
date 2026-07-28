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
import { parseFormData } from "@rvf/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigation } from "react-router";

export async function clientAction({
  context,
  request,
  params,
}: Route.ClientActionArgs) {
  const result = await parseFormData(request, SettingSchema);

  if (result.error) {
    return {
      success: false,
      setting: null,
      fieldErrors: result.error.fieldErrors,
    };
  }

  const supabase = context.get(SupabaseClientContext);
  const setting = await updateSetting(supabase, params.id, result.data);
  return { success: true, setting: setting, fieldErrors: null };
}

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const supabase = context.get(SupabaseClientContext);
  const setting = await findSettingById(supabase, params.id);

  return { setting };
}

export default function SettingEdit({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const setting = actionData?.setting || loaderData?.setting;
  const formId = setting?.id || "new";
  const fieldErrors = actionData?.fieldErrors;

  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      toast.success("Setting was saved!");
    } else if (actionData) {
      toast.error("Failed to save setting");
    }
  }, [actionData?.success]);

  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>Edit Setting</DialogTitle>
      </DialogHeader>
      <Form
        id={formId}
        schema={SettingSchema}
        defaultValues={setting}
        method="post"
      >
        {(form) => (
          <FieldGroup>
            <FieldProvider scope={form.scope("key")}>
              {(field) => (
                <Field data-invalid={!!field.error() || !!fieldErrors?.key}>
                  <FieldLabel htmlFor={field.name()}>Key</FieldLabel>
                  <Input
                    {...field.getInputProps({
                      disabled: !isIdle,
                      "aria-invalid": !!field.error() || !!fieldErrors?.key,
                    })}
                  />
                  <FieldError>{field.error() || fieldErrors?.key}</FieldError>
                </Field>
              )}
            </FieldProvider>
            <FieldProvider scope={form.scope("value")}>
              {(field) => (
                <Field data-invalid={!!field.error() || !!fieldErrors?.value}>
                  <FieldLabel htmlFor={field.name()}>Value</FieldLabel>
                  <Input
                    {...field.getInputProps({
                      disabled: !isIdle,
                      "aria-invalid": !!field.error() || !!fieldErrors?.value,
                    })}
                  />
                  <FieldError>{field.error() || fieldErrors?.value}</FieldError>
                </Field>
              )}
            </FieldProvider>
          </FieldGroup>
        )}
      </Form>

      <DialogFooter>
        <Button type="submit" form={formId} disabled={!isIdle}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </Fragment>
  );
}
