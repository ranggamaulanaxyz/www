import { Form } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/drive-edit";
import DeskHeader from "~/components/desk/header";
import type { DeskHandle } from "./desk";
import { DriveSchema } from "~/modules/drive/schemas";
import { useEffect, useState } from "react";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findById, update } from "~/modules/drive/services";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "lucide-react";
import { validate } from "~/lib/utils";
import InputDateTime from "~/components/ui/input-datetime";
import { Separator } from "~/components/ui/separator";
import { AuthContext } from "~/modules/auth/middleware";

export const handle: DeskHandle<Route.ComponentProps["loaderData"]> = {
  breadcrumb: (match) => {
    return match.loaderData?.drive?.name;
  },
};

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const supabase = context.get(SupabaseClientContext);
  const drive = await findById(supabase, params.id);
  return { drive };
}

async function validateFormData(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    createdAt: formData.get("created_at") as string,
  };
  const result = await validate(DriveSchema, data);
  return result;
}

export async function clientAction({
  request,
  params,
  context,
}: Route.ClientActionArgs) {
  const validation = await validateFormData(await request.formData());
  if (!validation.success) {
    console.log(validation.errors);
    return { errors: { fieldErrors: validation.errors, formErrors: null } };
  }
  const supabase = context.get(SupabaseClientContext);

  const auth = context.get(AuthContext);
  const user = auth?.user;
  console.log(auth);
  const drive = await update(
    supabase,
    params.id,
    validation.data,
    user?.timeZone,
  );
  return { drive };
}

export default function DriveEdit({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { drive } = loaderData;
  const defaultValues: DriveSchema = {
    name: drive?.name || "",
    description: drive?.description || "",
    createdAt: drive?.createdAt,
    updatedAt: drive?.updatedAt,
  };
  const [field, setFieldValue] = useState<DriveSchema>(defaultValues);

  const initialFieldErrors = actionData?.errors?.fieldErrors;
  const [fieldErrors, setFieldError] = useState(initialFieldErrors);

  useEffect(() => {
    setFieldError(initialFieldErrors);
  }, [initialFieldErrors]);

  return (
    <Form method="post">
      <DeskHeader>
        <div className="ml-auto">
          <Button type="submit">
            <SaveIcon />
            <span className="sr-only">Save</span>
          </Button>
        </div>
      </DeskHeader>
      <div className="p-4">
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <FieldGroup>
                <Field data-invalid={!!fieldErrors?.name}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    type="text"
                    name="name"
                    defaultValue={field.name}
                    aria-invalid={!!fieldErrors?.name}
                  />
                  <FieldError errors={fieldErrors?.name} />
                </Field>
                <Field data-invalid={!!fieldErrors?.description}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    name="description"
                    defaultValue={field.description || ""}
                    aria-invalid={!!fieldErrors?.description}
                  />
                  <FieldError errors={fieldErrors?.description} />
                </Field>
                <Separator />
                <Field data-invalid={!!fieldErrors?.createdAt}>
                  <FieldLabel>Created At</FieldLabel>
                  <InputDateTime
                    name="created_at"
                    defaultValue={field.createdAt || ""}
                  />
                  <FieldError errors={fieldErrors?.createdAt} />
                </Field>
                <Field data-invalid={!!fieldErrors?.updatedAt}>
                  <FieldLabel>Updated At</FieldLabel>
                  <InputDateTime
                    name="updated_at"
                    defaultValue={field.updatedAt || ""}
                    readOnly
                  />
                  <FieldError errors={fieldErrors?.updatedAt} />
                </Field>
              </FieldGroup>
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
