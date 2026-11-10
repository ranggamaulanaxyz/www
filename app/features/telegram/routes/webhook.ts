import camelcaseKeys from "camelcase-keys";
import type { Route } from "./+types/webhook";
import { upsertUpdate } from "../services/update.services";
import { supabaseAdminClientContext } from "~/context";
import { telegramUpdateSchema } from "../schemas/update.schemas";
import { data } from "react-router";
import { chat } from "../services/bot.services.server";
import { getEnv } from "~/utils/env.server";
import { env } from "cloudflare:workers";

export async function action({ context, request }: Route.ActionArgs) {
  const requestData = (await request.json()) as never;
  const camelCasedRequestData = camelcaseKeys(requestData, { deep: true });
  const updateData = telegramUpdateSchema.parse(camelCasedRequestData);
  const supabase = context.get(supabaseAdminClientContext);
  console.log(requestData);
  const update = await upsertUpdate(supabase, {
    updateId: updateData.updateId,
    messageId: updateData.message?.messageId,
    telegramUserId: updateData.message?.from?.id,
    chatId: updateData.message?.chat.id,
    messageDate: updateData.message?.date,
  });

  if (update.status === "processing") {
    return data({ message: "Success", data: updateData });
  }

  if (updateData.message?.text) {
    await chat({
      chatId: updateData.message.chat.id,
      messageId: updateData.message.messageId,
      text: updateData.message?.text,
    });
  }

  env.TELEGRAM_UPDATE_QUEUE;

  return data({ message: "Success", data: updateData });
}
