import { createRequestHandler } from "react-router";
import type { Queue } from "./types";
import { runTelegramJob } from "~/features/telegram/services/bot.server";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request) {
    return requestHandler(request);
  },
  async queue(batch) {
    for (const message of batch.messages) {
      switch (message.body.type) {
        case "telegram_bot_job":
          await runTelegramJob(message.body.id);
        default:
          continue;
      }
    }
  },
} satisfies ExportedHandler<Env, Queue>;
