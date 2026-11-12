import camelcaseKeys from "camelcase-keys";
import type { Route } from "./+types/webhook";
import { upsertJob } from "../services/job";
import { supabaseAdminClientContext } from "~/context";
import { data } from "react-router";
import { addJobQueue } from "../services/bot.server";

export async function action({ context, request }: Route.ActionArgs) {
  const requestData = (await request.json()) as any;
  const supabase = context.get(supabaseAdminClientContext);
  const update = await upsertJob(supabase, {
    updateId: requestData?.update_id,
    updateData: requestData,
  });

  if (update.status !== "completed") {
    await addJobQueue(update.id);
  }

  return data({ message: "Success" });
}
