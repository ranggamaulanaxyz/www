import { Fragment } from "react/jsx-runtime";
import { Button } from "~/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import SettingFormView from "~/modules/setting/components/form";
import { SettingSchema } from "~/modules/setting/schemas";
import type { Route } from "./+types/setting-create";
import { SupabaseClientContext } from "~/lib/supabase/supabase.context";
import { createSetting } from "~/modules/setting/services";
import { parseFormData } from "~/lib/utils";
import { redirect } from "react-router";

export async function clientAction({
  context,
  request,
  url,
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
  const setting = await createSetting(supabase, result.data);
  const searchParams = new URLSearchParams(url.searchParams);
  return redirect(`/desk/settings/${setting.id}?${searchParams.toString()}`);
}

export default function SettingCreate({ actionData }: Route.ComponentProps) {
  const id = "new";
  const initialFieldErrors = actionData?.fieldErrors;
  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>New Setting</DialogTitle>
      </DialogHeader>
      <SettingFormView id={id} initialErrors={initialFieldErrors} />
      <DialogFooter>
        <Button form={id} type="submit">
          Save
        </Button>
      </DialogFooter>
    </Fragment>
  );
}
