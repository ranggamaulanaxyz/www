import { Form, redirect } from "react-router";
import type { Route } from "./+types/drive-edit";
import type { DeskHandle } from "./desk";
import { DriveSchema } from "~/modules/drive/schemas";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { create } from "~/modules/drive/services";
import { validate } from "~/lib/utils";
import DriveFormView from "~/modules/drive/components/form";

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
  context,
}: Route.ClientActionArgs) {
  const validation = await validateFormData(await request.formData());
  if (!validation.success) {
    return { errors: { fieldErrors: validation.errors, formErrors: null } };
  }
  const supabase = context.get(SupabaseClientContext);
  const drive = await create(supabase, validation.data);
  return redirect(`/desk/drive/${drive?.id}`);
}

export default function DriveCreate({ actionData }: Route.ComponentProps) {
  const initialFieldErrors = actionData?.errors?.fieldErrors;
  return (
    <DriveFormView key="drive-new" initialFieldErrors={initialFieldErrors} />
  );
}
