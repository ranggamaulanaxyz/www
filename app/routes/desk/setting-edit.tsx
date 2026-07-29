import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import SettingFormView from "~/modules/setting/components/form";
import { SettingSchema } from "~/modules/setting/schemas";
import type { Route } from "./+types/setting-edit";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { findSettingById, updateSetting } from "~/modules/setting/services";
import { parseFormData } from "~/lib/utils";
import { useNavigation } from "react-router";

export async function clientAction({
  context,
  request,
  params,
}: Route.ClientActionArgs) {
  const result = await parseFormData(request, SettingSchema);
  if (!result.success) {
    return {
      success: result.success,
      setting: null,
      fieldErrors: result.error,
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
  const setting = loaderData?.setting;
  const id = setting?.id || "new";
  const initialFieldErrors = actionData?.fieldErrors;
  const navigation = useNavigation();
  const isIdle = navigation.state === "idle";
  const isSubmitting = navigation.state === "submitting";

  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>Edit Setting</DialogTitle>
      </DialogHeader>
      <SettingFormView
        id={id}
        setting={setting}
        initialErrors={initialFieldErrors}
      />
      <DialogFooter>
        <Button form={id} type="submit" disabled={!isIdle}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </Fragment>
  );
}
