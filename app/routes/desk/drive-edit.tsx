import { Form, Outlet, useOutlet } from "react-router";
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
import DriveFormView from "~/modules/drive/components/form";

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
    return { errors: { fieldErrors: validation.errors, formErrors: null } };
  }
  const supabase = context.get(SupabaseClientContext);

  const drive = await update(supabase, params.id, validation.data);
  return { drive };
}

export default function DriveEdit({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const outlet = useOutlet();
  if (outlet) return outlet;

  const drive = actionData?.drive || loaderData.drive || null;
  const initialFieldErrors = actionData?.errors?.fieldErrors;

  return (
    <DriveFormView
      key={drive?.id}
      drive={drive}
      initialFieldErrors={initialFieldErrors}
    />
  );
}
