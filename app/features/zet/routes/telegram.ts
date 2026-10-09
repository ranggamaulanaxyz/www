import { data } from "react-router";
import { ZetTelegramService } from "../services/telegram";
import type { Route } from "./+types/telegram";
import { webhookCallback } from "grammy";

export async function loader() {
  const zet = new ZetTelegramService();

  const result = await zet.setup();

  return data({ webhook_url: result.webhookUrl });
}

export async function action({ request }: Route.ActionArgs) {
  const zet = new ZetTelegramService();
  await zet.serve(request);

  return data({}, { status: 204 });
}
