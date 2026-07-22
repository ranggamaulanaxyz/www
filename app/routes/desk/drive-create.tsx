import { Form, redirect } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/drive-edit";
import DeskHeader from "~/components/desk/header";
import type { DeskHandle } from "./desk";
import { DriveSchema } from "~/modules/drive/schemas";
import { useEffect, useState } from "react";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { create } from "~/modules/drive/services";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { SaveIcon } from "lucide-react";
import { validate } from "~/lib/utils";

export const handle: DeskHandle = {
  breadcrumb: () => "New",
};

async function validateFormData(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
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
  const drive = await create(supabase, validation.data);
  return redirect(`/desk/drive/${drive?.id}`);
}

export default function DriveCreate({ actionData }: Route.ComponentProps) {
  const defaultValues: DriveSchema = {
    name: "",
    description: "",
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
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input type="text" name="name" defaultValue={field.name} />
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  name="description"
                  defaultValue={field.description || ""}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
